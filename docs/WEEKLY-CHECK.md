# Weekly check and badge

At the end of each week (seven lessons) a learner can take a short check on the week and collect a small thank-you badge. Week 1 exists; the machinery is built to be reused for every later week.

## Principles

- **An appreciation, not a credential.** This site does not certify anything. The badge says only "Week N complete" and "Well done!". It never names a level, a score, a grade, a qualification or the learner. A test fails if the badge text ever gains such wording.
- **No pass mark, no timer, unlimited retakes.** Finishing earns the badge; scoring does not. Every question must end with the right answer, with an explanation after each, as in lessons.
- **Private.** Nothing is sent anywhere. The only thing stored is the date the check was first finished (`weeks` in the progress file, see DATA-AND-PRIVACY.md).
- **Only what was taught.** A test checks that every Devanagari word in a check appears in that week's lessons.

## What the learner sees

1. After the last lesson of a week, the finish screen offers "Take the Week N check". It is also listed in the Archive once that lesson is open.
2. The check opens only when every lesson of the week is finished; otherwise it lists the lessons still to do.
3. About ten questions (recall, building a sentence, spot-the-mistake, odd-one-out, matching, and a two-sentence build).
4. A result page: "N of M right on the first try" (shown on screen only, never on the badge), the badge, buttons to download the picture, copy a short message or share, and one line about next week.

## The badge

`src/lib/badge.ts` draws a plain square SVG (the frozen logo, "Week N complete", "Well done!", the brand and tagline, the site address) and converts it to a PNG in the browser for download or sharing. It contains nothing about the person, so every learner gets the same image. The badge text is English only for now, because the Kannada interface is still a draft and the picture is meant to be posted publicly.

## Adding a week

1. Write `src/weeks/week-02.ts` exporting `week: Week` (same shape as week-01: title, `reviewed`, credits, `questions`, one-line `next` teaser). Questions use the lesson exercise shapes (choice, tiles, match).
2. A week is seven lessons: Week N = lessons 7(N-1)+1 to 7N (`src/lib/schedule.ts`).
3. Run `npm test`. The tests validate the schema, that each question has a single buildable right answer, that the types are mixed, and that only taught vocabulary is used.
4. Have it reviewed, then set `reviewed: true` (until then the page shows the "not yet reviewed" chip).

## Release safety

A week is replaced by an empty stub in production builds until its last lesson is published (see `holdBackUnreleasedLessons` in `vite.config.ts`), so its questions cannot reveal lessons still to come. Checked by building with different launch dates.

## Limitations

- The check is self-marked in the browser. Nobody can verify a badge, which is exactly why it makes no claims.
- Week 1 questions and the Week 2 teaser are drafts awaiting review.
