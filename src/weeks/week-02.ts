import type { Week } from "../lib/schema";

/**
 * Week 2 check — lessons 8–14: places of articulation, the five vargas, and the first consonant sandhi (final t).
 * Only words and letters taught in those lessons appear here (a test enforces it).
 */
export const week: Week = {
  number: 2,
  title: "Week 2 check",
  reviewed: false,
  credits: ["Draft written with Claude; awaiting review"],
  next: "Next week: asking “where?”, the difference between buzzing and plain sounds, and more joining of words.",
  questions: [
    {
      kind: "exercise",
      id: "q-lips",
      type: "choice",
      prompt: "Which of these letters is made with the lips?",
      options: [
        { text: "{ग|ga}", correct: false, why: "{ग|ga} is in the {क|ka} row: the back of the mouth." },
        { text: "{ज|ja}", correct: false, why: "{ज|ja} is in the {च|ca} row: the palate." },
        { text: "{ध|dha}", correct: false, why: "{ध|dha} is in the {त|ta} row: the teeth." },
        { text: "{भ|bha}", correct: true, why: "Yes — {भ|bha} is in the {प|pa} row, made with the lips." },
      ],
    },
    {
      kind: "exercise",
      id: "q-odd",
      type: "choice",
      prompt: "Three of these letters are made at the roof of the mouth. Which one is the odd one out?",
      options: [
        { text: "{ट|ṭa}", correct: false, why: "{ट|ṭa} is made at the roof of the mouth." },
        { text: "{ठ|ṭha}", correct: false, why: "{ठ|ṭha} is in the {ट|ṭa} row: the roof of the mouth." },
        { text: "{ण|ṇa}", correct: false, why: "{ण|ṇa} is the nasal of the {ट|ṭa} row: the roof of the mouth." },
        { text: "{थ|tha}", correct: true, why: "Yes — {थ|tha} is in the {त|ta} row, so it is made at the teeth." },
      ],
    },
    {
      kind: "exercise",
      id: "q-places",
      type: "match",
      prompt: "Match each letter with the place where it is made.",
      pairs: [
        ["{ख|kha}", "back of the mouth"],
        ["{छ|cha}", "palate"],
        ["{ठ|ṭha}", "roof of the mouth"],
        ["{द|da}", "teeth"],
        ["{ब|ba}", "lips"],
      ],
      why: "Find each letter's row first: {क|ka}, {च|ca}, {ट|ṭa}, {त|ta}, {प|pa}.",
    },
    {
      kind: "exercise",
      id: "q-ca-row",
      type: "tiles",
      prompt: "Build the {च|ca} row (the palate), in order.",
      tiles: ["{च|ca}", "{छ|cha}", "{ज|ja}", "{झ|jha}", "{ञ|ña}", "{ट|ṭa}"],
      answer: ["{च|ca}", "{छ|cha}", "{ज|ja}", "{झ|jha}", "{ञ|ña}"],
      why: "Plain, puff, buzz, buzz with a puff, nasal. {ट|ṭa} starts the next row.",
    },
    {
      kind: "exercise",
      id: "q-nasals",
      type: "match",
      prompt: "Every row ends with a nasal. Match each row with its last letter.",
      pairs: [
        ["{कवर्ग|kavarga}", "{ङ|ṅa}"],
        ["{चवर्ग|cavarga}", "{ञ|ña}"],
        ["{तवर्ग|tavarga}", "{न|na}"],
        ["{पवर्ग|pavarga}", "{म|ma}"],
      ],
      why: "The fifth letter of each row is the nasal made at that row's place.",
    },
    {
      kind: "exercise",
      id: "q-fourth",
      type: "choice",
      prompt: "Which letter is the fourth in the {प|pa} row (buzzing, with a puff of breath)?",
      options: [
        { text: "{फ|pha}", correct: false, why: "{फ|pha} is the second letter: {प|pa} with a puff of breath." },
        { text: "{ब|ba}", correct: false, why: "{ब|ba} is the third letter: buzzing, without the puff." },
        { text: "{भ|bha}", correct: true, why: "Yes. {प|pa} {फ|pha} {ब|ba} {भ|bha}: the fourth letter is {भ|bha}." },
        { text: "{म|ma}", correct: false, why: "{म|ma} is the fifth letter, the nasal." },
      ],
    },
    {
      kind: "exercise",
      id: "q-tac-ca",
      type: "choice",
      prompt: "{तत्|tat} + {च|ca} → ?",
      options: [
        { text: "tat ca", correct: false, why: "c is a palate sound and pulls the final t toward the palate, so it changes." },
        { text: "tac ca", correct: true, why: "Yes — the final t becomes a copy of the c that follows." },
        { text: "tap ca", correct: false, why: "p is a lip sound: the opposite end of the mouth from the palate." },
        { text: "tad ca", correct: false, why: "d is still made at the teeth. The t has to move to the palate." },
      ],
    },
    {
      kind: "exercise",
      id: "q-build-tal",
      type: "tiles",
      prompt: "Build {तत्|tat} + {लभते|labhate} (“gets”). Tap the pieces in order.",
      tiles: ["{तल्|tal}", "{लभते|labhate}", "{तत्|tat}", "{तच्|tac}"],
      answer: ["{तल्|tal}", "{लभते|labhate}"],
      why: "tal + labhate: the final t copied the l.",
    },
    {
      kind: "exercise",
      id: "q-stays",
      type: "choice",
      prompt: "In which of these does the final t of {तत्|tat} stay as it is?",
      options: [
        { text: "{तत् + च|tat + ca}", correct: false, why: "c pulls the t, giving {तच्च|tac ca}." },
        { text: "{तत् + जयति|tat + jayati}", correct: false, why: "j pulls the t, giving {तज्जयति|taj jayati}." },
        { text: "{तत् + पठति|tat + paṭhati}", correct: true, why: "Yes. p is not one of c, j, ṭ, l, so nothing pulls the t." },
        { text: "{तत् + लभते|tat + labhate}", correct: false, why: "l pulls the t, giving {तल्लभते|tal labhate}." },
      ],
    },
    {
      kind: "exercise",
      id: "q-mistake",
      type: "choice",
      prompt: "One of these joinings has a mistake. Which one?",
      options: [
        { text: "{तच् च|tac ca}", correct: false, why: "This one is fine: the t copied the c." },
        { text: "{तज् जयति|taj jayati}", correct: false, why: "This one is fine: the t copied the j." },
        { text: "{तल् लभते|tal labhate}", correct: false, why: "This one is fine: the t copied the l." },
        { text: "{तच् करोति|tac karoti}", correct: true, why: "Yes — k is not one of c, j, ṭ, l, so the t stays: {तत् करोति|tat karoti}." },
      ],
    },
    {
      kind: "exercise",
      id: "q-sentence",
      type: "tiles",
      prompt: "Back to week 1. Say “I drink water.”",
      tiles: ["{अहं|ahaṃ}", "{जलं|jalaṃ}", "{पिबामि|pibāmi}", "{पिबति|pibati}", "{जल|jala}"],
      answer: ["{अहं|ahaṃ}", "{जलं|jalaṃ}", "{पिबामि|pibāmi}"],
      why: "{अहं|ahaṃ} (I) + {जलं|jalaṃ} (water, with its -ṃ) + {पिबामि|pibāmi} (I drink).",
    },
  ],
};
