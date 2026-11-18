import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 2,
  title: "“What is your name?” — and no word for “is”",
  concept: "introductions",
  teaser:
    "How do you ask “What is your name?” in Sanskrit? Hint: there is no word for “is”.",
  rhythm: "new",
  minutes: 6,
  prerequisites: [1],
  credits: ["Draft written with Claude — awaiting contributor and scholar review"],
  reviewed: false,
  sources: [
    "Sentences from the “Simple Sanskrit sentences” page of Samskrita Bharati's “Mama Bhāṣā Saṃskṛtam” leaflet (Jana Ganana 2026); word glosses to be verified by a reviewer",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "Your first real question",
      body: [
        "You can already say hello. Now let's ask the first thing people ask: **“What is your name?”**",
        "In English you need the little word *is*. In Sanskrit… watch what happens to it.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "sentences",
      title: "Word by word",
      widget: "word-by-word",
      prompt: "Tap each word to see what it means. Open all of them in both sentences.",
      requiredInteractions: 6,
      sentences: [
        {
          words: [
            { text: "{भवतः|bhavataḥ}", gloss: "your (asking a man)" },
            { text: "{नाम|nāma}", gloss: "name" },
            { text: "{किम्|kim}", gloss: "what" },
          ],
          english: "What is your name?",
          gap: {
            after: 1,
            label: "is",
            note: "Sanskrit just puts the words side by side: “your name — what?”",
          },
        },
        {
          words: [
            { text: "{मम|mama}", gloss: "my" },
            { text: "{नाम|nāma}", gloss: "name" },
            { text: "{रामः|rāmaḥ}", gloss: "Rāma (a name)" },
          ],
          english: "My name is Rāma.",
          gap: {
            after: 1,
            label: "is",
            note: "Again, no “is”: “my name — Rāma.”",
          },
        },
      ],
    },
    {
      kind: "explain",
      id: "no-is",
      title: "Where did “is” go?",
      body: [
        "It was never needed. {भवतः|bhavataḥ} {नाम|nāma} {किम्|kim} is literally “your name — what?”, and {मम|mama} {नाम|nāma} {रामः|rāmaḥ} is “my name — Rāma.”",
        "Setting two things side by side is enough: the meaning is already clear. Simple statements like this are very common in Sanskrit.",
      ].join("\n"),
      callout: {
        tone: "caution",
        text: "Sanskrit *does* have a word for “is” — {अस्ति|asti}. It just isn't needed for simple statements like these. You'll meet it later, in a sentence like “there is a puja at home”.",
      },
    },
    {
      kind: "explain",
      id: "who",
      title: "Who are you asking?",
      body: [
        "“Your” changes with the person you are talking to:",
        "{भवतः|bhavataḥ} when you ask a **man**.",
        "{भवत्याः|bhavatyāḥ} when you ask a **woman**.",
        "Everything else in the question stays exactly the same.",
      ].join("\n"),
    },
    {
      kind: "exercise",
      id: "q-build",
      type: "tiles",
      guided: true,
      prompt: "Build “What is your name?” to ask a man. Tap the pieces in order.",
      hint: "Your… name… what? And remember, there's no word for “is”.",
      tiles: ["{भवतः|bhavataḥ}", "{नाम|nāma}", "{किम्|kim}", "{अस्ति|asti}"],
      answer: ["{भवतः|bhavataḥ}", "{नाम|nāma}", "{किम्|kim}"],
      why: "“Your name — what?” No word for “is” needed.",
    },
    {
      kind: "exercise",
      id: "q-mine",
      type: "choice",
      guided: true,
      prompt: "Which word means “my”?",
      hint: "The m-sounds in {मम|mama} are a clue: think of “me” and “my”.",
      reviewItem: true,
      options: [
        {
          text: "{नाम|nāma}",
          correct: false,
          why: "That is “name”.",
        },
        {
          text: "{मम|mama}",
          correct: true,
          why: "Yes — {मम|mama} means “my”.",
        },
        {
          text: "{किम्|kim}",
          correct: false,
          why: "That is the question word “what”.",
        },
        {
          text: "{भवतः|bhavataḥ}",
          correct: false,
          why: "That is “your” — the one for talking to a man, not about yourself.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-woman",
      type: "choice",
      reviewItem: true,
      prompt: "You want to ask a woman her name. Which question do you use?",
      options: [
        {
          text: "{भवतः नाम किम्|bhavataḥ nāma kim}",
          correct: false,
          why: "Close — but {भवतः|bhavataḥ} is the “your” for a man.",
        },
        {
          text: "{भवत्याः नाम किम्|bhavatyāḥ nāma kim}",
          correct: true,
          why: "Yes — {भवत्याः|bhavatyāḥ} is “your” for a woman.",
        },
        {
          text: "{मम नाम किम्|mama nāma kim}",
          correct: false,
          why: "{मम|mama} means “my” — that would ask “my name — what?”",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-answer",
      type: "tiles",
      reviewItem: true,
      prompt: "Say “My name is Sītā.” Tap the pieces in order.",
      tiles: ["{मम|mama}", "{नाम|nāma}", "{सीता|sītā}", "{अस्ति|asti}", "{भवतः|bhavataḥ}"],
      answer: ["{मम|mama}", "{नाम|nāma}", "{सीता|sītā}"],
      why: "“My name — Sītā.” Again, no “is”.",
    },
    {
      kind: "exercise",
      id: "q-why",
      type: "choice",
      prompt: "Why is there no word for “is” in {मम नाम रामः|mama nāma rāmaḥ}?",
      options: [
        {
          text: "The writer forgot to add it",
          correct: false,
          why: "Nothing is missing — this is how simple Sanskrit statements are normally made.",
        },
        {
          text: "Putting the words side by side is enough to show the meaning",
          correct: true,
          why: "Exactly. “My name — Rāma” says everything that “my name is Rāma” does.",
        },
        {
          text: "“Is” is hidden inside the word {नाम|nāma}",
          correct: false,
          why: "{नाम|nāma} just means “name”. There is no hidden “is”.",
        },
        {
          text: "Sanskrit has no word for “is” at all",
          correct: false,
          why: "It does — {अस्ति|asti}. It simply isn't needed in sentences like this one.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each Sanskrit word with its meaning.",
      pairs: [
        ["{भवतः|bhavataḥ}", "your (to a man)"],
        ["{भवत्याः|bhavatyāḥ}", "your (to a woman)"],
        ["{मम|mama}", "my"],
        ["{किम्|kim}", "what"],
        ["{नाम|nāma}", "name"],
      ],
      why: "Five small words — and you can now ask and tell a name.",
    },
    {
      kind: "recap",
      id: "recap",
      rule: "No “is” needed: {भवतः|bhavataḥ} {नाम|nāma} {किम्|kim}? = “What is your name?” — {मम|mama} {नाम|nāma} {रामः|rāmaḥ} = “My name is Rāma.” (Use {भवत्याः|bhavatyāḥ} to ask a woman.)",
      example: { dev: "भवतः नाम किम्? मम नाम रामः।", iast: "bhavataḥ nāma kim? mama nāma rāmaḥ." },
    },
  ],
};
