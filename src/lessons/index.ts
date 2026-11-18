import type { Lesson } from "../lib/schema";

/**
 * Every `day-NNN.ts` in this folder is picked up automatically — no manual registration.
 * The lesson number comes from the file name and must match `lesson.number`.
 *
 * In a production build, lessons beyond the publish window are replaced by an empty stub
 * (`lesson = null`, see vite.config.ts), so unreleased lessons never reach the browser.
 */
const modules = import.meta.glob<{ lesson: Lesson | null }>("./day-*.ts", { eager: true });

const entries = Object.entries(modules)
  .map(([path, m]) => ({ n: Number(/day-(\d+)\.ts$/.exec(path)?.[1]), lesson: m.lesson }))
  .sort((a, b) => a.n - b.n);

/** Numbers of every lesson that exists in the repo, published or held back. */
export const allNumbers: number[] = entries.map((e) => e.n);

/** Total lessons written (includes ones not yet published). */
export const lessonCount: number = entries.length;

/** Lessons actually present in this build. */
export const lessons: Lesson[] = entries.flatMap((e) => (e.lesson ? [e.lesson] : []));

export function getLesson(n: number): Lesson | undefined {
  return lessons.find((l) => l.number === n);
}
