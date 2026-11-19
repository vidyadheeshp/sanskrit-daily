/**
 * Low-precision astronomy for the panchang card. Pure functions, no dependencies.
 *
 * Formulas: Jean Meeus, "Astronomical Algorithms" (2nd ed.): ch. 7 (Julian Day), ch. 25 (Sun, low accuracy),
 * ch. 47 (Moon, the 60 largest longitude terms), ch. 28 (equation of time); sunrise/sunset by the NOAA method.
 * Accuracy: Sun ~0.01°, Moon ~0.01–0.02° (≈ 1–2 minutes on a tithi boundary), sunrise/sunset ~1 minute.
 * All of it is checked in astro.test.ts against values from an independent library (PyEphem).
 */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

/** Normalise an angle to [0, 360). */
export const norm360 = (x: number): number => ((x % 360) + 360) % 360;

/** Julian Day (UT) for a JavaScript Date. */
export const julianDay = (d: Date): number => d.getTime() / 86_400_000 + 2_440_587.5;

/** Date for a Julian Day. */
export const fromJulianDay = (jd: number): Date => new Date((jd - 2_440_587.5) * 86_400_000);

/**
 * ΔT = TT − UT, in seconds. Meeus' formulas want dynamical time (TT); a JavaScript Date is UT. Earth's rotation is
 * irregular, so ΔT is measured, not computed; it was ≈ 69 s in 2025 and is growing by roughly 0.2 s a year.
 * A straight line anchored there is within ~2 s for 2015–2040, which is ~0.0003° of Moon.
 */
export const deltaT = (jd: number): number => 69.2 + 0.22 * (2000 + (jd - 2_451_545.0) / 365.25 - 2025);

/** Julian centuries since J2000.0, in dynamical time (the argument the series expect). */
const centuries = (jd: number): number => (jd + deltaT(jd) / 86_400 - 2_451_545.0) / 36_525;

/** Sun's apparent ecliptic longitude (tropical, degrees), without nutation. Meeus ch. 25. */
export function sunLongitude(jd: number): number {
  const T = centuries(jd);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * RAD;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  return norm360(L0 + C - 0.00569); // −0.00569°: aberration
}

// Meeus table 47.A — the 60 largest terms for the Moon's longitude.
// Columns: D, M, M', F, Σl (units of 1e-6 degree).
const MOON_LON: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700],
  [2, 1, -2, 0, 691], [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399], [0, 0, 2, -2, -381],
  [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330], [2, -1, 2, 0, 327],
  [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294],
];

/** Moon's geocentric ecliptic longitude (tropical, mean equinox of date, degrees). Meeus ch. 47. */
export function moonLongitude(jd: number): number {
  const T = centuries(jd);
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
  const D = (297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000) * RAD;
  const M = (357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000) * RAD;
  const Mp = (134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000) * RAD;
  const F = (93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000) * RAD;
  const A1 = (119.75 + 131.849 * T) * RAD;
  const A2 = (53.09 + 479264.29 * T) * RAD;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;

  let sum = 0;
  for (const [d, m, mp, f, coef] of MOON_LON) {
    const arg = d * D + m * M + mp * Mp + f * F;
    const eFactor = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1;
    sum += coef * eFactor * Math.sin(arg);
  }
  // additive terms: Venus, Jupiter and the flattening of the Earth
  sum += 3958 * Math.sin(A1) + 1962 * Math.sin(Lp * RAD - F) + 318 * Math.sin(A2);
  return norm360(Lp + sum / 1e6);
}

/**
 * Lahiri (Chitrapaksha) ayanamsa in degrees: the offset between the tropical and the sidereal zodiac.
 * 23°51′11″ at J2000.0, growing by the rate of general precession. Good to ~0.001° for 1950–2100.
 */
export function lahiriAyanamsa(jd: number): number {
  const years = (jd - 2_451_545.0) / 365.25;
  return 23.853056 + 0.013969 * years;
}

/** Sun–Moon elongation in degrees [0, 360): 0 = new moon, 180 = full moon. */
export const elongation = (jd: number): number => norm360(moonLongitude(jd) - sunLongitude(jd));

/** Sidereal (Lahiri) longitudes. */
export const siderealMoon = (jd: number): number => norm360(moonLongitude(jd) - lahiriAyanamsa(jd));
export const siderealSun = (jd: number): number => norm360(sunLongitude(jd) - lahiriAyanamsa(jd));

/** Mean obliquity of the ecliptic, degrees. */
const obliquity = (jd: number): number => {
  const T = centuries(jd);
  return 23.439291 - 0.0130042 * T - 0.00000016 * T * T;
};

/** Sun's declination (degrees) and the equation of time (minutes) at a Julian Day. */
function sunDeclinationAndEoT(jd: number): { decl: number; eotMin: number } {
  const T = centuries(jd);
  const lam = sunLongitude(jd) * RAD;
  const eps = obliquity(jd) * RAD;
  const decl = Math.asin(Math.sin(eps) * Math.sin(lam)) * DEG;
  const alpha = norm360(Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam)) * DEG);
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  let e = L0 - 0.0057183 - alpha;
  e = ((e + 540) % 360) - 180; // wrap to [-180, 180]
  return { decl, eotMin: e * 4 };
}

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
  /** True when the Sun never rises or never sets on that date at that latitude. */
  polar: boolean;
}

/**
 * Sunrise and sunset for the civil date (y, m, d) at a place. `lon` is degrees east. The date is the date at the
 * place, so its UTC day starts at 00:00 local mean time minus the longitude offset. Upper-limb rise/set with
 * standard refraction (zenith 90.833°), the convention used by almanacs.
 */
export function sunTimes(y: number, m: number, d: number, lat: number, lon: number): SunTimes {
  const dayStart = Date.UTC(y, m - 1, d);
  const solve = (guessMs: number): { noonMs: number; haDeg: number | null } => {
    const { decl, eotMin } = sunDeclinationAndEoT(julianDay(new Date(guessMs)));
    const noonMs = dayStart + (720 - 4 * lon - eotMin) * 60_000;
    const cosHa =
      (Math.cos(90.833 * RAD) - Math.sin(lat * RAD) * Math.sin(decl * RAD)) /
      (Math.cos(lat * RAD) * Math.cos(decl * RAD));
    return { noonMs, haDeg: cosHa < -1 || cosHa > 1 ? null : Math.acos(cosHa) * DEG };
  };

  // iterate: the Sun's declination and the equation of time are re-evaluated at the event itself
  let noonMs = dayStart + (720 - 4 * lon) * 60_000;
  let riseMs = noonMs - 6 * 3_600_000;
  let setMs = noonMs + 6 * 3_600_000;
  let polar = false;
  for (let i = 0; i < 3; i++) {
    const r = solve(riseMs);
    const s = solve(setMs);
    if (r.haDeg === null || s.haDeg === null) {
      polar = true;
      break;
    }
    riseMs = r.noonMs - r.haDeg * 4 * 60_000;
    setMs = s.noonMs + s.haDeg * 4 * 60_000;
    noonMs = r.noonMs;
  }
  if (polar) return { sunrise: null, sunset: null, polar: true };
  return { sunrise: new Date(riseMs), sunset: new Date(setMs), polar: false };
}

/**
 * Find the first instant after `fromJd` at which `angle(jd)` (an angle that increases with time, in degrees)
 * crosses the next multiple of `size`. Returns the Julian Day, accurate to about a second.
 */
export function nextBoundary(angle: (jd: number) => number, fromJd: number, size: number): number {
  const startIndex = Math.floor(angle(fromJd) / size);
  const step = 15 / 1440; // 15 minutes
  let lo = fromJd;
  let hi = fromJd;
  for (let i = 0; i < 4 * 24 * 4; i++) {
    hi = lo + step;
    if (Math.floor(angle(hi) / size) !== startIndex) break; // crossed (wraps handled below)
    lo = hi;
  }
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (Math.floor(angle(mid) / size) === startIndex) lo = mid;
    else hi = mid;
  }
  return hi;
}
