# System Architecture

## 1. Goals and constraints

| Goal | Consequence |
|---|---|
| A new lesson every day, no login | Lesson is a pure function of the calendar date |
| No backend, no database | All content ships as static files; all state lives in the browser |
| Free hosting | Output must be plain static files (GitHub Pages) |
| Works on cheap phones and offline | Small bundle, service worker pre-cache |
| Contributors who are not programmers | Lessons are data files, validated automatically |
| Non-addictive | No server-side engagement loop is even possible; the app has no notifications |

## 2. High-level view

```
                    ┌────────────────────────────┐
                    │   GitHub Pages (static)    │
                    │  index.html · JS · CSS     │
                    │  service worker · manifest │
                    └─────────────┬──────────────┘
                                  │ HTTPS, once (then cached)
                                  ▼
┌────────────────────────────── Browser ───────────────────────────────┐
│                                                                      │
│  Hash router ──► Route (Today / Archive / Notes / Settings / About)  │
│                        │                                             │
│        date.ts ────────┤ "which day is it?"                          │
│                        ▼                                             │
│                 Lesson registry ──► LessonPlayer                     │
│                                       │ steps                        │
│                       ┌───────────────┼────────────────┐             │
│                       ▼               ▼                ▼             │
│                  ExplainStep      DemoStep        ExerciseStep       │
│                  (text/cards)  (PlaceChart,     (Choice, Tiles,      │
│                                 SandhiDemo…)     Match)              │
│                                       │                              │
│                                       ▼                              │
│                  progress store ◄── completion / recap rule          │
│                       │                                              │
│                       ▼                                              │
│          localStorage  (progress, notes, review boxes, settings)     │
└──────────────────────────────────────────────────────────────────────┘
```

There is exactly one network interaction: downloading the static files. After the first
visit the service worker serves everything from cache.

## 3. Key decisions

### 3.1 The date selects the lesson — and gates it
`dayNumber = whole calendar days since the launch date, + 1`, computed on the **IST** calendar date
(India Standard Time, UTC+5:30, no daylight saving) so that a new lesson unlocks at **6:00 AM IST for every
learner at the same instant**, wherever they are. `scheduleISO()` in `src/lib/date.ts` derives that date (the IST date, shifted so each day starts at `unlockHourIST`) from the
current instant, so it does not depend on the device's time-zone setting. Date arithmetic goes through
`Date.UTC`, never timestamp differences, so daylight saving elsewhere cannot shift the day by one.
Personal data (days practised, review due dates) still uses the learner's own local date.

The release schedule lives in one file, `schedule.json` (`launchDate`, `previewLessons`,
`publishAheadDays`), and its rules are pure functions in `src/lib/schedule.ts`:

- **Client gate:** lesson N is open when `N <= max(previewLessons, dayNumber)`. A locked lesson shows
  only "Unlocks on <date>" — never its title or content. With no launch date, only the preview lesson is open.
- **Build gate:** a Vite plugin (`vite.config.ts`, production builds only) replaces every lesson beyond
  `dayNumber(today UTC) + publishAheadDays` with an empty stub, so unreleased lessons are *not shipped*.
  The build runs on the UTC date and IST is at most one day ahead of it, so the 2-day buffer keeps the build safely ahead and pre-caches tomorrow for offline use.
- A scheduled GitHub Action rebuilds daily, so the publish window advances without manual work
  (see [RELEASING.md](RELEASING.md)).
- If the user's clock is wrong they simply see a different lesson. Nothing breaks, nothing is lost.
- If the day number exceeds the number of written lessons, the app shows a calm
  "you're all caught up" screen and links to the archive. It never shows an error.
- `#/day/N` opens lesson N directly (if unlocked). This is the archive and the deep-link format in one.

**Registry:** `src/lessons/index.ts` discovers `day-NNN.ts` files with `import.meta.glob`; there is
no manual registration. It exports `allNumbers` (every lesson that exists, published or held back),
`lessons` (those present in this build) and `getLesson`.

**Sharing:** after the build, `scripts/build-share-pages.ts` writes `dist/d/<n>/index.html` for each
published lesson — a static page with Open Graph/Twitter tags (title, the lesson's `teaser`, a banner)
that redirects into the app. Link-preview crawlers don't run JavaScript, which is why this can't be done
with the hash route. The service worker is told not to answer `/d/N/` with the app shell.

### 3.2 Lessons are data, not code
A lesson is a TypeScript object (`src/lessons/day-NNN.ts`) conforming to the schema in
`src/lib/schema.ts`: a list of **steps**, each of a fixed `kind`. Components render steps;
authors never write UI code. This was chosen over Markdown-with-components (MDsveX) because:

1. a schema can be validated in CI — a malformed lesson fails the build rather than a learner;
2. fewer dependencies and no framework-version coupling;
3. exercises need structured answers anyway (correct option, accepted tile orders, explanations
   for each wrong answer), which is awkward to express in prose.

Rich text inside steps uses a tiny inline markup (`**bold**`, `*italic*`, `{dev|iast}` for
paired script text) rendered by `src/lib/markup.ts`. No HTML is ever injected from lesson
data, so a contributed lesson cannot execute script.

### 3.3 Step kinds

| Kind | Purpose | Completion rule |
|---|---|---|
| `explain` | A short card of text, optionally with a `callout` | "Got it" button |
| `demo` | An interactive widget showing the concept (`widget` names a registered component) | Widget reports `done` once the learner has tried the required interactions |
| `exercise` | One question: `choice`, `tiles` or `match` | Correct answer. Wrong answers show a per-option explanation |
| `recap` | The one-line rule + review items | Always last; writes the note and schedules review |

Demo widgets today: `place-chart`, `sandhi-demo` (specific to the sandhi lesson) and two reusable,
data-driven ones — `reveal-cards` (tap a word to see the pieces it is made from) and `word-by-word`
(a sentence laid out word by word, with a "gap" for a word English needs but Sanskrit omits). Their
data lives in the lesson file.
Prefer reusable, data-driven widgets like `reveal-cards`; lesson-specific widgets are a last resort.

**Drafts:** `src/lessons/drafts/` holds finished-but-unpublished lessons. They are validated by the
same tests, but are not in the registry, so the app never serves them.

Adding a new game type means: add a variant to the schema, add one component, register it
in `ExerciseStep.svelte`. Existing lessons are unaffected.

### 3.4 State: `localStorage` only
One versioned JSON blob under the key `sanskrit-daily:v1`:

```jsonc
{
  "version": 1,
  "completed": { "1": "2026-11-14" },          // lesson number → local date completed
  "notes":     { "1": "Dental stops …" },        // lesson number → recap rule
  "review":    { "1:q3": { "box": 2, "due": "2026-11-20" } },
  "settings":  { "script": "both" }              // dev | iast | both
}
```

- Every read and write is wrapped in try/catch. If storage is blocked (private mode, quota)
  the app keeps working in memory for the session and says so on the Settings page.
- Corrupt or unknown-version data is ignored (and left untouched), never crashes the app.
- **Export/Import** is a JSON file the learner saves themselves — the "account system".

### 3.5 Spaced repetition (`src/lib/srs.ts`)
A five-box Leitner scheduler: intervals 1, 2, 4, 8, 16 days. Correct → up a box;
wrong → back to box 1. Pure functions over dates, easy to unit test. Due items are shown
as an **optional** "Quick review" card on the Today page, capped at 3 items so it never
becomes a chore.

### 3.6 Routing
Hash routing (`#/`, `#/day/3`, `#/archive`, `#/notes`, `#/review`, `#/settings`, `#/why`, `#/welcome`, `#/about`).
GitHub Pages has no SPA fallback, so path-based routes would 404 on refresh. Hash routes
also keep working offline with no extra configuration.

**First-visit landing page.** `#/` renders `Home.svelte`, which shows `Landing.svelte` **once**, to a genuinely new
visitor — one who has not seen it (`settings.welcomeSeen`) and has no lesson progress. Everyone else gets Today.
The decision is made once, when `Home` opens (a plain `const`, not reactive), so marking the page as seen does not
flip it away while it is being read. `#/welcome` always shows the landing page and is linked from the navigation
("What is this?"). Deep links such as `#/day/3` or a lesson share page bypass it.

### 3.6b The panchang card
`PanchangCard.svelte` (Today page, switchable in Settings) shows the five limbs of the day, calculated in the browser
by `src/lib/panchang/` (pure functions, validated against independent data: see [PANCHANG.md](PANCHANG.md)). A learner's
location is optional, rounded, kept under its own storage key (not in the exportable progress), and never sent anywhere.
The card is language-first by rule: a test fails if auspicious-timing or astrology vocabulary appears on it.

### 3.7 Offline / PWA
`vite-plugin-pwa` generates a Workbox service worker that pre-caches the whole app shell and
all lessons (lessons are bundled into the JS, so there is nothing separate to fetch). The
manifest `start_url` and `scope` must equal the Vite `base` path — see DEPLOYMENT.md.
Update strategy: `autoUpdate` — a new deploy is picked up on the next visit.

### 3.8 Script handling
Every Sanskrit string is authored as a pair — Devanagari **and** IAST — because
automatic transliteration of joined sandhi forms (`तच्च` ↔ *tac ca*) is exactly the kind of
thing that goes subtly wrong. The Settings page lets the learner choose Devanagari,
IAST or both. Automatic transliteration (Sanscript) and regional scripts are deferred until
the content is large enough to justify checking the output.

Fonts: system fonts with a Devanagari-capable fallback stack for the MVP. Self-hosting a
subsetted Noto Sans Devanagari is a planned improvement (see ROADMAP in CURRICULUM.md).

## 4. Module map

| Path | Responsibility | Pure / testable? |
|---|---|---|
| `src/config.ts` | `LAUNCH_DATE`, storage key, site name | — |
| `src/lib/date.ts` | local-date maths, `dayNumber`, formatting | yes |
| `src/lib/schedule.ts` | release rules: what is unlocked / published | yes |
| `src/lib/access.ts` | app-side wrapper: `openThrough`, `unlockText` | — |
| `src/lib/share.ts` | share URL and message text | yes |
| `src/lib/counter.ts` | optional anonymous visit counter (GoatCounter) | mostly |
| `src/lib/panchang/` | astronomy, Sanskrit names and the five limbs for the Today card (see docs/PANCHANG.md) | yes |
| `src/lib/place.ts` | the optional saved location for the card (own storage key, never exported) | yes |
| `scripts/` | build-time: share pages, daily post text (run with tsx) | — |
| `src/lib/schema.ts` | Zod schema + inferred TS types for lessons | yes |
| `src/lib/markup.ts` | tiny inline markup → safe token array | yes |
| `src/lib/srs.ts` | Leitner scheduling | yes |
| `src/lib/storage.ts` | safe read/write, versioning, export/import | mostly |
| `src/lib/store.svelte.ts` | reactive app state on top of storage | — |
| `src/lib/router.svelte.ts` | hash router | — |
| `src/lessons/` | published lessons + registry (`drafts/` for unpublished) | validated by tests |
| `src/components/` | UI widgets | manual + e2e |
| `src/routes/` | page-level screens | manual + e2e |

## 5. Testing strategy

1. **Unit (Vitest):** date maths (DST, month ends, before launch), SRS transitions,
   markup parser, storage fallbacks.
2. **Content validation (Vitest):** every published lesson and every draft is parsed with the Zod
   schema; additional checks (unique ids, exactly one correct option, last step is `recap`,
   every wrong option has an explanation).
3. **UI smoke test (Vitest + jsdom, `src/smoke.test.ts`):** mounts the real app, navigates by
   hash and plays Lessons 1 and 2 (and the draft sandhi lesson, via the lesson player) from start to finish — checking step gating, wrong-answer
   explanations, tiles, matching, and that progress, notes and review items are saved. Tests that depend on
   the date pin the clock (only `Date` is faked) so they never break as real time passes.
   When you add a lesson, extend this test only if it introduces a new interaction.
4. **Time zones (`npm run test:tz`):** runs the whole suite as if the device were in Asia/Kolkata, UTC, Los Angeles,
   Kiritimati (UTC+14), Pago Pago (UTC-11) and Sydney. Each run first proves the zone was really applied
   (`src/timezone.test.ts`). Beware: on Windows, writing `TZ=America/Los_Angeles` before a command is silently ignored for
   IANA names, so a hand-made "zone matrix" can pass without changing anything; use this script. GitHub's build machine
   runs in UTC, so every deploy also exercises that zone.
5. **Build check:** `svelte-check` (types) and `vite build` in CI.
6. **Later:** a Playwright test in a real browser at phone width (jsdom cannot judge layout,
   touch behaviour or Devanagari font rendering — those still need a manual check).

## 6. Security and privacy

- No third-party fonts or ad scripts. The only third-party request is the *optional* GoatCounter visit counter
  (inactive unless configured, off when Do Not Track is on or the learner switches it off — see DATA-AND-PRIVACY.md).
- Lesson text is rendered through the markup parser into Svelte text nodes — never `{@html}`.
- Imported progress files are schema-checked before being applied.
- Details in [DATA-AND-PRIVACY.md](DATA-AND-PRIVACY.md).

## 7. Known limitations (accepted)

- **No cross-device sync** except manual export/import. Deliberate — it keeps the
  project serverless and accountless.
- **Clearing site data erases progress.** The Settings page nudges users to export.
- **Same lesson for everyone** is a product choice; per-user adaptive paths are out of scope.
- **Content is bundled**, so total lessons × size grows the JS bundle. At ~3 KB/lesson,
  365 lessons ≈ 1 MB uncompressed; if that becomes a problem, lessons can be switched to
  lazy `import()` chunks without changing the schema.
