/**
 * Regenerates the PNG brand assets (icons + link-preview banner) from the frozen master logo.
 *
 *   npm i --no-save @resvg/resvg-js
 *   node docs/brand/make-assets.mjs
 *
 * Latin text only: see the Devanagari caveat in docs/brand/BRAND.md.
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const root = fileURLToPath(new URL("../../", import.meta.url));
const logo = readFileSync(join(root, "docs/brand/logo/pratyaham-logo.svg"), "utf8");

// The drawing without its rounded-square background, so it can sit on a full-bleed square (maskable / iOS icons).
const BG = '<rect width="256" height="256" rx="56" fill="#8a3b12"/>';
if (!logo.includes(BG)) throw new Error("logo background rect not found");
const strip = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[\s\S]*?<\/title>/, "");
const drawing = strip(logo).replace(BG, "");

const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { loadSystemFonts: true } }).render().asPng();
const out = (name) => join(root, "public", name);

copyFileSync(join(root, "docs/brand/logo/pratyaham-logo.svg"), out("favicon.svg"));
writeFileSync(out("icon-192.png"), render(logo, 192));
writeFileSync(out("icon-512.png"), render(logo, 512));

const fullBleed = (scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#8a3b12"/>` +
  `<g transform="translate(128 128) scale(${scale}) translate(-128 -128)">${drawing}</g></svg>`;
writeFileSync(out("icon-maskable-512.png"), render(fullBleed(0.7), 512));
writeFileSync(out("apple-touch-icon.png"), render(fullBleed(0.84), 180));

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbf6ec"/>
  <rect width="1200" height="14" fill="#8a3b12"/><rect y="616" width="1200" height="14" fill="#8a3b12"/>
  <svg x="90" y="160" width="310" height="310" viewBox="0 0 256 256">${strip(logo)}</svg>
  <text x="470" y="270" font-family="Segoe UI, Arial" font-size="118" font-weight="700" fill="#8a3b12">Pratyaham</text>
  <text x="474" y="345" font-family="Segoe UI, Arial" font-size="50" font-weight="600" fill="#2b2118">Sanskrit Daily</text>
  <text x="474" y="425" font-family="Segoe UI, Arial" font-size="38" fill="#6e5f4e">One small lesson, every day.</text>
  <text x="474" y="480" font-family="Segoe UI, Arial" font-size="30" fill="#6e5f4e">Free · no login · no ads · 5 minutes</text>
</svg>`;
writeFileSync(out("og-image.png"), render(og, 1200));
console.log("brand assets written to public/");
