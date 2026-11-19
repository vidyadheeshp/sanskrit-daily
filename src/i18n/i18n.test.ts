import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { en, type Key } from "./en";
import { kn } from "./kn";
import { LANGUAGES, LANG_CODES, DEFAULT_LANG, isLang } from "./langs";
import { linksOf, parseUi } from "./markup";
import { SITE_TAGLINE_EN } from "../config";
import { VARAS } from "../lib/panchang/terms";

/** The catalogs must stay in lock-step. These checks run on every change, so a translator cannot silently break a page. */

const keys = Object.keys(en) as Key[];
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const KANNADA = /[ಀ-೿]/;

describe("catalog parity (English ↔ Kannada)", () => {
  it("kn has exactly the keys of en", () => {
    expect(Object.keys(kn).sort()).toEqual([...keys].sort());
  });

  it.each(keys)("%s: same placeholders, same links, not empty", (k) => {
    expect(kn[k].trim(), "empty translation").not.toBe("");
    expect(placeholders(kn[k])).toEqual(placeholders(en[k]));
    expect(linksOf(kn[k])).toEqual(linksOf(en[k]));
  });

  it("markup is balanced: translated text never leaves stray ** or ^^", () => {
    for (const k of keys) {
      const flat = (s: string) => JSON.stringify(parseUi(s)).replace(/"t":"\w+"/g, "");
      for (const mark of ["**", "^^"]) {
        const count = (s: string) => s.split(mark).length - 1;
        expect(count(kn[k]) % 2, `${k}: unbalanced ${mark}`).toBe(0);
      }
      void flat;
    }
  });

  it("nearly every Kannada string is actually in Kannada script", () => {
    // Allowed to match English: names/numbers/symbols only (e.g. "{n}", "Dine Dine", "IST").
    const stillEnglish = keys.filter((k) => !KANNADA.test(kn[k]) && /[A-Za-z]{4,}/.test(kn[k].replace(/\{\w+\}/g, "")));
    expect(stillEnglish).toEqual([]);
  });
});

describe("catalog content", () => {
  it("the English tagline key equals the brand constant", () => {
    expect(en["brand.tagline"]).toBe(SITE_TAGLINE_EN);
  });

  it("English weekday text matches the glosses in terms.ts exactly", () => {
    VARAS.forEach((v, i) => {
      expect(en[`panchang.vara.gloss.${i}` as Key]).toBe(v.gloss);
      expect(en[`panchang.vara.short.${i}` as Key]).toBe(v.short);
    });
  });

  it("every key is used somewhere in the source", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(svelte|ts)$/.test(name) && !/\.test\.ts$/.test(name) && !/src[\\/]i18n[\\/](en|kn)\.ts$/.test(p)) files.push(p);
      }
    };
    walk("src");
    const source = files.map((f) => readFileSync(f, "utf8")).join("\n");
    // Keys built at run time (dyn / cityName) are checked by prefix.
    const dynamic = /^(panchang\.(ordinal|vara\.short|vara\.gloss)|city|rhythm|landing\.(how|promises|faq))\./;
    const unused = keys.filter((k) => !dynamic.test(k) && !source.includes(`"${k}"`) && !source.includes(`'${k}'`) && !source.includes(`\`${k}\``));
    expect(unused).toEqual([]);
  });
});

describe("languages", () => {
  it("English is the default, and every declared language has a catalog or is English", () => {
    expect(DEFAULT_LANG).toBe("en");
    expect(LANG_CODES).toEqual(["en", "kn"]);
    expect(LANGUAGES.map((l) => l.code)).toEqual([...LANG_CODES]);
    expect(isLang("kn")).toBe(true);
    expect(isLang("fr")).toBe(false);
  });

  it("Kannada is flagged as an unreviewed draft until a native speaker signs it off", () => {
    expect(LANGUAGES.find((l) => l.code === "kn")!.reviewed).toBe(false);
    expect(LANGUAGES.find((l) => l.code === "en")!.reviewed).toBe(true);
  });
});
