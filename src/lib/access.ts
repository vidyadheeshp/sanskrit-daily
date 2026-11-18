import { SCHEDULE, UNLOCK_ALL } from "../config";
import { formatISO, istISO } from "./date";
import { unlockDate, unlockedThrough } from "./schedule";

/** The date the release schedule runs on: today in IST, the same instant for every learner worldwide. */
export const scheduleToday = (now?: Date): string => istISO(now);

/** Highest lesson number the learner may open on the (IST) schedule date `today`. */
export function openThrough(today: string): number {
  return UNLOCK_ALL ? Number.POSITIVE_INFINITY : unlockedThrough(today, SCHEDULE);
}

/** Human text for when a locked lesson opens. Never reveals the lesson's content. */
export function unlockText(n: number): string {
  const d = unlockDate(n, SCHEDULE);
  return d ? `Unlocks on ${formatISO(d)} at 12:00 AM IST` : "Unlocks after launch — date to be announced";
}
