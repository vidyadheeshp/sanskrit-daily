// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { weekSchema } from "../lib/schema";
import { weeks, weekEndingWith, lessonRange } from "./index";
import { lessons } from "../lessons";
import { weekFirstLesson, weekLastLesson, LESSONS_PER_WEEK } from "../lib/schedule";
import { badgeSvg, badgeShareText } from "../lib/badge";
import { defaultState, parseState } from "../lib/storage";
import { parseHash } from "../lib/router.svelte";

const devWords = (s: string) =>
  (s.match(/[ऀ-ॿ]+/g) ?? []).map((w) => w.replace(/[।॥]/g, "")).filter(Boolean);

describe("week ranges", () => {
  it("a week is seven lessons", () => {
    expect(LESSONS_PER_WEEK).toBe(7);
    expect([weekFirstLesson(1), weekLastLesson(1)]).toEqual([1, 7]);
    expect([weekFirstLesson(2), weekLastLesson(2)]).toEqual([8, 14]);
    expect(lessonRange(3)).toEqual([15, 21]);
  });
  it("the check is offered at the end of the week's last lesson only", () => {
    expect(weekEndingWith(7)?.number).toBe(1);
    expect(weekEndingWith(6)).toBeUndefined();
    expect(weekEndingWith(8)).toBeUndefined();
  });
});

describe.each(weeks.map((w) => [w.number, w] as const))("week %i check", (_n, week) => {
  const [first, last] = lessonRange(week.number);

  it("matches the schema", () => {
    expect(() => weekSchema.parse(week)).not.toThrow();
  });

  it("has unique question ids and enough questions for a real check", () => {
    const ids = week.questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(8);
  });

  it("every question has a single right answer that can actually be built", () => {
    for (const q of week.questions) {
      if (q.type === "choice") {
        expect(q.options.filter((o) => o.correct), q.id).toHaveLength(1);
      } else if (q.type === "tiles") {
        const pool = [...q.tiles];
        for (const a of q.answer) {
          const i = pool.indexOf(a);
          expect(i, `${q.id}: answer tile ${a} missing`).toBeGreaterThanOrEqual(0);
          pool.splice(i, 1);
        }
        expect(q.tiles.length, `${q.id}: needs at least one wrong tile`).toBeGreaterThan(q.answer.length);
      } else {
        expect(new Set(q.pairs.map((p) => p[0])).size, q.id).toBe(q.pairs.length);
        expect(new Set(q.pairs.map((p) => p[1])).size, q.id).toBe(q.pairs.length);
      }
    }
  });

  it("uses a mix of question types", () => {
    expect(new Set(week.questions.map((q) => q.type)).size).toBe(3);
  });

  it("only uses Sanskrit words taught in this week's lessons", () => {
    const taught = new Set(
      lessons.filter((l) => l.number >= first && l.number <= last).flatMap((l) => devWords(JSON.stringify(l))),
    );
    const used = week.questions.flatMap((q) => devWords(JSON.stringify(q)));
    const strangers = [...new Set(used)].filter((w) => !taught.has(w));
    expect(strangers).toEqual([]);
  });

  it("does not stay unreviewed by accident: reviewed is explicit, and credits are present", () => {
    expect(typeof week.reviewed).toBe("boolean");
    expect(week.credits.length).toBeGreaterThan(0);
  });

  it("has a one-line teaser for next week that does not look like lesson content", () => {
    expect(week.next.length).toBeLessThanOrEqual(160);
    expect(week.next.split("\n")).toHaveLength(1);
  });
});

describe("badge", () => {
  const svg = badgeSvg(1, "example.github.io/sanskrit-daily/");
  const text = svg.replace(/<[^>]+>/g, " ");

  it("says only that the week is complete, with the brand", () => {
    expect(text).toContain("Week 1");
    expect(text).toContain("complete");
    expect(text).toContain("Dine Dine");
    expect(svg).toContain("xmlns=");
  });

  it("makes no claim of level, certification, score or identity", () => {
    expect(text).not.toMatch(/certif|qualif|diploma|level|fluen|expert|master|score|grade|rank|\d+\s*\/\s*\d+|\d+\s*%/i);
  });

  it("escapes anything inserted into it", () => {
    expect(badgeSvg(1, '"><script>x</script>')).not.toContain("<script>");
  });

  it("the share message is plain and carries the link", () => {
    const msg = badgeShareText(1, "https://example.github.io/sanskrit-daily/");
    expect(msg).toContain("Week 1");
    expect(msg).toContain("https://example.github.io/sanskrit-daily/");
    expect(msg).not.toMatch(/certif|score|level|fluen/i);
  });
});

describe("state and routing", () => {
  it("weeks start empty, round-trip, drop bad entries, and old files without weeks still load", () => {
    expect(defaultState().weeks).toEqual({});
    const s = { ...defaultState(), weeks: { "1": "2026-11-25", x: "2026-11-25", "2": "not-a-date" } };
    expect(parseState(s)?.weeks).toEqual({ "1": "2026-11-25" });
    const old: any = defaultState();
    delete old.weeks;
    expect(parseState(old)?.weeks).toEqual({});
  });

  it("parses #/week/N", () => {
    expect(parseHash("#/week/1")).toEqual({ name: "week", n: 1 });
    expect(parseHash("#/week/abc")).toEqual({ name: "today" });
    expect(parseHash("#/week/0")).toEqual({ name: "today" });
  });
});
