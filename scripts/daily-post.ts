/**
 * Prints ready-to-paste LinkedIn and WhatsApp posts for a lesson.
 *
 *   npm run post -- 3        one lesson
 *   npm run post -- all      every lesson written so far
 *
 * The link comes from SITE_URL (or schedule.json "siteUrl"). Edit the templates below to taste.
 */
import { loadLessons, readSchedule, siteUrl } from "./lib";

const arg = process.argv[2] ?? "";
const schedule = readSchedule();
const site = siteUrl(schedule) || "https://YOUR-SITE-URL/";
const lessons = await loadLessons();

const selected = arg === "all" ? lessons : lessons.filter((l) => String(l.number) === arg);
if (selected.length === 0) {
  console.error('Usage: npm run post -- <lesson number | all>');
  process.exit(1);
}

for (const l of selected) {
  const url = `${site}d/${l.number}/`;
  console.log(`\n${"=".repeat(60)}\nLESSON ${l.number} — ${l.title}\n${"=".repeat(60)}`);
  console.log(`\n--- LinkedIn ---\n`);
  console.log(
    [
      `🪔 Sanskrit Daily · Lesson ${l.number}`,
      ``,
      l.teaser,
      ``,
      `Today's lesson takes about ${l.minutes} minutes. Free, no login, no ads — it works in your browser.`,
      ``,
      `👉 ${url}`,
      ``,
      `New lesson every day. #Sanskrit #LearnSanskrit #LanguageLearning #IndianLanguages`,
    ].join("\n"),
  );
  console.log(`\n--- WhatsApp ---\n`);
  console.log([`🪔 *Sanskrit Daily #${l.number}*`, l.teaser, `${l.minutes} min, free, no login 👉 ${url}`].join("\n"));
}
