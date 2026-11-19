import type { Week } from "../lib/schema";

/**
 * Week 1 check — lessons 1–7. Only words and patterns taught in those lessons appear here (a test enforces it).
 * Questions are a little more demanding than the daily ones: translate, build, spot the mistake, pick the odd one out.
 */
export const week: Week = {
  number: 1,
  title: "Week 1 check",
  reviewed: false,
  credits: ["Draft written with Claude — awaiting review by the project owner"],
  next: "Next week: where each Sanskrit sound is made in your mouth — and why words change shape when they join.",
  questions: [
    {
      kind: "exercise",
      id: "q-sorry",
      type: "choice",
      prompt: "You bump into someone by accident. Which word says sorry?",
      options: [
        { text: "{धन्यवादाः|dhanyavādāḥ}", correct: false, why: "That is “thank you”." },
        { text: "{क्षम्यताम्|kṣamyatām}", correct: true, why: "Yes — {क्षम्यताम्|kṣamyatām} is an apology." },
        { text: "{स्वागतम्|svāgatam}", correct: false, why: "That is “welcome”." },
        { text: "{कृपया|kṛpayā}", correct: false, why: "That is “please”." },
      ],
    },
    {
      kind: "exercise",
      id: "q-name-woman",
      type: "choice",
      prompt: "Which one asks a woman her name?",
      options: [
        { text: "{भवतः नाम किम्|bhavataḥ nāma kim}", correct: false, why: "{भवतः|bhavataḥ} is the “your” for a man." },
        { text: "{भवत्याः नाम किम्|bhavatyāḥ nāma kim}", correct: true, why: "Yes — {भवत्याः|bhavatyāḥ} is “your” for a woman." },
        { text: "{मम नाम किम्|mama nāma kim}", correct: false, why: "{मम|mama} means “my”, so this asks about your own name." },
        { text: "{भवती नाम किम्|bhavatī nāma kim}", correct: false, why: "{भवती|bhavatī} is “you”, not “your”. To ask someone's name you need “your”." },
      ],
    },
    {
      kind: "exercise",
      id: "q-meaning",
      type: "choice",
      prompt: "What does {भवान् किं पिबति|bhavān kiṃ pibati} ask?",
      options: [
        { text: "What are you drinking?", correct: true, why: "Yes — {भवान्|bhavān} (you) + {किं|kiṃ} (what) + {पिबति|pibati} (drink)." },
        { text: "What am I drinking?", correct: false, why: "“I” would be {अहं|ahaṃ}, with a verb ending in -मि." },
        { text: "What are you reading?", correct: false, why: "Reading is {पठति|paṭhati}. This verb means drinking." },
        { text: "I am drinking water.", correct: false, why: "That is an answer. This is a question: it has {किं|kiṃ}, “what”." },
      ],
    },
    {
      kind: "exercise",
      id: "q-build-woman",
      type: "tiles",
      prompt: "Say “What are you doing?” to a woman.",
      tiles: ["{भवती|bhavatī}", "{किं|kiṃ}", "{करोति|karoti}", "{करोमि|karomi}", "{भवान्|bhavān}"],
      answer: ["{भवती|bhavatī}", "{किं|kiṃ}", "{करोति|karoti}"],
      why: "{भवती|bhavatī} for a woman, and the verb stays {करोति|karoti}.",
    },
    {
      kind: "exercise",
      id: "q-not-i",
      type: "choice",
      prompt: "Which one is NOT an “I” form?",
      options: [
        { text: "{पठामि|paṭhāmi}", correct: false, why: "That is an “I” form: it ends in -मि." },
        { text: "{गच्छामि|gacchāmi}", correct: false, why: "That is an “I” form: it ends in -मि." },
        { text: "{करोति|karoti}", correct: true, why: "Right — it ends in -ति, the “you” form, not the “I” form." },
        { text: "{करोमि|karomi}", correct: false, why: "That is an “I” form: it ends in -मि." },
      ],
    },
    {
      kind: "exercise",
      id: "q-mistake",
      type: "choice",
      prompt: "One of these sentences has a mistake. Which one?",
      options: [
        { text: "{भवान् किं करोति|bhavān kiṃ karoti}", correct: false, why: "This one is fine." },
        { text: "{अहं जलं पिबामि|ahaṃ jalaṃ pibāmi}", correct: false, why: "This one is fine." },
        { text: "{अहं पुस्तकं पठति|ahaṃ pustakaṃ paṭhati}", correct: true, why: "Yes — with {अहं|ahaṃ} (I) the verb must end in -मि: {पठामि|paṭhāmi}." },
        { text: "{मम नाम सीता|mama nāma sītā}", correct: false, why: "This one is fine." },
      ],
    },
    {
      kind: "exercise",
      id: "q-temple",
      type: "tiles",
      prompt: "Say “I go to the temple.”",
      tiles: ["{अहं|ahaṃ}", "{देवालयं|devālayaṃ}", "{गच्छामि|gacchāmi}", "{गच्छति|gacchati}", "{देवालय|devālaya}"],
      answer: ["{अहं|ahaṃ}", "{देवालयं|devālayaṃ}", "{गच्छामि|gacchāmi}"],
      why: "{अहं|ahaṃ} (I) + {देवालयं|devālayaṃ} (the place I go to, with its -ṃ) + {गच्छामि|gacchāmi} (I go).",
    },
    {
      kind: "exercise",
      id: "q-fits",
      type: "choice",
      prompt: "Which answer fits the question {भवान् किं पठति|bhavān kiṃ paṭhati}?",
      options: [
        { text: "{अहं पुस्तकं पठति|ahaṃ pustakaṃ paṭhati}", correct: false, why: "Right words, but with {अहं|ahaṃ} (I) the verb must end in -मि." },
        { text: "{अहं पुस्तकं पठामि|ahaṃ pustakaṃ paṭhāmi}", correct: true, why: "Yes — “I am reading a book.”" },
        { text: "{अहं जलं पिबामि|ahaṃ jalaṃ pibāmi}", correct: false, why: "That answers a question about drinking." },
        { text: "{मम नाम सीता|mama nāma sītā}", correct: false, why: "That answers a question about a name." },
      ],
    },
    {
      kind: "exercise",
      id: "q-match",
      type: "match",
      prompt: "Match each sentence with its meaning.",
      pairs: [
        ["{अहं जलं पिबामि|ahaṃ jalaṃ pibāmi}", "I drink water"],
        ["{मम नाम रामः|mama nāma rāmaḥ}", "My name is Rāma"],
        ["{भवती किं पठति|bhavatī kiṃ paṭhati}", "What are you reading? (to a woman)"],
        ["{अहं भोजनं करोमि|ahaṃ bhojanaṃ karomi}", "I am having a meal"],
        ["{भवत्याः नाम किम्|bhavatyāḥ nāma kim}", "What is your name? (to a woman)"],
      ],
      why: "Five whole sentences — a week ago none of these meant anything.",
    },
    {
      kind: "exercise",
      id: "q-intro",
      type: "tiles",
      prompt: "Say two things in a row: “My name is Rāma. I am reading a book.”",
      tiles: [
        "{मम|mama}",
        "{नाम|nāma}",
        "{रामः|rāmaḥ}",
        "{अहं|ahaṃ}",
        "{पुस्तकं|pustakaṃ}",
        "{पठामि|paṭhāmi}",
        "{अस्ति|asti}",
        "{पठति|paṭhati}",
      ],
      answer: [
        "{मम|mama}",
        "{नाम|nāma}",
        "{रामः|rāmaḥ}",
        "{अहं|ahaṃ}",
        "{पुस्तकं|pustakaṃ}",
        "{पठामि|paṭhāmi}",
      ],
      why: "No “is” needed in the first sentence, and the -मि verb goes with {अहं|ahaṃ} in the second.",
    },
  ],
};
