/**
 * Anonymous visit counter, via GoatCounter (goatcounter.com): no cookies, no personal data,
 * no cross-site tracking. It counts page views only — never what a learner answers or how well
 * they do. Entirely inactive unless a site code is configured at build time.
 */

const CODE_RE = /^[a-z0-9][a-z0-9-]{1,30}$/i;

export function validCode(code: string): boolean {
  return CODE_RE.test(code);
}

export function countingAllowed(opts: {
  code: string;
  setting: boolean;
  dnt: string | null | undefined;
}): boolean {
  if (!validCode(opts.code)) return false;
  if (!opts.setting) return false;
  // Honour "Do Not Track" even though GoatCounter is privacy-friendly.
  if (opts.dnt === "1" || opts.dnt === "yes") return false;
  return true;
}

type GoatCounterWindow = Window & {
  goatcounter?: { count: (vars: { path: string; title?: string }) => void };
};

let loading: Promise<void> | null = null;

function loadScript(code: string): Promise<void> {
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.async = true;
    s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
    s.src = "https://gc.zgo.at/count.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("counter script blocked"));
    document.head.append(s);
  });
  return loading;
}

/** Record one page view. Silent on any failure (offline, blocked by an ad-blocker, …). */
export async function countPage(code: string, path: string, title: string): Promise<void> {
  try {
    await loadScript(code);
    (window as GoatCounterWindow).goatcounter?.count({ path, title });
  } catch {
    /* ignore */
  }
}

/** Total shown in the footer. Needs "Allow adding visitor counts on your website" enabled in GoatCounter. */
export async function fetchTotal(code: string): Promise<string | null> {
  try {
    const res = await fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`);
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;
    const v = json.count_unique ?? json.count;
    return typeof v === "string" || typeof v === "number" ? String(v) : null;
  } catch {
    return null;
  }
}
