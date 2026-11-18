# Lesson Authoring Guide

How to write a new daily lesson. You do not need to know Svelte — a lesson is a data file.

## 1. Before you write

Answer these in one sentence each. If you cannot, the lesson is not ready.

1. **The one idea:** what will the learner understand at the end?
2. **The "why":** what puzzle or problem does the idea solve?
3. **The misconceptions:** what will learners wrongly guess? (These become wrong options.)
4. **Prerequisites:** which earlier lessons does it rely on? Say so in `prerequisites`.
5. **The honest caveat:** what simplification are you making, and is it flagged?

## 2. Create the file

1. Copy `src/lessons/day-001.ts` to `src/lessons/day-NNN.ts` (three digits).
2. Change `number`, `title`, `concept`, and the steps.
3. That's it — lessons are discovered automatically from the file name (`day-NNN.ts`, and `number`
   must match). Not ready to publish at all? Put it in `src/lessons/drafts/` and list it in
   `drafts/index.ts`: drafts are tested but never served. Published lessons are numbered 1, 2, 3 … with
   no gaps, and each unlocks on its day — see [RELEASING.md](RELEASING.md).
4. Run `npm test` — it validates your lesson against the schema.
5. Preview at `http://localhost:5173/#/day/NNN`.

## 3. Lesson shape

```ts
export const lesson: Lesson = {
  number: 1,
  title: "Why does tat + ca become tac ca?",
  concept: "consonant-sandhi",          // tag used for grouping
  teaser: "Why does तत् + च become तच्च? Can you spot the shortcut?",  // 1-line hook for posts & link previews
  rhythm: "new",                         // new | recognize | build | review | culture | challenge
  minutes: 5,
  prerequisites: [],
  credits: ["Written by …"],            // contributor recognition
  reviewed: false,                       // set true only after scholar sign-off
  steps: [ /* see below */ ],
};
```

Steps run in order. The **last step must be `recap`**.

## 4. Step kinds

### `explain`
```ts
{ kind: "explain", id: "hook", title: "A puzzle",
  body: "Say **tat ca** quickly. Notice what your tongue does.",
  callout: { tone: "note", text: "…" } }       // optional; tone: note | caution
```

### `demo`
```ts
{ kind: "demo", id: "try-sandhi", title: "Try it", widget: "sandhi-demo",
  prompt: "Pick a following letter and watch the final t.", requiredInteractions: 3 }
```
`widget` must be a registered widget: `reveal-cards`, `word-by-word`, `place-chart` or `sandhi-demo`. New widgets
are code changes — open an issue first, and prefer reusable data-driven ones.

**`reveal-cards`** is the one to reach for first for vocabulary: each tap opens a word into its
pieces, meaning and when to use it. All its data lives in your lesson file:
```ts
{ kind: "demo", id: "meet", widget: "reveal-cards", requiredInteractions: 6,
  prompt: "Tap each word to see the pieces it is made from.",
  cards: [
    { word: "{नमस्ते|namaste}",
      parts: [ { text: "{नमः|namaḥ}", meaning: "a bow" }, { text: "{ते|te}", meaning: "to you" } ],
      meaning: "“A bow to you” — hello.",
      use: "To greet someone, or to say goodbye." },
  ] }
```
`cards` must contain at least `requiredInteractions` cards.

**`word-by-word`** is for sentences. Each word is tapped open to show its gloss; once a sentence is
fully open, an optional `gap` reveals a word English needs but Sanskrit leaves out (e.g. "is"):
```ts
{ kind: "demo", id: "sentences", widget: "word-by-word", requiredInteractions: 6,
  prompt: "Tap each word to see what it means.",
  sentences: [
    { words: [ { text: "{मम|mama}", gloss: "my" }, { text: "{नाम|nāma}", gloss: "name" },
               { text: "{रामः|rāmaḥ}", gloss: "Rāma" } ],
      english: "My name is Rāma.",
      gap: { after: 1, label: "is", note: "Again, no “is”: “my name — Rāma.”" } },
  ] }
```
`requiredInteractions` counts words across all sentences and cannot exceed the total; `gap.after` is
the index of the word the missing English word would follow (it must not be the last word).

### `exercise` — three types

**choice** (multiple choice with explained mistakes)
```ts
{ kind: "exercise", id: "q1", type: "choice", guided: true,
  prompt: "tat + ca →",
  hint: "Which place in the mouth does ca use?",
  options: [
    { text: "tat ca",  correct: false, why: "Nothing changed — but ca pulls the t to the palate." },
    { text: "tac ca",  correct: true,  why: "Yes: t moves to the palate to match ca." },
  ],
  reviewItem: true }                          // true = schedule for spaced review
```
Exactly one option must be `correct`. **Every wrong option needs a `why`.**

**tiles** (build the answer from pieces)
```ts
{ kind: "exercise", id: "q2", type: "tiles", prompt: "Build the joined form",
  tiles: ["ta", "c", "ca", "t"], answer: ["ta", "c", "ca"],
  why: "…" }
```
Distractor tiles are the ones not in `answer`.

**match** (pair left items with right items)
```ts
{ kind: "exercise", id: "q3", type: "match", prompt: "Match each letter to its place",
  pairs: [["ca", "palate"], ["ta", "teeth"]] }
```

Set `guided: true` for scaffolded questions (hints shown). Questions without `guided`
are the "prove it" stage and show no hint.

### `recap`
```ts
{ kind: "recap", id: "recap", rule: "A final dental t becomes c before c, j.",
  example: { dev: "तत् + च = तच्च", iast: "tat + ca = tac ca" } }
```
`rule` is saved verbatim into the learner's notes — keep it to one memorable sentence. For a
vocabulary lesson a compact word list (`word meaning · word meaning · …`) is fine.

## 5. Inline markup (in any text field)

| Write | Result |
|---|---|
| `**word**` | bold |
| `*word*` | italic |
| `{तत्\|tat}` | Devanagari **and** IAST, shown according to the learner's script setting |

No HTML. Newlines become paragraph breaks.

## 6. Writing style

- **Short.** A card is ≤ 60 words. Split, don't scroll.
- **Concrete before abstract.** Show *tat ca* → *tac ca* first; name the rule second.
- **Name the learner's feeling.** "This looks random — it isn't."
- **Plain English, defined terms.** The first time you use a technical term
  (*sandhi*, *dantya*), define it in the same sentence.
- **Never state something false to make it simple.** Use a `caution` callout for
  "real grammar has more cases; here we only look at …".
- **Wrong-answer explanations address the misconception**, in a kind tone. Never "Wrong!".
- Always supply **both** Devanagari and IAST for Sanskrit forms.

## 7. Checklist before opening a pull request

- [ ] One idea only
- [ ] Hook states a puzzle or reason
- [ ] At least one interactive demo
- [ ] At least 1 guided and 3 unguided ("prove it") exercises
- [ ] Every wrong option has a `why`
- [ ] Devanagari and IAST both correct and consistent
- [ ] Simplifications flagged with a caution callout
- [ ] Recap rule fits in one sentence
- [ ] `npm test` passes
- [ ] Played through on a phone-width window
- [ ] `credits` filled in; `reviewed: false` (reviewers flip it later)
