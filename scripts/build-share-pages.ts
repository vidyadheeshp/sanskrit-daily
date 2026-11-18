/**
 * Runs after `vite build`. For every published lesson writes dist/d/<n>/index.html: a tiny static page
 * with Open Graph / Twitter tags (so LinkedIn, WhatsApp and friends show a proper link preview) that
 * then sends the visitor into the app at #/day/<n>. Crawlers don't run JavaScript, so they only see the tags.
 * Also adds site-wide preview tags to dist/index.html.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { publishThrough } from "../src/lib/schedule";
import { basePath, esc, loadLessons, readSchedule, root, siteUrl, todayUTC } from "./lib";

const dist = join(root, "dist");
const schedule = readSchedule();
const base = basePath();
const site = siteUrl(schedule);
const through = publishThrough(todayUTC(), schedule);
const lessons = (await loadLessons()).filter((l) => l.number <= through);

if (!existsSync(join(dist, "index.html"))) throw new Error("dist/index.html not found — run `vite build` first.");
if (!site) {
  console.warn(
    "[share] SITE_URL is not set (and schedule.json has no siteUrl): link previews need absolute URLs, " +
      "so og:url / og:image are omitted. Set SITE_URL to e.g. https://user.github.io/repo/ .",
  );
}

const image = site ? `${site}og-image.png` : "";

function metaTags(opts: { title: string; description: string; url: string }): string {
  const t = esc(opts.title);
  const d = esc(opts.description);
  return [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Pratyaham" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    opts.url ? `<meta property="og:url" content="${esc(opts.url)}" />` : "",
    image ? `<meta property="og:image" content="${image}" />` : "",
    image ? `<meta property="og:image:width" content="1200" />` : "",
    image ? `<meta property="og:image:height" content="630" />` : "",
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    image ? `<meta name="twitter:image" content="${image}" />` : "",
  ]
    .filter(Boolean)
    .join("\n    ");
}

for (const l of lessons) {
  const title = `Pratyaham — Sanskrit Daily #${l.number} · ${l.title}`;
  const target = `${base}#/day/${l.number}`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(l.teaser)}" />
    ${metaTags({ title, description: l.teaser, url: site ? `${site}d/${l.number}/` : "" })}
    <script>location.replace(${JSON.stringify(target)});</script>
    <noscript><meta http-equiv="refresh" content="0; url=${esc(target)}" /></noscript>
  </head>
  <body style="font-family: system-ui, sans-serif; padding: 1.5rem">
    <p>Opening lesson ${l.number}… <a href="${esc(target)}">Tap here if nothing happens.</a></p>
  </body>
</html>
`;
  const dir = join(dist, "d", String(l.number));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

// Site-wide preview tags on the home page.
const indexPath = join(dist, "index.html");
const index = readFileSync(indexPath, "utf8");
if (!index.includes('property="og:title"')) {
  const tags = metaTags({
    title: "Pratyaham — Sanskrit Daily: one small lesson every day",
    description: "A new bite-sized Sanskrit lesson every day. Free, no login, no ads.",
    url: site,
  });
  writeFileSync(indexPath, index.replace("</head>", `    ${tags}\n  </head>`));
}

console.log(`[share] wrote ${lessons.length} share page(s) (lessons 1–${lessons.at(-1)?.number ?? 0})`);
