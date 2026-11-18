# Name and logo — shortlist

Status: **DECIDED — see [BRAND.md](BRAND.md).** Chosen: the name **Pratyaham (प्रत्यहम्)**, the staircase-and-lamp logo, tagline *प्रतिदिनं संस्कृतम्*. The rest of this page is the record of how it was chosen. The Sanskrit below was written by an AI
assistant and has **not been checked by a Sanskrit scholar** — verify before adopting (see docs/CONTENT-REVIEW.md).

## What the name should say

One small lesson a day · slow and steady · learning the *why* · calm, not addictive.

## Name shortlist

| | Name | Meaning | Why it fits | Watch out for |
|---|---|---|---|---|
| ★ | **पदे पदे** — *pade pade* | "at every step" (*pada* means both **step** and **word**) | A language learned **step by step and word by word**: one small step a day. The double meaning is exactly right for a language course. Rhythmic and easy to say. | Check for existing products with this name. |
| | **बिन्दुः** — *bindu* | a **drop**; also the **dot** (the same dot lesson 6 teaches) | "A drop a day." Echoes the well-known verse *jala-bindu-nipātena kramaśaḥ pūryate ghaṭaḥ* — "drop by drop the pot is filled". | A very common name; verify the verse's exact wording. |
| | **प्रत्यहम्** — *pratyaham* | "daily, every day" | The most literal match for "Daily". | Harder for beginners to read and pronounce. |

Also considered: **शनैः शनैः** *(śanaiḥ śanaiḥ, "slowly, slowly" — from the saying that knowledge comes slowly)* and
**दीपिका** *(dīpikā, "a little lamp")*.

**Suggested tagline:** *प्रतिदिनं संस्कृतम्* (*pratidinaṃ saṃskṛtam* — "Sanskrit, every day"). The English name
"Sanskrit Daily" can stay as the descriptive subtitle.

## Logo concepts

Files in `docs/brand/concepts/` (SVG, 256×256, colours from the app's palette: `#8a3b12`, `#fbf6ec`, `#e8b04a`).
`preview.png` shows both at full size and at 64/40/28/16 px on light and dark backgrounds.

| File | Pairs with | Idea |
|---|---|---|
| `pade-pade-steps-and-lamp.svg` ★ | पदे पदे | A staircase of three steps with a lamp flame above the top one: lit one step at a time. Stays legible at 16 px. |
| `bindu-drop-and-dot.svg` | बिन्दुः | A water drop with a dot at its heart, above ripples. The simplest and cleanest at small sizes. |

A third concept (a sun over the Devanagari headline bar) was drawn and **dropped**: it was muddy when small, and a
hand-drawn letter *pa* read as a cup.

## If you adopt one

- Replace `public/favicon.svg`, add the mark and the Devanagari wordmark to the header (as live text, so browsers shape it correctly).
- Add PNG app icons (192 and 512 px) so the app installs with a proper icon on Android.
- Redraw the 1200×630 link-preview banner (`public/og-image.png`).
- Update the README title and the Why/About pages.
- Note for any pre-rendered image: simple image tools mis-place Devanagari vowel signs such as ि, so keep Devanagari
  out of generated images, or render those images in a real browser.
