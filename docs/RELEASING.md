# Releasing — how new lessons go live

## The model in one paragraph

Lessons are files `src/lessons/day-NNN.ts`. Lesson **N** unlocks on `launchDate + (N − 1)` days.
Two layers enforce this:

1. **The build** (runs automatically every day) ships only lessons up to *today + 2 days*. Anything
   later is replaced by an empty stub, so unreleased lessons are **not in the website's code at all**.
2. **The app** unlocks lesson N at **12:00 AM IST for everyone**: a learner in India and one in
   California get it at exactly the same moment (the schedule runs on the IST date, not the device's local date). A locked lesson shows
   "🔒 Unlocks on Fri, 4 Dec 2026" and nothing else — not even its title.

The two-day head start is what makes (2) work in every time zone, and it also pre-caches tomorrow's
lesson for offline use.

## `schedule.json` — the only file you edit to schedule

```json
{
  "launchDate": null,
  "previewLessons": 1,
  "publishAheadDays": 2,
  "siteUrl": null
}
```

| Field | Meaning |
|---|---|
| `launchDate` | Day 1, as `"YYYY-MM-DD"`. `null` = not announced: only the preview lesson is open. |
| `previewLessons` | How many lessons are *always* open — the free sample people can try from your post. |
| `publishAheadDays` | How many days ahead of "today" a build includes. Keep at 2 (or more). |
| `siteUrl` | Optional fallback for the public URL (CI sets it automatically). |

### Setting the launch date

1. Edit `schedule.json`, e.g. `"launchDate": "2026-12-01"`.
2. Commit and push to `main`. The site redeploys.

> ⚠️ **A launch date in the past opens lessons immediately.** If today is the 16th and you set the
> launch date to the 10th, lessons 1–7 are all open straight away. Choose today or a future date.

Until you set a date, **only lesson 1 is open** (as a preview). Lessons 2–7 exist but are locked and
are not in the published code.

## Daily routine — automatic

Nothing to do. `.github/workflows/deploy.yml` runs at **12:00 AM IST (18:30 UTC)** every day, rebuilds, and deploys. (GitHub schedules are in UTC; IST is UTC+5:30.)
It can start a few minutes late — harmless, because tomorrow's lesson is already in the site and the app unlocks it at each learner's own midnight.
It also runs on every push to `main`, and has a **Run workflow** button (Actions tab → *Deploy to
GitHub Pages* → *Run workflow*).

## Your routine — stay ahead

1. **Keep a buffer of ~14 lessons.** Just add `src/lessons/day-NNN.ts` files. They are held back
   automatically until their window.
2. `npm test` — validates every lesson and plays each one through the real UI.
3. `npm run dev:unlock` — preview any lesson, including locked ones. (Normal `npm run dev` obeys
   the schedule.)
4. **Scholar review** before a lesson's day. Set `reviewed: true` and add the reviewer to `credits`
   only after a named sign-off.
5. **Posts:** `npm run post -- 12` prints a LinkedIn and a WhatsApp post for lesson 12;
   `npm run post -- all` prints every lesson's. Set `SITE_URL` (e.g. in your shell) so the link is real.

## If something goes wrong

| Situation | What to do |
|---|---|
| Typo or error in a published lesson | Fix it and push. Learners get the fix on their next visit (the app updates itself). |
| The deploy didn't run | Actions → *Deploy to GitHub Pages* → *Run workflow*. |
| You fell behind and a day has no lesson | Nothing breaks: learners see "You're all caught up" and the archive. Tell your audience you're taking a short break. |
| You need to delay everything | Move `launchDate` later and push. Lessons not yet unlocked re-lock. |
| The scheduled run stopped | GitHub pauses scheduled workflows on public repos after ~60 days without repo activity. Any commit, or re-enabling it in the Actions tab, restarts it. |

## Pre-launch checklist

- [ ] At least lessons 1–7 reviewed by someone who knows Sanskrit (or the *"Not yet scholar-reviewed"* badge is accepted for now)
- [ ] `launchDate` chosen and set — today or later
- [ ] Repo variables set if wanted: `GOATCOUNTER_CODE` (see DEPLOYMENT.md), `SITE_URL`/`BASE_PATH` only for custom domains
- [ ] Opened the live site on a real phone — Devanagari renders correctly, taps feel right
- [ ] Share page checked: paste `https://<site>/d/1/` into WhatsApp (send it to yourself) and into LinkedIn's **Post Inspector** to see the preview card. Platforms cache previews, so inspect *before* the big post.
- [ ] `docs/LAUNCH-POSTS.md` filled in with the date and link

## Things to be aware of

- **The repo is public**, so upcoming lessons can be read on GitHub even though they are not on the
  website. If the surprise matters, keep future lessons on a private branch and merge them weekly.
- **Previews are per lesson page** (`/d/N/`), not per lesson image: every card uses the same
  site banner with that lesson's title and teaser.
- **Learners' clocks decide when they see a lesson.** Changing a device's date can open a lesson
  early. That is accepted: nothing is lost, and there is no cheating to prevent in a learning game.
