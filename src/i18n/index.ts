/**
 * Interface translation. English is the default; the learner opts in to another language (Settings or the header).
 *
 *   t("nav.today")                       → "Today" / "ಇಂದು"
 *   t("landing.status.open", { n: 3 })   → "Lesson 3 is open today"
 *
 * `t` reads the language from the reactive app store, so it can be used in templates. When the language changes the
 * page content is re-created (App.svelte keys <main> on the language), so values computed once in a script are fresh.
 * A key missing from a catalog falls back to English (the type system makes that impossible for "kn": see kn.ts).
 */
import { UNLOCK_HOUR_IST } from "../config";
import { app } from "../lib/store.svelte";
import { en, type Key } from "./en";
import { kn } from "./kn";
import { languageInfo, type Lang } from "./langs";

export type { Key };
export type Params = Record<string, string | number>;

const catalogs: Partial<Record<Lang, Partial<Record<Key, string>>>> = { kn };

/** Replace {name} placeholders. Unknown placeholders are left visible so mistakes show up in tests. */
export function fill(s: string, params?: Params): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (whole, name: string) => (name in params ? String(params[name]) : whole));
}

export const lang = (): Lang => app.state.settings.language;

export function t(key: Key, params?: Params): string {
  const l = lang();
  const message = (l === "en" ? undefined : catalogs[l]?.[key]) ?? en[key];
  return fill(message, params);
}

/** `t` for keys built at run time, e.g. dyn("panchang.ordinal", 9). */
export const dyn = (prefix: string, id: string | number, params?: Params): string => t(`${prefix}.${id}` as Key, params);

/** Locale for dates / for clock times, per language. */
export const locale = (): string => languageInfo(lang()).locale;
export const timeLocale = (): string => languageInfo(lang()).timeLocale;

/** "6:00 AM IST" in English; "ಬೆಳಿಗ್ಗೆ 6:00 (IST)" in Kannada. */
export function unlockTime(): string {
  return t(UNLOCK_HOUR_IST < 12 ? "time.am" : "time.pm", { h: UNLOCK_HOUR_IST % 12 || 12 });
}

/** A city's name in the current language (falls back to the English label). */
export function cityName(label: string): string {
  const key = `city.${label.toLowerCase().replace(/\s+/g, "_")}`;
  return key in en ? t(key as Key) : label;
}
