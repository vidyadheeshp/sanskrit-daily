/**
 * Tiny inline markup for lesson text. Output is plain data that components render as
 * Svelte text nodes — HTML is never injected, so lesson files cannot run script.
 *
 *   **bold**   *italic*   {देवनागरी|IAST}
 *   A newline starts a new paragraph.
 */

export type Token =
  | { t: "text"; text: string }
  | { t: "b"; text: string }
  | { t: "i"; text: string }
  | { t: "sk"; dev: string; iast: string };

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|\{([^|{}]+)\|([^{}]+)\}/g;

export function parseInline(src: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of src.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ t: "text", text: src.slice(last, idx) });
    if (m[1] !== undefined) out.push({ t: "b", text: m[1] });
    else if (m[2] !== undefined) out.push({ t: "i", text: m[2] });
    else out.push({ t: "sk", dev: m[3].trim(), iast: m[4].trim() });
    last = idx + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", text: src.slice(last) });
  return out;
}

export function parseMarkup(src: string): Token[][] {
  return src
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(parseInline);
}

export type ScriptSetting = "dev" | "iast" | "both";

/** Plain-text rendering (used for notes export and aria labels). */
export function toPlain(src: string, script: ScriptSetting = "both"): string {
  return parseInline(src)
    .map((tok) => {
      if (tok.t !== "sk") return tok.text;
      if (script === "dev") return tok.dev;
      if (script === "iast") return tok.iast;
      return `${tok.dev} (${tok.iast})`;
    })
    .join("");
}
