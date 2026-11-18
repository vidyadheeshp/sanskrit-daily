import { SCHEDULE, UNLOCK_ALL } from "../config";
import { formatISO } from "./date";
import { unlockDate, unlockedThrough } from "./schedule";

/** Highest lesson number the learner may open on their local date. */
export function openThrough(today: string): number {
  return UNLOCK_ALL ? Number.POSITIVE_INFINITY : unlockedThrough(today, SCHEDULE);
}

/** Human text for when a locked lesson opens. Never reveals the lesson's content. */
export function unlockText(n: number): string {
  const d = unlockDate(n, SCHEDULE);
  return d ? `Unlocks on ${formatISO(d)}` : "Unlocks after launch — date to be announced";
}
