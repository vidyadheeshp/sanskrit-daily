import { describe, it, expect } from "vitest";
import { countingAllowed, validCode } from "./counter";

describe("visit counter", () => {
  it("accepts normal GoatCounter site codes only", () => {
    expect(validCode("sanskrit-daily")).toBe(true);
    expect(validCode("abc123")).toBe(true);
    expect(validCode("")).toBe(false);
    expect(validCode("a")).toBe(false);
    expect(validCode("evil.com/x")).toBe(false);
    expect(validCode("a b")).toBe(false);
    expect(validCode("-bad")).toBe(false);
  });

  it("counts only when configured, switched on, and Do Not Track is off", () => {
    const ok = { code: "sanskrit-daily", setting: true, dnt: null };
    expect(countingAllowed(ok)).toBe(true);
    expect(countingAllowed({ ...ok, dnt: "0" })).toBe(true);
    expect(countingAllowed({ ...ok, dnt: undefined })).toBe(true);
  });

  it("stays off without a code", () => {
    expect(countingAllowed({ code: "", setting: true, dnt: null })).toBe(false);
  });

  it("stays off when the learner turns it off", () => {
    expect(countingAllowed({ code: "sanskrit-daily", setting: false, dnt: null })).toBe(false);
  });

  it("honours Do Not Track", () => {
    expect(countingAllowed({ code: "sanskrit-daily", setting: true, dnt: "1" })).toBe(false);
    expect(countingAllowed({ code: "sanskrit-daily", setting: true, dnt: "yes" })).toBe(false);
  });
});
