# Curriculum & Roadmap

## Weekly rhythm

A fixed rhythm gives variety without randomness and makes each lesson's *type* predictable.

| Day | Rhythm tag | What the learner does |
|---|---|---|
| Mon | `new` | Meets one new idea (explain + demo) |
| Tue | `recognize` | Spots the idea in examples (match / choice) |
| Wed | `build` | Constructs forms from parts (tiles) |
| Thu | `new` | Second new idea, usually building on Monday |
| Fri | `review` | Mixed recall from the past two weeks |
| Sat | `culture` | A verse, a numeral system, a word-origin story |
| Sun | `challenge` | A light puzzle (e.g. a prahelika) — optional |

Because lessons are numbered from launch day, not from Monday, the rhythm is a *content
design guide*, not enforced in code. (`rhythm` is metadata used for the Archive filter.)

## Learning arc

Two tracks run side by side so beginners get something usable on day 1 *and* a foundation:

- **Conversation track** — everyday phrases, taught as tiny sentences whose pieces you can see
  (greetings, "What is your name?", "What are you doing?"). Inspired by the Samskrita Bharati
  "simple Sanskrit sentences" leaflet; see [CONTENT-REVIEW.md](CONTENT-REVIEW.md) on permission.
- **Foundations track** — sounds and letters, then sandhi, then words, sentences and verse.

Days 1–7 are all conversation; after that the two tracks alternate.

## First 28 days (draft — subject to scholar review)

| # | Rhythm | Lesson idea | Status |
|---|---|---|---|
| 1 | new | **Say hello** — namaste, svāgatam, dhanyavādāḥ, kṛpayā, kṣamyatām, punaḥ milāmaḥ | built |
| 2 | new | **"What is your name?"** — *bhavataḥ nāma kim?* / *mama nāma …* (no word for "is") | built |
| 3 | new | **"What are you doing?"** — *ahaṃ* / *bhavān* and the **-ti → -mi** switch | built |
| 4 | new | **Read, drink, go** — *paṭhāmi, pibāmi, gacchāmi* and the hidden "stretch" pattern | built |
| 5 | build | **Answer by tweaking the question** — *bhavān kiṃ pibati? → ahaṃ jalaṃ pibāmi* | built |
| 6 | new | **The little dot** — the -ṃ ending: the thing the action lands on (*jalaṃ, pustakaṃ, devālayaṃ*) | built |
| 7 | review | **Week 1** — a whole conversation, hello to "what are you reading?" | built |
| 8 | new | The five places in the mouth | draft written |
| 9 | recognize | Sort letters by place | draft written |
| 10 | build | Build the varga chart: 5 groups × 5 letters | draft written |
| 11 | new | **Why *tat + ca* → *tac ca*?** — final dental meets a palatal | draft written (was the unpublished sandhi draft) |
| 12 | recognize | Predict the joined form | draft written |
| 13 | build | Build the joined form | draft written |
| 14 | review | Fortnight review (weeks 1 and 2 mixed) | draft written |
| 15 | new | **"Where?"** — *kutra*, *ahaṃ devālayaṃ gacchāmi* | |
| 16 | recognize | Which question word? (*kim / kutra / kaḥ*) | |
| 17 | build | Build a question and its answer | |
| 18 | new | Voiced vs unvoiced — the "buzz" test | |
| 19 | review | Places + voicing | |
| 20 | culture | Why the alphabet is ordered the way it is | |
| 21 | challenge | Sort-the-letters puzzle | |
| 22 | new | Consonant sandhi II: *tat + jayati → taj jayati* | |
| 23 | recognize | Predict the joined form | |
| 24 | build | Build the joined form | |
| 25 | new | Consonant sandhi III: *bhagavat + gītā → bhagavadgītā*, *tad bhavati* | |
| 26 | new | Vowel sandhi: *mā + astu → māstu*, *deva + ālaya → devālaya* | |
| 27 | culture | A subhāṣita that shows sandhi | |
| 28 | challenge | Un-join the sandhi (viccheda) | |

> Week 2 (lessons 8–14) is written as drafts (`reviewed: false`), to be reviewed one by one before each opens. The old sandhi draft is now lesson 11; `src/lessons/drafts/` is empty. The Week 2 weekly check (`src/weeks/week-02.ts`) is written as a draft too.

## Roadmap

**Now (prototype)**
- [x] Architecture & docs
- [x] Lesson player with explain / demo / exercise / recap steps
- [x] Lesson 1 (greetings) end to end
- [x] Sandhi lesson written as a draft (`src/lessons/drafts/`)
- [x] Lesson 2: "What is your name?" (introduces the reusable `word-by-word` widget)
- [x] Lessons 3–7: the rest of week 1 (conversation track)
- [x] Release schedule, date gating, scheduled deploy, share pages, visit counter
- [x] Local progress, notes, spaced review, export/import
- [ ] Scholar review of Lesson 1

**Next**
- [ ] Lessons 2–14 authored (conversation track first)
- [ ] Self-hosted, subsetted Noto Sans Devanagari
- [x] jsdom smoke test that plays Lesson 1 end to end
- [ ] Playwright test in a real browser at phone width
- [ ] Archive filter by rhythm / concept
- [ ] Printable "my notes" page

**Later** (from Future-Enhancements.md)
- [ ] Automatic transliteration + regional scripts (Telugu, Kannada, Grantha…)
- [ ] Culture threads (raga names, Aryabhata, Ayurveda terms)
- [ ] Bhagavad Gita and other literature threads (as one thread among several)
- [ ] Contributor recognition page generated from lesson `credits`
- [ ] Native wrapper (Capacitor) once the web app is stable
- [ ] Audio — deliberately deferred; only revisit with a reviewed source of pronunciation

> At the end of every seven lessons there is a weekly check with a thank-you badge. See [WEEKLY-CHECK.md](WEEKLY-CHECK.md).
