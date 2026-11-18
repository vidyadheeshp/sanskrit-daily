import { describe, it, expect } from "vitest";
import { shareText, shareUrl } from "./share";

describe("share helpers", () => {
  it("builds the per-lesson share-page URL under the site's base path", () => {
    expect(shareUrl(3, "https://user.github.io", "/sanskrit-daily/")).toBe("https://user.github.io/sanskrit-daily/d/3/");
    expect(shareUrl(12, "https://example.org", "/")).toBe("https://example.org/d/12/");
  });

  it("falls back to a relative URL for odd origins", () => {
    expect(shareUrl(2, "null", "/x/")).toBe("/x/d/2/");
  });

  it("composes a short, paste-ready message", () => {
    const text = shareText({ number: 4, teaser: "Spot the pattern." }, "https://e.org/d/4/");
    expect(text).toBe("Sanskrit Daily #4 — Spot the pattern.\nhttps://e.org/d/4/");
  });
});
