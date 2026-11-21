import type { Lesson } from "../../lib/schema";

/**
 * Written and tested, but NOT published: not in the registry, so the app never serves them.
 * To publish a draft: set its `number` to the next free lesson number, move it to
 * `src/lessons/day-NNN.ts` (lessons are discovered automatically from the file name).
 * Currently empty: the consonant-sandhi draft became lesson 11.
 */
export const drafts: Lesson[] = [];
