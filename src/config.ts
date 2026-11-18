import schedule from "../schedule.json";
import type { ScheduleConfig } from "./lib/schedule";

/**
 * Release schedule, from /schedule.json (edit that file, not this one).
 * Deliberately a plain mutable object so tests can change it.
 */
export const SCHEDULE: ScheduleConfig = {
  launchDate: schedule.launchDate,
  previewLessons: schedule.previewLessons,
  publishAheadDays: schedule.publishAheadDays,
};

/** `npm run dev:unlock` opens every lesson so authors can preview unreleased ones. */
export const UNLOCK_ALL = import.meta.env.VITE_UNLOCK_ALL === "true";

/** GoatCounter site code for the anonymous visit counter. Empty = counter disabled. */
export const COUNTER_CODE: string = String(import.meta.env.VITE_GOATCOUNTER_CODE ?? "").trim();

/** localStorage key. Bump the suffix only with a migration. */
export const STORAGE_KEY = "sanskrit-daily:v1";

export const SITE_NAME = "Sanskrit Daily";

/** Max number of spaced-review items offered in one sitting. */
export const MAX_REVIEW_PER_SESSION = 3;
