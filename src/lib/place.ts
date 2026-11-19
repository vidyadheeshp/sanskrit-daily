/**
 * The place used for the panchang card (sunrise, and so the day's tithi, depend on where you are).
 *
 * PRIVACY: kept in its own localStorage key, NOT in the exportable progress file, so sharing a progress export never
 * shares a location. Coordinates are rounded to 2 decimals (~1 km). Nothing here is ever sent anywhere: the
 * panchang is calculated entirely in the browser. "Delete everything" removes it.
 */
import { defaultKV, type KV } from "./storage";

export const PLACE_KEY = "sanskrit-daily:place";

export interface SavedPlace {
  /** "device" = from the browser's location; "city" = picked from the list (shown in IST). */
  mode: "device" | "city";
  lat: number;
  lon: number;
  label: string;
}

/** ~1 km: plenty for sunrise to the minute, and not a precise location. */
export const roundCoord = (x: number): number => Math.round(x * 100) / 100;

const finite = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

export function parsePlace(raw: unknown): SavedPlace | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Record<string, unknown>;
  if (p.mode !== "device" && p.mode !== "city") return null;
  if (!finite(p.lat) || !finite(p.lon) || p.lat < -90 || p.lat > 90 || p.lon < -180 || p.lon > 180) return null;
  if (typeof p.label !== "string" || p.label.length === 0 || p.label.length > 60) return null;
  return { mode: p.mode, lat: p.lat, lon: p.lon, label: p.label };
}

export function loadPlace(kv: KV | null = defaultKV()): SavedPlace | null {
  if (!kv) return null;
  try {
    const text = kv.getItem(PLACE_KEY);
    return text ? parsePlace(JSON.parse(text)) : null;
  } catch {
    return null;
  }
}

export function savePlace(place: SavedPlace, kv: KV | null = defaultKV()): boolean {
  if (!kv) return false;
  try {
    kv.setItem(PLACE_KEY, JSON.stringify(place));
    return true;
  } catch {
    return false;
  }
}

export function clearPlace(kv: KV | null = defaultKV()): void {
  try {
    kv?.removeItem(PLACE_KEY);
  } catch {
    /* ignore */
  }
}
