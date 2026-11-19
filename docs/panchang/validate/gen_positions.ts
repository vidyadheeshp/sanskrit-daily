// Prints the app's Sun/Moon longitudes at 600 deterministic pseudo-random instants (used by compare_positions.py).
import { julianDay, sunLongitude, moonLongitude, lahiriAyanamsa } from "../../../src/lib/panchang/astro.ts";

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const start = Date.UTC(2025, 0, 1), end = Date.UTC(2030, 11, 31);
const rows: Array<{ iso: string; sun: number; moon: number; ayan: number }> = [];
for (let i = 0; i < 600; i++) {
  const t = new Date(Math.round(start + rnd() * (end - start)));
  const jd = julianDay(t);
  rows.push({ iso: t.toISOString(), sun: sunLongitude(jd), moon: moonLongitude(jd), ayan: lahiriAyanamsa(jd) });
}
console.log(JSON.stringify(rows));
