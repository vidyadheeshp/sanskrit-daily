import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 1,
  title: "Say hello — six everyday Sanskrit words",
  concept: "greetings",
  teaser:
    "In Sanskrit, “hello” isn’t just a sound — it’s a tiny sentence. Can you guess what नमस्ते literally means?",
  rhythm: "new",
  minutes: 5,
  prerequisites: [],
  credits: ["Draft written with Claude — awaiting contributor and scholar review"],
  reviewed: false,
  sources: [
    "Word choice inspired by the “Simple Sanskrit sentences” page of Samskrita Bharati's “Mama Bhāṣā Saṃskṛtam” leaflet (Jana Ganana 2026); word breakdowns to be verified by a reviewer",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "Hello, with meaning",
      body: [
        "The English word “hello” doesn't *mean* anything. Sanskrit greetings are different — each one is a tiny sentence with a meaning you can see.",
        "Learn the meaning once and the word stays with you, instead of being a sound you have to memorise.",
        "Today: six everyday words — **hello, welcome, thank you, please, sorry** and **see you again**.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "meet",
      title: "Meet the six words",
      widget: "reveal-cards",
      prompt: "Tap each word to open it up and see the pieces it is made from.",
      requiredInteractions: 6,
      cards: [
        {
          word: "{नमस्ते|namaste}",
          parts: [
            { text: "{नमः|namaḥ}", meaning: "a bow, a salutation" },
            { text: "{ते|te}", meaning: "to you" },
          ],
          meaning: "“A bow to you” — hello.",
          use: "To greet someone, or to say goodbye. Any time of day.",
        },
        {
          word: "{स्वागतम्|svāgatam}",
          parts: [
            { text: "{सु|su}", meaning: "well, good" },
            { text: "{आगतम्|āgatam}", meaning: "arrived" },
          ],
          meaning: "“Well-arrived” — welcome!",
          use: "When someone arrives or comes to your door.",
        },
        {
          word: "{धन्यवादाः|dhanyavādāḥ}",
          parts: [
            { text: "{धन्य|dhanya}", meaning: "fortunate, blessed" },
            { text: "{वादाः|vādāḥ}", meaning: "words" },
          ],
          meaning: "“Words that call you blessed” — thank you.",
          use: "After someone helps you or gives you something. The ending *-āḥ* is plural, like “many thanks”.",
        },
        {
          word: "{कृपया|kṛpayā}",
          parts: [{ text: "{कृपा|kṛpā}", meaning: "kindness (here with “through”)" }],
          meaning: "“Through kindness” — please.",
          use: "When you ask for something politely.",
        },
        {
          word: "{क्षम्यताम्|kṣamyatām}",
          parts: [
            { text: "{क्षम्|kṣam}", meaning: "to forgive, to put up with" },
            { text: "{-यताम्|-yatām}", meaning: "let it be…" },
          ],
          meaning: "“Let it be forgiven” — excuse me, sorry.",
          use: "When you bump into someone or need to apologise.",
        },
        {
          word: "{पुनः मिलामः|punaḥ milāmaḥ}",
          parts: [
            { text: "{पुनः|punaḥ}", meaning: "again" },
            { text: "{मिलामः|milāmaḥ}", meaning: "we meet" },
          ],
          meaning: "“Again we meet” — see you again.",
          use: "When you part, hoping to meet again.",
        },
      ],
    },
    {
      kind: "explain",
      id: "pattern",
      title: "Spot the pieces",
      body: [
        "Did you notice? Most of these words are small pieces joined together: {नमः|namaḥ} + {ते|te}, {सु|su} + {आगतम्|āgatam}, {पुनः|punaḥ} + {मिलामः|milāmaḥ}.",
        "Looking for the pieces is a habit that will make almost every new Sanskrit word easier to remember.",
      ].join("\n"),
      callout: {
        tone: "caution",
        text: "When pieces join they sometimes change shape — {सु|su} + {आगतम्|āgatam} becomes {स्वागतम्|svāgatam}. That is called sandhi, and a later lesson explains it. For now, just spot the pieces.",
      },
    },
    {
      kind: "exercise",
      id: "q-build",
      type: "tiles",
      guided: true,
      prompt: "Build the greeting that means “a bow to you”. Tap the pieces in order.",
      hint: "First the bow, then “to you”.",
      tiles: ["{नमः|namaḥ}", "{ते|te}", "{सु|su}", "{आगतम्|āgatam}"],
      answer: ["{नमः|namaḥ}", "{ते|te}"],
      why: "{नमः|namaḥ} (a bow) + {ते|te} (to you) joins to make {नमस्ते|namaste}.",
    },
    {
      kind: "exercise",
      id: "q-welcome",
      type: "choice",
      guided: true,
      prompt: "A guest arrives at your door. Which word says “well-arrived”?",
      hint: "{सु|su} means “well”, {आगतम्|āgatam} means “arrived”.",
      reviewItem: true,
      options: [
        {
          text: "{पुनः मिलामः|punaḥ milāmaḥ}",
          correct: false,
          why: "That one is for leaving — it means “we meet again”.",
        },
        {
          text: "{स्वागतम्|svāgatam}",
          correct: true,
          why: "Yes — {सु|su} (well) + {आगतम्|āgatam} (arrived) gives “welcome”.",
        },
        {
          text: "{क्षम्यताम्|kṣamyatām}",
          correct: false,
          why: "That one asks to be forgiven — an apology, not a welcome.",
        },
        {
          text: "{कृपया|kṛpayā}",
          correct: false,
          why: "That means “please” — it goes with a request.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-sorry",
      type: "choice",
      reviewItem: true,
      prompt: "You accidentally bump into someone. Which word says “excuse me / sorry”?",
      options: [
        {
          text: "{धन्यवादाः|dhanyavādāḥ}",
          correct: false,
          why: "That is “thank you” — you say it after receiving something.",
        },
        {
          text: "{स्वागतम्|svāgatam}",
          correct: false,
          why: "That welcomes someone who arrives.",
        },
        {
          text: "{क्षम्यताम्|kṣamyatām}",
          correct: true,
          why: "Right — “let it be forgiven”, the Sanskrit way to say sorry.",
        },
        {
          text: "{कृपया|kṛpayā}",
          correct: false,
          why: "“Please” asks for something; it doesn't apologise.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each word with the little meaning hidden inside it.",
      pairs: [
        ["{नमस्ते|namaste}", "a bow to you"],
        ["{स्वागतम्|svāgatam}", "well-arrived"],
        ["{कृपया|kṛpayā}", "through kindness"],
        ["{पुनः मिलामः|punaḥ milāmaḥ}", "again we meet"],
      ],
      why: "Each greeting is a tiny sentence.",
    },
    {
      kind: "exercise",
      id: "q-thanks",
      type: "choice",
      reviewItem: true,
      prompt: "Someone hands you a gift. Which word says “thank you”?",
      options: [
        {
          text: "{कृपया|kṛpayā}",
          correct: false,
          why: "“Please” is for asking, before you receive — not for thanking after.",
        },
        {
          text: "{पुनः मिलामः|punaḥ milāmaḥ}",
          correct: false,
          why: "That is a goodbye: “we meet again”.",
        },
        {
          text: "{धन्यवादाः|dhanyavādāḥ}",
          correct: true,
          why: "Yes — “words that call you blessed”: thank you.",
        },
        {
          text: "{क्षम्यताम्|kṣamyatām}",
          correct: false,
          why: "That is “sorry”, not “thanks”.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-bye",
      type: "choice",
      prompt: "You are leaving a friend and hope to meet again. Which word fits?",
      options: [
        {
          text: "{स्वागतम्|svāgatam}",
          correct: false,
          why: "That welcomes someone who is arriving — the opposite moment.",
        },
        {
          text: "{कृपया|kṛpayā}",
          correct: false,
          why: "“Please” goes with a request, not a farewell.",
        },
        {
          text: "{पुनः मिलामः|punaḥ milāmaḥ}",
          correct: true,
          why: "Yes — {पुनः|punaḥ} (again) + {मिलामः|milāmaḥ} (we meet).",
        },
        {
          text: "{क्षम्यताम्|kṣamyatām}",
          correct: false,
          why: "That is an apology, not a goodbye.",
        },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "{नमस्ते|namaste} hello · {स्वागतम्|svāgatam} welcome · {धन्यवादाः|dhanyavādāḥ} thank you · {कृपया|kṛpayā} please · {क्षम्यताम्|kṣamyatām} sorry · {पुनः मिलामः|punaḥ milāmaḥ} see you again. Each is a tiny sentence — look for the pieces.",
      example: { dev: "नमस्ते! स्वागतम्!", iast: "namaste! svāgatam!" },
    },
  ],
};
