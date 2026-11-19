import { describe, it, expect } from "vitest";
import { STORAGE_KEY } from "../config";
import { PLACE_KEY, clearPlace, loadPlace, parsePlace, roundCoord, savePlace } from "./place";
import { defaultState, exportJSON, type KV } from "./storage";

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

describe("saved place", () => {
  const good = { mode: "device", lat: 12.97, lon: 77.59, label: "Your location" } as const;

  it("round-trips through storage", () => {
    const kv = fakeKV();
    expect(savePlace(good, kv)).toBe(true);
    expect(loadPlace(kv)).toEqual(good);
  });

  it("rounds coordinates to about a kilometre", () => {
    expect(roundCoord(12.971599)).toBe(12.97);
    expect(roundCoord(-77.59462)).toBe(-77.59);
  });

  it("rejects anything that is not a valid place", () => {
    for (const bad of [null, "x", 5, [], {}, { ...good, mode: "gps" }, { ...good, lat: 91 }, { ...good, lon: -181 },
      { ...good, lat: "12" }, { ...good, lat: NaN }, { ...good, label: "" }, { ...good, label: "x".repeat(61) }]) {
      expect(parsePlace(bad), JSON.stringify(bad)).toBeNull();
    }
  });

  it("ignores corrupt storage", () => {
    expect(loadPlace(fakeKV({ [PLACE_KEY]: "{not json" }))).toBeNull();
    expect(loadPlace(fakeKV({ [PLACE_KEY]: JSON.stringify({ mode: "device", lat: 999, lon: 0, label: "x" }) }))).toBeNull();
    expect(loadPlace(fakeKV())).toBeNull();
    expect(loadPlace(null)).toBeNull();
  });

  it("survives blocked storage", () => {
    const blocked: KV = { getItem: () => null, setItem: () => { throw new Error("quota"); }, removeItem: () => { throw new Error("no"); } };
    expect(savePlace(good, blocked)).toBe(false);
    expect(() => clearPlace(blocked)).not.toThrow();
    expect(savePlace(good, null)).toBe(false);
  });

  it("can be forgotten", () => {
    const kv = fakeKV();
    savePlace(good, kv);
    clearPlace(kv);
    expect(loadPlace(kv)).toBeNull();
    expect(Object.keys(kv.data)).toHaveLength(0);
  });
});

describe("privacy", () => {
  it("keeps the place in its own key, separate from the progress data", () => {
    expect(PLACE_KEY).not.toBe(STORAGE_KEY);
  });

  it("never puts a location in the exportable progress file", () => {
    const text = exportJSON(defaultState()).toLowerCase();
    for (const word of ["lat", "lon", "place", "location", "coords"]) expect(text, word).not.toContain(word);
  });
});
