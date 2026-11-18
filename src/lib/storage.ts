/**
 * Safe, versioned persistence. Every storage access is wrapped: if localStorage is
 * unavailable (private mode, blocked, quota) the app keeps working in memory.
 */
import { STORAGE_KEY } from "../config";
import { isValidISO } from "./date";
import type { Card } from "./srs";
import type { ScriptSetting } from "./markup";

export interface State {
  version: 1;
  /** lesson number → local date completed */
  completed: Record<string, string>;
  /** lesson number → recap rule */
  notes: Record<string, string>;
  /** "<lesson>:<stepId>" → review card */
  review: Record<string, Card>;
  settings: { script: ScriptSetting; countVisits: boolean };
}

export interface KV {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function defaultState(): State {
  return { version: 1, completed: {}, notes: {}, review: {}, settings: { script: "both", countVisits: true } };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Validate an unknown value (from storage or an imported file). Returns null if unusable. */
export function parseState(raw: unknown): State | null {
  if (!isRecord(raw) || raw.version !== 1) return null;
  const out = defaultState();

  if (isRecord(raw.completed)) {
    for (const [k, v] of Object.entries(raw.completed)) {
      if (/^\d+$/.test(k) && isValidISO(v)) out.completed[k] = v;
    }
  }
  if (isRecord(raw.notes)) {
    for (const [k, v] of Object.entries(raw.notes)) {
      if (/^\d+$/.test(k) && typeof v === "string" && v.length <= 1000) out.notes[k] = v;
    }
  }
  if (isRecord(raw.review)) {
    for (const [k, v] of Object.entries(raw.review)) {
      if (
        /^\d+:[\w-]+$/.test(k) &&
        isRecord(v) &&
        Number.isInteger(v.box) &&
        (v.box as number) >= 1 &&
        (v.box as number) <= 5 &&
        isValidISO(v.due)
      ) {
        out.review[k] = { box: v.box as number, due: v.due as string };
      }
    }
  }
  if (isRecord(raw.settings) && ["dev", "iast", "both"].includes(raw.settings.script as string)) {
    out.settings.script = raw.settings.script as ScriptSetting;
  }
  if (isRecord(raw.settings) && typeof raw.settings.countVisits === "boolean") {
    out.settings.countVisits = raw.settings.countVisits;
  }
  return out;
}

function defaultKV(): KV | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadState(kv: KV | null = defaultKV()): State {
  if (!kv) return defaultState();
  try {
    const text = kv.getItem(STORAGE_KEY);
    if (!text) return defaultState();
    return parseState(JSON.parse(text)) ?? defaultState();
  } catch {
    return defaultState();
  }
}

/** Returns false if the write failed (caller can warn the user). */
export function saveState(state: State, kv: KV | null = defaultKV()): boolean {
  if (!kv) return false;
  try {
    kv.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(kv: KV | null = defaultKV()): void {
  try {
    kv?.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function exportJSON(state: State): string {
  return JSON.stringify(state, null, 2);
}

export function parseImport(text: string): State | null {
  try {
    return parseState(JSON.parse(text));
  } catch {
    return null;
  }
}
