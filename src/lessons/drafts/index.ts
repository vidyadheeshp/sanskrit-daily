import type { Lesson } from "../../lib/schema";
import { lesson as sandhiTatCa } from "./sandhi-tat-ca";

/**
 * Written and tested, but NOT published: not in the registry, so the app never serves them.
 * To publish a draft: set its `number` to the next free lesson number, move it to
 * `src/lessons/day-NNN.ts` and register it in `src/lessons/index.ts`.
 */
export const drafts: Lesson[] = [sandhiTatCa];
