# Design Principles

These rules decide arguments. If a feature breaks one of them, the feature loses.

## Product principles

1. **Learning outcomes over engagement.** We measure whether people understood and remembered —
   never time-on-app, streak length or daily-active-user counts. (The only measurement is an anonymous page-view counter;
   anything more must follow the boundary in DATA-AND-PRIVACY.md.)
2. **A lesson ends.** Every lesson has a clear finish screen. No "one more round", no endless modes.
3. **No guilt.** Missing a day costs nothing. We show "days practised" (a total that only grows),
   never a streak that resets.
4. **No pressure mechanics.** No timers on answers, no leaderboards, no hearts/lives, no loss
   framing, no push notifications.
5. **Language tool first.** Culture and literature appear as optional threads (Saturdays), not as
   a religious frame. Content is chosen for linguistic value.
6. **Respect the learner's device and data.** Small, fast, offline, no account, no tracking.

## Pedagogy principles

1. **Why before what.** Every rule is introduced with the problem it solves
   (e.g. *tat + ca* → *tac ca* because the mouth finds it easier to move once).
2. **One idea per lesson.** If a lesson needs two "aha"s, it is two lessons.
3. **Manipulate, don't just read.** Each lesson has at least one demo the learner can poke
   before being tested.
4. **Scaffold, then remove the scaffold.** The guided try has hints; "prove it" has none.
5. **Explain mistakes.** Every wrong option carries an explanation of the *misconception*
   it represents, not a generic "try again".
6. **Retrieve later.** The recap rule returns via spaced review (1, 2, 4, 8, 16 days), capped at
   3 items per session.
7. **Honest scope.** When a rule has exceptions or the real grammar is more complex, say so
   in a callout rather than over-simplifying silently. A simplification is allowed; a false
   statement is not.
8. **Both scripts, always available.** Devanagari and IAST are both shown by default so
   beginners are never blocked by the script and script learners are never denied it.

## Interface principles

- Mobile-first, one-handed, large tap targets (≥ 44 px).
- Respect `prefers-reduced-motion` — every animation must have a still equivalent.
- Colour is never the only signal (use icons/text for right/wrong).
- Keyboard-operable everything; visible focus; semantic HTML.
- Calm visual tone: warm paper background, generous spacing, no flashing, no confetti storms.
- Text is short. If a card needs scrolling, split it.

## What we will not build (without revisiting this document)

Streaks that reset · XP/levels · leaderboards · lives · countdown timers · push
notifications · "come back!" nudges · ads · selling data · loot boxes · social comparison.
