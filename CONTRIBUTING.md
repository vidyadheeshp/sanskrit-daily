# Contributing

Thank you for helping. There are three easy ways in, from least to most technical.

## 1. Review or report (no code)
- Spotted a Sanskrit error, unclear explanation or typo? Open an issue with the lesson number
  and what you think is wrong. Scholar review is the most valuable contribution we can get —
  see [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md).

## 2. Write a lesson (light code)
- Read [docs/LESSON-AUTHORING-GUIDE.md](docs/LESSON-AUTHORING-GUIDE.md) and
  [docs/DESIGN-PRINCIPLES.md](docs/DESIGN-PRINCIPLES.md).
- A lesson is a data file; you do not need to know Svelte.
- You are credited in the lesson's `credits` field.

## 3. Improve the app (code)
```bash
npm install
npm run dev
npm test            # must pass
npm run check       # type-check
```
- Keep the bundle small; avoid new dependencies unless clearly worth it.
- Anything that adds tracking, streak mechanics, notifications or engagement loops will not be
  merged — see the "will not build" list in the design principles.

## Pull request checklist
- [ ] `npm test` and `npm run check` pass
- [ ] Lessons: authoring checklist completed
- [ ] UI changes: tried at phone width, keyboard-only, and with reduced motion on
- [ ] No new network requests at runtime

## Code of conduct
Be kind, assume good faith, and remember that many contributors are learners. Sanskrit
traditions are diverse — disagreements about content are resolved by sources, politely.
