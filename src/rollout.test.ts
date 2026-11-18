import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { addDays } from "./lib/date";
import { publishThrough, unlockedThrough, type ScheduleConfig } from "./lib/schedule";

const workflow = readFileSync(new URL("../.github/workflows/deploy.yml", import.meta.url), "utf8");
const cfg: ScheduleConfig = { launchDate: "2026-11-19", previewLessons: 1, publishAheadDays: 2 };

describe("daily rollout workflow", () => {
  it("runs at 12:00 AM IST (18:30 UTC; IST is UTC+5:30)", () => {
    const cron = /cron:\s*"([^"]+)"/.exec(workflow)?.[1];
    expect(cron).toBe("30 18 * * *");
    const [min, hour] = cron!.split(" ").map(Number);
    const istMinutes = (hour * 60 + min + 5 * 60 + 30) % (24 * 60);
    expect(istMinutes).toBe(0); // 00:00 IST
  });

  it("is also triggerable by hand and on every push", () => {
    expect(workflow).toContain("workflow_dispatch");
    expect(workflow).toMatch(/push:\s+branches:\s*\[main\]/);
  });

  it("tests before it deploys", () => {
    expect(workflow.indexOf("npm test")).toBeGreaterThan(-1);
    expect(workflow.indexOf("npm test")).toBeLessThan(workflow.indexOf("npm run build"));
  });
});

describe("the 18:30 UTC build is always ahead of the next IST midnight", () => {
  it("has already published the lesson that unlocks at the next 00:00 IST, for every day of a long run", () => {
    // The build runs on UTC date D at 18:30. The next IST midnight starts IST date D + 1 for every learner (the schedule runs on IST).
    for (let i = -10; i < 400; i++) {
      const utcDate = addDays("2026-11-19", i);
      const istDateAtNextMidnight = addDays(utcDate, 1);
      expect(publishThrough(utcDate, cfg), `build on ${utcDate}`).toBeGreaterThanOrEqual(
        unlockedThrough(istDateAtNextMidnight, cfg),
      );
    }
  });

  it("still covers a run that GitHub starts up to ~a day late", () => {
    // A skipped run means the next build happens ~24h later; the site must not be a lesson short in between.
    for (let i = -10; i < 400; i++) {
      const utcDate = addDays("2026-11-19", i);
      const twoLocalMidnightsLater = addDays(utcDate, 2);
      expect(publishThrough(utcDate, cfg), `build on ${utcDate}`).toBeGreaterThanOrEqual(
        unlockedThrough(twoLocalMidnightsLater, cfg),
      );
    }
  });
});
