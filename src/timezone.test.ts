import { describe, it, expect } from "vitest";

describe("time-zone test harness", () => {
  // When a zone is requested, make sure it was really applied, so a "passes in every zone" result can be trusted.
  it("actually applies TEST_TZ when one is set", () => {
    const wanted = process.env.TEST_TZ;
    if (!wanted) return; // default run: whatever the machine uses
    // Compare what the clock actually does, not the zone's name (ICU may report an alias, e.g. Asia/Calcutta).
    const t = new Date("2026-11-19T00:30:00Z");
    const hourThere = Number(new Intl.DateTimeFormat("en-GB", { timeZone: wanted, hour: "2-digit", hour12: false }).format(t));
    expect(t.getHours()).toBe(hourThere % 24);
    expect(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false }).format(t)).toBe(String(hourThere % 24).padStart(2, "0"));
  });

  it("really shifts the clock between zones (sanity check of the formatter itself)", () => {
    const t = new Date("2026-11-19T00:30:00Z");
    const hourIn = (timeZone: string) =>
      new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hour12: false }).format(t);
    expect(hourIn("Asia/Kolkata")).toBe("06");
    expect(hourIn("America/Los_Angeles")).toBe("16");
    expect(hourIn("Pacific/Kiritimati")).toBe("14");
  });
});
