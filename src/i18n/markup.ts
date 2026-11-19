/**
 * Markup for interface messages (src/i18n/en.ts). Output is plain data rendered as Svelte text nodes by <Msg>,
 * never as HTML, so a translation cannot inject script.
 *
 *   **bold**    *italic*    ^^देवनागरी^^    [label](#/route)    [label](https://…)
 *
 * Links are only honoured for in-app routes (#/…) and https URLs; anything else is shown as plain text.
 */
export type UiToken =
  | { t: "text"; text: string }
  | { t: "b"; children: UiToken[] }
  | { t: "i"; children: UiToken[] }
  | { t: "dev"; text: string }
  | { t: "a"; label: string; href: string };

const RE = /\*\*(.+?)\*\*|\*(.+?)\*|\^\^(.+?)\^\^|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseUi(src: string): UiToken[] {
  const out: UiToken[] = [];
  let last = 0;
  for (const m of src.matchAll(RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ t: "text", text: src.slice(last, idx) });
    if (m[1] !== undefined) out.push({ t: "b", children: parseUi(m[1]) });
    else if (m[2] !== undefined) out.push({ t: "i", children: parseUi(m[2]) });
    else if (m[3] !== undefined) out.push({ t: "dev", text: m[3] });
    else out.push({ t: "a", label: m[4], href: m[5] });
    last = idx + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", text: src.slice(last) });
  return out;
}

export type LinkKind = "internal" | "external" | null;

export function linkKind(href: string): LinkKind {
  if (/^#\/[A-Za-z0-9/_-]*$/.test(href)) return "internal";
  if (/^https:\/\/[^\s"'<>]+$/.test(href)) return "external";
  return null;
}

/** The links in a message, in order. Used by tests to check a translation keeps the same links. */
export function linksOf(src: string): string[] {
  const out: string[] = [];
  const walk = (tokens: UiToken[]) => {
    for (const t of tokens) {
      if (t.t === "a") out.push(t.href);
      else if (t.t === "b" || t.t === "i") walk(t.children);
    }
  };
  walk(parseUi(src));
  return out;
}
