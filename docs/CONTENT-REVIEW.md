# Content Review & Correctness

Sanskrit is a living scholarly tradition with real authorities. A learning tool that teaches
something wrong does harm. This document sets out how lessons are checked.

## Status of current content

**Nothing in this repository has yet been reviewed by a Sanskrit scholar.** Lessons carry
`reviewed: false` and the app shows a small "Not yet scholar-reviewed" badge on them. The
badge is removed only when a named reviewer signs off.

## Review levels

| Level | Who | What they check |
|---|---|---|
| 1. Author self-check | Lesson author | Checklist in the Authoring Guide |
| 2. Peer review | Another contributor | Pedagogy, clarity, typos, schema, mobile play-through |
| 3. Scholar review | Someone with formal Sanskrit training | Grammar claims, examples, Devanagari/IAST correctness, honest scope of simplifications |

A lesson may be published at level 1–2 **with the badge**. Level 3 sign-off flips
`reviewed: true` and adds the reviewer's name to `credits`.

## What reviewers should check

- Every example form is attested/correct (and the Devanagari matches the IAST).
- Rules are attributed correctly if named (e.g. Pāṇinian sūtra names are optional; if used, verify them).
- Simplifications are flagged, not silently false.
- No claim about history, religion or origin is made without a source.
- Wrong-answer explanations don't teach a new error.

## Source policy

Prefer, in order: classical grammars and standard commentaries; a recognised modern
reference grammar (e.g. Whitney, Macdonell, Kale, Coulson); an institutional course.
List sources in the lesson's `sources` field when used.

## Open questions

- **Licence for lesson text** — code is AGPL-3.0; a content licence (e.g. CC BY-SA 4.0) needs a deliberate decision.
- **Who is the first scholar reviewer?** Educator partnerships (see Future-Enhancements.md) are the
  likely route.
- **Reporting errors:** a "Report a mistake" link per lesson that opens a pre-filled GitHub issue
  (no data leaves the device unless the learner chooses to open the link).
