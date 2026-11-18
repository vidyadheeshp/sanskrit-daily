/** Five-box Leitner scheduler. Pure functions over ISO dates. */
import { addDays } from "./date";

export const INTERVALS = [1, 2, 4, 8, 16] as const;
export const MAX_BOX = INTERVALS.length;

export interface Card {
  box: number; // 1..MAX_BOX
  due: string; // YYYY-MM-DD
}

export function newCard(today: string): Card {
  return { box: 1, due: addDays(today, INTERVALS[0]) };
}

export function grade(card: Card, correct: boolean, today: string): Card {
  const box = correct ? Math.min(card.box + 1, MAX_BOX) : 1;
  return { box, due: addDays(today, INTERVALS[box - 1]) };
}

/** Ids that are due today or overdue, most overdue first, capped at `max`. */
export function dueItems(cards: Record<string, Card>, today: string, max: number): string[] {
  return Object.entries(cards)
    .filter(([, c]) => c.due <= today)
    .sort((a, b) => a[1].due.localeCompare(b[1].due) || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([id]) => id);
}
