/** Sharing helpers. Pure: nothing is sent anywhere — the text is copied or handed to the OS share sheet. */

/** URL of the per-lesson share page (static page with link-preview tags that opens the lesson). */
export function shareUrl(n: number, origin: string, base: string): string {
  try {
    return new URL(`d/${n}/`, new URL(base, origin)).href;
  } catch {
    return `${base}d/${n}/`;
  }
}

export function shareText(lesson: { number: number; teaser: string }, url: string): string {
  return `Sanskrit Daily #${lesson.number} — ${lesson.teaser}\n${url}`;
}
