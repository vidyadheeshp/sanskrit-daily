/**
 * Runs after `vite build`. Writes dist/dine-dine-daily.ics: a calendar entry that repeats every day at the
 * unlock time (6:00 AM IST). Learners add it once; their calendar app then reminds them every day with no
 * server, no account and nothing sent to us. The file starts today (or the launch date, if later), so the
 * daily deploy keeps it fresh and nobody gets reminders for days before they joined.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { reminderIcs } from "../src/lib/calendar";
import { reminderOptions } from "../src/lib/reminder";
import { readSchedule, root, siteUrl, todayUTC } from "./lib";

const schedule = readSchedule();
const site = siteUrl(schedule) || "https://YOUR-SITE-URL/";
const start = schedule.launchDate && schedule.launchDate > todayUTC() ? schedule.launchDate : todayUTC();

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "dine-dine-daily.ics"), reminderIcs(reminderOptions(start, schedule.unlockHourIST, site)));
console.log(`[calendar] dist/dine-dine-daily.ics (repeats daily from ${start}, ${schedule.unlockHourIST}:00 IST)`);
