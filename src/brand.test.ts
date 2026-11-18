import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { SITE_NAME, SITE_NAME_DEV, SITE_SUBTITLE, SITE_TAGLINE, SITE_TAGLINE_EN } from "./config";

/**
 * The brand is FROZEN (docs/brand/BRAND.md). These tests fail if the name, tagline, logo or icon set drift.
 * To change the brand on purpose, update BRAND.md and this file together.
 */

const file = (p: string) => new URL(`../${p}`, import.meta.url);
const text = (p: string) => readFileSync(file(p), "utf8");
const codepoints = (s: string) => [...s].map((c) => c.codePointAt(0)!.toString(16));

describe("frozen identity", () => {
  it("has the chosen name, subtitle and tagline", () => {
    expect(SITE_NAME).toBe("Dine Dine");
    expect(SITE_SUBTITLE).toBe("Sanskrit Daily");
    expect(SITE_TAGLINE_EN).toBe("Sanskrit, every day");
  });

  it("spells the Devanagari name and tagline exactly (code point by code point)", () => {
    // दिने दिने = da + i-sign + na + e-sign, space, da + i-sign + na + e-sign
    expect(codepoints(SITE_NAME_DEV)).toEqual(["926", "93f", "928", "947", "20", "926", "93f", "928", "947"]);
    expect(SITE_NAME_DEV.normalize("NFC")).toBe("दिने दिने");
    expect(SITE_TAGLINE.normalize("NFC")).toBe("प्रतिदिनं संस्कृतम्");
  });

  it("is recorded as frozen in BRAND.md, with the same values", () => {
    const brand = text("docs/brand/BRAND.md");
    expect(brand).toContain("FROZEN");
    for (const v of [SITE_NAME, SITE_NAME_DEV, SITE_SUBTITLE, SITE_TAGLINE, SITE_TAGLINE_EN]) expect(brand).toContain(v);
  });
});

describe("frozen logo", () => {
  const master = text("docs/brand/logo/dine-dine-logo.svg");

  it("keeps the favicon byte-identical to the master logo", () => {
    expect(text("public/favicon.svg")).toBe(master);
  });

  it("keeps the in-app Logo component identical in shape and colour to the master", () => {
    const component = text("src/components/Logo.svelte");
    const paths = [...master.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
    expect(paths).toHaveLength(3); // staircase + flame + flame highlight
    for (const d of paths) expect(component, `path ${d}`).toContain(`d="${d}"`);
    for (const colour of ["#8a3b12", "#fbf6ec", "#e8b04a", "#fff3d6"]) {
      expect(master).toContain(colour);
      expect(component).toContain(colour);
    }
    expect(component).toContain('rx="56"');
  });
});

describe("icon set and link-preview banner", () => {
  const size = (p: string): [number, number] => {
    const b = readFileSync(file(p));
    expect(b.subarray(1, 4).toString("ascii"), `${p} is a PNG`).toBe("PNG");
    return [b.readUInt32BE(16), b.readUInt32BE(20)]; // IHDR width, height
  };

  it.each([
    ["public/icon-192.png", [192, 192]],
    ["public/icon-512.png", [512, 512]],
    ["public/icon-maskable-512.png", [512, 512]],
    ["public/apple-touch-icon.png", [180, 180]],
    ["public/og-image.png", [1200, 630]],
  ] as const)("%s is %j px", (p, expected) => {
    expect(size(p)).toEqual(expected);
  });

  it("lists every icon in the PWA manifest and each file exists", () => {
    const config = text("vite.config.ts");
    const srcs = [...config.matchAll(/src:\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(srcs).toEqual(expect.arrayContaining(["favicon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png"]));
    for (const s of srcs) expect(existsSync(file(`public/${s}`)), s).toBe(true);
    expect(config).toContain('purpose: "maskable"');
    expect(config).toContain('short_name: "Dine Dine"');
  });

  it("is wired into the page head", () => {
    const html = text("index.html");
    expect(html).toContain("<title>Dine Dine — Sanskrit Daily</title>");
    expect(html).toContain('rel="apple-touch-icon"');
    expect(html).toContain("favicon.svg");
  });
});
