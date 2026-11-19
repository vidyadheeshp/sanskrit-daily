import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { addDays, scheduleISO } from "./lib/date";
import { publishThrough, unlockedThrough, type ScheduleConfig } from "./lib/schedule";

const workflow = readFileSync(new URL("../.github/workflows/deploy.yml", import.meta.url), "utf8");
const settings = JSON.parse(readFileSync(new URL("../schedule.json", import.meta.url), "utf8").replace(/^﻿/, ""));
const UNLOCK_HOUR_IST: number = settings.unlockHourIST;
const cfg: ScheduleConfig = { launchDate: "2026-11-19", previewLessons: 1, publishAheadDays: 2 };
const HOUR = 3_600_000;

describe("daily rollout workflow", () => {
  it("is set to unlock at 6:00 AM IST", () => {
    expect(UNLOCK_HOUR_IST).toBe(6);
  });

  it("runs at the unlock moment: 6:00 AM IST = 00:30 UTC (IST is UTC+5:30)", () => {
    const cron = /cron:\s*"([^"]+)"/.exec(workflow)?.[1];
    expect(cron).toBe("30 0 * * *");
    const [min, hour] = cron!.split(" ").map(Number);
    expect((hour * 60 + min + 5 * 60 + 30) % (24 * 60)).toBe(UNLOCK_HOUR_IST * 60); // the cron and the setting agree
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

describe("a build is always ahead of the lesson learners can open", () => {
  // A build made at instant b is the live site until the next build. Even if one scheduled run is skipped,
  // that is under 48 hours. Every learner's schedule day in that window must already be published.
  it("holds for builds at any hour of any day, with learners checking for up to 48 hours afterwards", () => {
    for (let day = -10; day < 400; day++) {
      for (const buildHour of [0, 0.5, 6, 12, 18, 23.5]) {
        const build = new Date(Date.parse(`${addDays("2026-11-19", day)}T00:00:00Z`) + buildHour * HOUR);
        const published = publishThrough(build.toISOString().slice(0, 10), cfg);
        for (let ahead = 0; ahead <= 48; ahead += 2) {
          const learnerDay = scheduleISO(new Date(build.getTime() + ahead * HOUR), UNLOCK_HOUR_IST);
          expect(published, `built ${build.toISOString()}, learner +${ahead}h`).toBeGreaterThanOrEqual(
            unlockedThrough(learnerDay, cfg),
          );
        }
      }
    }
  });

  it("at the cron moment itself, the lesson unlocking right now is already in the site", () => {
    for (let day = -10; day < 400; day++) {
      const cronRun = new Date(`${addDays("2026-11-19", day)}T00:30:00Z`);
      const now = unlockedThrough(scheduleISO(cronRun, UNLOCK_HOUR_IST), cfg);
      expect(publishThrough(cronRun.toISOString().slice(0, 10), cfg), cronRun.toISOString()).toBeGreaterThanOrEqual(now);
    }
  });
});
