import type { Lesson } from "../lib/schema";

export const lesson: Lesson = {
  number: 9,
  title: "Sort the letters by place",
  concept: "places-of-articulation",
  teaser:
    "ग, छ, ड, ध, भ: five letters you may never have met. Can you tell where each one lives in the mouth?",
  rhythm: "recognize",
  minutes: 5,
  prerequisites: [8],
  credits: ["Draft written with Claude; awaiting review"],
  reviewed: false,
  sources: [
    "Same vargas as lesson 8. Week 1 words are used so learners can place sounds they already say",
  ],
  steps: [
    {
      kind: "explain",
      id: "hook",
      title: "Four more in every row",
      body: [
        "Yesterday you met the first letter of each row. But every row has **five** letters, and they all live at the same place.",
        "That gives you a very useful trick: to place a new letter, you only need to know **which row it belongs to**. If {ग|ga} is in the {क|ka} row, it is made at the back of the mouth, just like {क|ka}.",
      ].join("\n"),
    },
    {
      kind: "demo",
      id: "place-chart",
      title: "Look at the whole row",
      widget: "place-chart",
      prompt: "Tap three places, and this time look at all five letters in each row, not just the first.",
      requiredInteractions: 3,
    },
    {
      kind: "exercise",
      id: "q-ga",
      type: "choice",
      guided: true,
      prompt: "Where is {ग|ga} made?",
      hint: "{ग|ga} sits in the same row as {क|ka}.",
      options: [
        { text: "The back of the mouth", correct: true, why: "Yes. {ग|ga} is in the {क|ka} row, so it is made in the same place as {क|ka}." },
        { text: "The lips", correct: false, why: "The lips belong to the {प|pa} row ({प|pa}, {फ|pha}, {ब|ba}, {भ|bha}, {म|ma})." },
        { text: "The teeth", correct: false, why: "The teeth belong to the {त|ta} row. {ग|ga} sits with {क|ka}." },
        { text: "The palate", correct: false, why: "The palate belongs to the {च|ca} row. {ग|ga} sits with {क|ka}." },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      reviewItem: true,
      prompt: "Match each letter with the place where it is made.",
      pairs: [
        ["{ग|ga}", "back of the mouth"],
        ["{छ|cha}", "palate"],
        ["{ड|ḍa}", "roof of the mouth"],
        ["{ध|dha}", "teeth"],
        ["{भ|bha}", "lips"],
      ],
      why: "Each of these belongs to a row you know: {क|ka}, {च|ca}, {ट|ṭa}, {त|ta} and {प|pa}.",
    },
    {
      kind: "exercise",
      id: "q-odd",
      type: "choice",
      prompt: "Three of these letters are made at the palate. Which one is the odd one out?",
      options: [
        { text: "{च|ca}", correct: false, why: "{च|ca} is made at the palate." },
        { text: "{ज|ja}", correct: false, why: "{ज|ja} is made at the palate." },
        { text: "{ञ|ña}", correct: false, why: "{ञ|ña} is made at the palate." },
        { text: "{द|da}", correct: true, why: "Yes. {द|da} is in the {त|ta} row, so it is made at the teeth." },
      ],
    },
    {
      kind: "exercise",
      id: "q-words",
      type: "match",
      reviewItem: true,
      prompt: "You already know these words. Match each one with the place where its first consonant is made.",
      pairs: [
        ["{जलं|jalaṃ}", "palate"],
        ["{गच्छामि|gacchāmi}", "back of the mouth"],
        ["{देवालयं|devālayaṃ}", "teeth"],
        ["{मम|mama}", "lips"],
      ],
      why: "{ज|ja} is in the palate row, {ग|ga} at the back, {द|da} at the teeth, {म|ma} at the lips.",
    },
    {
      kind: "exercise",
      id: "q-patha",
      type: "choice",
      prompt: "The middle consonant of {पठामि|paṭhāmi} is {ठ|ṭha}. Where is it made?",
      options: [
        { text: "The teeth", correct: false, why: "That is {थ|tha}, a different letter that looks a little similar. {ठ|ṭha} is the one in {पठामि|paṭhāmi}." },
        { text: "The roof of the mouth", correct: true, why: "Yes. {ठ|ṭha} is in the {ट|ṭa} row, so the tongue tip curls back to the roof of the mouth." },
        { text: "The lips", correct: false, why: "The first letter of {पठामि|paṭhāmi} is a lip sound, but the middle one, {ठ|ṭha}, is not." },
        { text: "The palate", correct: false, why: "The palate is for the {च|ca} row. {ठ|ṭha} sits in the {ट|ṭa} row." },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      rule: "Every letter in a row is made at the same place, so to place a new letter, find its row: {ग|ga} is with {क|ka} (back), {छ|cha} with {च|ca} (palate), {ड|ḍa} with {ट|ṭa} (roof), {ध|dha} with {त|ta} (teeth), {भ|bha} with {प|pa} (lips).",
    },
  ],
};
