import type { ReminderOptions } from "./calendar";

/** Wording of the calendar entry. English only: it is written into the learner's own calendar. */
export const REMINDER_TITLE = "🪔 Dine Dine — today's Sanskrit lesson";
export const REMINDER_NOTE = "One small Sanskrit lesson, about 5 minutes. Free, no login.";

export const reminderOptions = (startDate: string, hourIST: number, url: string): ReminderOptions => ({
  startDate,
  hourIST,
  url,
  title: REMINDER_TITLE,
  note: REMINDER_NOTE,
});
