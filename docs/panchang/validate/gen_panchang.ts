// Prints the app's panchang for 250 (place, moment) samples across 2026-2027 (used by compare_panchang.py).
import { panchangFor, CITIES } from "../../../src/lib/panchang/panchang.ts";

let seed = 777;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const places = ["New Delhi", "Bengaluru", "Mumbai", "Kolkata", "Guwahati"].map((n) => CITIES.find((c) => c.label === n)!);
const start = Date.UTC(2026, 0, 1), end = Date.UTC(2027, 11, 31);
const out: unknown[] = [];
for (let i = 0; i < 250; i++) {
  const now = new Date(Math.round(start + rnd() * (end - start)));
  const place = places[i % places.length];
  const p = panchangFor(now, place);
  out.push({
    place: { label: place.label, lat: place.lat, lon: place.lon },
    now: now.toISOString(),
    date: p.date,
    sunrise: p.sunrise?.toISOString(),
    sunset: p.sunset?.toISOString(),
    tithi: { n: p.tithi.number, end: p.tithi.endsAt.toISOString() },
    nakshatra: { n: p.nakshatra.number, end: p.nakshatra.endsAt.toISOString() },
    yoga: { n: p.yoga.number, end: p.yoga.endsAt.toISOString() },
    karana: { n: p.karana.number, end: p.karana.endsAt.toISOString() },
  });
}
console.log(JSON.stringify(out));
