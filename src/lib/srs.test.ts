import { describe, it, expect } from "vitest";
import { dueItems, grade, newCard, INTERVALS, MAX_BOX } from "./srs";

describe("spaced repetition", () => {
  it("a new card is due tomorrow in box 1", () => {
    expect(newCard("2026-11-14")).toEqual({ box: 1, due: "2026-11-15" });
  });

  it("a correct answer moves up a box and waits longer", () => {
    const c = grade({ box: 1, due: "2026-11-15" }, true, "2026-11-15");
    expect(c).toEqual({ box: 2, due: "2026-11-17" });
  });

  it("a wrong answer drops back to box 1", () => {
    const c = grade({ box: 4, due: "2026-11-15" }, false, "2026-11-15");
    expect(c).toEqual({ box: 1, due: "2026-11-16" });
  });

  it("never goes past the top box", () => {
    const c = grade({ box: MAX_BOX, due: "2026-11-15" }, true, "2026-11-15");
    expect(c.box).toBe(MAX_BOX);
    expect(c.due).toBe("2026-12-01"); // +16 days
    expect(INTERVALS[MAX_BOX - 1]).toBe(16);
  });

  it("lists only due items, most overdue first, capped", () => {
    const cards = {
      "1:a": { box: 1, due: "2026-11-14" },
      "1:b": { box: 1, due: "2026-11-10" },
      "1:c": { box: 2, due: "2026-11-20" },
      "1:d": { box: 1, due: "2026-11-12" },
    };
    expect(dueItems(cards, "2026-11-14", 10)).toEqual(["1:b", "1:d", "1:a"]);
    expect(dueItems(cards, "2026-11-14", 2)).toEqual(["1:b", "1:d"]);
    expect(dueItems(cards, "2026-11-01", 3)).toEqual([]);
  });
});
