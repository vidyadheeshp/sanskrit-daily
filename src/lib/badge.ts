/**
 * The weekly "thank-you" badge: a square picture and a short message.
 *
 * Deliberately modest. It says that a week was finished and nothing more: no level, no score, no name, no
 * "certified" or "fluent". It is an appreciation, not a credential, so it cannot be mistaken for one.
 * Nothing user-specific goes into it, so there is nothing to leak and the same badge is made for everyone.
 */
import { SITE_NAME, SITE_NAME_DEV, SITE_TAGLINE, SITE_TAGLINE_EN } from "../config";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const BADGE_SIZE = 1080;

/** The badge as a self-contained SVG (fonts fall back to the device's own; no external files). */
export function badgeSvg(week: number, host: string): string {
  const S = BADGE_SIZE;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" role="img" aria-label="${esc(`Week ${week} complete`)}">
  <rect width="${S}" height="${S}" fill="#fbf6ec"/>
  <rect x="36" y="36" width="${S - 72}" height="${S - 72}" rx="56" fill="none" stroke="#8a3b12" stroke-width="6"/>
  <g transform="translate(${S / 2 - 160} 120) scale(1.25)">
    <rect width="256" height="256" rx="56" fill="#8a3b12"/>
    <path d="M44 208 V182 H96 V152 H156 V124 H212 V208 Z" fill="#fbf6ec" stroke="#fbf6ec" stroke-width="12" stroke-linejoin="round"/>
    <path d="M184 30 C206 60 220 82 205 104 C197 115 171 115 163 104 C148 82 162 60 184 30 Z" fill="#e8b04a"/>
    <path d="M184 66 C194 81 198 91 191 100 C188 104 180 104 177 100 C170 91 174 81 184 66 Z" fill="#fff3d6"/>
  </g>
  <text x="${S / 2}" y="560" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="120" font-weight="700" fill="#8a3b12">Week ${week}</text>
  <text x="${S / 2}" y="660" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="84" fill="#3a2a1c">complete</text>
  <text x="${S / 2}" y="760" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="48" fill="#6a5440">Well done!</text>
  <text x="${S / 2}" y="870" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Nirmala UI', 'Kohinoor Devanagari', sans-serif" font-size="64" font-weight="700" fill="#8a3b12">${esc(SITE_NAME_DEV)} · ${esc(SITE_NAME)}</text>
  <text x="${S / 2}" y="935" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Nirmala UI', 'Kohinoor Devanagari', sans-serif" font-size="38" fill="#3a2a1c">${esc(SITE_TAGLINE)} · ${esc(SITE_TAGLINE_EN)}</text>
  <text x="${S / 2}" y="995" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="30" fill="#6a5440">${esc(host)}</text>
</svg>`;
}

/** The message offered alongside the picture. Plain and factual. */
export function badgeShareText(week: number, url: string): string {
  return `I finished Week ${week} of ${SITE_NAME} — one small Sanskrit lesson every day. 🪔\n${url}`;
}

/** Turn the SVG into a PNG in the browser. Resolves null if this device cannot (no canvas, blocked image decode). */
export async function badgePng(svg: string): Promise<Blob | null> {
  try {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    try {
      const img = new Image();
      img.decoding = "async";
      await new Promise<void>((ok, fail) => {
        img.onload = () => ok();
        img.onerror = () => fail(new Error("image decode failed"));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = BADGE_SIZE;
      canvas.height = BADGE_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, BADGE_SIZE, BADGE_SIZE);
      return await new Promise<Blob | null>((ok) => canvas.toBlob((b) => ok(b), "image/png"));
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return null;
  }
}
