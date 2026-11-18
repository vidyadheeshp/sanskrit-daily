import { describe, it, expect } from "vitest";
import { allNumbers, lessonCount, lessons } from "./index";
import { drafts } from "./drafts";
import { lessonSchema, isExercise } from "../lib/schema";
import { parseInline } from "../lib/markup";

describe("lesson registry", () => {
  it("keeps drafts out of the published registry", () => {
    const published = new Set(lessons.map((l) => l.title));
    for (const d of drafts) expect(published.has(d.title)).toBe(false);
  });

  it("matches each lesson's number to its file name, and nothing is held back in tests", () => {
    expect(allNumbers).toEqual(lessons.map((l) => l.number));
    expect(lessonCount).toBe(lessons.length);
  });

  it("has at least one lesson", () => {
    expect(lessons.length).toBeGreaterThan(0);
  });

  it("numbers lessons 1..N with no gaps or duplicates", () => {
    expect(lessons.map((l) => l.number)).toEqual(lessons.map((_, i) => i + 1));
  });
});

describe.each([...lessons, ...drafts].map((l) => [l.title, l] as const))("lesson: %s", (_title, lesson) => {
  it("passes the schema", () => {
    const result = lessonSchema.safeParse(lesson);
    expect(result.success, result.success ? "" : JSON.stringify(result.error.issues, null, 2)).toBe(true);
  });

  it("has a short teaser that does not just repeat the title", () => {
    expect(lesson.teaser.length).toBeGreaterThan(20);
    expect(lesson.teaser.length).toBeLessThanOrEqual(200);
    expect(lesson.teaser).not.toBe(lesson.title);
  });

  it("has unique step ids (word characters and hyphens only)", () => {
    const ids = lesson.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[\w-]+$/);
  });

  it("ends with exactly one recap, and only at the end", () => {
    const kinds = lesson.steps.map((s) => s.kind);
    expect(kinds[kinds.length - 1]).toBe("recap");
    expect(kinds.filter((k) => k === "recap")).toHaveLength(1);
  });

  it("only requires prerequisites that come earlier", () => {
    for (const p of lesson.prerequisites) expect(p).toBeLessThan(lesson.number);
  });

  it("gives reveal-card demos enough cards", () => {
    for (const s of lesson.steps) {
      if (s.kind === "demo" && s.widget === "reveal-cards") {
        expect(s.cards, `step ${s.id}`).toBeDefined();
        expect(s.cards!.length, `step ${s.id}`).toBeGreaterThanOrEqual(s.requiredInteractions);
      }
    }
  });

  it("gives word-by-word demos valid sentences", () => {
    for (const s of lesson.steps) {
      if (s.kind === "demo" && s.widget === "word-by-word") {
        expect(s.sentences, `step ${s.id}`).toBeDefined();
        const total = s.sentences!.reduce((n, x) => n + x.words.length, 0);
        expect(total, `step ${s.id}`).toBeGreaterThanOrEqual(s.requiredInteractions);
        for (const x of s.sentences!) {
          if (x.gap) expect(x.gap.after, `step ${s.id}`).toBeLessThan(x.words.length - 1);
        }
      }
    }
  });

  it("has at least one demo, one guided and three unguided exercises", () => {
    const exercises = lesson.steps.filter(isExercise);
    expect(lesson.steps.some((s) => s.kind === "demo")).toBe(true);
    expect(exercises.filter((e) => e.guided).length).toBeGreaterThanOrEqual(1);
    expect(exercises.filter((e) => !e.guided).length).toBeGreaterThanOrEqual(3);
  });

  it("gives guided exercises a hint", () => {
    for (const e of lesson.steps.filter(isExercise)) {
      if (e.guided) expect(e.hint, `step ${e.id}`).toBeTruthy();
    }
  });

  it("choice questions have exactly one correct option and explain every option", () => {
    for (const s of lesson.steps) {
      if (s.kind === "exercise" && s.type === "choice") {
        expect(s.options.filter((o) => o.correct), `step ${s.id}`).toHaveLength(1);
        for (const o of s.options) expect(o.why.length, `step ${s.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("tile answers can be built from the tile pool and pool has distractors", () => {
    for (const s of lesson.steps) {
      if (s.kind === "exercise" && s.type === "tiles") {
        const pool = [...s.tiles];
        for (const a of s.answer) {
          const i = pool.indexOf(a);
          expect(i, `step ${s.id}: tile "${a}" missing from pool`).toBeGreaterThanOrEqual(0);
          pool.splice(i, 1);
        }
        expect(pool.length, `step ${s.id} needs at least one distractor`).toBeGreaterThan(0);
      }
    }
  });

  it("match pairs have unique left and right items", () => {
    for (const s of lesson.steps) {
      if (s.kind === "exercise" && s.type === "match") {
        expect(new Set(s.pairs.map((p) => p[0])).size).toBe(s.pairs.length);
        expect(new Set(s.pairs.map((p) => p[1])).size).toBe(s.pairs.length);
      }
    }
  });

  it("uses well-formed script markup (no stray braces or pipes)", () => {
    const texts: string[] = [lesson.teaser];
    for (const s of lesson.steps) {
      if (s.kind === "explain") texts.push(s.body, s.callout?.text ?? "");
      if (s.kind === "demo") {
        texts.push(s.prompt);
        for (const x of s.sentences ?? []) {
          texts.push(x.english, x.gap?.note ?? "");
          for (const w of x.words) texts.push(w.text, w.gloss);
        }
        for (const c of s.cards ?? []) {
          texts.push(c.word, c.meaning, c.use);
          for (const p of c.parts) texts.push(p.text, p.meaning);
        }
      }
      if (s.kind === "exercise") {
        texts.push(s.prompt);
        if (s.type === "choice") for (const o of s.options) texts.push(o.text, o.why);
        if (s.type === "tiles") texts.push(...s.tiles, s.why);
        if (s.type === "match") for (const p of s.pairs) texts.push(...p);
      }
      if (s.kind === "recap") texts.push(s.rule);
    }
    for (const t of texts) {
      const stripped = parseInline(t)
        .map((tok) => (tok.t === "sk" ? "" : tok.t === "text" ? tok.text : ""))
        .join("");
      expect(stripped, `leftover markup in: ${t}`).not.toMatch(/[{}|]/);
    }
  });
});
