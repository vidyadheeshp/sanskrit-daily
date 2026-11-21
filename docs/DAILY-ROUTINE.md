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

Every morning the deploy sends the text to you, so there is nothing to run:

1. At 6:00 AM IST the daily deploy publishes the lesson. When the site is live, a final step (`notify` in `.github/workflows/deploy.yml`, text from `scripts/post-issue.ts`) opens a GitHub issue titled "Post today's lesson: #N ...", assigned to the repository owner, and closes it again straight away to keep the list tidy.
2. GitHub **emails** you the issue, with the WhatsApp text (and an optional LinkedIn text) in code blocks. The GitHub mobile app also gives a push notification if you install it and leave notifications on.
3. Open it on your phone, tap the copy button on the WhatsApp block, and paste it into the channel. About 30 seconds.

It uses GitHub's own token, so there are no extra accounts, passwords or secrets. It runs only on the daily schedule and on "Run workflow" (a handy way to test it), never on ordinary pushes. Nothing is posted anywhere for you.

If the email does not arrive: check the issue exists under the repository's *Issues* tab (Issues must be enabled), that your GitHub notification settings send email, and the spam folder. Mail comes from GitHub's notifications address.

Manual fallback: `npm run post -- today` prints the same text; `npm run post -- 5` or `-- all` for other lessons.

## People who arrive late

Lessons build on each other, but a shared link lands on one day's lesson. So:

- **Today page:** someone with no lessons done, arriving after day 1, sees "New here? Start with Lesson 1". Someone who has skipped ahead sees "Your next lesson: N" (their first unfinished lesson) above today's. Anyone with progress sees "X of Y lessons done so far". There are still no streaks.
- **Lesson page:** if earlier lessons are not done, a note at the start says the lesson builds on them and offers the first one they have not done ("Stay on this lesson" dismisses it).
- **Posts:** the WhatsApp and LinkedIn texts end with "New here? Start from Lesson 1: <link>". The link is the Lesson 1 share page, so it always has a preview.

Everything here is computed in the browser from the learner's own progress; nothing is sent anywhere. Tests: `src/catchup-ui.test.ts`.
