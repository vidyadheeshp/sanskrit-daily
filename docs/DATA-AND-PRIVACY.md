# Data & Privacy

## Summary

Sanskrit Daily has **no accounts, no ads and no tracking of what you learn**. Your progress and answers
never leave your browser. The one exception is an **optional, anonymous visit counter** that adds one to a
page-view total. It is off unless the site owner configures it, you can switch it off, and "Do Not Track"
is honoured.

## What is stored on your device

Everything is stored in your own browser's `localStorage` under the key `sanskrit-daily:v1`:

| Field | Contents | Why |
|---|---|---|
| `completed` | lesson numbers + the local date you finished them | show "days practised", mark the archive |
| `notes` | the recap rule from lessons you finished | "My notes" page |
| `review` | spaced-review box and due date per item | optional quick review |
| `settings` | script preference; whether to count your visits; whether you have seen the welcome page; whether to show the panchang card | display, privacy, and showing the welcome page only once |

It never leaves your device unless **you** press *Export* and save the file yourself.

## Your location (optional, for the panchang card)

The Today page can show a small panchang card. Sunrise, and so the tithi, depend on where you are:
- Until you choose, it shows **New Delhi**. Nothing is requested from your browser.
- If you tap **Use my location**, your browser asks permission. Coordinates are **rounded to about 1 km** and stored on
  your device under a **separate key** (`sanskrit-daily:place`), so they are **not** in the progress file you can export.
- **Nothing is sent anywhere**: the calculation happens in your browser, and no maps or geocoding service is used.
- **Forget my location** (on the card) and **Delete everything** (Settings) both remove it. Or pick a city instead.
- The card can be switched off entirely in Settings → Sanskrit calendar.

## The visit counter

When configured, the app loads a small script from **GoatCounter** (goatcounter.com) and reports that a
page was viewed (for example `/day/3`). According to GoatCounter's documentation it sets no cookies and
does not store personal data such as full IP addresses; please read their privacy policy for the details.

It **never** sends: your answers, your scores, which questions you got wrong, your notes, or anything from
your stored progress. It only counts page views.

The footer may also *read* a total back from GoatCounter to display it — that is a request to their server
as well, and is covered by the same switch.

### Your controls

- **Settings → "Count my visits anonymously"** — untick it. The script is not loaded and the total is not fetched.
- **Do Not Track:** if your browser sends it, counting is off regardless of the setting.
- **Ad-blockers** will block it too, which is fine.
- The counter is **inactive in any copy of the site where no counter code is configured.**

## Other controls

- **Export** — downloads your progress as a JSON file.
- **Import** — loads a previously exported file (checked before it is applied).
- **Delete everything** — removes everything stored by the app on this device.
- Clearing your browser's site data also removes everything.

## The analytics boundary

The project's principle is *learning outcomes over engagement*. Therefore:

1. The visit counter may count **page views**. That's all it may count.
2. Nothing may measure engagement or behaviour: no streaks-of-use dashboards, no time-on-app, no
   per-learner profiles, no A/B tests on retention.
3. Measuring **learning outcomes** (e.g. which questions are commonly missed, to improve a lesson) would need
   its own opt-in design, documented here *before* it ships.

## Hosting note

The site is served by GitHub Pages. GitHub, as the host, may keep ordinary web-server logs (such as IP
addresses) under its own privacy policy. The app itself adds nothing to that, apart from the optional counter above.

## Language preference

`settings.language` (`en` or `kn`) is stored in the browser with the other settings and is included in the progress export. It is never sent anywhere.

## Weekly check

`weeks` records, per week, the date the weekly check was first finished. It is stored in the browser with the other progress, included in the progress export, and never sent anywhere. The score is shown on screen only and is not stored. The badge image is made in the browser and contains nothing about the person.
