import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 8,
  title: "Where in your mouth is each sound made?",
  concept: "places-of-articulation",
  teaser:
    "Say क, च, ट, त, प one after another. Feel your tongue travel from the back of your mouth to your lips.",
  rhythm: "new",
  minutes: 6,
  prerequisites: [],
  credits: ["Draft written with Claude; awaiting review"],
  reviewed: false,
  sources: [
    "The traditional arrangement of consonants into five vargas by place of articulation (sthāna), as taught in every Sanskrit primer; terminology and the wording of each place need a reviewer's check",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "Say five sounds",
      body: [
        "Say these five sounds slowly, one after another: {क|ka}, {च|ca}, {ट|ṭa}, {त|ta}, {प|pa}.",
        "Notice where your tongue is each time. It starts at the **back** of your mouth, moves forward step by step, and the last sound is made with your **lips**.",
        "Sanskrit's alphabet is organised by exactly this journey.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "place-chart",
      title: "The five places",
      widget: "place-chart",
      prompt: "Tap all five places. For each one, say the first letter slowly and feel where your tongue or lips touch.",
      requiredInteractions: 5,
    },
    {
      kind: "explain",
      id: "rows",
      title: "Five rows, one place each",
      body: [
        "The main consonants of Sanskrit sit in a chart of **five rows**. Every sound in a row is made at the **same place** in the mouth.",
        "A row is called a **varga** (“group”), and it is named after its first letter: the {क|ka} row, the {च|ca} row, the {ट|ṭa} row, the {त|ta} row and the {प|pa} row.",
        "Going from the back of the mouth to the front, the order is always the same: back, palate, roof, teeth, lips.",
      ].join("\n"),
      callout: {
        tone: "caution",
        text: "These five rows hold 25 consonants. Sanskrit has a few more ({य|ya}, {र|ra}, {ल|la}, {व|va}, {श|śa}, {ष|ṣa}, {स|sa}, {ह|ha}) that do not sit in these rows. We will meet them later; today is only about the five rows.",
      },
    },
    {
      kind: "exercise",
      id: "q-lips",
      type: "choice",
      guided: true,
      prompt: "Which place do you use to say {प|pa}?",
      hint: "Close your mouth and say pa. What touches?",
      options: [
        { text: "The back of the mouth", correct: false, why: "That is where {क|ka} lives. For {प|pa} the tongue does not need to move at all." },
        { text: "The lips", correct: true, why: "Yes. {प|pa} is made by pressing both lips together." },
        { text: "The teeth", correct: false, why: "The teeth are for {त|ta}: the tongue tip touches them. {प|pa} does not use the tongue." },
        { text: "The palate", correct: false, why: "The palate is for {च|ca}. Try saying pa and notice that your tongue stays still." },
      ],
    },
    {
      kind: "exercise",
      id: "q-teeth",
      type: "choice",
      reviewItem: true,
      prompt: "Which of these sounds is made with the tongue tip against the teeth?",
      options: [
        { text: "{क|ka}", correct: false, why: "{क|ka} is made at the back of the mouth, far from the teeth." },
        { text: "{ट|ṭa}", correct: false, why: "{ट|ṭa} is close, but the tongue tip curls back to the roof of the mouth, behind the teeth." },
        { text: "{त|ta}", correct: true, why: "Yes. For {त|ta} the tongue tip touches the back of the upper teeth." },
        { text: "{प|pa}", correct: false, why: "{प|pa} uses the lips, not the tongue." },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      reviewItem: true,
      prompt: "Match each letter with the place where it is made.",
      pairs: [
        ["{क|ka}", "back of the mouth"],
        ["{च|ca}", "palate"],
        ["{ट|ṭa}", "roof of the mouth"],
        ["{त|ta}", "teeth"],
        ["{प|pa}", "lips"],
      ],
      why: "Back, palate, roof, teeth, lips: the same journey as saying them in a row.",
    },
    {
      kind: "exercise",
      id: "q-order",
      type: "choice",
      prompt: "Going from the back of the mouth to the lips, which order of first letters is right?",
      options: [
        { text: "{प|pa} {त|ta} {ट|ṭa} {च|ca} {क|ka}", correct: false, why: "That order goes the other way, from the lips to the back." },
        { text: "{क|ka} {च|ca} {ट|ṭa} {त|ta} {प|pa}", correct: true, why: "Yes. Back, palate, roof, teeth, lips." },
        { text: "{क|ka} {ट|ṭa} {च|ca} {त|ta} {प|pa}", correct: false, why: "Close. The palate ({च|ca}) comes before the roof ({ट|ṭa}) on the way forward." },
        { text: "{त|ta} {प|pa} {क|ka} {च|ca} {ट|ṭa}", correct: false, why: "The places follow one smooth journey; they are not mixed up." },
      ],
    },
    {
      kind: "exercise",
      id: "q-why",
      type: "choice",
      prompt: "Why are the consonants arranged in rows like this?",
      options: [
        { text: "By how common each letter is", correct: false, why: "The chart does not count how often letters are used. It follows how the mouth makes them." },
        { text: "By the place in the mouth where each sound is made", correct: true, why: "Exactly. The alphabet follows the mouth: one row for each place." },
        { text: "In no particular order", correct: false, why: "It looks arbitrary at first, but the order is very deliberate." },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "Consonants sit in five rows by where they are made: back ({क|ka}), palate ({च|ca}), roof ({ट|ṭa}), teeth ({त|ta}), lips ({प|pa}).",
      example: { dev: "क च ट त प", iast: "ka ca ṭa ta pa" },
    },
  ],
};
