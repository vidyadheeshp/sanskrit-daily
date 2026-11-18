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

/** "Fri, 20 Nov 2026" — for showing an ISO date to people. */
export function formatISO(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Lesson number for a date. Launch day is 1; dates before launch give 0 or negative. */
export function dayNumber(today: string, launch: string): number {
  return daysBetween(launch, today) + 1;
}
