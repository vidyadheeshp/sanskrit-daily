// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { flushSync, mount, tick, unmount } from "svelte";
import App from "./App.svelte";
import LessonPlayer from "./components/LessonPlayer.svelte";
import { drafts } from "./lessons/drafts";
import { lessons, lessonCount } from "./lessons";
import { STORAGE_KEY, SCHEDULE } from "./config";
import { addDays, formatISO } from "./lib/date";
import { toPlain } from "./lib/markup";
import type { Lesson } from "./lib/schema";
import { app as store } from "./lib/store.svelte";
import { PLACE_KEY, loadPlace, savePlace } from "./lib/place";
import { panchangFor } from "./lib/panchang/panchang";

/** End-to-end smoke tests: play lessons through the real UI in jsdom. */

const q = (sel: string) => document.querySelector(sel);
const buttons = () => Array.from(document.querySelectorAll<HTMLButtonElement>("button, a.btn"));
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function btn(text: string, opts: { exact?: boolean } = {}): HTMLButtonElement {
  const found = buttons().find((b) => {
    const t = norm(b.textContent ?? "");
    return opts.exact ? t === text : t.includes(text);
  });
  if (!found) {
    throw new Error(`No button "${text}". Buttons: ${buttons().map((b) => norm(b.textContent ?? "")).join(" | ")}`);
  }
  return found as HTMLButtonElement;
}

async function click(text: string, opts: { exact?: boolean } = {}) {
  btn(text, opts).click();
  flushSync();
  await tick();
}

async function clickEl(el: HTMLElement) {
  el.click();
  flushSync();
  await tick();
}

const cont = () => btn("Continue") as HTMLButtonElement;
const page = () => document.body.textContent ?? "";

/** Navigate like a real user: change the hash and let the router react. */
async function goto(hash: string) {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  flushSync();
  await tick();
}

const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

/** Pin the clock to an exact instant. Only Date is faked. */
function setInstant(iso: string) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(iso));
}

/** Pin "today" to noon IST on that IST date. The release schedule runs on IST, so this gives the same result on any machine. */
function setToday(iso: string) {
  setInstant(`${iso}T12:00:00+05:30`);
}

const LAUNCH = "2026-12-01";
const ORIGINAL_LAUNCH = SCHEDULE.launchDate;
const EVERYTHING_OPEN = "2020-01-01"; // launched long ago: every lesson is unlocked

afterEach(() => {
  vi.useRealTimers();
  SCHEDULE.launchDate = ORIGINAL_LAUNCH;
});

beforeEach(() => {
  window.scrollTo = () => {}; // jsdom does not implement scrolling
  localStorage.clear();
  store.reset(); // the store is a module singleton: wipe its in-memory state between tests
  store.markWelcomeSeen(); // most tests are about something other than the first-visit landing page
  document.body.innerHTML = '<div id="root"></div>';
});

function mountApp() {
  return mount(App, { target: document.getElementById("root")! });
}

/** Plays a lesson using the answers in its own data. Works for every widget except the two sandhi-only ones. */
async function autoplay(lesson: Lesson) {
  const plain = (t: string) => norm(toPlain(t, "both"));
  for (const step of lesson.steps) {
    if (step.kind === "explain") {
      await click("Continue");
    } else if (step.kind === "demo") {
      if (step.widget === "reveal-cards") {
        const cards = Array.from(document.querySelectorAll<HTMLButtonElement>(".place-btn"));
        for (const c of cards.slice(0, step.requiredInteractions)) await clickEl(c);
      } else if (step.widget === "word-by-word") {
        for (const t of Array.from(document.querySelectorAll<HTMLButtonElement>(".wbw-tile"))) await clickEl(t);
      } else {
        throw new Error(`autoplay doesn't know widget "${step.widget}"`);
      }
      expect(cont().disabled, `demo ${step.id} should unlock Continue`).toBe(false);
      await click("Continue");
    } else if (step.kind === "exercise") {
      if (step.type === "choice") {
        await click(plain(step.options.find((o) => o.correct)!.text), { exact: true });
      } else if (step.type === "tiles") {
        for (const t of step.answer) await click(plain(t), { exact: true });
        await click("Check");
      } else {
        for (const [l, r] of step.pairs) {
          await click(plain(l), { exact: true });
          await click(plain(r), { exact: true });
        }
      }
      expect(cont().disabled, `exercise ${step.id} should unlock Continue`).toBe(false);
      await click("Continue");
    } else {
      await click("Finish lesson");
    }
  }
  expect(q("h1")?.textContent).toContain("Done for today");
}

describe("every published lesson can be played from start to finish", () => {
  it.each(lessons.map((l) => [l.number, l.title, l] as const))("lesson %i: %s", async (_n, _t, lesson) => {
    SCHEDULE.launchDate = EVERYTHING_OPEN;
    const app = mountApp();
    await goto(`#/day/${lesson.number}`);
    expect(q("h1")?.textContent).toContain(lesson.title);

    await autoplay(lesson);

    const s = saved();
    expect(s.completed[String(lesson.number)]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(s.notes[String(lesson.number)]).toBeTruthy();
    const expectedReview = lesson.steps
      .filter((st) => st.kind === "exercise" && st.reviewItem)
      .map((st) => `${lesson.number}:${st.id}`)
      .sort();
    expect(Object.keys(s.review).sort()).toEqual(expectedReview);
    unmount(app);
  });
});

describe("share button", () => {
  it("copies a paste-ready message with the lesson's share-page link", async () => {
    SCHEDULE.launchDate = EVERYTHING_OPEN;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const app = mountApp();
    await goto("#/day/1");
    await autoplay(lessons[0]);

    await click("Copy share message");
    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0] as string;
    expect(text).toContain("Sanskrit Daily #1");
    expect(text).toContain(lessons[0].teaser);
    expect(text).toMatch(/\/d\/1\/$/);
    expect(page()).toContain("Copied");
    unmount(app);
  });

  it("shows the text to copy by hand when the clipboard is blocked", async () => {
    SCHEDULE.launchDate = EVERYTHING_OPEN;
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    const app = mountApp();
    await goto("#/day/1");
    await autoplay(lessons[0]);
    await click("Copy share message");
    expect(document.querySelector("textarea")?.value).toContain("Sanskrit Daily #1");
    unmount(app);
  });
});

describe("Lesson 1 details", () => {
  it("is open as a preview even before a launch date exists, and shows the not-reviewed badge", async () => {
    SCHEDULE.launchDate = null;
    const app = mountApp();
    await goto("#/day/1");
    expect(q("h1")?.textContent).toContain("Say hello");
    expect(page()).toContain("Not yet scholar-reviewed");

    await click("Continue"); // hook
    expect(cont().disabled).toBe(true); // reveal-cards demo is gated until all six words are opened
    await click("(namaste)");
    expect(page()).toContain("A bow to you");
    unmount(app);
  });

  it("explains a wrong answer and keeps the learner on the question", async () => {
    SCHEDULE.launchDate = null;
    const app = mountApp();
    await goto("#/day/1");
    await click("Continue");
    for (const c of Array.from(document.querySelectorAll<HTMLButtonElement>(".place-btn"))) await clickEl(c);
    await click("Continue");
    await click("Continue"); // pattern
    // tiles (guided): wrong first
    await click("सु (su)", { exact: true });
    await click("Check");
    expect(page()).toContain("Not quite");
    unmount(app);
  });
});

describe("Lesson 2: the 'no word for is' demo", () => {
  it("reveals the dashed 'is' tile only once a whole sentence is open", async () => {
    SCHEDULE.launchDate = EVERYTHING_OPEN;
    const app = mountApp();
    await goto("#/day/2");
    await click("Continue");

    expect(cont().disabled).toBe(true);
    expect(document.querySelectorAll(".wbw-gap")).toHaveLength(0);
    const tiles = Array.from(document.querySelectorAll<HTMLButtonElement>(".wbw-tile"));
    expect(tiles).toHaveLength(6);
    for (const [i, tile] of tiles.entries()) {
      await clickEl(tile);
      if (i === 1) expect(document.querySelectorAll(".wbw-gap")).toHaveLength(0); // sentence 1 not finished
      if (i === 2) expect(document.querySelectorAll(".wbw-gap")).toHaveLength(1);
    }
    expect(document.querySelectorAll(".wbw-gap")).toHaveLength(2);
    expect(page()).toContain("My name is Rāma.");
    expect(cont().disabled).toBe(false);
    unmount(app);
  });
});

describe("date gating", () => {
  it("locks everything but lesson 1 until a launch date is set — without revealing the content", async () => {
    SCHEDULE.launchDate = null;
    const app = mountApp();
    await goto("#/day/2");
    expect(page()).toContain("🔒 Lesson 2");
    expect(page()).toContain("Unlocks after launch");
    expect(page()).not.toContain("What is your name?");
    expect(document.querySelector(".progress")).toBeNull(); // no lesson player
    unmount(app);
  });

  it("unlocks at exactly 6:00 AM IST: locked one second before, open one second after", async () => {
    SCHEDULE.launchDate = LAUNCH; // 2026-12-01 (IST); lesson 2 unlocks 2026-12-02 06:00 IST = 2026-12-02 00:30 UTC

    setInstant("2026-12-02T06:00:00+05:30");
    document.body.innerHTML = '<div id="root"></div>';
    let app = mountApp();
    await goto("#/day/2");
    expect(q("h1")?.textContent).toContain("What is your name?");
    unmount(app);

    setInstant("2026-12-02T05:59:59+05:30");
    document.body.innerHTML = '<div id="root"></div>';
    app = mountApp();
    await goto("#/day/2");
    expect(page()).toContain("🔒 Lesson 2");
    expect(page()).toContain("6:00 AM IST");
    expect(page()).not.toContain("What is your name?");
    unmount(app);
  });

  it("gives a learner in another time zone the same unlock moment (UTC instants either side of 00:30)", async () => {
    SCHEDULE.launchDate = LAUNCH;
    setInstant("2026-12-02T00:29:59Z"); // 05:59:59 IST — already mid-morning in Australia and Japan, still the night before in the US
    let app = mountApp();
    await goto("#/day/2");
    expect(page()).toContain("🔒 Lesson 2");
    unmount(app);

    setInstant("2026-12-02T00:30:00Z"); // 06:00:00 IST
    document.body.innerHTML = '<div id="root"></div>';
    app = mountApp();
    await goto("#/day/2");
    expect(q("h1")?.textContent).toContain("What is your name?");
    unmount(app);
  });

  it("shows the unlock date for a locked lesson", async () => {
    SCHEDULE.launchDate = LAUNCH;
    setToday(LAUNCH);
    const app = mountApp();
    await goto("#/day/3");
    expect(page()).toContain("🔒 Lesson 3");
    expect(page()).toContain(`Unlocks on ${formatISO(addDays(LAUNCH, 2))}`);
    unmount(app);
  });

  it("unlocks a lesson on its day", async () => {
    SCHEDULE.launchDate = LAUNCH;
    setToday(addDays(LAUNCH, 1)); // day 2
    const app = mountApp();
    await goto("#/day/2");
    expect(q("h1")?.textContent).toContain("What is your name?");
    await goto("#/day/3");
    expect(page()).toContain("🔒 Lesson 3");
    unmount(app);
  });

  it("Today shows a free lesson-1 preview and the next locked lesson before launch", async () => {
    SCHEDULE.launchDate = null;
    const app = mountApp();
    await goto("#/");
    expect(q("h1")?.textContent).toBe("Today");
    expect(page()).toContain("Preview");
    expect(page()).toContain("Try lesson 1");
    expect(page()).toContain("🔒 Lesson 2");
    unmount(app);
  });

  it("Today shows lesson 1 on launch day and lesson 2 the next day", async () => {
    SCHEDULE.launchDate = LAUNCH;
    setToday(LAUNCH);
    let app = mountApp();
    await goto("#/");
    expect(page()).toContain("Say hello");
    expect(page()).toContain("Start today's lesson");
    unmount(app);

    document.body.innerHTML = '<div id="root"></div>';
    setToday(addDays(LAUNCH, 1));
    app = mountApp();
    await goto("#/");
    expect(page()).toContain("What is your name?");
    unmount(app);
  });

  it("Today says 'all caught up' once every written lesson has been reached", async () => {
    SCHEDULE.launchDate = LAUNCH;
    setToday(addDays(LAUNCH, lessonCount)); // one day past the last lesson
    const app = mountApp();
    await goto("#/");
    expect(page()).toContain("all caught up");
    unmount(app);
  });

  it("the archive lists unlocked lessons and shows locked ones by number only", async () => {
    SCHEDULE.launchDate = LAUNCH;
    setToday(addDays(LAUNCH, 1)); // day 2: lessons 1–2 open
    const app = mountApp();
    await goto("#/archive");
    expect(page()).toContain("Say hello");
    expect(page()).toContain("What is your name?");
    expect(page()).toContain("Coming up");
    expect(page()).toContain("Lesson 3");
    expect(page()).toContain("Lesson 7");
    // Locked lessons' titles must not leak.
    expect(page()).not.toContain(lessons[2].title);
    unmount(app);
  });

  it("still says 'not written yet' for a lesson that doesn't exist", async () => {
    SCHEDULE.launchDate = EVERYTHING_OPEN;
    const app = mountApp();
    await goto("#/day/999");
    expect(page()).toContain("isn't written yet");
    unmount(app);
  });
});

describe("brand", () => {
  it("shows the logo, the Devanagari name and the English subtitle in the header, and the tagline in the footer", async () => {
    const app = mountApp();
    await goto("#/");
    const brand = document.querySelector(".brand")!;
    expect(brand.querySelector(".brand-name")?.textContent).toBe("दिने दिने");
    expect(brand.querySelector(".brand-sub")?.textContent).toContain("Dine Dine · Sanskrit Daily");
    expect(brand.getAttribute("aria-label")).toContain("Sanskrit Daily");
    const logo = brand.querySelector("svg.logo");
    expect(logo).not.toBeNull();
    expect(logo?.getAttribute("aria-hidden")).toBe("true"); // decorative: the text beside it names the site
    expect(document.querySelector("footer")?.textContent).toContain("प्रतिदिनं संस्कृतम्");
    unmount(app);
  });
});

describe("landing page (first visit only)", () => {
  /** A brand-new visitor: has not seen the landing page and has no progress. */
  function newVisitor() {
    store.reset();
  }

  it("shows the landing page to a new visitor, with the main call to action", async () => {
    newVisitor();
    const app = mountApp();
    await goto("#/");
    expect(q("h1")?.textContent).toContain("Learn Sanskrit, one small step a day.");
    expect(page()).toContain("दिने दिने");
    expect(page()).toContain("Dine Dine · Sanskrit Daily");
    const ctas = Array.from(document.querySelectorAll('a[href="#/day/1"]'));
    expect(ctas.length).toBeGreaterThanOrEqual(2); // top and bottom of the page
    unmount(app);
  });

  it("shows it only once: the next visit to the home page goes straight to Today", async () => {
    newVisitor();
    let app = mountApp();
    await goto("#/");
    expect(q("h1")?.textContent).toContain("Learn Sanskrit");
    expect(store.state.settings.welcomeSeen).toBe(true);
    expect(saved().settings.welcomeSeen).toBe(true); // remembered in storage, not just in memory
    unmount(app);

    document.body.innerHTML = '<div id="root"></div>';
    app = mountApp();
    await goto("#/");
    expect(q("h1")?.textContent).toBe("Today");
    unmount(app);
  });

  it("does not flip to Today while the new visitor is still reading it", async () => {
    newVisitor();
    const app = mountApp();
    await goto("#/");
    await goto("#/"); // a repeated navigation to the same page, e.g. clicking the logo
    expect(q("h1")?.textContent).toContain("Learn Sanskrit");
    unmount(app);
  });

  it("skips it for anyone who already has progress, even if they never saw it", async () => {
    newVisitor();
    store.completeLesson(1, "a rule", []);
    const app = mountApp();
    await goto("#/");
    expect(q("h1")?.textContent).toBe("Today");
    unmount(app);
  });

  it("stays reachable from the 'What is this?' link, even after it has been seen", async () => {
    const app = mountApp(); // beforeEach already marked it as seen
    await goto("#/");
    expect(q("h1")?.textContent).toBe("Today");
    const link = document.querySelector<HTMLAnchorElement>('nav a[href="#/welcome"]');
    expect(link?.textContent).toContain("What is this?");
    await goto("#/welcome");
    expect(q("h1")?.textContent).toContain("Learn Sanskrit");
    expect(document.querySelector('nav a[href="#/welcome"]')?.getAttribute("aria-current")).toBe("page");
    unmount(app);
  });

  it("lets a visitor try a real lesson 1 word right on the page", async () => {
    newVisitor();
    const app = mountApp();
    await goto("#/welcome");
    expect(page()).toContain("Try it");
    await click("(namaste)");
    expect(page()).toContain("A bow to you");
    unmount(app);
  });

  it("explains how it works, the promises, an honesty note and an FAQ", async () => {
    newVisitor();
    const app = mountApp();
    await goto("#/welcome");
    for (const t of ["Learn the why", "Play with it", "Check it stuck", "No accounts or logins", "No streaks", "not yet been reviewed by a Sanskrit scholar"]) {
      expect(page(), t).toContain(t);
    }
    expect(document.querySelectorAll(".faq details").length).toBeGreaterThanOrEqual(4);
    const external = Array.from(document.querySelectorAll<HTMLAnchorElement>('main a[target="_blank"]'));
    expect(external.length).toBeGreaterThanOrEqual(2);
    for (const a of external) expect(a.rel, a.href).toContain("noopener");
    unmount(app);
  });

  it("shows the launch status before a launch date exists", async () => {
    newVisitor();
    SCHEDULE.launchDate = null;
    const app = mountApp();
    await goto("#/welcome");
    expect(page()).toContain("start soon");
    expect(page()).toContain("after launch");
    unmount(app);
  });

  it("shows the launch date before launch, and the week strip locked by date", async () => {
    newVisitor();
    SCHEDULE.launchDate = LAUNCH;
    setToday(addDays(LAUNCH, -3));
    const app = mountApp();
    await goto("#/welcome");
    expect(page()).toContain(`Daily lessons start ${formatISO(LAUNCH)} at 6:00 AM IST`);
    const days = Array.from(document.querySelectorAll(".week li"));
    expect(days).toHaveLength(7);
    expect(days[0].classList.contains("open")).toBe(true); // lesson 1 is the free preview
    expect(days[1].textContent).toContain("🔒");
    unmount(app);
  });

  it("opens days as they unlock and never reveals a locked lesson's title", async () => {
    newVisitor();
    SCHEDULE.launchDate = LAUNCH;
    setToday(addDays(LAUNCH, 2)); // day 3
    const app = mountApp();
    await goto("#/welcome");
    expect(page()).toContain("Lesson 3 is open today");
    const open = document.querySelectorAll(".week li.open");
    expect(open).toHaveLength(3);
    for (const l of lessons.slice(3)) expect(page(), l.title).not.toContain(l.title);
    unmount(app);
  });
});

describe("panchang card (language-first)", () => {
  const NOW = "2026-11-19T12:00:00+05:30";

  const setGeolocation = (impl: unknown) =>
    Object.defineProperty(navigator, "geolocation", { value: impl, configurable: true });
  afterEach(() => setGeolocation(undefined));

  const card = () => document.querySelector(".panchang")!;
  const cardText = () => (card().textContent ?? "").replace(/\s+/g, " ");

  it("shows the five limbs for New Delhi by default, in Sanskrit, with the brief note", async () => {
    setInstant(NOW);
    const app = mountApp();
    await goto("#/");
    expect(cardText()).toContain("Today in the Sanskrit calendar");
    for (const label of ["Vāra", "Tithi", "Nakṣatra", "Yoga", "Karaṇa"]) expect(cardText(), label).toContain(label);
    // Thursday 19 Nov 2026: Śukla navamī, pūrva bhādrapadā, vyāghāta, kaulava (cross-checked against a published almanac)
    for (const name of ["गुरुवासरः", "नवमी", "पूर्व भाद्रपदा", "व्याघात", "कौलव"]) expect(cardText(), name).toContain(name);
    expect(cardText()).toContain("New Delhi");
    expect(cardText()).toMatch(/sunrise 6:4\d am/);
    expect(cardText()).toMatch(/sunset 5:2\d pm/);
    expect(cardText()).toContain("until"); // each limb says when it ends
    // the brief note: what it is, significance, relevance, usage
    for (const part of ["About these terms", "Pañcāṅga", "Significance.", "Relevance.", "Usage here.", "not yet been reviewed by a Sanskrit scholar"]) {
      expect(cardText(), part).toContain(part);
    }
    unmount(app);
  });

  it("is compact: one row per term with a short hint, and the definitions folded away", async () => {
    setInstant(NOW);
    const app = mountApp();
    await goto("#/");
    const about = card().querySelector<HTMLDetailsElement>("details.about")!;
    expect(about).not.toBeNull();
    expect(about.open).toBe(false); // definitions and the note are one tap away, not in the way

    // what is visible by default: everything except the folded-away part and the city dropdown's options
    const clone = card().cloneNode(true) as HTMLElement;
    clone.querySelectorAll("details.about, option").forEach((e) => e.remove());
    const visible = (clone.textContent ?? "").replace(/\s+/g, " ").trim();
    expect(visible.length).toBeLessThan(500); // it was ~975 before the compact redesign

    const list = Array.from(card().children).find((c) => c.tagName === "DL")!;
    expect(list.querySelectorAll(":scope > .limb")).toHaveLength(5); // one row per term

    // short but descriptive: the hints that teach something, and when each one ends
    expect(visible).toContain("Jupiter's day");
    expect(visible).toContain("ninth · bright fortnight");
    expect(visible).toContain("until 7:06 am");
    // the definitions are in the folded part only
    expect(about.textContent).toContain("the lunar day");
    expect(visible).not.toContain("the lunar day");
    unmount(app);
  });

  it("puts a space before the bracket after the place name", async () => {
    setInstant(NOW);
    const app = mountApp();
    await goto("#/");
    expect(cardText()).toContain("New Delhi (default)");
    unmount(app);
  });

  it("describes full moon, new moon and the dark fortnight in the tithi hint", async () => {
    for (const [at, expected] of [
      ["2026-11-24T12:00:00+05:30", "full moon"],
      ["2026-12-08T12:00:00+05:30", "new moon"], // amāvāsyā at sunrise on 8 Dec; 9 and 10 Dec are both pratipadā
      ["2026-12-02T12:00:00+05:30", "dark fortnight"],
    ] as const) {
      document.body.innerHTML = '<div id="root"></div>';
      setInstant(at);
      const app = mountApp();
      await goto("#/");
      const clone = card().cloneNode(true) as HTMLElement;
      clone.querySelectorAll("details.about, option").forEach((e) => e.remove());
      expect(clone.textContent ?? "", at).toContain(expected);
      unmount(app);
    }
  });

  it("stays language-first: no auspicious timings, astrology or predictions", async () => {
    setInstant(NOW);
    const app = mountApp();
    await goto("#/");
    expect(cardText()).not.toMatch(/rahu|muhurt|muhūrt|abhijit|auspicious|inauspicious|horoscope|astrolog|kundali|lucky|zodiac sign/i);
    expect(cardText()).toContain("not for predictions");
    unmount(app);
  });

  it("explains each term in plain English", async () => {
    setInstant(NOW);
    const app = mountApp();
    await goto("#/");
    expect(cardText()).toContain("the day of the week");
    expect(cardText()).toContain("the lunar day");
    expect(cardText()).toContain("one of 27");
    expect(cardText()).toContain("half a tithi");
    expect(cardText()).toContain("day of Jupiter, the teacher (guru)");
    expect(cardText()).toContain("ninth"); // tithis are ordinal numbers: vocabulary
    unmount(app);
  });

  it("is still yesterday's panchang before sunrise, and says so", async () => {
    setInstant("2026-11-19T04:30:00+05:30");
    const app = mountApp();
    await goto("#/");
    expect(cardText()).toContain("still yesterday's panchang");
    expect(cardText()).toContain("बुधवासरः"); // Wednesday
    unmount(app);
  });

  it("flags a change that falls within minutes of sunrise", async () => {
    setInstant("2027-08-05T12:00:00+05:30");
    savePlace({ mode: "city", lat: 22.5726, lon: 88.3639, label: "Kolkata" });
    const app = mountApp();
    await goto("#/");
    expect(cardText()).toContain("within minutes of sunrise");
    unmount(app);
  });

  it("uses the device's location when the learner shares it, rounded, and remembers it separately", async () => {
    setInstant(NOW);
    setGeolocation({
      getCurrentPosition: (ok: (p: unknown) => void) => ok({ coords: { latitude: 12.971599, longitude: 77.594566 } }),
    });
    const app = mountApp();
    await goto("#/");
    expect(cardText()).toContain("Showing New Delhi");
    await click("Use my location");
    expect(cardText()).toContain("Your location");
    expect(cardText()).toContain("12.97°N 77.59°E"); // ~1 km precision, never the exact point
    expect(cardText()).toContain("Your location (12.97°N"); // with a space before the bracket
    // Bengaluru's sunrise (not Delhi's), shown in the DEVICE's time zone, whatever that is: a shared location has no
    // fixed zone of its own. The expected text is built the same way the card builds it.
    const bengaluru = panchangFor(new Date(NOW), { lat: 12.97, lon: 77.59, label: "Your location" });
    const sunriseHere = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
      .format(bengaluru.sunrise!)
      .replace(/\s+/g, " ");
    expect(cardText()).toContain(`sunrise ${sunriseHere}`);
    expect(loadPlace()).toEqual({ mode: "device", lat: 12.97, lon: 77.59, label: "Your location" });
    expect(localStorage.getItem(PLACE_KEY)).not.toBeNull();
    expect(JSON.stringify(saved())).not.toContain("12.97"); // not in the progress data that can be exported
    unmount(app);
  });

  it("can forget the location again, going back to the default city", async () => {
    setInstant(NOW);
    savePlace({ mode: "device", lat: 12.97, lon: 77.59, label: "Your location" });
    const app = mountApp();
    await goto("#/");
    expect(cardText()).toContain("Your location");
    await click("Forget my location");
    expect(cardText()).toContain("New Delhi");
    expect(loadPlace()).toBeNull();
    unmount(app);
  });

  it("explains kindly when the location is refused, and keeps showing a city", async () => {
    setInstant(NOW);
    setGeolocation({ getCurrentPosition: (_ok: unknown, fail: (e: unknown) => void) => fail({ code: 1 }) });
    const app = mountApp();
    await goto("#/");
    await click("Use my location");
    expect(cardText()).toContain("Couldn't get your location");
    expect(cardText()).toContain("New Delhi");
    expect(loadPlace()).toBeNull(); // nothing is stored when it is refused
    unmount(app);
  });

  it("says so when the browser cannot share a location", async () => {
    setInstant(NOW);
    setGeolocation(undefined);
    const app = mountApp();
    await goto("#/");
    await click("Use my location");
    expect(cardText()).toContain("can't share a location");
    unmount(app);
  });

  it("lets the learner pick a city instead", async () => {
    setInstant(NOW);
    const app = mountApp();
    await goto("#/");
    const select = document.querySelector<HTMLSelectElement>("#pc-city")!;
    select.value = "Bengaluru";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    await tick();
    expect(cardText()).toContain("Bengaluru");
    expect(cardText()).toMatch(/sunrise 6:(19|2\d) am/);
    expect(loadPlace()).toMatchObject({ mode: "city", label: "Bengaluru" });
    unmount(app);
  });

  it("can be switched off in Settings, and back on", async () => {
    setInstant(NOW);
    const app = mountApp();
    await goto("#/settings");
    const box = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).find((b) =>
      (b.closest("label")?.textContent ?? "").includes("panchang"),
    )!;
    expect(box.checked).toBe(true);
    box.click();
    flushSync();
    await tick();
    expect(saved().settings.showPanchang).toBe(false);
    await goto("#/");
    expect(document.querySelector(".panchang")).toBeNull();
    await goto("#/settings");
    Array.from(document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).find((b) =>
      (b.closest("label")?.textContent ?? "").includes("panchang"),
    )!.click();
    flushSync();
    await tick();
    await goto("#/");
    expect(document.querySelector(".panchang")).not.toBeNull();
    unmount(app);
  });

  it("deletes the saved location when everything is deleted", async () => {
    savePlace({ mode: "device", lat: 12.97, lon: 77.59, label: "Your location" });
    expect(loadPlace()).not.toBeNull();
    store.reset();
    expect(loadPlace()).toBeNull();
  });

  it("does not appear on the lesson pages or the landing page", async () => {
    SCHEDULE.launchDate = EVERYTHING_OPEN;
    const app = mountApp();
    await goto("#/day/1");
    expect(document.querySelector(".panchang")).toBeNull();
    await goto("#/welcome");
    expect(document.querySelector(".panchang")).toBeNull();
    unmount(app);
  });
});

describe("Why page", () => {
  it("explains the initiative, links to lesson 1 and to the issue tracker, and is in the navigation", async () => {
    const app = mountApp();
    await goto("#/why");
    expect(q("h1")?.textContent).toContain("Why Dine Dine?");
    expect(page()).toContain("दिने दिने");
    expect(page()).toContain("means “day by day”");
    expect(page()).toContain("A slow, steady way to learn");
    expect(page()).toContain("not yet been reviewed by a Sanskrit scholar");

    expect(document.querySelector('nav a[href="#/welcome"]')).not.toBeNull(); // "What is this?" is in the nav

    expect(document.querySelector('a[href="#/day/1"]')).not.toBeNull();
    const issues = document.querySelector<HTMLAnchorElement>('a[href$="/issues"]');
    expect(issues?.href).toMatch(/^https:\/\/github\.com\/.+\/issues$/);
    expect(issues?.rel).toContain("noopener"); // external link must not get access to this window
    unmount(app);
  });

  it("is reachable from the About page", async () => {
    const app = mountApp();
    await goto("#/about");
    expect(document.querySelector('main a[href="#/why"]')).not.toBeNull();
    unmount(app);
  });
});

describe("visit counter setting", () => {
  it("says so when this copy of the site has no counter", async () => {
    const app = mountApp();
    await goto("#/settings");
    expect(page()).toContain("has no visit counter");
    unmount(app);
  });
});

describe("Draft sandhi lesson (exercises the place-chart and sandhi widgets)", () => {
  it("plays through the real lesson player", async () => {
    const lesson = drafts.find((d) => d.concept === "consonant-sandhi")!;
    const app = mount(LessonPlayer, { target: document.getElementById("root")!, props: { lesson } });
    await tick();

    // hook, places
    await click("Continue");
    await click("Continue");

    // place chart: gated until 3 places
    expect(cont().disabled).toBe(true);
    await click("Lips");
    await click("Teeth");
    expect(cont().disabled).toBe(true);
    await click("Palate");
    expect(cont().disabled).toBe(false);
    await click("Continue");

    // idea, sandhi demo
    await click("Continue");
    expect(cont().disabled).toBe(true);
    for (const w of ["च ca", "जयति jayati", "टीका ṭīkā", "करोति karoti"]) await click(w, { exact: true });
    expect(page()).toContain("The t stayed");
    await click("Continue");

    // pattern
    await click("Continue");

    // guided choice
    await click("tad ca");
    expect(cont().disabled).toBe(true);
    await click("tac ca");
    await click("Continue");

    // tiles
    await click("तट् (taṭ)");
    await click("Check");
    expect(page()).toContain("Not quite");
    await click("Clear");
    await click("तच् (tac)");
    await click("च (ca)", { exact: true });
    await click("Check");
    await click("Continue");

    // jayati
    await click("taj jayati");
    await click("Continue");

    // match
    for (const [l, r] of [
      ["च (ca)", "च् (c)"],
      ["ट (ṭa)", "ट् (ṭ)"],
      ["ल (la)", "ल् (l)"],
      ["क (ka)", "stays त् (t)"],
    ]) {
      await click(l, { exact: true });
      await click(r, { exact: true });
    }
    await click("Continue");

    // why, karoti
    await click("once, instead of twice");
    await click("Continue");
    await click("tat karoti");
    await click("Continue");

    await click("Finish lesson");
    expect(q("h1")?.textContent).toContain("Done for today");
    expect(saved().notes[String(lesson.number)]).toContain("tat + ca = tac ca");

    unmount(app);
  });
});
