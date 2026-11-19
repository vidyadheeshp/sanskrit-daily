/**
 * Supported interface languages. Pure (no store, no framework) so storage and tests can import it.
 * To add a language: add its code here, write src/i18n/<code>.ts (typed as a full copy of the English catalog), and
 * register it in src/i18n/index.ts. See docs/I18N.md.
 */
export const LANG_CODES = ["en", "kn"] as const;
export type Lang = (typeof LANG_CODES)[number];

/** English is the default; other languages are opt-in. */
export const DEFAULT_LANG: Lang = "en";

export const isLang = (x: unknown): x is Lang => typeof x === "string" && (LANG_CODES as readonly string[]).includes(x);

export interface LanguageInfo {
  code: Lang;
  /** Name in English, for people who cannot read the language. */
  english: string;
  /** Name in the language itself, shown in the switcher. */
  native: string;
  /** Locale for dates. */
  locale: string;
  /** Locale for clock times (English uses the Indian 12-hour style). */
  timeLocale: string;
  /**
   * True once a native speaker has reviewed the whole catalog. While false, the site says openly that the
   * translation is a draft. Flip this only after a named reviewer signs off (see docs/I18N.md).
   */
  reviewed: boolean;
}

export const LANGUAGES: readonly LanguageInfo[] = [
  { code: "en", english: "English", native: "English", locale: "en-GB", timeLocale: "en-IN", reviewed: true },
  { code: "kn", english: "Kannada", native: "ಕನ್ನಡ", locale: "kn-IN", timeLocale: "kn-IN", reviewed: false },
];

export const languageInfo = (code: Lang): LanguageInfo => LANGUAGES.find((l) => l.code === code)!;
