import { describe, it, expect } from "vitest";
import { STORAGE_KEY } from "../config";
import {
  defaultState,
  exportJSON,
  loadState,
  parseImport,
  parseState,
  saveState,
  type KV,
} from "./storage";

function fakeKV(initial: Record<string, string> = {}): KV & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

describe("storage", () => {
  it("round-trips state", () => {
    const kv = fakeKV();
    const s = defaultState();
    s.completed["1"] = "2026-11-14";
    s.notes["1"] = "rule";
    s.review["1:q-tac"] = { box: 2, due: "2026-11-20" };
    s.settings.script = "iast";
    s.settings.countVisits = false;
    s.settings.welcomeSeen = true;
    expect(saveState(s, kv)).toBe(true);
    expect(loadState(kv)).toEqual(s);
  });

  it("falls back to defaults on corrupt JSON", () => {
    expect(loadState(fakeKV({ [STORAGE_KEY]: "{not json" }))).toEqual(defaultState());
  });

  it("ignores unknown versions", () => {
    expect(loadState(fakeKV({ [STORAGE_KEY]: JSON.stringify({ version: 99 }) }))).toEqual(defaultState());
  });

  it("works without any storage", () => {
    expect(loadState(null)).toEqual(defaultState());
    expect(saveState(defaultState(), null)).toBe(false);
  });

  it("reports failed writes instead of throwing", () => {
    const kv: KV = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {},
    };
    expect(saveState(defaultState(), kv)).toBe(false);
  });

  it("drops invalid entries but keeps valid ones", () => {
    const parsed = parseState({
      version: 1,
      completed: { "1": "2026-11-14", x: "2026-11-14", "2": "nonsense" },
      notes: { "1": "ok", "2": 5 },
      review: { "1:a": { box: 3, due: "2026-11-20" }, "1:b": { box: 9, due: "2026-11-20" } },
      settings: { script: "klingon" },
    });
    expect(parsed?.completed).toEqual({ "1": "2026-11-14" });
    expect(parsed?.notes).toEqual({ "1": "ok" });
    expect(parsed?.review).toEqual({ "1:a": { box: 3, due: "2026-11-20" } });
    expect(parsed?.settings.script).toBe("both");
    expect(parsed?.settings.countVisits).toBe(true); // default when missing or invalid
    expect(parsed?.settings.welcomeSeen).toBe(false); // default when missing
  });

  it("imports an exported file and rejects junk", () => {
    const s = defaultState();
    s.completed["2"] = "2026-11-15";
    expect(parseImport(exportJSON(s))).toEqual(s);
    expect(parseImport("hello")).toBeNull();
    expect(parseImport("[]")).toBeNull();
  });
});
