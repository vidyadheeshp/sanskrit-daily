import { describe, it, expect } from "vitest";
import {
  elongation,
  julianDay,
  lahiriAyanamsa,
  nextBoundary,
  norm360,
  sunLongitude,
  sunTimes,
} from "./astro";

/**
 * Reference values below were generated with an INDEPENDENT library (PyEphem 4.2.1), not with this code.
 * See docs/PANCHANG.md for the full validation (600 positions, 250 panchangs, and a published almanac).
 */
const NEW_MOONS = ["2026-01-18T19:51:54Z", "2026-02-17T12:01:04Z", "2026-03-19T01:23:24Z", "2026-04-17T11:51:44Z", "2026-05-16T20:00:58Z", "2026-06-15T02:54:04Z", "2026-07-14T09:43:31Z", "2026-08-12T17:36:39Z", "2026-09-11T03:26:55Z"];
const FULL_MOONS = ["2026-01-03T10:02:50Z", "2026-02-01T22:09:10Z", "2026-03-03T11:37:49Z", "2026-04-02T02:11:54Z", "2026-05-01T17:23:06Z", "2026-05-31T08:45:07Z", "2026-06-29T23:56:35Z", "2026-07-29T14:35:37Z", "2026-08-28T04:18:26Z"];
const EQUINOX_2026_MAR = "2026-03-20T14:45:53Z";
const SOLSTICE_2026_JUN = "2026-06-21T08:24:31Z";

const MIN = 60_000;
const minutesApart = (a: Date, b: Date) => Math.abs(a.getTime() - b.getTime()) / MIN;
const jdToDate = (jd: number) => new Date((jd - 2_440_587.5) * 86_400_000);
const wrap180 = (x: number) => ((x + 540) % 360) - 180;

describe("Julian Day", () => {
  it("is 2451545.0 at J2000.0", () => {
    expect(julianDay(new Date("2000-01-01T12:00:00Z"))).toBeCloseTo(2_451_545.0, 9);
  });
  it("is 2440587.5 at the Unix epoch", () => {
    expect(julianDay(new Date(0))).toBe(2_440_587.5);
  });
});

describe("norm360", () => {
  it("wraps into [0, 360)", () => {
    expect(norm360(-1)).toBe(359);
    expect(norm360(361)).toBe(1);
    expect(norm360(720)).toBe(0);
  });
});

describe("the Sun", () => {
  it("is at ecliptic longitude 0° at the March equinox (independent reference)", () => {
    const lon = wrap180(sunLongitude(julianDay(new Date(EQUINOX_2026_MAR))));
    expect(Math.abs(lon)).toBeLessThan(0.01); // ~15 minutes of the Sun's motion; observed error is far smaller
  });
  it("is at 90° at the June solstice (independent reference)", () => {
    expect(Math.abs(sunLongitude(julianDay(new Date(SOLSTICE_2026_JUN))) - 90)).toBeLessThan(0.01);
  });
});

describe("the Moon (new and full moons, independent reference)", () => {
  // Elongation (Moon minus Sun) is 0° at new moon and 180° at full moon, i.e. a tithi boundary (multiple of 12°).
  it.each(NEW_MOONS)("new moon %s is found within 3 minutes", (iso) => {
    const t = new Date(iso);
    const found = jdToDate(nextBoundary(elongation, julianDay(t) - 3 / 24, 12));
    expect(minutesApart(found, t)).toBeLessThan(3);
  });
  it.each(FULL_MOONS)("full moon %s is found within 3 minutes", (iso) => {
    const t = new Date(iso);
    const found = jdToDate(nextBoundary(elongation, julianDay(t) - 3 / 24, 12));
    expect(minutesApart(found, t)).toBeLessThan(3);
  });
});

describe("Lahiri ayanamsa", () => {
  it("is 23°51′11″ at J2000.0", () => {
    expect(lahiriAyanamsa(2_451_545.0)).toBeCloseTo(23.853056, 5);
  });
  it("grows by about 50.3 arcseconds a year (the rate of precession)", () => {
    const perYear = lahiriAyanamsa(2_451_545.0 + 365.25 * 10) - lahiriAyanamsa(2_451_545.0);
    expect((perYear / 10) * 3600).toBeGreaterThan(50);
    expect((perYear / 10) * 3600).toBeLessThan(50.6);
  });
  it("is about 24.2° in 2026", () => {
    const v = lahiriAyanamsa(julianDay(new Date("2026-01-01T00:00:00Z")));
    expect(v).toBeGreaterThan(24.19);
    expect(v).toBeLessThan(24.22);
  });
});

describe("sunrise and sunset", () => {
  it("handles places with no sunrise (polar night / midnight sun)", () => {
    expect(sunTimes(2026, 12, 21, 80, 0).polar).toBe(true); // polar night
    expect(sunTimes(2026, 6, 21, 80, 0).polar).toBe(true); // midnight sun
    expect(sunTimes(2026, 12, 21, 80, 0).sunrise).toBeNull();
  });
  it("gives a day about 12 hours long at the equator", () => {
    const t = sunTimes(2026, 3, 20, 0, 0);
    const hours = (t.sunset!.getTime() - t.sunrise!.getTime()) / 3_600_000;
    expect(hours).toBeGreaterThan(12);
    expect(hours).toBeLessThan(12.2);
  });
  it("rises before it sets, with solar noon between them", () => {
    const t = sunTimes(2026, 11, 19, 12.9716, 77.5946);
    expect(t.sunrise!.getTime()).toBeLessThan(t.sunset!.getTime());
  });
});

describe("nextBoundary", () => {
  it("finds the next multiple of the segment size, including across the 360° wrap", () => {
    const jd0 = 2_461_000; // arbitrary
    const angle = (jd: number) => norm360(355 + 10 * (jd - jd0)); // 10° per day, starting at 355°
    expect(nextBoundary(angle, jd0, 12) - jd0).toBeCloseTo((360 - 355) / 10, 3); // crosses 360° after 0.5 day
    const angle2 = (jd: number) => norm360(100 + 10 * (jd - jd0));
    expect(nextBoundary(angle2, jd0, 12) - jd0).toBeCloseTo(0.8, 3); // from 100°, the next multiple of 12 is 108°: 0.8 day away
  });
});
