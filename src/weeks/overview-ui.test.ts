// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { flushSync, mount, tick } from "svelte";
import App from "../App.svelte";
import { SCHEDULE } from "../config";
import { app as store } from "../lib/store.svelte";

/** The Archive's week-by-week overview. */

const ORIGINAL_LAUNCH = SCHEDULE.launchDate;
const page = () => document.body.textContent?.replace(/\s+/g, " ") ?? "";

async function openArchive() {
  location.hash = "#/archive";
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  flushSync();
  await tick();
}

beforeEach(async () => {
  window.scrollTo = () => {};
  localStorage.clear();
  store.reset();
  store.markWelcomeSeen();
  document.body.innerHTML = '<div id="root"></div>';
  vi.useFakeTimers({ toFake: ["Date"] });
  SCHEDULE.launchDate = "2026-12-01";
  vi.setSystemTime(new Date("2026-12-09T12:00:00+05:30")); // day 9: lessons 1-9 open (week 1 complete + 2 of week 2)
  location.hash = "#/archive";
  window.dispatchEvent(new HashChangeEvent("hashchange"));
});
afterEach(() => {
  vi.useRealTimers();
  SCHEDULE.launchDate = ORIGINAL_LAUNCH;
});

const mountApp = async () => {
  mount(App, { target: document.getElementById("root")! });
  flushSync();
  await openArchive();
};

describe("Archive, week by week", () => {
  it("shows each week with how many of its lessons are done", async () => {
    store.completeLesson(1, "r", []);
    store.completeLesson(2, "r", []);
    store.completeLesson(3, "r", []);
    store.completeLesson(8, "r", []);
    await mountApp();
    const overview = document.querySelector("section[aria-labelledby='overview-h']")!.textContent!.replace(/\s+/g, " ");
    expect(overview).toContain("Your progress, week by week");
    expect(overview).toContain("Week 1");
    expect(overview).toContain("3 of 7 lessons done");
    expect(overview).toContain("Week 2");
    expect(overview).toContain("1 of 2 lessons done");
    const bars = [...document.querySelectorAll<HTMLElement>("section[aria-labelledby='overview-h'] [role=progressbar]")];
    expect(bars.map((b) => b.getAttribute("aria-valuenow"))).toEqual(["1", "3"]); // newest week first
  });

  it("lists newest week first, expands only the current week, and keeps older weeks one tap away", async () => {
    await mountApp();
    const weeks = [...document.querySelectorAll<HTMLDetailsElement>("details.wk")];
    expect(weeks).toHaveLength(2);
    expect(weeks[0].querySelector(".wk-name")?.textContent).toBe("Week 2");
    expect(weeks[0].open).toBe(true);
    expect(weeks[1].open).toBe(false);
    expect(weeks[1].querySelectorAll("a[href^='#/day/']")).toHaveLength(7);
    expect(weeks[0].querySelectorAll("a[href^='#/day/']")).toHaveLength(2);
  });

  it("offers a finished week's check, and marks it done afterwards", async () => {
    await mountApp();
    expect(page()).toContain("Take the check");
    store.completeWeek(1);
    document.body.innerHTML = '<div id="root"></div>';
    await mountApp();
    expect(page()).toContain("Check done ✓");
  });

  it("is also drawn in Kannada, with no English left in the overview", async () => {
    store.setLanguage("kn");
    await mountApp();
    const overview = document.querySelector("section[aria-labelledby='overview-h']")!.textContent!;
    expect(overview).toMatch(/[ಀ-೿]/);
    expect(overview).not.toContain("Week");
  });
});
