# Deployment (GitHub Pages)

> Day-to-day publishing of lessons is covered in [RELEASING.md](RELEASING.md). This page is the one-time setup.

## One-time setup

1. Create a GitHub repository, e.g. `sanskrit-daily`, and push this project to `main`.
2. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` tests, builds and publishes.
4. The site appears at `https://<username>.github.io/<repo>/`.

Pages is free for public repositories.

## What the workflow does

| Trigger | Why |
|---|---|
| push to `main` | publish changes |
| **daily at 00:20 UTC** (`schedule`) | publish the next day's lesson without anyone lifting a finger |
| **Run workflow** button (`workflow_dispatch`) | emergencies |

Steps: `npm ci` → `npm test` → `npm run check` → `npm run build` (which also writes the per-lesson share pages) → deploy.
If a test fails, **nothing is deployed**.

## Repository variables (optional)

Set under **Settings → Secrets and variables → Actions → Variables**:

| Variable | Default | Set it when |
|---|---|---|
| `BASE_PATH` | `/<repo>/` | using a user site (`<user>.github.io`) or a custom domain → `/` |
| `SITE_URL` | `https://<owner>.github.io/<repo>/` | using a custom domain → `https://your-domain/` |
| `GOATCOUNTER_CODE` | *(unset = no counter)* | you want the anonymous visit counter |

### The base-path rule

A project site is served from `/<repo>/`, not `/`. The base path is applied everywhere from one value:
`vite.config.ts` reads `BASE_PATH`; the PWA manifest and the share pages follow it. If assets 404 or the app
is blank after deploy, a wrong base path is the cause 9 times out of 10.

## Visit counter (GoatCounter)

The footer can show a visitor total, counted anonymously (no cookies). Off unless you configure it:

1. Create a free site at **goatcounter.com**; choose a site code, e.g. `sanskrit-daily`.
2. In GoatCounter → *Settings* enable **"Allow adding visitor counts on your website"** (needed to show the total in the footer). Optionally make the stats page public.
3. Add the repository variable `GOATCOUNTER_CODE` = your code.
4. Re-run the workflow. A few visits later, the footer shows the total.

Notes:
- GoatCounter ignores `localhost`, so you will not see counts from local testing.
- Ad-blockers may block it; counts are therefore a *lower bound*.
- The footer total is read from `https://<code>.goatcounter.com/counter/TOTAL.json`. If it doesn't appear, re-check step 2 and GoatCounter's documentation for the current format.
- Learners can switch counting off in Settings, and "Do Not Track" is honoured. See [DATA-AND-PRIVACY.md](DATA-AND-PRIVACY.md).

## Link previews (LinkedIn, WhatsApp, X…)

`npm run build` writes `dist/d/<n>/index.html` for every published lesson: a tiny page carrying
preview tags (title, the lesson's teaser, a banner image) that then redirects into the app. Share
**`https://<site>/d/<n>/`**, not the `#/day/<n>` URL — hash URLs cannot carry per-lesson previews.

The banner is `public/og-image.png` (1200×630). Replace it to change the look of every preview card.
Platforms cache previews: after changing one, refresh it with LinkedIn's **Post Inspector**.

## Custom domain (optional, later)

Add a `public/CNAME` file containing the domain, set DNS as GitHub documents, and set the repository
variables `BASE_PATH=/` and `SITE_URL=https://your-domain/`.

## Local commands

```bash
npm run dev            # obeys the release schedule
npm run dev:unlock     # opens every lesson, for previewing
npm run build          # production build into dist/ (SITE_URL=… for absolute preview URLs)
npm run preview        # serve dist/
npm run post -- 3      # LinkedIn + WhatsApp text for lesson 3
```

## Limits to remember

- Static files only: no secrets, no server code.
- Soft limits: ~1 GB site size, ~100 GB/month bandwidth — a text-only app is nowhere near either.
- Browsers cache `index.html` briefly; the service worker handles updates (`autoUpdate`).
