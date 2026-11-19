import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 3,
  title: "“What are you doing?” — I and you",
  concept: "pronouns-verb-endings",
  teaser:
    "One tiny ending — -ति or -मि — tells you whether it’s “you” or “I” doing the action. Can you spot which is which?",
  rhythm: "new",
  minutes: 6,
  prerequisites: [2],
  credits: ["Draft written with Claude; reviewed by the project owner"],
  reviewed: true,
  sources: [
    "Sentences from the “Simple Sanskrit sentences” page of Samskrita Bharati's “Mama Bhāṣā Saṃskṛtam” leaflet (Jana Ganana 2026); explanations to be verified by a reviewer",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "A question for any friend",
      body: [
        "Now a question you can ask anyone: **“What are you doing?”**",
        "To ask it — and to answer — you need two tiny words, **I** and **you**. And there's a surprise: the *end of the verb* changes depending on who is acting.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "sentences",
      title: "A question and its answer",
      widget: "word-by-word",
      prompt: "Tap each word to see what it means. Open all six.",
      requiredInteractions: 6,
      sentences: [
        {
          words: [
            { text: "{भवान्|bhavān}", gloss: "you (to a man, polite)" },
            { text: "{किं|kiṃ}", gloss: "what" },
            { text: "{करोति|karoti}", gloss: "does / do" },
          ],
          english: "What are you doing?",
        },
        {
          words: [
            { text: "{अहं|ahaṃ}", gloss: "I" },
            { text: "{भोजनं|bhojanaṃ}", gloss: "a meal" },
            { text: "{करोमि|karomi}", gloss: "I do" },
          ],
          english: "I am having a meal.",
        },
      ],
    },
    {
      kind: "explain",
      id: "ending",
      title: "The verb tells you who",
      body: [
        "Compare the last word of each sentence: {करोति|karoti} and {करोमि|karomi}.",
        "The ending **{-ति|-ti}** goes with {भवान्|bhavān} (you). The ending **{-मि|-mi}** goes with {अहं|ahaṃ} (I).",
        "So the verb itself already tells you who is acting.",
      ].join("\n"),
      callout: {
        tone: "caution",
        text: "Two small notes. A final **m** is often written as a dot — {किम्|kim} and {किं|kiṃ} are the same word. And strictly, -ति is the “he/she” ending; the polite “you” ({भवान्|bhavān}) borrows it. A casual “you” exists too — a later lesson.",
      },
    },
    {
      kind: "explain",
      id: "woman",
      title: "Man or woman?",
      body: [
        "To ask a man, say {भवान्|bhavān}. To ask a woman, say {भवती|bhavatī}.",
        "The verb stays {करोति|karoti} either way.",
      ].join("\n"),
    },
    {
      kind: "exercise",
      id: "q-build",
      type: "tiles",
      guided: true,
      prompt: "Build “What are you doing?” (to a man). Tap the pieces in order.",
      hint: "“You” goes with -ति, not -मि.",
      tiles: ["{भवान्|bhavān}", "{किं|kiṃ}", "{करोति|karoti}", "{करोमि|karomi}"],
      answer: ["{भवान्|bhavān}", "{किं|kiṃ}", "{करोति|karoti}"],
      why: "You (भवान्) → the verb ends in -ति.",
    },
    {
      kind: "exercise",
      id: "q-which",
      type: "choice",
      guided: true,
      prompt: "Which verb means “I do”?",
      hint: "The “I” ending is -मि.",
      options: [
        {
          text: "{करोति|karoti}",
          correct: false,
          why: "-ति goes with “you”, not “I”.",
        },
        {
          text: "{करोमि|karomi}",
          correct: true,
          why: "Yes — -मि is the “I” ending.",
        },
        {
          text: "{भवान्|bhavān}",
          correct: false,
          why: "That is the word for “you” — a pronoun, not a verb.",
        },
        {
          text: "{अहं|ahaṃ}",
          correct: false,
          why: "That is the word for “I” itself — a pronoun, not a verb.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-you",
      type: "choice",
      reviewItem: true,
      prompt: "You ask a friend (a man) what he is doing. Which question?",
      options: [
        {
          text: "{भवान् किं करोमि|bhavān kiṃ karomi}",
          correct: false,
          why: "-मि is the “I” ending. Mixing it with “you” doesn't fit.",
        },
        {
          text: "{भवान् किं करोति|bhavān kiṃ karoti}",
          correct: true,
          why: "Yes — “you” (भवान्) with the -ति verb.",
        },
        {
          text: "{अहं किं करोति|ahaṃ kiṃ karoti}",
          correct: false,
          why: "{अहं|ahaṃ} means “I”, but -ति is not the “I” ending.",
        },
        {
          text: "{अहं किं करोमि|ahaṃ kiṃ karomi}",
          correct: false,
          why: "That is grammatical, but it asks “What am I doing?” — about yourself.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-reply",
      type: "tiles",
      reviewItem: true,
      prompt: "Say “I am having a meal.” Tap the pieces in order.",
      tiles: ["{अहं|ahaṃ}", "{भोजनं|bhojanaṃ}", "{करोमि|karomi}", "{करोति|karoti}"],
      answer: ["{अहं|ahaṃ}", "{भोजनं|bhojanaṃ}", "{करोमि|karomi}"],
      why: "I (अहं) → the verb ends in -मि.",
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each Sanskrit word with its meaning.",
      pairs: [
        ["{अहं|ahaṃ}", "I"],
        ["{भवान्|bhavān}", "you (to a man)"],
        ["{करोमि|karomi}", "I do"],
        ["{करोति|karoti}", "you do (polite)"],
      ],
      why: "Four words — and you can now ask and answer “What are you doing?”",
    },
    {
      kind: "exercise",
      id: "q-why",
      type: "choice",
      prompt: "In {अहं भोजनं करोमि|ahaṃ bhojanaṃ karomi}, what tells you that “I” am the one acting?",
      options: [
        {
          text: "The ending of the verb: -मि",
          correct: true,
          why: "Exactly. The verb's ending carries the “who”.",
        },
        {
          text: "The first letter of the sentence",
          correct: false,
          why: "The first letter has nothing to do with it.",
        },
        {
          text: "Only the order of the words",
          correct: false,
          why: "Word order in Sanskrit is quite free. The ending is what carries the “who”.",
        },
        {
          text: "Nothing — you have to guess",
          correct: false,
          why: "No guessing needed: -मि always points to “I”.",
        },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "{अहं|ahaṃ} (I) → the verb ends in {-मि|-mi}: {करोमि|karomi}. {भवान्|bhavān} (you, polite, to a man) → the verb ends in {-ति|-ti}: {करोति|karoti}. (To a woman: {भवती|bhavatī}.)",
      example: { dev: "भवान् किं करोति? अहं भोजनं करोमि।", iast: "bhavān kiṃ karoti? ahaṃ bhojanaṃ karomi." },
    },
  ],
};
