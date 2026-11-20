/**
 * Daily calendar reminder. Pure: builds the text of an .ics file (and a Google Calendar link) for a
 * repeating event at the lesson unlock time. Nothing is sent anywhere; the learner's own calendar app
 * does the reminding, in their own time zone (06:00 IST is shown as the local equivalent).
 */
import { IST_OFFSET_MINUTES } from "./date";

export interface ReminderOptions {
  /** First day of the repeating event, "YYYY-MM-DD" (an IST date). */
  startDate: string;
  /** Unlock hour in IST, 0-23. */
  hourIST: number;
  /** Where the event points: the site address, absolute. */
  url: string;
  /** Event title. */
  title: string;
  /** A short note shown in the event. */
  note: string;
  /** Minutes the event lasts. */
  minutes?: number;
}

/** "20261119T003000Z" — the UTC instant of `hourIST` o'clock on the IST date `startDate`. */
export function utcStamp(startDate: string, hourIST: number, plusMinutes = 0): string {
  const [y, m, d] = startDate.split("-").map(Number);
  const ms = Date.UTC(y, m - 1, d, hourIST, 0, 0) - IST_OFFSET_MINUTES * 60_000 + plusMinutes * 60_000;
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const escapeText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** RFC 5545 folding: lines of at most 75 octets, continuation lines start with one space. */
export function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > (out.length === 0 ? 75 : 74)) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export function reminderIcs(o: ReminderOptions): string {
  const minutes = o.minutes ?? 15;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dine Dine//Sanskrit Daily//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:daily-reminder@dine-dine",
    `DTSTAMP:${utcStamp(o.startDate, o.hourIST)}`,
    `DTSTART:${utcStamp(o.startDate, o.hourIST)}`,
    `DTEND:${utcStamp(o.startDate, o.hourIST, minutes)}`,
    "RRULE:FREQ=DAILY",
    `SUMMARY:${escapeText(o.title)}`,
    `DESCRIPTION:${escapeText(`${o.note}\n${o.url}`)}`,
    `URL:${o.url}`,
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(o.title)}`,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** One-tap "add to Google Calendar" link for the same repeating event. */
export function googleCalendarUrl(o: ReminderOptions): string {
  const minutes = o.minutes ?? 15;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: o.title,
    details: `${o.note}\n${o.url}`,
    dates: `${utcStamp(o.startDate, o.hourIST)}/${utcStamp(o.startDate, o.hourIST, minutes)}`,
    recur: "RRULE:FREQ=DAILY",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
