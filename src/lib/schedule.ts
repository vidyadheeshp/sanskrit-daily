/**
 * Release schedule — pure functions, shared by the app, the build and the tests.
 *
 *  - `launchDate` is Day 1 (local calendar date, YYYY-MM-DD). `null` means "not announced yet".
 *  - `previewLessons` lessons are always open (the free sample), launched or not.
 *  - `publishAheadDays`: a build includes lessons up to this many days ahead of its own date, so
 *    the app can unlock each one at the learner's own local midnight in any time zone.
 */
import { addDays, dayNumber } from "./date.ts";

export interface ScheduleConfig {
  launchDate: string | null;
  previewLessons: number;
  publishAheadDays: number;
}

/** Highest lesson number a learner may open on their local date `today`. */
export function unlockedThrough(today: string, c: ScheduleConfig): number {
  const byDate = c.launchDate ? Math.max(0, dayNumber(today, c.launchDate)) : 0;
  return Math.max(c.previewLessons, byDate);
}

export function isUnlocked(n: number, today: string, c: ScheduleConfig): boolean {
  return n <= unlockedThrough(today, c);
}

/** The date lesson `n` unlocks, or null if the launch date isn't set (or it is always open). */
export function unlockDate(n: number, c: ScheduleConfig): string | null {
  if (!c.launchDate || n <= c.previewLessons) return null;
  return addDays(c.launchDate, n - 1);
}

/** Highest lesson number to include in a build made on `todayUTC`. */
export function publishThrough(todayUTC: string, c: ScheduleConfig): number {
  if (!c.launchDate) return c.previewLessons;
  return Math.max(c.previewLessons, dayNumber(todayUTC, c.launchDate) + c.publishAheadDays);
}
