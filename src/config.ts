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

/** The hour (IST, 24h) at which each day's lesson unlocks. From schedule.json: 6 = 6:00 AM IST. */
export const UNLOCK_HOUR_IST: number = schedule.unlockHourIST;
/** "6:00 AM IST" — for display. */
export const UNLOCK_TIME_LABEL = `${UNLOCK_HOUR_IST % 12 || 12}:00 ${UNLOCK_HOUR_IST < 12 ? "AM" : "PM"} IST`;

/** `npm run dev:unlock` opens every lesson so authors can preview unreleased ones. */
export const UNLOCK_ALL = import.meta.env.VITE_UNLOCK_ALL === "true";

/** GoatCounter site code for the anonymous visit counter. Empty = counter disabled. */
export const COUNTER_CODE: string = String(import.meta.env.VITE_GOATCOUNTER_CODE ?? "").trim();

/** localStorage key. Bump the suffix only with a migration. */
export const STORAGE_KEY = "sanskrit-daily:v1";

/**
 * BRAND — FROZEN (see docs/brand/BRAND.md). A test pins these exact values.
 * Name: Dine Dine (दिने दिने, "day by day"). Descriptive subtitle: Sanskrit Daily.
 */
export const SITE_NAME = "Dine Dine";
export const SITE_NAME_DEV = "दिने दिने";
export const SITE_SUBTITLE = "Sanskrit Daily";
export const SITE_TAGLINE = "प्रतिदिनं संस्कृतम्";
export const SITE_TAGLINE_EN = "Sanskrit, every day";

/**
 * Who made this. Shown in the footer ("Made with love by ...", copyright line) only once `name` is filled in;
 * `url` (personal website) is optional. A plain object so tests can change it.
 */
export const AUTHOR = { name: "", url: "" };
/** First year of publication, for the copyright line. */
export const COPYRIGHT_YEAR = 2026;

/** Public repository (used for the "report a mistake" link). */
export const REPO_URL = "https://github.com/vidyadheeshp/sanskrit-daily";

/** Max number of spaced-review items offered in one sitting. */
export const MAX_REVIEW_PER_SESSION = 3;
