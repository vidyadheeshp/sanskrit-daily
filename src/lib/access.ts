import { SCHEDULE, UNLOCK_ALL, UNLOCK_HOUR_IST, UNLOCK_TIME_LABEL } from "../config";
import { formatISO, scheduleISO } from "./date";
import { unlockDate, unlockedThrough } from "./schedule";

/** The date the release schedule runs on: the IST day, starting at the unlock hour; the same instant for every learner worldwide. */
export const scheduleToday = (now: Date = new Date()): string => scheduleISO(now, UNLOCK_HOUR_IST);

/** Highest lesson number the learner may open on the (IST) schedule date `today`. */
export function openThrough(today: string): number {
  return UNLOCK_ALL ? Number.POSITIVE_INFINITY : unlockedThrough(today, SCHEDULE);
}

/** Human text for when a locked lesson opens. Never reveals the lesson's content. */
export function unlockText(n: number): string {
  const d = unlockDate(n, SCHEDULE);
  return d ? `Unlocks on ${formatISO(d)} at ${UNLOCK_TIME_LABEL}` : "Unlocks after launch — date to be announced";
}
