import { describe, it, expect } from "vitest";
import { fold, googleCalendarUrl, reminderIcs, utcStamp } from "./calendar";
import { reminderOptions } from "./reminder";

const opts = reminderOptions("2026-11-19", 6, "https://example.github.io/sanskrit-daily/");

describe("calendar reminder", () => {
  it("6:00 AM IST is 00:30 UTC the same day", () => {
    expect(utcStamp("2026-11-19", 6)).toBe("20261119T003000Z");
    expect(utcStamp("2026-11-19", 6, 15)).toBe("20261119T004500Z");
  });

  it("an hour before 5:30 AM IST rolls back to the previous UTC day", () => {
    expect(utcStamp("2026-11-19", 5)).toBe("20261118T233000Z");
  });

  it("is a valid repeating daily event with a reminder at the start time", () => {
    const ics = reminderIcs(opts);
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART:20261119T003000Z");
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics).toContain("TRIGGER:PT0M");
    expect(ics).toContain("https://example.github.io/sanskrit-daily/");
    expect(ics.split("BEGIN:VEVENT")).toHaveLength(2);
  });

  it("uses CRLF only, and no line is longer than 75 bytes", () => {
    const ics = reminderIcs(opts);
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
    for (const line of ics.split("\r\n")) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });

  it("folding never splits a character and unfolds back to the original", () => {
    const long = "SUMMARY:" + "🪔दिने ".repeat(30);
    const folded = fold(long);
    expect(folded.replace(/\r\n /g, "")).toBe(long);
    expect(folded).not.toContain("�");
  });

  it("escapes commas, semicolons and newlines in text", () => {
    const ics = reminderIcs({ ...opts, title: "a, b; c", note: "x\ny" });
    expect(ics).toContain("SUMMARY:a\\, b\\; c");
    expect(ics).toContain("DESCRIPTION:x\\ny");
  });

  it("the Google link repeats daily at the same time", () => {
    const u = new URL(googleCalendarUrl(opts));
    expect(u.hostname).toBe("calendar.google.com");
    expect(u.searchParams.get("recur")).toBe("RRULE:FREQ=DAILY");
    expect(u.searchParams.get("dates")).toBe("20261119T003000Z/20261119T004500Z");
  });

  it("collects nothing about the learner", () => {
    expect(reminderIcs(opts)).not.toMatch(/ATTENDEE|ORGANIZER/);
  });
});
