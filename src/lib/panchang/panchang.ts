/**
 * The five limbs (pañcāṅga) of a day — vāra, tithi, nakṣatra, yoga, karaṇa — computed astronomically.
 * Conventions (stated on the card too): sidereal Lahiri ayanamsa; values taken at local sunrise, the traditional
 * start of the day (udaya); upper-limb sunrise with standard refraction. Regional almanacs can differ.
 */
import {
  elongation,
  julianDay,
  fromJulianDay,
  nextBoundary,
  norm360,
  siderealMoon,
  siderealSun,
  sunTimes,
} from "./astro";
import { VARAS, karanaTerm, pakshaTerm, tithiInPaksha, tithiTerm, NAKSHATRAS, YOGAS, type Term } from "./terms";

export interface Place {
  lat: number;
  /** degrees east */
  lon: number;
  label: string;
  /** IANA zone for showing times; undefined = the device's own zone. */
  tz?: string;
}

export interface Limb {
  /** 1-based number within its cycle (tithi 1–30, nakṣatra 1–27, yoga 1–27, karaṇa 1–60). */
  number: number;
  term: Term;
  /** When this one ends (and the next begins). */
  endsAt: Date;
  /** What follows it. */
  next: Term;
  /** True when a change falls within a few minutes of sunrise, so almanacs may name this one differently. */
  closeCall: boolean;
}

export interface Panchang {
  place: Place;
  /** The civil date the panchang is for, YYYY-MM-DD at the place. Before sunrise this is the previous day. */
  date: string;
  /** Sunrise/sunset on that date (null near the poles). */
  sunrise: Date | null;
  sunset: Date | null;
  vara: { term: Term };
  tithi: Limb & { paksha: Term; numberInPaksha: number };
  nakshatra: Limb;
  yoga: Limb;
  karana: Limb;
}

const SEG27 = 360 / 27;

/** Civil Y/M/D of an instant at a place's time zone (or the device's). */
export function civilDateAt(instant: Date, tz?: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

const isoOf = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const sumAngle = (jd: number): number => norm360(siderealSun(jd) + siderealMoon(jd));

/** The panchang for the traditional day that `now` falls in, at `place`. */
export function panchangFor(now: Date, place: Place): Panchang {
  let { y, m, d } = civilDateAt(now, place.tz);
  let sun = sunTimes(y, m, d, place.lat, place.lon);

  // The traditional day starts at sunrise: before it, we are still in the previous day.
  if (sun.sunrise && now.getTime() < sun.sunrise.getTime()) {
    const prev = new Date(Date.UTC(y, m - 1, d) - 86_400_000);
    y = prev.getUTCFullYear();
    m = prev.getUTCMonth() + 1;
    d = prev.getUTCDate();
    sun = sunTimes(y, m, d, place.lat, place.lon);
  }

  // Values are taken at sunrise (or, if the Sun does not rise, at local noon).
  const ref = sun.sunrise ?? new Date(Date.UTC(y, m - 1, d, 12) - (place.lon / 15) * 3_600_000);
  const jd = julianDay(ref);

  const e = elongation(jd);
  const tithiNo = Math.floor(e / 12) + 1; // 1..30
  const karanaNo = Math.floor(e / 6) + 1; // 1..60
  const nakNo = Math.floor(siderealMoon(jd) / SEG27) + 1; // 1..27
  const yogaNo = Math.floor(sumAngle(jd) / SEG27) + 1; // 1..27

  const wrap = (n: number, max: number) => ((n - 1) % max) + 1;
  // A boundary within a few minutes of sunrise is a genuine judgement call (calculations differ by about a minute).
  const CLOSE = 4 / 1440; // 4 minutes, in days
  const close = (angle: (j: number) => number, size: number) =>
    Math.floor(angle(jd - CLOSE) / size) !== Math.floor(angle(jd) / size) ||
    Math.floor(angle(jd + CLOSE) / size) !== Math.floor(angle(jd) / size);

  return {
    place,
    date: isoOf(y, m, d),
    sunrise: sun.sunrise,
    sunset: sun.sunset,
    vara: { term: VARAS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] },
    tithi: {
      number: tithiNo,
      term: tithiTerm(tithiNo),
      next: tithiTerm(wrap(tithiNo + 1, 30)),
      endsAt: fromJulianDay(nextBoundary(elongation, jd, 12)),
      closeCall: close(elongation, 12),
      paksha: pakshaTerm(tithiNo),
      numberInPaksha: tithiInPaksha(tithiNo),
    },
    nakshatra: {
      number: nakNo,
      term: NAKSHATRAS[nakNo - 1],
      next: NAKSHATRAS[wrap(nakNo + 1, 27) - 1],
      endsAt: fromJulianDay(nextBoundary(siderealMoon, jd, SEG27)),
      closeCall: close(siderealMoon, SEG27),
    },
    yoga: {
      number: yogaNo,
      term: YOGAS[yogaNo - 1],
      next: YOGAS[wrap(yogaNo + 1, 27) - 1],
      endsAt: fromJulianDay(nextBoundary(sumAngle, jd, SEG27)),
      closeCall: close(sumAngle, SEG27),
    },
    karana: {
      number: karanaNo,
      term: karanaTerm(karanaNo),
      next: karanaTerm(wrap(karanaNo + 1, 60)),
      endsAt: fromJulianDay(nextBoundary(elongation, jd, 6)),
      closeCall: close(elongation, 6),
    },
  };
}

/** A starter list of places for the manual picker (all in India; times shown in IST). */
export const CITIES: readonly Place[] = [
  { label: "New Delhi", lat: 28.6139, lon: 77.209 },
  { label: "Mumbai", lat: 19.076, lon: 72.8777 },
  { label: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { label: "Chennai", lat: 13.0827, lon: 80.2707 },
  { label: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { label: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { label: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { label: "Pune", lat: 18.5204, lon: 73.8567 },
  { label: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { label: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { label: "Varanasi", lat: 25.3176, lon: 82.9739 },
  { label: "Ujjain", lat: 23.1765, lon: 75.7885 },
  { label: "Mysuru", lat: 12.2958, lon: 76.6394 },
  { label: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
  { label: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
  { label: "Guwahati", lat: 26.1445, lon: 91.7362 },
].map((c) => ({ ...c, tz: "Asia/Kolkata" }));

/** Shown until the learner shares their location. */
export const FALLBACK_PLACE: Place = CITIES[0];
