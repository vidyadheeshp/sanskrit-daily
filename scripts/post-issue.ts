/**
 * Used by the daily workflow, after the site is live. Writes today's ready-to-paste posts for the lesson
 * that opened at 6:00 AM IST to post.md (issue body) and post-title.txt (issue title), so GitHub can email
 * them to the owner. Writes nothing (and exits 0) if there is no lesson today, e.g. before launch.
 *
 * The WhatsApp and LinkedIn texts sit in code blocks: on GitHub (web and phone) each has a copy button.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { dayNumber, scheduleISO } from "../src/lib/date";
import { linkedinPost, loadLessons, readSchedule, root, siteUrl, whatsappPost } from "./lib";

const schedule = readSchedule();
const site = siteUrl(schedule);
if (!schedule.launchDate || !site) {
  console.log("[post-issue] no launch date or site URL; nothing to post.");
  process.exit(0);
}

const n = dayNumber(scheduleISO(new Date(), schedule.unlockHourIST), schedule.launchDate);
const lesson = (await loadLessons()).find((l) => l.number === n);
if (!lesson) {
  console.log(`[post-issue] no lesson for day ${n}; nothing to post.`);
  process.exit(0);
}

const url = `${site}d/${lesson.number}/`;
const fence = "```";
const body = [
  `Lesson ${lesson.number} is live: **${lesson.title}**  `,
  `${url}`,
  ``,
  `### WhatsApp channel (copy and paste)`,
  ``,
  fence,
  whatsappPost(lesson, url, `${site}d/1/`),
  fence,
  ``,
  `### LinkedIn (optional)`,
  ``,
  fence,
  linkedinPost(lesson, url, `${site}d/1/`),
  fence,
  ``,
  `_Sent automatically by the daily deploy. Nothing is posted anywhere for you._`,
  ``,
].join("\n");

writeFileSync(join(root, "post.md"), body);
writeFileSync(join(root, "post-title.txt"), `Post today's lesson: #${lesson.number} ${lesson.title}`);
console.log(`[post-issue] wrote post.md for lesson ${lesson.number}`);
