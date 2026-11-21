// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { flushSync, mount, tick } from "svelte";
import App from "./App.svelte";
import { SCHEDULE } from "./config";
import { app as store } from "./lib/store.svelte";

/** What a learner who arrives late sees: a way in at Lesson 1, their own next lesson, and a heads-up on skipped lessons. */

const page = () => document.body.textContent?.replace(/\s+/g, " ") ?? "";
const ORIGINAL_LAUNCH = SCHEDULE.launchDate;

async function goto(hash: string) {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  flushSync();
  await tick();
}
function boot(now: string) {
  vi.setSystemTime(new Date(now));
  document.body.innerHTML = '<div id="root"></div>';
  mount(App, { target: document.getElementById("root")! });
  flushSync();
}
const done = (...ns: number[]) => ns.forEach((n) => store.completeLesson(n, "rule", []));

beforeEach(() => {
  window.scrollTo = () => {};
  localStorage.clear();
  store.reset();
  store.markWelcomeSeen();
  vi.useFakeTimers({ toFake: ["Date"] });
  SCHEDULE.launchDate = "2026-12-01"; // 3 Dec = day 3: lessons 1-3 open
  location.hash = "#/";
});
afterEach(() => {
  vi.useRealTimers();
  SCHEDULE.launchDate = ORIGINAL_LAUNCH;
});

describe("late arrivals: Today page", () => {
  it("a newcomer who has done nothing is invited to start at Lesson 1", () => {
    boot("2026-12-03T12:00:00+05:30");
    expect(page()).toContain("New here? Start with Lesson 1");
    expect(document.querySelector<HTMLAnchorElement>('a[href="#/day/1"]')).not.toBeNull();
    expect(page()).not.toContain("lessons done so far");
  });

  it("on launch day there is nothing to catch up on, so no 'start here' card", () => {
    boot("2026-12-01T12:00:00+05:30");
    expect(page()).not.toContain("New here? Start with Lesson 1");
  });

  it("someone who skipped ahead is pointed to their own next lesson, with progress", () => {
    done(2);
    boot("2026-12-03T12:00:00+05:30");
    expect(page()).toContain("Your next lesson: 1");
    expect(page()).not.toContain("New here?");
    expect(page()).toMatch(/1 of 3 lessons done so far/);
  });

  it("someone who is up to date sees neither card, just progress", () => {
    done(1, 2);
    boot("2026-12-03T12:00:00+05:30");
    expect(page()).not.toContain("Your next lesson");
    expect(page()).not.toContain("New here?");
    expect(page()).toMatch(/2 of 3 lessons done so far/);
  });
});

describe("late arrivals: arriving on a lesson from a shared link", () => {
  it("says the lesson builds on earlier ones, offers the first missing one, and can be dismissed", async () => {
    boot("2026-12-03T12:00:00+05:30");
    await goto("#/day/3");
    const note = document.querySelector("[data-builds]");
    expect(note?.textContent).toContain("builds on earlier lessons");
    expect(note?.querySelector<HTMLAnchorElement>('a[href="#/day/1"]')).not.toBeNull();

    (note!.querySelector("button") as HTMLButtonElement).click();
    flushSync();
    await tick();
    expect(document.querySelector("[data-builds]")).toBeNull();
  });

  it("points at the first lesson they haven't done, not always Lesson 1", async () => {
    done(1);
    boot("2026-12-03T12:00:00+05:30");
    await goto("#/day/3");
    expect(document.querySelector('[data-builds] a[href="#/day/2"]')).not.toBeNull();
  });

  it("does not appear on Lesson 1, or when everything before has been done", async () => {
    boot("2026-12-03T12:00:00+05:30");
    await goto("#/day/1");
    expect(document.querySelector("[data-builds]")).toBeNull();
    done(1, 2);
    await goto("#/day/2");
    await goto("#/day/3");
    expect(document.querySelector("[data-builds]")).toBeNull();
  });
});
