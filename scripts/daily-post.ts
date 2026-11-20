/**
 * Prints ready-to-paste LinkedIn and WhatsApp posts for a lesson.
 *
 *   npm run post -- today    today's lesson (the one that opened at 6:00 AM IST)
 *   npm run post -- 3        one lesson
 *   npm run post -- all      every lesson written so far
 *
 * The link comes from SITE_URL (or schedule.json "siteUrl"). Edit the templates below to taste.
 */
import { dayNumber, scheduleISO } from "../src/lib/date";
import { linkedinPost, loadLessons, readSchedule, siteUrl, whatsappPost } from "./lib";

const arg = process.argv[2] ?? "";
const schedule = readSchedule();
const site = siteUrl(schedule) || "https://YOUR-SITE-URL/";
const lessons = await loadLessons();

const wanted =
  arg === "today" && schedule.launchDate
    ? String(dayNumber(scheduleISO(new Date(), schedule.unlockHourIST), schedule.launchDate))
    : arg;
const selected = arg === "all" ? lessons : lessons.filter((l) => String(l.number) === wanted);
if (selected.length === 0) {
  console.error('Usage: npm run post -- <lesson number | today | all>');
  process.exit(1);
}

for (const l of selected) {
  const url = `${site}d/${l.number}/`;
  console.log(`\n${"=".repeat(60)}\nLESSON ${l.number} — ${l.title}\n${"=".repeat(60)}`);
  console.log(`\n--- LinkedIn ---\n`);
  console.log(linkedinPost(l, url));
  console.log(`\n--- WhatsApp ---\n`);
  console.log(whatsappPost(l, url));
}
