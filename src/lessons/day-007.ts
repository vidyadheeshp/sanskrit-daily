import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 7,
  title: "Week 1 — a real conversation, start to finish",
  concept: "week-1-review",
  teaser:
    "A week ago you knew no Sanskrit. Can you follow a real conversation — from “hello” to “what are you reading?”",
  rhythm: "review",
  minutes: 7,
  prerequisites: [6],
  credits: ["Draft written with Claude — awaiting contributor and scholar review"],
  reviewed: false,
  sources: [
    "Phrases from the “Simple Sanskrit sentences” page of Samskrita Bharati's “Mama Bhāṣā Saṃskṛtam” leaflet (Jana Ganana 2026); to be verified by a reviewer",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "One week in",
      body: [
        "Seven days ago you knew no Sanskrit. Today you'll follow a real little conversation using everything from this week: greetings, names, and what people are doing.",
        "There's one new word to meet first.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "sentences",
      title: "Asking a woman",
      widget: "word-by-word",
      prompt: "You already know how to ask a man. Here's the same question for a woman. Open all six words.",
      requiredInteractions: 6,
      sentences: [
        {
          words: [
            { text: "{भवती|bhavatī}", gloss: "you (to a woman)" },
            { text: "{किं|kiṃ}", gloss: "what" },
            { text: "{पठति|paṭhati}", gloss: "reads" },
          ],
          english: "What are you reading?",
        },
        {
          words: [
            { text: "{अहं|ahaṃ}", gloss: "I" },
            { text: "{पुस्तकं|pustakaṃ}", gloss: "a book" },
            { text: "{पठामि|paṭhāmi}", gloss: "I read" },
          ],
          english: "I am reading a book.",
        },
      ],
    },
    {
      kind: "explain",
      id: "conversation",
      title: "The whole conversation",
      body: [
        "**A:** {नमस्ते|namaste}!",
        "**B:** {नमस्ते|namaste}!",
        "**A:** {भवत्याः नाम किम्|bhavatyāḥ nāma kim}?",
        "**B:** {मम नाम सीता|mama nāma sītā}.",
        "**A:** {भवती किं पठति|bhavatī kiṃ paṭhati}?",
        "**B:** {अहं पुस्तकं पठामि|ahaṃ pustakaṃ paṭhāmi}.",
      ].join("\n"),
      callout: {
        tone: "note",
        text: "Every line uses something from this week. Read it again slowly and see how much you can understand without help.",
      },
    },
    {
      kind: "exercise",
      id: "q-greet",
      type: "choice",
      guided: true,
      prompt: "A guest arrives at your door. Which word welcomes them?",
      hint: "{सु|su} (well) + {आगतम्|āgatam} (arrived).",
      reviewItem: true,
      options: [
        {
          text: "{धन्यवादाः|dhanyavādāḥ}",
          correct: false,
          why: "That is “thank you”.",
        },
        {
          text: "{स्वागतम्|svāgatam}",
          correct: true,
          why: "Yes — “well-arrived”: welcome.",
        },
        {
          text: "{पुनः मिलामः|punaḥ milāmaḥ}",
          correct: false,
          why: "That is a goodbye: “we meet again”.",
        },
        {
          text: "{क्षम्यताम्|kṣamyatām}",
          correct: false,
          why: "That is an apology.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-name",
      type: "tiles",
      prompt: "Say “My name is Sītā.”",
      tiles: ["{मम|mama}", "{नाम|nāma}", "{सीता|sītā}", "{अस्ति|asti}", "{भवतः|bhavataḥ}"],
      answer: ["{मम|mama}", "{नाम|nāma}", "{सीता|sītā}"],
      why: "“My name — Sītā.” No word for “is” needed.",
    },
    {
      kind: "exercise",
      id: "q-woman",
      type: "choice",
      reviewItem: true,
      prompt: "You ask a woman what she is reading. Which question?",
      options: [
        {
          text: "{भवान् किं पठति|bhavān kiṃ paṭhati}",
          correct: false,
          why: "{भवान्|bhavān} is the “you” for a man.",
        },
        {
          text: "{भवती किं पठति|bhavatī kiṃ paṭhati}",
          correct: true,
          why: "Yes — {भवती|bhavatī} for a woman, with the -ति verb.",
        },
        {
          text: "{अहं किं पठामि|ahaṃ kiṃ paṭhāmi}",
          correct: false,
          why: "That asks “What am I reading?” — about yourself.",
        },
        {
          text: "{भवती किं पठामि|bhavatī kiṃ paṭhāmi}",
          correct: false,
          why: "-मि is the “I” ending; it doesn't go with “you”.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-answer",
      type: "tiles",
      reviewItem: true,
      prompt: "Say “I am drinking water.”",
      tiles: ["{अहं|ahaṃ}", "{जलं|jalaṃ}", "{पिबामि|pibāmi}", "{पिबति|pibati}"],
      answer: ["{अहं|ahaṃ}", "{जलं|jalaṃ}", "{पिबामि|pibāmi}"],
      why: "I + water + “I drink”.",
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each word with its meaning.",
      pairs: [
        ["{धन्यवादाः|dhanyavādāḥ}", "thank you"],
        ["{कृपया|kṛpayā}", "please"],
        ["{किं|kiṃ}", "what"],
        ["{अहं|ahaṃ}", "I"],
        ["{गच्छामि|gacchāmi}", "I go"],
      ],
      why: "A week of words, all at your fingertips.",
    },
    {
      kind: "exercise",
      id: "q-ending",
      type: "choice",
      prompt: "Which verb ending goes with {अहं|ahaṃ} (I)?",
      options: [
        {
          text: "{-ति|-ti}",
          correct: false,
          why: "-ति goes with “you” (polite) or “he / she”.",
        },
        {
          text: "{-मि|-mi}",
          correct: true,
          why: "Yes — -मि always points to “I”.",
        },
        {
          text: "No ending is needed",
          correct: false,
          why: "Verbs always carry an ending, and it tells you who is acting.",
        },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "Week 1: greet ({नमस्ते|namaste}), ask a name ({भवतः नाम किम्|bhavataḥ nāma kim}), ask what someone does ({भवान् किं करोति|bhavān kiṃ karoti}) and answer ({अहं … करोमि|ahaṃ … karomi}). Man: {भवान्|bhavān}. Woman: {भवती|bhavatī}.",
      example: { dev: "नमस्ते! मम नाम सीता।", iast: "namaste! mama nāma sītā." },
    },
  ],
};
