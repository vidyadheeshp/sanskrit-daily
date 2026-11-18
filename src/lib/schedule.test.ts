import { describe, it, expect } from "vitest";
import { isUnlocked, publishThrough, unlockDate, unlockedThrough, type ScheduleConfig } from "./schedule";

const base: ScheduleConfig = { launchDate: "2026-12-01", previewLessons: 1, publishAheadDays: 2 };
const noLaunch: ScheduleConfig = { ...base, launchDate: null };

describe("unlockedThrough", () => {
  it("only the preview lesson is open until a launch date is set", () => {
    expect(unlockedThrough("2026-12-25", noLaunch)).toBe(1);
  });

  it("only the preview lesson is open before launch day", () => {
    expect(unlockedThrough("2026-11-30", base)).toBe(1);
    expect(unlockedThrough("2026-01-01", base)).toBe(1);
  });

  it("opens one lesson per day from launch day", () => {
    expect(unlockedThrough("2026-12-01", base)).toBe(1);
    expect(unlockedThrough("2026-12-02", base)).toBe(2);
    expect(unlockedThrough("2026-12-07", base)).toBe(7);
  });

  it("never locks a lesson that was already open", () => {
    expect(unlockedThrough("2026-12-01", { ...base, previewLessons: 3 })).toBe(3);
  });
});

describe("isUnlocked", () => {
  it("is true up to and including today's lesson, false after", () => {
    expect(isUnlocked(2, "2026-12-02", base)).toBe(true);
    expect(isUnlocked(3, "2026-12-02", base)).toBe(false);
  });

  it("keeps everything but the preview locked without a launch date", () => {
    expect(isUnlocked(1, "2026-12-02", noLaunch)).toBe(true);
    expect(isUnlocked(2, "2026-12-02", noLaunch)).toBe(false);
  });
});

describe("unlockDate", () => {
  it("is launch date + (n - 1) days", () => {
    expect(unlockDate(2, base)).toBe("2026-12-02");
    expect(unlockDate(7, base)).toBe("2026-12-07");
    expect(unlockDate(32, base)).toBe("2027-01-01");
  });

  it("is null when unknown or when the lesson is always open", () => {
    expect(unlockDate(2, noLaunch)).toBeNull();
    expect(unlockDate(1, base)).toBeNull();
  });
});

describe("publishThrough (what a build includes)", () => {
  it("publishes only the preview before a launch date exists", () => {
    expect(publishThrough("2026-12-05", noLaunch)).toBe(1);
  });

  it("publishes just the preview well before launch", () => {
    expect(publishThrough("2026-11-01", base)).toBe(1);
  });

  it("stays a couple of days ahead of the calendar", () => {
    expect(publishThrough("2026-12-01", base)).toBe(3); // day 1 + 2 ahead
    expect(publishThrough("2026-12-05", base)).toBe(7);
  });

  it("is always enough for the IST schedule date (IST is at most one date ahead of UTC)", () => {
    // Build at 2026-12-04 UTC. By IST it can already be 2026-12-05, i.e. day 5.
    expect(publishThrough("2026-12-04", base)).toBeGreaterThanOrEqual(unlockedThrough("2026-12-05", base));
  });
});
