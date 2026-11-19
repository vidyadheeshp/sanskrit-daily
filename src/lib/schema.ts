/**
 * Lesson schema. Used for build-time validation (tests); components only import the
 * inferred *types* (`import type`), so Zod is not shipped to learners.
 */
import { z } from "zod";

const text = z.string().min(1);

export const WIDGETS = ["place-chart", "sandhi-demo", "reveal-cards", "word-by-word"] as const;
export const RHYTHMS = ["new", "recognize", "build", "review", "culture", "challenge"] as const;

const callout = z.object({
  tone: z.enum(["note", "caution"]),
  text,
});

const explainStep = z.object({
  kind: z.literal("explain"),
  id: text,
  title: text.optional(),
  body: text,
  callout: callout.optional(),
});

/** A word that reveals its pieces and meaning when tapped (widget: "reveal-cards"). */
const revealCard = z.object({
  /** The word, usually "{देवनागरी|IAST}". */
  word: text,
  /** The meaningful pieces it is built from, in order. */
  parts: z.array(z.object({ text, meaning: text })).min(1),
  /** What the whole word means. */
  meaning: text,
  /** When you would say it. */
  use: text,
});

/**
 * A sentence laid out word by word (widget: "word-by-word"). Tapping a word reveals its gloss.
 * Once every word is revealed, the optional `gap` shows a word English needs but Sanskrit omits.
 */
const wordSentence = z.object({
  words: z.array(z.object({ text, gloss: text })).min(2),
  /** The natural English translation. */
  english: text,
  gap: z
    .object({
      /** Index of the word after which the English word would sit. */
      after: z.number().int().min(0),
      /** The English word that is missing in Sanskrit, e.g. "is". */
      label: text,
      note: text,
    })
    .optional(),
});

const demoStep = z.object({
  kind: z.literal("demo"),
  id: text,
  title: text.optional(),
  widget: z.enum(WIDGETS),
  prompt: text,
  requiredInteractions: z.number().int().min(1),
  /** Required when widget is "reveal-cards". */
  cards: z.array(revealCard).optional(),
  /** Required when widget is "word-by-word". */
  sentences: z.array(wordSentence).optional(),
});

const exerciseBase = {
  kind: z.literal("exercise"),
  id: text,
  prompt: text,
  /** Guided questions show their hint; unguided ("prove it") questions never do. */
  guided: z.boolean().optional(),
  hint: text.optional(),
  /** Schedule this question for spaced review. */
  reviewItem: z.boolean().optional(),
};

const choiceStep = z.object({
  ...exerciseBase,
  type: z.literal("choice"),
  options: z
    .array(z.object({ text, correct: z.boolean(), why: text }))
    .min(2),
});

const tilesStep = z.object({
  ...exerciseBase,
  type: z.literal("tiles"),
  tiles: z.array(text).min(2),
  answer: z.array(text).min(1),
  why: text,
});

const matchStep = z.object({
  ...exerciseBase,
  type: z.literal("match"),
  pairs: z.array(z.tuple([text, text])).min(2),
  why: text.optional(),
});

const recapStep = z.object({
  kind: z.literal("recap"),
  id: text,
  rule: text,
  example: z.object({ dev: text, iast: text }).optional(),
});

export const stepSchema = z.union([
  explainStep,
  demoStep,
  choiceStep,
  tilesStep,
  matchStep,
  recapStep,
]);

const exerciseSchema = z.union([choiceStep, tilesStep, matchStep]);

/**
 * A weekly check: a short set of questions on everything in a week, shown after its last lesson.
 * Questions use the same exercise shapes as lessons. There is no pass mark; finishing earns a thank-you badge.
 */
export const weekSchema = z.object({
  number: z.number().int().min(1),
  title: text,
  reviewed: z.boolean(),
  credits: z.array(text).min(1),
  questions: z.array(exerciseSchema).min(6),
  /** One brief line teasing the next week. A teaser only; never lesson content. */
  next: text,
});

export const lessonSchema = z.object({
  number: z.number().int().min(1),
  title: text,
  concept: text,
  /** One-line hook used for social posts and link previews. Pose the puzzle; don't give the answer. */
  teaser: text,
  rhythm: z.enum(RHYTHMS),
  minutes: z.number().int().min(1).max(15),
  prerequisites: z.array(z.number().int().min(1)),
  credits: z.array(text).min(1),
  reviewed: z.boolean(),
  sources: z.array(text).optional(),
  steps: z.array(stepSchema).min(2),
});

export type Lesson = z.infer<typeof lessonSchema>;
export type Week = z.infer<typeof weekSchema>;
export type Step = z.infer<typeof stepSchema>;
export type ExplainStep = z.infer<typeof explainStep>;
export type DemoStep = z.infer<typeof demoStep>;
export type RevealCard = z.infer<typeof revealCard>;
export type WordSentence = z.infer<typeof wordSentence>;
export type ChoiceStep = z.infer<typeof choiceStep>;
export type TilesStep = z.infer<typeof tilesStep>;
export type MatchStep = z.infer<typeof matchStep>;
export type RecapStep = z.infer<typeof recapStep>;
export type ExerciseStep = ChoiceStep | TilesStep | MatchStep;
export type Widget = (typeof WIDGETS)[number];

export function isExercise(step: Step): step is ExerciseStep {
  return step.kind === "exercise";
}
