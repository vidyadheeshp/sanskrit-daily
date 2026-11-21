import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 14,
  title: "Two weeks in: a mixed review",
  concept: "review-weeks-1-2",
  teaser:
    "Fourteen days in. Sentences, sounds and sandhi: how much do you remember?",
  rhythm: "review",
  minutes: 6,
  prerequisites: [7, 13],
  credits: ["Draft written with Claude; awaiting review"],
  reviewed: false,
  sources: ["Only material from lessons 1 to 13"],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "Look how far you have come",
      body: [
        "In the first week you learned to say hello, ask a name, and say what you do. This week you learned where Sanskrit sounds live and why words change shape when they meet.",
        "Today is a relaxed mix of both. Nothing is new, and a wrong answer simply shows you what to look at again.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "warmup",
      title: "Warm up",
      widget: "word-by-word",
      prompt: "Tap at least four words and say each sentence aloud.",
      requiredInteractions: 4,
      sentences: [
        {
          words: [
            { text: "{अहं|ahaṃ}", gloss: "I" },
            { text: "{पुस्तकं|pustakaṃ}", gloss: "a book" },
            { text: "{पठामि|paṭhāmi}", gloss: "I read" },
          ],
          english: "I read a book.",
        },
        {
          words: [
            { text: "{भवान्|bhavān}", gloss: "you" },
            { text: "{किं|kiṃ}", gloss: "what" },
            { text: "{करोति|karoti}", gloss: "do / does" },
          ],
          english: "What are you doing?",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-ending",
      type: "choice",
      guided: true,
      prompt: "Which verb ending goes with {अहं|ahaṃ} (“I”)?",
      hint: "Think of {पठामि|paṭhāmi} and {गच्छामि|gacchāmi}.",
      options: [
        { text: "-ति", correct: false, why: "-ति is for “you / he / she”, as in {करोति|karoti}." },
        { text: "-मि", correct: true, why: "Yes. -मि is the “I” ending: {पठामि|paṭhāmi}, {पिबामि|pibāmi}." },
        { text: "-ṃ", correct: false, why: "-ṃ marks the thing the action lands on, such as {जलं|jalaṃ}. It is not a verb ending." },
      ],
    },
    {
      kind: "exercise",
      id: "q-water",
      type: "choice",
      reviewItem: true,
      prompt: "Which one says “I drink water”?",
      options: [
        { text: "{अहं जलं पिबति|ahaṃ jalaṃ pibati}", correct: false, why: "With {अहं|ahaṃ} the verb must end in -मि." },
        { text: "{अहं जलं पिबामि|ahaṃ jalaṃ pibāmi}", correct: true, why: "Yes: “I” + water (with -ṃ) + “I drink”." },
        { text: "{अहं जल पिबामि|ahaṃ jala pibāmi}", correct: false, why: "The thing being drunk needs its -ṃ: {जलं|jalaṃ}." },
      ],
    },
    {
      kind: "exercise",
      id: "q-build",
      type: "tiles",
      reviewItem: true,
      prompt: "Say “I go to the temple.” Tap the pieces in order.",
      tiles: ["{अहं|ahaṃ}", "{देवालयं|devālayaṃ}", "{गच्छामि|gacchāmi}", "{गच्छति|gacchati}", "{देवालय|devālaya}"],
      answer: ["{अहं|ahaṃ}", "{देवालयं|devālayaṃ}", "{गच्छामि|gacchāmi}"],
      why: "{अहं|ahaṃ} (I) + {देवालयं|devālayaṃ} (the temple, with -ṃ) + {गच्छामि|gacchāmi} (I go).",
    },
    {
      kind: "exercise",
      id: "q-places",
      type: "match",
      reviewItem: true,
      prompt: "Match each letter with the place where it is made.",
      pairs: [
        ["{घ|gha}", "back of the mouth"],
        ["{झ|jha}", "palate"],
        ["{ढ|ḍha}", "roof of the mouth"],
        ["{थ|tha}", "teeth"],
        ["{फ|pha}", "lips"],
      ],
      why: "Find each letter's row first: {क|ka}, {च|ca}, {ट|ṭa}, {त|ta}, {प|pa}.",
    },
    {
      kind: "exercise",
      id: "q-nasal",
      type: "choice",
      prompt: "Which letter is the nasal at the end of the {प|pa} row (the lips)?",
      options: [
        { text: "{ब|ba}", correct: false, why: "{ब|ba} is the third letter: the buzzing one." },
        { text: "{म|ma}", correct: true, why: "Yes. Every row ends with a nasal, and for the lips it is {म|ma}." },
        { text: "{न|na}", correct: false, why: "{न|na} is the nasal of the teeth row." },
      ],
    },
    {
      kind: "exercise",
      id: "q-sandhi",
      type: "choice",
      reviewItem: true,
      prompt: "{तत्|tat} + {जयति|jayati} → ?",
      options: [
        { text: "tat jayati", correct: false, why: "j is a palate sound, so it pulls the t toward the palate." },
        { text: "taj jayati", correct: true, why: "Yes. The final t copies the j." },
        { text: "tak jayati", correct: false, why: "k is made at the back of the mouth. The t copies the j, which is at the palate." },
      ],
    },
    {
      kind: "exercise",
      id: "q-stays",
      type: "choice",
      prompt: "In which of these does the final t of {तत्|tat} stay as it is?",
      options: [
        { text: "{तत् + च|tat + ca}", correct: false, why: "c pulls the t, giving {तच्च|tac ca}." },
        { text: "{तत् + करोति|tat + karoti}", correct: true, why: "Yes. k is not one of c, j, ṭ, l, so the t stays." },
        { text: "{तत् + लभते|tat + labhate}", correct: false, why: "l pulls the t, giving {तल्लभते|tal labhate}." },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "Two weeks in one line: say a simple sentence ({अहं|ahaṃ} with -मि, -ṃ on what you act on), place each consonant by its row, and join {तत्|tat} to the next word by looking at its first sound.",
      example: { dev: "अहं पुस्तकं पठामि।", iast: "ahaṃ pustakaṃ paṭhāmi." },
    },
  ],
};
