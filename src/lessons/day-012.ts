import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 12,
  title: "Predict the joined word",
  concept: "consonant-sandhi",
  teaser:
    "तत् + लभते: does the final t change, and into what? Now you can predict it before you see it.",
  rhythm: "recognize",
  minutes: 5,
  prerequisites: [11],
  credits: ["Draft written with Claude; awaiting review"],
  reviewed: false,
  sources: [
    "Same rule as lesson 11 (the final t of {तत्|tat} before c, j, ṭ, l). Only these four triggers are covered, on purpose",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "From watching to predicting",
      body: [
        "Last time you saw that a final **t** becomes a copy of the next sound, but only when that sound is **c, j, ṭ or l**.",
        "Today you do it yourself. Look at the sound that comes next, and ask: *is it one of the four?*",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "sandhi-demo",
      title: "A few more",
      widget: "sandhi-demo",
      prompt: "Pick three different words to follow {तत्|tat} and watch what happens.",
      requiredInteractions: 3,
    },
    {
      kind: "exercise",
      id: "q-labhate",
      type: "choice",
      guided: true,
      prompt: "{तत्|tat} + {लभते|labhate} (“gets”) → ?",
      hint: "The next sound is l, one of the four. The t becomes a copy of it.",
      options: [
        { text: "tat labhate", correct: false, why: "l is one of the four sounds that pull the t, so it does change." },
        { text: "tal labhate", correct: true, why: "Yes. The t becomes a copy of the l that follows." },
        { text: "tac labhate", correct: false, why: "c is a palate sound, but the next sound is l. The t copies exactly what comes next." },
        { text: "tad labhate", correct: false, why: "d is a different sound, and nothing in this rule makes a t into d." },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      reviewItem: true,
      prompt: "Match each pair of words with the joined form.",
      pairs: [
        ["{तत् + च|tat + ca}", "{तच्च|tac ca}"],
        ["{तत् + जयति|tat + jayati}", "{तज्जयति|taj jayati}"],
        ["{तत् + लभते|tat + labhate}", "{तल्लभते|tal labhate}"],
        ["{तत् + करोति|tat + karoti}", "{तत्करोति|tat karoti}"],
      ],
      why: "Three of them change (before c, j and l) and one does not (before k).",
    },
    {
      kind: "exercise",
      id: "q-nochange",
      type: "choice",
      prompt: "After which word does the final t of {तत्|tat} stay as it is?",
      options: [
        { text: "{च|ca}", correct: false, why: "c is one of the four, so the t becomes c." },
        { text: "{जयति|jayati}", correct: false, why: "j is one of the four, so the t becomes j." },
        { text: "{करोति|karoti}", correct: true, why: "Yes. k is not one of the four, so nothing pulls the t and it stays." },
        { text: "{लभते|labhate}", correct: false, why: "l is one of the four, so the t becomes l." },
      ],
    },
    {
      kind: "exercise",
      id: "q-pathati",
      type: "choice",
      prompt: "Why does {तत् पठति|tat paṭhati} stay as it is?",
      options: [
        { text: "Because {पठति|paṭhati} is a verb", correct: false, why: "Whether the next word is a verb does not matter here. What matters is the sound it starts with." },
        { text: "Because p is not one of c, j, ṭ or l, so nothing pulls the t", correct: true, why: "Exactly. The rule only looks at the sound that follows." },
        { text: "Because the word is too long", correct: false, why: "Length does not matter. Only the first sound of the next word does." },
      ],
    },
    {
      kind: "exercise",
      id: "q-unjoin",
      type: "choice",
      reviewItem: true,
      prompt: "Which two words joined to make {तज्जयति|taj jayati}?",
      hint: "Work backwards: the doubled j came from a t that copied the j.",
      options: [
        { text: "{तत्|tat} + {जयति|jayati}", correct: true, why: "Yes. The final t copied the j, giving taj jayati." },
        { text: "{तत्|tat} + {करोति|karoti}", correct: false, why: "That would stay {तत्करोति|tat karoti}: k does not pull the t." },
        { text: "{तत्|tat} + {लभते|labhate}", correct: false, why: "That makes {तल्लभते|tal labhate}, with an l." },
        { text: "{तत्|tat} + {च|ca}", correct: false, why: "That makes {तच्च|tac ca}, with a c." },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "To predict the joining, look at the next sound: if it is **c, j, ṭ or l** the final **t** becomes a copy of it; otherwise it stays.",
      example: { dev: "तत् + लभते = तल्लभते", iast: "tat + labhate = tal labhate" },
    },
  ],
};
