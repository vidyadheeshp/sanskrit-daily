import { describe, it, expect } from "vitest";
import { parseInline, parseMarkup, toPlain } from "./markup";

describe("markup", () => {
  it("parses plain text", () => {
    expect(parseInline("hello")).toEqual([{ t: "text", text: "hello" }]);
  });

  it("parses bold, italic and script pairs", () => {
    expect(parseInline("a **b** *c* {तत्|tat} d")).toEqual([
      { t: "text", text: "a " },
      { t: "b", text: "b" },
      { t: "text", text: " " },
      { t: "i", text: "c" },
      { t: "text", text: " " },
      { t: "sk", dev: "तत्", iast: "tat" },
      { t: "text", text: " d" },
    ]);
  });

  it("does not treat HTML as markup", () => {
    expect(parseInline("<script>alert(1)</script>")).toEqual([
      { t: "text", text: "<script>alert(1)</script>" },
    ]);
  });

  it("splits paragraphs on newlines and drops blanks", () => {
    expect(parseMarkup("one\n\n two \n")).toHaveLength(2);
  });

  it("renders plain text for each script setting", () => {
    expect(toPlain("see {तत्|tat}", "dev")).toBe("see तत्");
    expect(toPlain("see {तत्|tat}", "iast")).toBe("see tat");
    expect(toPlain("see {तत्|tat}", "both")).toBe("see तत् (tat)");
  });
});
