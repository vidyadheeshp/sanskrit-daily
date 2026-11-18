# Brand — FROZEN

**Frozen on 18 November 2026** (name changed the same day — see the change log below). These choices are final. Changing any of them needs an explicit, recorded
decision (edit this file *and* the tests in `src/brand.test.ts` in the same change). The tests fail if the name,
tagline, logo or icon set drift.

## Identity

| | |
|---|---|
| **Name** | **Dine Dine** — दिने दिने (*dine dine*) |
| **Meaning** | "day by day, every day" (*dina*, "day", in the locative, repeated) |
| **Descriptive subtitle** | **Sanskrit Daily** — says plainly what it is; used wherever someone may not know the name yet (headings, share messages, link previews, store listings) |
| **Tagline** | **प्रतिदिनं संस्कृतम्** (*pratidinaṃ saṃskṛtam*) — "Sanskrit, every day" |
| **Logo** | A staircase of three steps with a lamp flame above the top step: a lamp lit one step at a time |

> The Sanskrit above was chosen by the project owner and drafted by an AI assistant. It has **not been checked by a
> Sanskrit scholar** (see `docs/CONTENT-REVIEW.md`). If a reviewer proposes a correction, that is a deliberate brand
> change: record it here.

## The logo

- Master file: [`logo/dine-dine-logo.svg`](logo/dine-dine-logo.svg) (256×256, rounded square).
- Palette: burnt sienna `#8a3b12` (background), paper `#fbf6ec` (steps), lamp gold `#e8b04a`, flame highlight `#fff3d6`.
- The app draws the same mark as `src/components/Logo.svelte`; `public/favicon.svg` is a byte-identical copy of the master.
  A test enforces both.

**Do**
- Use the mark at 16 px and up. Give it clear space of at least a quarter of its width.
- Put it on light or dark backgrounds *as is* — the sienna square carries its own background.
- Set the name in Devanagari as **live text** (never as a pre-rendered image).

**Don't**
- Recolour, rotate, stretch, outline or add effects to the mark.
- Change the number of steps or the flame.
- Put Devanagari into a generated image (see below).

## Where it appears

| Where | Asset |
|---|---|
| Browser tab | `public/favicon.svg` |
| Header | `Logo.svelte` + the Devanagari name as live text, "Dine Dine · Sanskrit Daily" beneath |
| Installed app (Android/desktop) | `public/icon-192.png`, `icon-512.png`, and `icon-maskable-512.png` (full-bleed, inset mark for OS cropping) |
| iPhone home screen | `public/apple-touch-icon.png` (180×180, full-bleed) |
| Link previews (LinkedIn, WhatsApp, …) | `public/og-image.png` (1200×630) + per-lesson tags from `scripts/build-share-pages.ts` |
| Footer, Why and About pages | the tagline |

## Regenerating the PNG assets

`docs/brand/make-assets.mjs` redraws every PNG from the master SVG:

```bash
npm i --no-save @resvg/resvg-js     # not a project dependency; --no-save keeps package.json untouched
node docs/brand/make-assets.mjs
```

**Devanagari caveat:** simple image renderers (including this one) mis-place some vowel signs, such as ि, and may
mis-shape conjuncts. That is why the banner and icons contain **Latin text only**. The Devanagari name and tagline
are always live HTML text, which browsers shape correctly.

## Change log

| Date | Change | Why |
|---|---|---|
| 18 Nov 2026 | Name **Pratyaham (प्रत्यहम्) → Dine Dine (दिने दिने)**. Logo and tagline unchanged. | Decision by the project owner, before the public launch. |

**Note on the Latin spelling:** "Dine Dine" is also how an English reader would read two English words ("dine" = to eat).
That is why the descriptive subtitle **Sanskrit Daily** must always accompany the name wherever people might meet it
cold (link previews, share messages, store listings, posts).

## Naming history

How the name was chosen, and the alternatives considered, is in [`NAMING.md`](NAMING.md). Concept drawings that were
not chosen are archived in `concepts/`.
