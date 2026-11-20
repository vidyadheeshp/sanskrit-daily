# Daily routine: reminders and WhatsApp

Two ways learners hear about each new lesson. Neither needs a server, an account or any personal data.

## 1. Calendar reminder (automatic for the learner)

A repeating calendar entry at **6:00 AM IST** (the unlock time), shown in the learner's own time zone.

- **Add to my calendar** downloads `dine-dine-daily.ics` (written into the site by `scripts/build-calendar.ts` on every build). Opening it in Google, Apple or Outlook Calendar adds a daily entry with an alarm at the start time.
- **Add to Google Calendar** opens a pre-filled "new event" page on Google, already set to repeat daily.
- Both are in **Settings** and at the end of every lesson.
- The entry lives in the learner's calendar app. We never see who added it, and deleting the entry stops it.
- The file starts on the day of the build (or the launch date if that is later), so nobody gets reminders for days before they joined. Its `UID` is fixed, so importing a newer copy updates the entry instead of duplicating it.
- Wording: `src/lib/reminder.ts` (English only, because it is written into the learner's own calendar).

## 2. WhatsApp (you post, once a day, about one minute)

WhatsApp has no safe, official way to post automatically from a script, so this part stays manual. Use a **WhatsApp Channel** (one-way, followers cannot see each other's numbers) rather than a group.

One-time set-up (in the WhatsApp phone app): *Updates* tab -> *+* -> *New channel* -> name it "Dine Dine · Sanskrit Daily", add the logo, then copy the channel link and put it wherever you share the site.

Every morning after 6:00 AM IST (the deploy has finished by then):

```
npm run post -- today
```

Copy the block under `--- WhatsApp ---` into the channel. The link inside is the lesson's share page, which shows a proper preview card in WhatsApp. Other options: `npm run post -- 5` (a specific lesson) or `npm run post -- all`.

Tip: schedule the post in your phone's reminders for 6:15 AM so it becomes a habit.
