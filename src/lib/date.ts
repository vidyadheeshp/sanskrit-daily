/**
 * Calendar maths on local YYYY-MM-DD strings.
 * Everything goes through Date.UTC so daylight-saving never shifts a day.
 */

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function localISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toUTC(iso: string): number {
  const m = ISO.exec(iso);
  if (!m) throw new Error(`Invalid ISO date: ${iso}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function isValidISO(iso: unknown): iso is string {
  if (typeof iso !== "string" || !ISO.test(iso)) return false;
  const t = toUTC(iso);
  return new Date(t).toISOString().slice(0, 10) === iso;
}

/** Whole days from `a` to `b` (positive when b is later). */
export function daysBetween(a: string, b: string): number {
  return Math.round((toUTC(b) - toUTC(a)) / 86_400_000);
}

export function addDays(iso: string, n: number): string {
  return new Date(toUTC(iso) + n * 86_400_000).toISOString().slice(0, 10);
}

/** India Standard Time is UTC+5:30 and has no daylight saving. */
export const IST_OFFSET_MINUTES = 330;

/**
 * The calendar date (YYYY-MM-DD) in India Standard Time at instant `now`.
 * Independent of the device's time-zone setting. The release schedule builds on this: see `scheduleISO`.
 */
export function istISO(now: Date = new Date()): string {
  return new Date(now.getTime() + IST_OFFSET_MINUTES * 60_000).toISOString().slice(0, 10);
}

/** "Fri, 20 Nov 2026" — for showing an ISO date to people. */
export function formatISO(iso: string, locale = "en-GB"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * The release schedule's calendar date at instant `now`: the IST date, but with each day starting at
 * `unlockHourIST` (6 = 6:00 AM IST) instead of midnight. Everyone, everywhere, flips to the next day at the same
 * instant, whatever their device's time zone.
 */
export function scheduleISO(now: Date, unlockHourIST: number): string {
  return istISO(new Date(now.getTime() - unlockHourIST * 3_600_000));
}

/** "Fri 20 Nov" — compact, for small tiles. */
export function formatISOShort(iso: string, locale = "en-GB"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
}

/** Lesson number for a date. Launch day is 1; dates before launch give 0 or negative. */
export function dayNumber(today: string, launch: string): number {
  return daysBetween(launch, today) + 1;
}
