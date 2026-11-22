// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { flushSync, mount, tick } from "svelte";
import App from "../App.svelte";
import { SCHEDULE, STORAGE_KEY } from "../config";
import { app as store } from "../lib/store.svelte";
import { toPlain } from "../lib/markup";
import { week as week1 } from "./week-01";
import { en } from "../i18n/en";
import { kn } from "../i18n/kn";

/** The weekly check and its badge, through the real UI. */

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const page = () => document.body.textContent ?? "";
const buttons = () => Array.from(document.querySelectorAll<HTMLButtonElement>("button, a.btn"));
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

function btn(text: string, exact = false): HTMLButtonElement {
  const found = buttons().find((b) => (exact ? norm(b.textContent ?? "") === text : norm(b.textContent ?? "").includes(text)));
  if (!found) throw new Error(`No button "${text}". Buttons: ${buttons().map((b) => norm(b.textContent ?? "")).join(" | ")}`);
  return found as HTMLButtonElement;
}
async function click(text: string, exact = false) {
  btn(text, exact).click();
  flushSync();
  await tick();
}
async function goto(hash: string) {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  flushSync();
  await tick();
}

/** Answers every question from its own data. */
async function answerAll() {
  const plain = (s: string) => norm(toPlain(s, "both"));
  for (const q of week1.questions) {
    if (q.type === "choice") {
      await click(plain(q.options.find((o) => o.correct)!.text), true);
    } else if (q.type === "tiles") {
      for (const a of q.answer) await click(plain(a), true);
      await click("Check");
    } else {
      for (const [l, r] of q.pairs) {
        await click(plain(l), true);
        await click(plain(r), true);
      }
    }
    const next = buttons().find((b) => /Next question|See my badge/.test(b.textContent ?? ""))!;
    expect(next.disabled, `question ${q.id} should unlock the next step`).toBe(false);
    next.click();
    flushSync();
    await tick();
  }
}

const ORIGINAL_LAUNCH = SCHEDULE.launchDate;

function finishLessons(upTo: number) {
  for (let n = 1; n <= upTo; n++) store.completeLesson(n, `rule ${n}`, []);
}

beforeEach(() => {
  window.scrollTo = () => {};
  localStorage.clear();
  store.reset();
  store.markWelcomeSeen();
  document.body.innerHTML = '<div id="root"></div>';
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-12-20T12:00:00+05:30")); // far past launch: everything is open
  SCHEDULE.launchDate = "2026-12-01";
  location.hash = "#/";
  window.dispatchEvent(new HashChangeEvent("hashchange")); // the router is a singleton: reset it before mounting
  mount(App, { target: document.getElementById("root")! });
  flushSync();
});
afterEach(() => {
  vi.useRealTimers();
  SCHEDULE.launchDate = ORIGINAL_LAUNCH;
});

describe("weekly check", () => {
  it("is locked until every lesson of the week is finished, and says which are left", async () => {
    finishLessons(5);
    await goto("#/week/1");
    expect(page()).toContain(en["week.locked.title"]);
    expect(page()).toContain("Lesson 6");
    expect(page()).toContain("Lesson 7");
    expect(page()).not.toContain("Lesson 5");
    expect(buttons().some((b) => b.textContent?.includes("Start the check"))).toBe(false);
  });

  it("an unknown week says so politely", async () => {
    await goto("#/week/9");
    expect(page()).toContain(en["week.missing.title"]);
  });

  it("explains itself, can be played through, and ends with a plain badge and a teaser", async () => {
    finishLessons(7);
    await goto("#/week/1");
    expect(page()).toContain(`${week1.questions.length} short questions`);
    expect(page()).toMatch(/no pass mark/i);
    await click("Start the check");
    expect(page()).toContain(`Question 1 of ${week1.questions.length}`);
    await answerAll();

    expect(document.querySelector("h1")?.textContent).toContain("Week 1 complete");
    expect(page()).toMatch(/You got \d+ of \d+ right on the first try/);
    expect(saved().weeks["1"]).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const svg = document.querySelector("figure.badge svg")!;
    expect(svg).not.toBeNull();
    expect(svg.textContent).toContain("Week 1");
    expect(svg.textContent).not.toMatch(/\d+\s*\/\s*\d+|score|certif/i);
    expect(page()).toContain(en["week.badge.note"]);
    expect(page()).toContain(week1.next);
    expect(buttons().some((b) => b.textContent?.includes("Download image"))).toBe(true);
    expect(buttons().some((b) => b.textContent?.includes("Copy message"))).toBe(true);
  });

  it("a finished week opens straight on the badge, and can be retaken without losing it", async () => {
    finishLessons(7);
    store.completeWeek(1);
    const firstDate = saved().weeks["1"];
    await goto("#/week/1");
    expect(document.querySelector("figure.badge svg")).not.toBeNull();
    expect(page()).toContain("You finished the Week 1 check");
    await click("Take the check again");
    expect(page()).toContain(`Question 1 of ${week1.questions.length}`);
    expect(saved().weeks["1"]).toBe(firstDate);
  });

  it("the badge message can be copied", async () => {
    finishLessons(7);
    store.completeWeek(1);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await goto("#/week/1");
    await click("Copy message");
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("I finished Week 1 of Dine Dine");
    expect(page()).toContain(en["week.badge.copied"]);
  });

  it("appears in the Archive once the week's last lesson is open, marked done when finished", async () => {
    await goto("#/archive");
    expect(page()).toContain("Week 1 check and badge");
    expect(page()).toContain("Week 2 check and badge");
    expect(page()).not.toContain("Week 3 check"); // lessons 15–21 aren't written yet, so no check is offered
    store.completeWeek(1);
    await goto("#/archive");
    const entry = Array.from(document.querySelectorAll("a")).find((a) => a.textContent?.includes("Week 1 check"))!;
    expect(entry.textContent).toMatch(/done/i);
  });

  it("is offered at the end of lesson 7 and not of other lessons", async () => {
    await goto("#/day/7");
    // play lesson 7 to the end with its own data
    const { lesson } = await import("../lessons/day-007");
    const plain = (s: string) => norm(toPlain(s, "both"));
    for (const step of lesson.steps) {
      if (step.kind === "explain") await click("Continue");
      else if (step.kind === "demo") {
        for (const w of Array.from(document.querySelectorAll<HTMLButtonElement>(".wbw-tile"))) {
          w.click();
          flushSync();
          await tick();
        }
        await click("Continue");
      } else if (step.kind === "exercise") {
        if (step.type === "choice") await click(plain(step.options.find((o) => o.correct)!.text), true);
        else if (step.type === "tiles") {
          for (const a of step.answer) await click(plain(a), true);
          await click("Check");
        } else {
          for (const [l, r] of step.pairs) {
            await click(plain(l), true);
            await click(plain(r), true);
          }
        }
        await click("Continue");
      } else await click("Finish lesson");
    }
    expect(page()).toContain("That's the end of Week 1!");
    expect(btn("Take the Week 1 check")).toBeTruthy();
  });

  it("renders in Kannada, with the badge itself staying plain English", async () => {
    finishLessons(7);
    store.completeWeek(1);
    store.setLanguage("kn");
    await goto("#/week/1");
    expect(document.querySelector("h1")?.textContent).toContain("ವಾರ 1");
    expect(page()).toContain(kn["week.badge.note"]);
    expect(document.querySelector("figure.badge svg")?.textContent).toContain("Week 1");
    expect(document.querySelector("figure.badge svg")?.textContent).not.toMatch(/[ಀ-೿]/);
  });
});
