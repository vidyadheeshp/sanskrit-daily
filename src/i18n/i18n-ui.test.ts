// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { flushSync, mount, tick } from "svelte";
import App from "../App.svelte";
import { STORAGE_KEY, SCHEDULE } from "../config";
import { app as store } from "../lib/store.svelte";
import { defaultState, parseState } from "../lib/storage";
import { en, type Key } from "./en";
import { kn } from "./kn";

/** The language switch, through the real UI. */

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const page = () => document.body.textContent ?? "";
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

async function goto(hash: string) {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  flushSync();
  await tick();
}
async function click(el: Element | null | undefined) {
  if (!el) throw new Error("element not found");
  (el as HTMLElement).click();
  flushSync();
  await tick();
}
const langButton = (code: string) => document.querySelector<HTMLButtonElement>(`.lang-switch button[lang="${code}"]`);

const ORIGINAL_LAUNCH = SCHEDULE.launchDate;

beforeEach(() => {
  window.scrollTo = () => {};
  localStorage.clear();
  store.reset();
  store.markWelcomeSeen();
  document.body.innerHTML = '<div id="root"></div>';
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-12-03T12:00:00+05:30"));
  SCHEDULE.launchDate = "2026-12-01"; // lessons 1-3 open
  location.hash = "#/";
  mount(App, { target: document.getElementById("root")! });
  flushSync();
});
afterEach(() => {
  vi.useRealTimers();
  SCHEDULE.launchDate = ORIGINAL_LAUNCH;
});

/** English UI strings of a decent length must not show up while reading Kannada. */
function leakedEnglish(keysToCheck: Key[]) {
  return keysToCheck.filter((k) => {
    const plain = en[k].replace(/\{\w+\}|\*\*|\^\^|\[[^\]]*\]\([^)]*\)/g, "").trim();
    return plain.length >= 12 && kn[k] !== en[k] && page().includes(norm(plain));
  });
}

describe("language switch", () => {
  it("is English by default, and says so on <html>", () => {
    expect(store.language).toBe("en");
    expect(document.documentElement.lang).toBe("en");
    expect(page()).toContain("Today");
    expect(langButton("en")?.getAttribute("aria-pressed")).toBe("true");
    expect(langButton("kn")?.getAttribute("aria-pressed")).toBe("false");
  });

  it("switches to Kannada from the header, remembers it, and switches back", async () => {
    await click(langButton("kn"));
    expect(document.documentElement.lang).toBe("kn");
    expect(page()).toContain(kn["nav.today"]);
    expect(saved().settings.language).toBe("kn");
    expect(langButton("kn")?.getAttribute("aria-pressed")).toBe("true");

    await click(langButton("en"));
    expect(document.documentElement.lang).toBe("en");
    expect(page()).toContain(en["nav.today"]);
    expect(saved().settings.language).toBe("en");
  });

  it("can be chosen in Settings too", async () => {
    await goto("#/settings");
    const radio = document.querySelector<HTMLInputElement>('input[name="language"][value="kn"]')!;
    await click(radio);
    expect(store.language).toBe("kn");
    expect(page()).toContain(kn["settings.title"]);
    expect(document.querySelector<HTMLInputElement>('input[name="language"][value="kn"]')!.checked).toBe(true);
  });

  it("translates the main pages without leaking English interface text", async () => {
    await click(langButton("kn"));
    const checks: Array<[string, Key[]]> = [
      ["#/", ["today.title" as Key].filter((k) => k in en)],
      ["#/archive", ["archive.title", "archive.lede"]],
      ["#/settings", ["settings.title", "settings.cal.note", "settings.progress.body"]],
      ["#/why", ["why.gap.title", "why.diff.title", "why.early.title"]],
      ["#/about", ["about.title" as Key].filter((k) => k in en)],
      ["#/notes", ["notes.title", "notes.lede"]],
    ];
    for (const [hash, ks] of checks) {
      await goto(hash);
      expect(page(), hash).toMatch(/[ಀ-೿]/);
      expect(leakedEnglish(ks), hash).toEqual([]);
      for (const k of ks) expect(page(), `${hash} ${k}`).toContain(norm(kn[k].replace(/\{\w+\}|\*\*|\^\^/g, "").slice(0, 8)));
    }
  });

  it("shows the draft notice only in Kannada", async () => {
    expect(page()).not.toContain(en["lang.draft"].replace(/\*\*|\{\w+\}/g, "").slice(0, 20));
    await click(langButton("kn"));
    expect(document.querySelector(".draft-notice")).not.toBeNull();
    await click(langButton("en"));
    expect(document.querySelector(".draft-notice")).toBeNull();
  });

  it("keeps lessons in English, tags them lang=en, and says so", async () => {
    await click(langButton("kn"));
    await goto("#/day/1");
    expect(document.querySelector('[lang="en"]')).not.toBeNull();
    expect(page()).toContain(norm(kn["lang.lessonsEnglish"].replace(/\*\*|\{\w+\}/g, "").slice(0, 10)));
  });

  it("renders the panchang card in Kannada (default city, no location prompt)", async () => {
    await click(langButton("kn"));
    await goto("#/");
    const card = document.querySelector(".panchang");
    expect(card).not.toBeNull();
    expect(card!.textContent).toContain(kn["panchang.title"]);
    expect(card!.textContent).toContain(kn["city.new_delhi" as Key]);
    expect(card!.textContent).not.toContain("New Delhi");
  });
});

describe("storage", () => {
  it("defaults to English and rejects an unknown language", () => {
    expect(defaultState().settings.language).toBe("en");
    const bad = { ...defaultState(), settings: { ...defaultState().settings, language: "xx" } };
    expect(parseState(bad)?.settings.language).toBe("en");
  });

  it("keeps a valid language, and a file saved before languages existed loads as English", () => {
    const kan = { ...defaultState(), settings: { ...defaultState().settings, language: "kn" } };
    expect(parseState(kan)?.settings.language).toBe("kn");
    const old = defaultState() as any;
    delete old.settings.language;
    expect(parseState(old)?.settings.language).toBe("en");
  });
});

describe("daily reminder", () => {
  it("Settings offers the calendar file and the Google link, in both languages", async () => {
    await goto("#/settings");
    const ics = document.querySelector<HTMLAnchorElement>('a[href$="dine-dine-daily.ics"]');
    expect(ics?.hasAttribute("download")).toBe(true);
    const g = document.querySelector<HTMLAnchorElement>('a[href^="https://calendar.google.com/"]');
    expect(g?.getAttribute("rel")).toContain("noopener");
    expect(new URL(g!.href).searchParams.get("recur")).toBe("RRULE:FREQ=DAILY");
    expect(page()).toContain(en["reminder.ics"]);
    await click(langButton("kn"));
    expect(page()).toContain(kn["reminder.ics"]);
  });
});
