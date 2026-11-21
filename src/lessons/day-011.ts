import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 11,
  title: "Why does tat + ca become tac ca?",
  concept: "consonant-sandhi",
  teaser:
    "Why does तत् + च become तच्च? Your mouth is taking a shortcut — can you spot it?",
  rhythm: "new",
  minutes: 6,
  prerequisites: [8, 9, 10],
  credits: ["Draft written with Claude; awaiting review"],
  reviewed: false,
  sources: [
    "Pāṇini, Aṣṭādhyāyī 8.4.40 (stoḥ ścunā ścuḥ), 8.4.41 (ṣṭunā ṣṭuḥ), 8.4.60 (tor li) — numbering to be verified by a reviewer",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "A small puzzle",
      body: [
        "Take two little words: {तत्|tat} (“that”) and {च|ca} (“and”).",
        "Written apart they are *tat ca*. But in Sanskrit they are joined and spoken as {तच्च|tac ca}.",
        "The last **t** turned into a **c**. That is not random — your mouth is doing it for a reason. Let's find it.",
      ].join("\n"),
    },
    {
      kind: "explain",
      id: "places",
      title: "What you already know",
      body: [
        "In the last three lessons you learned that every consonant is made at one of five places: **back** ({क|ka}), **palate** ({च|ca}), **roof** ({ट|ṭa}), **teeth** ({त|ta}) and **lips** ({प|pa}).",
        "Now we put that to work. It explains why Sanskrit words change shape when they meet.",
      ].join("\n"),
    },
    {
      kind: "explain",
      id: "idea",
      title: "The shortcut",
      body: [
        "{तत्|tat} ends in **t** — made at the **teeth**.",
        "{च|ca} starts with **c** — made at the **palate**, further back.",
        "Teeth, then palate: two separate moves. Sanskrit takes the shortcut — the **t** moves to the palate too and becomes **c**. The neighbouring sounds agree on one place.",
        "This joining of sounds is called **sandhi** (“putting together”).",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "sandhi-demo",
      title: "Try it",
      widget: "sandhi-demo",
      prompt: "Pick what follows {तत्|tat} and watch what happens to its final t. Try at least four.",
      requiredInteractions: 4,
    },
    {
      kind: "explain",
      id: "pattern",
      title: "The pattern",
      body: [
        "Did you notice? The **t** became a copy of the next sound — but only for **c, j** (palate), **ṭ** (roof of the mouth) and **l**.",
        "Before **k** or **p** it stayed **t**: those sounds are made far from where the shift happens.",
      ].join("\n"),
      callout: {
        tone: "caution",
        text: "Real sandhi has many more cases (other letters in these groups, ś, ñ, voiced sounds…). Today we look at just c, j, ṭ and l. Later lessons fill in the rest.",
      },
    },
    {
      kind: "exercise",
      id: "q-tac",
      type: "choice",
      guided: true,
      prompt: "{तत्|tat} + {च|ca} → ?",
      hint: "The t should become a copy of the sound that follows it.",
      reviewItem: true,
      options: [
        {
          text: "tat ca",
          correct: false,
          why: "The sounds stay apart only if nothing pulls them together. Here c pulls the t to the palate.",
        },
        {
          text: "tac ca",
          correct: true,
          why: "Yes — the t moves to the palate to match c, so the mouth only moves once.",
        },
        {
          text: "tad ca",
          correct: false,
          why: "d is still made at the teeth. The t has to move to the palate, where c lives.",
        },
        {
          text: "tap ca",
          correct: false,
          why: "p is made with the lips — the opposite end of the mouth from the palate.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-build",
      type: "tiles",
      guided: true,
      prompt: "Build the joined form of {तत्|tat} + {च|ca}. Tap the pieces in order.",
      hint: "First piece: the word after its last letter has changed. Second piece: ca.",
      tiles: ["{तत्|tat}", "{तच्|tac}", "{च|ca}", "{तट्|taṭ}"],
      answer: ["{तच्|tac}", "{च|ca}"],
      why: "tac + ca: the final t has become c, then ca follows.",
    },
    {
      kind: "exercise",
      id: "q-jayati",
      type: "choice",
      reviewItem: true,
      prompt: "{तत्|tat} + {जयति|jayati} (“wins”) → ?",
      options: [
        {
          text: "tat jayati",
          correct: false,
          why: "j is a palate sound, just like c, so it pulls the t toward the palate as well.",
        },
        {
          text: "taj jayati",
          correct: true,
          why: "Right. The t becomes a copy of the next sound — here j.",
        },
        {
          text: "tac jayati",
          correct: false,
          why: "Close! The t moves to the palate, but it copies the next sound exactly: j, not c.",
        },
        {
          text: "tad jayati",
          correct: false,
          why: "d stays at the teeth. The t has to move to the palate.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each following sound with what the final t of {तत्|tat} becomes.",
      pairs: [
        ["{च|ca}", "{च्|c}"],
        ["{ट|ṭa}", "{ट्|ṭ}"],
        ["{ल|la}", "{ल्|l}"],
        ["{क|ka}", "stays {त्|t}"],
      ],
    },
    {
      kind: "exercise",
      id: "q-why",
      type: "choice",
      prompt: "Why does the t of {तत्|tat} become c in {तच्च|tac ca}?",
      options: [
        {
          text: "c is simply a better letter than t",
          correct: false,
          why: "No letter is “better”. This is about where in the mouth the sounds are made.",
        },
        {
          text: "The mouth moves to the next sound's place once, instead of twice",
          correct: true,
          why: "Exactly. Neighbouring sounds settle on one place — that is the idea behind this kind of sandhi.",
        },
        {
          text: "The meaning of the word changes before ca",
          correct: false,
          why: "The meaning stays the same; only the sound changes.",
        },
        {
          text: "It is random and has to be memorised",
          correct: false,
          why: "It feels random at first, but it follows a pattern in how the mouth works.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "q-karoti",
      type: "choice",
      reviewItem: true,
      prompt: "{तत्|tat} + {करोति|karoti} (“does”) → ?",
      options: [
        {
          text: "tac karoti",
          correct: false,
          why: "k is made at the back of the mouth, not at the palate, so nothing pulls the t toward c.",
        },
        {
          text: "tat karoti",
          correct: true,
          why: "Right — k is not one of the sounds that triggers this change, so the t stays.",
        },
        {
          text: "tak karoti",
          correct: false,
          why: "Today's pattern only copies c, j, ṭ and l. It does not copy k.",
        },
        {
          text: "tad karoti",
          correct: false,
          why: "d is a voiced sound; k is unvoiced, so there is no reason for the t to become voiced. (Voicing is a later lesson.)",
        },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "A final **t** copies the next sound when that sound is c, j, ṭ or l: *tat + ca = tac ca*.",
      example: { dev: "तत् + च = तच्च", iast: "tat + ca = tac ca" },
    },
  ],
};
