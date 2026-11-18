import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 6,
  title: "The little dot at the end of जलं, पुस्तकं, देवालयं",
  concept: "object-ending-m",
  teaser:
    "Why do जलं, पुस्तकं and देवालयं all end with a little dot? A tiny ending marks what the action lands on.",
  rhythm: "new",
  minutes: 6,
  prerequisites: [5],
  credits: ["Draft written with Claude — awaiting contributor and scholar review"],
  reviewed: false,
  sources: [
    "Sentences adapted from the “Simple Sanskrit sentences” page of Samskrita Bharati's “Mama Bhāṣā Saṃskṛtam” leaflet (Jana Ganana 2026); the explanation is deliberately simplified and needs a reviewer's check",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "A little dot with a job",
      body: [
        "In the last lesson you used {जलं|jalaṃ}, {पुस्तकं|pustakaṃ} and {भोजनं|bhojanaṃ}. Did you notice they all end with the same little dot?",
        "It isn't decoration. It has a job — let's find out what it is.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "sentences",
      title: "Three sentences",
      widget: "word-by-word",
      prompt: "Tap words to see what they mean. Open at least six — the middle words are the interesting ones.",
      requiredInteractions: 6,
      sentences: [
        {
          words: [
            { text: "{अहं|ahaṃ}", gloss: "I" },
            { text: "{जलं|jalaṃ}", gloss: "water — what I drink" },
            { text: "{पिबामि|pibāmi}", gloss: "I drink" },
          ],
          english: "I drink water.",
        },
        {
          words: [
            { text: "{अहं|ahaṃ}", gloss: "I" },
            { text: "{पुस्तकं|pustakaṃ}", gloss: "a book — what I read" },
            { text: "{पठामि|paṭhāmi}", gloss: "I read" },
          ],
          english: "I read a book.",
        },
        {
          words: [
            { text: "{अहं|ahaṃ}", gloss: "I" },
            { text: "{देवालयं|devālayaṃ}", gloss: "the temple — where I go" },
            { text: "{गच्छामि|gacchāmi}", gloss: "I go" },
          ],
          english: "I go to the temple.",
        },
      ],
    },
    {
      kind: "explain",
      id: "lands-on",
      title: "What the action lands on",
      body: [
        "Look at the middle words: {जलं|jalaṃ}, {पुस्तकं|pustakaṃ}, {देवालयं|devālayaṃ}. Each is the thing the action **lands on** — what you drink, what you read, where you go.",
        "All three wear the same ending: **-ṃ**. It's Sanskrit's way of saying “this is what the verb is doing something to”.",
      ].join("\n"),
      callout: {
        tone: "caution",
        text: "Three small notes. (1) A final **m** is often written as a dot: {जलम्|jalam} = {जलं|jalaṃ}. (2) {अहं|ahaṃ} (I) also ends in a dot, but that's just how the word is — it isn't marking anything. (3) These everyday words all belong to one group; other kinds of word change differently. Later lessons cover those.",
      },
    },
    {
      kind: "exercise",
      id: "q-thing",
      type: "choice",
      guided: true,
      prompt: "In {अहं जलं पिबामि|ahaṃ jalaṃ pibāmi}, which word is the thing being drunk?",
      hint: "What does the verb “drink” land on?",
      options: [
        {
          text: "{अहं|ahaṃ}",
          correct: false,
          why: "That is “I” — the one doing the drinking, not the thing drunk.",
        },
        {
          text: "{जलं|jalaṃ}",
          correct: true,
          why: "Yes — water is what gets drunk, so it carries the -ṃ ending.",
        },
        {
          text: "{पिबामि|pibāmi}",
          correct: false,
          why: "That is the action itself — “I drink”.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-build",
      type: "tiles",
      reviewItem: true,
      prompt: "Say “I go to the temple.” Tap the pieces in order.",
      tiles: ["{अहं|ahaṃ}", "{देवालयं|devālayaṃ}", "{गच्छामि|gacchāmi}", "{देवालय|devālaya}"],
      answer: ["{अहं|ahaṃ}", "{देवालयं|devālayaṃ}", "{गच्छामि|gacchāmi}"],
      why: "{देवालयं|devālayaṃ} — with its -ṃ — is the place I am going to.",
    },
    {
      kind: "exercise",
      id: "q-pick",
      type: "choice",
      reviewItem: true,
      prompt: "Which one correctly says “I drink water”?",
      options: [
        {
          text: "{अहं जल पिबामि|ahaṃ jala pibāmi}",
          correct: false,
          why: "The thing being drunk needs its ending: {जलं|jalaṃ}.",
        },
        {
          text: "{अहं जलं पिबामि|ahaṃ jalaṃ pibāmi}",
          correct: true,
          why: "Yes — “I” + water (with -ṃ) + “I drink”.",
        },
        {
          text: "{अहं जलं पिबति|ahaṃ jalaṃ pibati}",
          correct: false,
          why: "-ति is for “you / he / she”. With {अहं|ahaṃ} (I) the verb ends in -मि.",
        },
        {
          text: "{अहं जलं पिबमि|ahaṃ jalaṃ pibami}",
          correct: false,
          why: "Almost! The *a* before -मि should stretch: {पिबामि|pibāmi}.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each word with its meaning.",
      pairs: [
        ["{जलं|jalaṃ}", "water"],
        ["{पुस्तकं|pustakaṃ}", "a book"],
        ["{भोजनं|bhojanaṃ}", "a meal"],
        ["{देवालयं|devālayaṃ}", "the temple"],
        ["{कार्यं|kāryaṃ}", "work"],
      ],
      why: "Five everyday words — all wearing the -ṃ ending.",
    },
    {
      kind: "exercise",
      id: "q-aham",
      type: "choice",
      prompt: "{अहं|ahaṃ} (I) also ends in a dot. Does that mean it's the thing the action lands on?",
      options: [
        {
          text: "Yes — every word with a dot is the thing being acted on",
          correct: false,
          why: "Not quite. {अहं|ahaṃ} is the one *doing* the action, even though it has a dot.",
        },
        {
          text: "No — that's just how the word for “I” is written",
          correct: true,
          why: "Exactly. The dot on {अहं|ahaṃ} isn't marking an object; it's simply part of the word.",
        },
        {
          text: "It's a mistake in the spelling",
          correct: false,
          why: "It's correct — {अहम्|aham} and {अहं|ahaṃ} are the same word.",
        },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "The thing the action lands on wears the ending -ṃ: {जलं|jalaṃ} पिबामि (I drink water), {पुस्तकं|pustakaṃ} पठामि (I read a book), {देवालयं|devālayaṃ} गच्छामि (I go to the temple).",
      example: { dev: "अहं देवालयं गच्छामि।", iast: "ahaṃ devālayaṃ gacchāmi." },
    },
  ],
};
