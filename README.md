# Dine Dine (दिने दिने) — Sanskrit Daily

*प्रतिदिनं संस्कृतम्* — Sanskrit, every day. One small lesson, every day.

<img src="docs/brand/logo/dine-dine-logo.svg" alt="Dine Dine logo: a staircase with a lamp flame above the top step" width="96" />

A free, open-source, **frontend-only** game that teaches Sanskrit one concept at a time.
Every day there is a new lesson. You open it and play. There is no login, no account, no
backend and no tracking of what you do (just an optional, anonymous visit counter).

> **Status:** early prototype. Seven lessons are written (a week of everyday conversation). Daily lessons start on
> **19 November 2026** (`schedule.json`); until then only lesson 1 is open, then one new lesson unlocks each day. A sandhi lesson is waiting in `src/lessons/drafts/`.
> Content has **not yet been reviewed by a Sanskrit scholar** — see
> [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md) before treating anything here as authoritative.

---

## What makes it different

- **Concept first.** Each lesson explains *why*, lets you poke at the idea, and only then
  tests you. You cannot skip ahead without understanding the step you are on.
- **A new lesson every day**, chosen purely from the calendar date — everyone sees the same
  lesson on the same day, so people can talk about it. Missed a day? The archive is always open.
- **Non-addictive by design.** Lessons take 3–6 minutes and end with a clear "done for today".
  No streak guilt, no notifications, no infinite play. See [docs/DESIGN-PRINCIPLES.md](docs/DESIGN-PRINCIPLES.md).
- **A little Sanskrit calendar.** The Today page has an optional card of today's panchang (weekday, tithi, nakṣatra, yoga, karaṇa) in Sanskrit, calculated in your browser. It is for vocabulary, not predictions.
- **No server.** Progress is stored in your own browser. Each lesson unlocks at 6:00 AM IST on its day, for everyone; locked lessons aren't even in the site's code. You can export it to a file and move it
  to another device.
- **Works offline** once installed as a PWA.

## How a lesson works

```
Hook → Explain → Interactive demo → Guided try → Prove it → Recap
```

Each step has to be completed before the next one opens. Wrong answers get a targeted
explanation of *why*, not just "incorrect". The recap becomes a one-line rule saved in
**My Notes** and is scheduled for later review.

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit tests, lesson validation, and full UI play-throughs of Lessons 1, 2 and the draft lesson
npm run check        # type-check (svelte-check)
npm run test:tz      # run every test as if the device were in six different time zones
npm run dev:unlock   # preview every lesson, including locked ones
npm run post -- 3    # ready-to-paste LinkedIn + WhatsApp text for lesson 3
npm run build        # static site in dist/ (+ per-lesson share pages)
npm run preview      # serve the production build locally
```

Preview any day without waiting for the calendar: `http://localhost:5173/#/day/1`.

## Tech stack

| Concern | Choice |
|---|---|
| UI | Svelte 5 + TypeScript |
| Build | Vite |
| Offline / install | vite-plugin-pwa (Workbox) |
| Lesson validation | Zod (build/test time only — not shipped to users) |
| Tests | Vitest |
| Hosting | GitHub Pages via GitHub Actions |
| State | `localStorage` only |

Full reasoning: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Documentation map

| Document | Read it if you want to… |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | understand how the app is put together |
| [docs/DESIGN-PRINCIPLES.md](docs/DESIGN-PRINCIPLES.md) | understand the pedagogy and the non-addictive rules |
| [docs/LESSON-AUTHORING-GUIDE.md](docs/LESSON-AUTHORING-GUIDE.md) | write a new lesson |
| [docs/CURRICULUM.md](docs/CURRICULUM.md) | see the weekly rhythm and the first 28 days |
| [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md) | know how lessons are checked for correctness |
| [docs/PANCHANG.md](docs/PANCHANG.md) | see how the panchang card is calculated and validated |
| [docs/RELEASING.md](docs/RELEASING.md) | schedule lessons and run the daily release |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | set up GitHub Pages, the counter and link previews |
| [docs/LAUNCH-POSTS.md](docs/LAUNCH-POSTS.md) | copy the LinkedIn / WhatsApp launch posts |
| [docs/DATA-AND-PRIVACY.md](docs/DATA-AND-PRIVACY.md) | see exactly what is stored and why |
| [CONTRIBUTING.md](CONTRIBUTING.md) | contribute code or lessons |

## Project layout

```
src/
  components/      reusable game widgets (exercises, demos, lesson player)
  lessons/         one file per day: day-001.ts, day-002.ts, …
  lib/             date logic, storage, spaced repetition, routing, schema
  routes/          Today, Archive, Notes, Settings, About pages
docs/              all project documentation
```

## License

- **Code:** [AGPL-3.0](LICENSE).
- **Lesson content** (the text in `src/lessons/`): a licence has not been chosen yet, so all rights are
  reserved for now. Please ask before reusing lesson text. See [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md).
