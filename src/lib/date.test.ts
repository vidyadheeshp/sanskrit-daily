import { describe, it, expect } from "vitest";
import { addDays, dayNumber, daysBetween, isValidISO, localISO } from "./date";

describe("date maths", () => {
  it("launch day is day 1", () => {
    expect(dayNumber("2026-11-14", "2026-11-14")).toBe(1);
  });

  it("counts consecutive days", () => {
    expect(dayNumber("2026-11-15", "2026-11-14")).toBe(2);
    expect(dayNumber("2026-12-14", "2026-11-14")).toBe(31);
  });

  it("gives 0 or negative before launch", () => {
    expect(dayNumber("2026-11-13", "2026-11-14")).toBe(0);
    expect(dayNumber("2026-11-01", "2026-11-14")).toBeLessThan(0);
  });

  it("is not thrown off by daylight-saving boundaries", () => {
    // US and EU DST changes
    expect(daysBetween("2026-03-07", "2026-03-09")).toBe(2);
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(daysBetween("2026-10-30", "2026-11-02")).toBe(3);
  });

  it("handles month, year and leap-day boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
    expect(daysBetween("2026-01-01", "2027-01-01")).toBe(365);
  });

  it("formats local dates", () => {
    expect(localISO(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
    expect(localISO(new Date(2026, 11, 31, 0, 0))).toBe("2026-12-31");
  });

  it("validates ISO strings", () => {
    expect(isValidISO("2026-02-28")).toBe(true);
    expect(isValidISO("2026-02-30")).toBe(false);
    expect(isValidISO("2026-2-3")).toBe(false);
    expect(isValidISO(20260101)).toBe(false);
  });
});
