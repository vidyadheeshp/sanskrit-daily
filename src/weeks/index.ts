import type { Week } from "../lib/schema";
import { weekFirstLesson, weekLastLesson } from "../lib/schedule";

/**
 * Every `week-NN.ts` (digits) in this folder is picked up automatically, like the lessons.
 * In a production build a week whose last lesson is not yet published is replaced by an empty stub
 * (`week = null`, see vite.config.ts), so its questions cannot reveal lessons still to come.
 */
const modules = import.meta.glob<{ week: Week | null }>("./week-[0-9]*.ts", { eager: true });

const entries = Object.entries(modules)
  .map(([path, m]) => ({ n: Number(/week-(\d+)\.ts$/.exec(path)?.[1]), week: m.week }))
  .sort((a, b) => a.n - b.n);

/** Weeks present in this build. */
export const weeks: Week[] = entries.flatMap((e) => (e.week ? [e.week] : []));

export const getWeek = (n: number): Week | undefined => weeks.find((w) => w.number === n);

/** The week whose last lesson is lesson `n`, if any (used to offer the check at the end of that lesson). */
export const weekEndingWith = (n: number): Week | undefined => weeks.find((w) => weekLastLesson(w.number) === n);

export const lessonRange = (week: number): [number, number] => [weekFirstLesson(week), weekLastLesson(week)];
