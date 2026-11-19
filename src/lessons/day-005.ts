import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 5,
  title: "Answer the question by tweaking it",
  concept: "question-and-answer",
  teaser:
    "Someone asks you a question in Sanskrit. You can answer it by changing just three things in the question. Which three?",
  rhythm: "build",
  minutes: 6,
  prerequisites: [4],
  credits: ["Draft written with Claude; reviewed by the project owner"],
  reviewed: true,
  sources: [
    "Question-and-answer pairs adapted from the “Simple Sanskrit sentences” page of Samskrita Bharati's “Mama Bhāṣā Saṃskṛtam” leaflet (Jana Ganana 2026); to be verified by a reviewer",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "A trick for answering",
      body: [
        "Someone asks what you are drinking or reading. Good news: you don't need new sentences. You can answer by **reusing the question**.",
        "Let's see how.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "sentences",
      title: "Question and answer, side by side",
      widget: "word-by-word",
      prompt: "Tap each word to see what it means. Open all six.",
      requiredInteractions: 6,
      sentences: [
        {
          words: [
            { text: "{भवान्|bhavān}", gloss: "you (to a man)" },
            { text: "{किं|kiṃ}", gloss: "what" },
            { text: "{पिबति|pibati}", gloss: "drink(s)" },
          ],
          english: "What are you drinking?",
        },
        {
          words: [
            { text: "{अहं|ahaṃ}", gloss: "I" },
            { text: "{जलं|jalaṃ}", gloss: "water" },
            { text: "{पिबामि|pibāmi}", gloss: "I drink" },
          ],
          english: "I am drinking water.",
        },
      ],
    },
    {
      kind: "explain",
      id: "three-changes",
      title: "Three small changes",
      body: [
        "To turn the question into an answer, change three things:",
        "**1.** {किं|kiṃ} (what) → the thing itself: {जलं|jalaṃ}.",
        "**2.** {भवान्|bhavān} (you) → {अहं|ahaṃ} (I).",
        "**3.** The verb: -ति → -मि (and stretch the *a*): {पिबति|pibati} → {पिबामि|pibāmi}.",
        "Words you'll need: {जलं|jalaṃ} water · {पुस्तकं|pustakaṃ} a book · {भोजनं|bhojanaṃ} a meal.",
      ].join("\n"),
      callout: {
        tone: "note",
        text: "Why {जलं|jalaṃ} ends in a dot is the subject of the next lesson. For now, just use the words as given.",
      },
    },
    {
      kind: "exercise",
      id: "q-b1",
      type: "tiles",
      guided: true,
      prompt: "Answer “What are you drinking?” — “I am drinking water.”",
      hint: "I, then the thing, then the “I” form of the verb.",
      tiles: ["{अहं|ahaṃ}", "{जलं|jalaṃ}", "{पिबामि|pibāmi}", "{पिबति|pibati}"],
      answer: ["{अहं|ahaṃ}", "{जलं|jalaṃ}", "{पिबामि|pibāmi}"],
      why: "I (अहं) + the thing (जलं) + the I-form (पिबामि).",
    },
    {
      kind: "exercise",
      id: "q-b2",
      type: "tiles",
      reviewItem: true,
      prompt: "Answer “What are you reading?” — “I am reading a book.”",
      tiles: ["{अहं|ahaṃ}", "{पुस्तकं|pustakaṃ}", "{पठामि|paṭhāmi}", "{पठति|paṭhati}", "{जलं|jalaṃ}"],
      answer: ["{अहं|ahaṃ}", "{पुस्तकं|pustakaṃ}", "{पठामि|paṭhāmi}"],
      why: "I + a book + “I read”.",
    },
    {
      kind: "exercise",
      id: "q-b3",
      type: "tiles",
      prompt: "Answer “What are you doing?” — “I am having a meal.”",
      tiles: ["{अहं|ahaṃ}", "{भोजनं|bhojanaṃ}", "{करोमि|karomi}", "{करोति|karoti}", "{पुस्तकं|pustakaṃ}"],
      answer: ["{अहं|ahaṃ}", "{भोजनं|bhojanaṃ}", "{करोमि|karomi}"],
      why: "I + a meal + “I do”. Remember: {करोमि|karomi} doesn't stretch.",
    },
    {
      kind: "exercise",
      id: "q-q",
      type: "choice",
      reviewItem: true,
      prompt: "Which question does {अहं पुस्तकं पठामि|ahaṃ pustakaṃ paṭhāmi} answer?",
      options: [
        {
          text: "{भवान् किं पिबति|bhavān kiṃ pibati}",
          correct: false,
          why: "That asks what you are *drinking*. The answer is about reading.",
        },
        {
          text: "{भवान् किं पठति|bhavān kiṃ paṭhati}",
          correct: true,
          why: "Yes — “What are you reading?” — “I am reading a book.”",
        },
        {
          text: "{भवतः नाम किम्|bhavataḥ nāma kim}",
          correct: false,
          why: "That asks for a name, not what you are doing.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each question with its answer.",
      pairs: [
        ["{भवान् किं पिबति|bhavān kiṃ pibati}", "{अहं जलं पिबामि|ahaṃ jalaṃ pibāmi}"],
        ["{भवान् किं पठति|bhavān kiṃ paṭhati}", "{अहं पुस्तकं पठामि|ahaṃ pustakaṃ paṭhāmi}"],
        ["{भवतः नाम किम्|bhavataḥ nāma kim}", "{मम नाम सीता|mama nāma sītā}"],
        ["{भवान् किं करोति|bhavān kiṃ karoti}", "{अहं भोजनं करोमि|ahaṃ bhojanaṃ karomi}"],
      ],
      why: "You can now hold a small conversation.",
    },
    {
      kind: "recap",
      id: "recap",
      rule: "To answer, reuse the question and change three things: {किं|kiṃ} → the thing, {भवान्|bhavān} → {अहं|ahaṃ}, and the verb -ति → -मि. “What are you drinking?” → “I drink water.”",
      example: { dev: "भवान् किं पिबति? अहं जलं पिबामि।", iast: "bhavān kiṃ pibati? ahaṃ jalaṃ pibāmi." },
    },
  ],
};
