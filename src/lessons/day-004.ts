import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 4,
  title: "Read, drink, go — and a hidden pattern",
  concept: "verb-i-forms",
  teaser:
    "Three new verbs, one hidden pattern: the sound just before -मि quietly stretches. Can you spot it?",
  rhythm: "new",
  minutes: 6,
  prerequisites: [3],
  credits: ["Draft written with Claude — awaiting contributor and scholar review"],
  reviewed: false,
  sources: [
    "Verbs from the “Simple Sanskrit sentences” page of Samskrita Bharati's “Mama Bhāṣā Saṃskṛtam” leaflet (Jana Ganana 2026); the “stretch” pattern is a simplification to be checked by a reviewer",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "More things to do",
      body: [
        "You can say {करोमि|karomi} — “I do”. Now let's add three more everyday actions: **read, drink** and **go**.",
        "And there's a pattern hiding in them. See if you can catch it.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "verbs",
      title: "Four verbs, two forms each",
      widget: "reveal-cards",
      prompt: "Tap each verb to compare the “you” form with the “I” form.",
      requiredInteractions: 4,
      cards: [
        {
          word: "{पठति → पठामि|paṭhati → paṭhāmi}",
          parts: [
            { text: "{पठति|paṭhati}", meaning: "reads (you, politely)" },
            { text: "{पठामि|paṭhāmi}", meaning: "I read" },
          ],
          meaning: "-ति becomes -मि, and the *a* before it stretches to *ā*.",
          use: "you ask what someone is reading, or say what you read.",
        },
        {
          word: "{पिबति → पिबामि|pibati → pibāmi}",
          parts: [
            { text: "{पिबति|pibati}", meaning: "drinks (you, politely)" },
            { text: "{पिबामि|pibāmi}", meaning: "I drink" },
          ],
          meaning: "Same change: -ति becomes -मि, and *a* stretches to *ā*.",
          use: "you ask what someone is drinking, or say what you drink.",
        },
        {
          word: "{गच्छति → गच्छामि|gacchati → gacchāmi}",
          parts: [
            { text: "{गच्छति|gacchati}", meaning: "goes (you, politely)" },
            { text: "{गच्छामि|gacchāmi}", meaning: "I go" },
          ],
          meaning: "Again: -ति becomes -मि, and *a* stretches to *ā*.",
          use: "you ask where someone is going, or say where you go.",
        },
        {
          word: "{करोति → करोमि|karoti → karomi}",
          parts: [
            { text: "{करोति|karoti}", meaning: "does (you, politely)" },
            { text: "{करोमि|karomi}", meaning: "I do" },
          ],
          meaning: "-ति becomes -मि — but this one does **not** stretch. The *o* stays.",
          use: "you ask what someone is doing, or say what you do.",
        },
      ],
    },
    {
      kind: "explain",
      id: "pattern",
      title: "Catch the pattern",
      body: [
        "{पठ-ति|paṭha-ti} → {पठा-मि|paṭhā-mi}, {पिब-ति|piba-ti} → {पिबा-मि|pibā-mi}, {गच्छ-ति|gaccha-ti} → {गच्छा-मि|gacchā-mi}.",
        "Two things happen: the ending **-ति** becomes **-मि**, *and* the *a* just before it stretches to *ā*.",
        "{करोति|karoti} is the odd one out — it keeps its *o*: {करोमि|karomi}.",
      ].join("\n"),
      callout: {
        tone: "caution",
        text: "Why {करोति|karoti} behaves differently depends on which “family” a verb belongs to — a later lesson. For now, just notice which ones stretch.",
      },
    },
    {
      kind: "exercise",
      id: "q-build",
      type: "tiles",
      guided: true,
      prompt: "Build “I read” from pieces. Tap them in order.",
      hint: "The I-ending is -मि, and the *a* before it stretches first.",
      tiles: ["{पठा|paṭhā}", "{मि|mi}", "{ति|ti}", "{पठ|paṭha}"],
      answer: ["{पठा|paṭhā}", "{मि|mi}"],
      why: "{पठा|paṭhā} (stretched) + {मि|mi} gives {पठामि|paṭhāmi}.",
    },
    {
      kind: "exercise",
      id: "q-drink",
      type: "choice",
      guided: true,
      prompt: "Which one means “I drink”?",
      hint: "Stretch the *a*, then swap the ending.",
      options: [
        {
          text: "{पिबमि|pibami}",
          correct: false,
          why: "The ending is right, but the *a* before it should stretch to *ā*.",
        },
        {
          text: "{पिबामि|pibāmi}",
          correct: true,
          why: "Yes — -मि, with the *a* stretched to *ā*.",
        },
        {
          text: "{पिबति|pibati}",
          correct: false,
          why: "That is the “you / he / she” form, not “I”.",
        },
        {
          text: "{पिबाति|pibāti}",
          correct: false,
          why: "It stretches the *a* but keeps -ति. “I” needs -मि.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-go",
      type: "choice",
      reviewItem: true,
      prompt: "Which one means “I go”?",
      options: [
        {
          text: "{गच्छमि|gacchami}",
          correct: false,
          why: "Close — but the *a* before -मि should stretch to *ā*.",
        },
        {
          text: "{गच्छामि|gacchāmi}",
          correct: true,
          why: "Right — stretched *ā* plus -मि.",
        },
        {
          text: "{गच्छति|gacchati}",
          correct: false,
          why: "That is the “you / he / she” form.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-do",
      type: "choice",
      prompt: "Which one means “I do”?",
      options: [
        {
          text: "{करामि|karāmi}",
          correct: false,
          why: "That copies the stretch pattern — but {करोति|karoti} is the exception. Its *o* stays.",
        },
        {
          text: "{करोमि|karomi}",
          correct: true,
          why: "Yes — the odd one out keeps its *o*.",
        },
        {
          text: "{करोति|karoti}",
          correct: false,
          why: "That is the “you” form.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-you",
      type: "choice",
      reviewItem: true,
      prompt: "You politely ask a man what he is reading: {भवान् किं …?|bhavān kiṃ …?} Which verb fits?",
      options: [
        {
          text: "{पठामि|paṭhāmi}",
          correct: false,
          why: "That is the “I” form. The question is about “you”.",
        },
        {
          text: "{पठति|paṭhati}",
          correct: true,
          why: "Yes — “you” goes with -ति.",
        },
        {
          text: "{पठ|paṭha}",
          correct: false,
          why: "That is only the front part of the verb. It needs an ending.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each “I” form with its meaning.",
      pairs: [
        ["{पठामि|paṭhāmi}", "I read"],
        ["{पिबामि|pibāmi}", "I drink"],
        ["{गच्छामि|gacchāmi}", "I go"],
        ["{करोमि|karomi}", "I do"],
      ],
      why: "Four verbs you can now use about yourself.",
    },
    {
      kind: "recap",
      id: "recap",
      rule: "To say “I”, swap -ति for -मि and stretch the *a* before it: {पठति|paṭhati} → {पठामि|paṭhāmi}, {पिबति|pibati} → {पिबामि|pibāmi}, {गच्छति|gacchati} → {गच्छामि|gacchāmi}. The exception to remember: {करोति|karoti} → {करोमि|karomi}.",
      example: { dev: "पठति → पठामि · पिबति → पिबामि", iast: "paṭhati → paṭhāmi · pibati → pibāmi" },
    },
  ],
};
