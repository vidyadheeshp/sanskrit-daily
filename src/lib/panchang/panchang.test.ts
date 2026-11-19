import { describe, it, expect } from "vitest";
import { CITIES, FALLBACK_PLACE, panchangFor, type Place } from "./panchang";
import {
  AMAVASYA,
  NAKSHATRAS,
  PURNIMA,
  VARAS,
  YOGAS,
  karanaTerm,
  pakshaTerm,
  tithiInPaksha,
  tithiTerm,
  type Term,
} from "./terms";

const city = (name: string): Place => CITIES.find((c) => c.label === name)!;
const IST = (iso: string) => new Date(`${iso}+05:30`);
const minutesApart = (a: Date | null, b: Date) => (a ? Math.abs(a.getTime() - b.getTime()) / 60_000 : Infinity);

describe("the names", () => {
  it("has the right number of each", () => {
    expect(VARAS).toHaveLength(7);
    expect(NAKSHATRAS).toHaveLength(27);
    expect(YOGAS).toHaveLength(27);
  });

  const unique = (terms: readonly Term[]) => new Set(terms.map((t) => t.dev)).size === terms.length;
  it("never repeats a name within a list", () => {
    expect(unique(VARAS)).toBe(true);
    expect(unique(NAKSHATRAS)).toBe(true);
    expect(unique(YOGAS)).toBe(true);
    expect(unique(Array.from({ length: 30 }, (_, i) => tithiTerm(i + 1)).slice(0, 15))).toBe(true);
  });

  it("writes every name in both scripts, NFC-normalised, and attaches a gloss only to weekdays and tithis", () => {
    const all = [...VARAS, ...NAKSHATRAS, ...YOGAS, PURNIMA, AMAVASYA, ...Array.from({ length: 60 }, (_, i) => karanaTerm(i + 1))];
    for (const t of all) {
      expect(t.dev.length).toBeGreaterThan(0);
      expect(t.iast.length).toBeGreaterThan(0);
      expect(t.dev).toBe(t.dev.normalize("NFC"));
      expect(t.iast).toBe(t.iast.normalize("NFC"));
    }
    // No unreviewed etymologies on the 27 + 27.
    for (const t of [...NAKSHATRAS, ...YOGAS]) expect(t.gloss, t.iast).toBeUndefined();
  });

  it("starts the week on Sunday", () => {
    expect(VARAS[0].iast).toBe("ravivāsaraḥ");
    expect(VARAS[4].iast).toBe("guruvāsaraḥ");
  });

  it("names tithis 1–14 the same in both fortnights, with pūrṇimā and amāvāsyā as the 15th", () => {
    for (let n = 1; n <= 14; n++) expect(tithiTerm(n).iast).toBe(tithiTerm(n + 15).iast);
    expect(tithiTerm(15)).toBe(PURNIMA);
    expect(tithiTerm(30)).toBe(AMAVASYA);
    expect(tithiTerm(9).iast).toBe("navamī");
    expect(tithiTerm(9).gloss).toBe("ninth");
  });

  it("assigns the fortnight by number, and numbers within it 1..15", () => {
    expect(pakshaTerm(1).iast).toBe("śukla-pakṣaḥ");
    expect(pakshaTerm(15).iast).toBe("śukla-pakṣaḥ");
    expect(pakshaTerm(16).iast).toBe("kṛṣṇa-pakṣaḥ");
    expect(pakshaTerm(30).iast).toBe("kṛṣṇa-pakṣaḥ");
    expect(tithiInPaksha(15)).toBe(15);
    expect(tithiInPaksha(16)).toBe(1);
    expect(tithiInPaksha(30)).toBe(15);
  });

  it("follows the karaṇa rule: one fixed start, seven repeating eight times, three fixed at the end", () => {
    expect(karanaTerm(1).iast).toBe("kiṃstughna");
    expect(karanaTerm(2).iast).toBe("bava");
    expect(karanaTerm(8).iast).toBe("viṣṭi");
    expect(karanaTerm(9).iast).toBe("bava");
    expect(karanaTerm(57).iast).toBe("viṣṭi");
    expect(karanaTerm(58).iast).toBe("śakuni");
    expect(karanaTerm(59).iast).toBe("catuṣpāda");
    expect(karanaTerm(60).iast).toBe("nāga");
    const counts = new Map<string, number>();
    for (let n = 2; n <= 57; n++) counts.set(karanaTerm(n).iast, (counts.get(karanaTerm(n).iast) ?? 0) + 1);
    expect(counts.size).toBe(7);
    for (const c of counts.values()) expect(c).toBe(8);
  });
});

/**
 * Values published by Drik Panchang (drikpanchang.com), read on 19 Nov 2026 for these dates and cities.
 * Times are IST, to the minute; ±2 minutes allows for that rounding and for sunrise conventions.
 */
const PUBLISHED = [
  { city: "Bengaluru", at: "2026-11-19T12:00:00", date: "2026-11-19", vara: "guruvāsaraḥ", sunrise: "2026-11-19T06:20:00", sunset: "2026-11-19T17:50:00",
    tithi: [9, "navamī", "2026-11-19T07:05:00"], nakshatra: [25, "pūrva bhādrapadā", null], yoga: [13, "vyāghāta", "2026-11-19T07:42:00"], karana: [18, "kaulava", "2026-11-19T07:05:00"] },
  { city: "Bengaluru", at: "2026-11-24T12:00:00", date: "2026-11-24", vara: "maṅgalavāsaraḥ", sunrise: "2026-11-24T06:22:00", sunset: "2026-11-24T17:50:00",
    tithi: [15, "pūrṇimā", "2026-11-24T20:23:00"], nakshatra: [3, "kṛttikā", "2026-11-24T23:25:00"], yoga: [19, "parigha", "2026-11-24T16:06:00"], karana: [29, "viṣṭi", "2026-11-24T10:05:00"] },
  { city: "Mumbai", at: "2026-12-10T12:00:00", date: "2026-12-10", vara: "guruvāsaraḥ", sunrise: "2026-12-10T07:01:00", sunset: "2026-12-10T18:02:00",
    tithi: [1, "pratipadā", "2026-12-10T08:45:00"], nakshatra: [19, "mūla", "2026-12-10T23:58:00"], yoga: [9, "śūla", "2026-12-10T09:24:00"], karana: [2, "bava", "2026-12-10T08:45:00"] },
  { city: "Kolkata", at: "2027-03-05T12:00:00", date: "2027-03-05", vara: "śukravāsaraḥ", sunrise: "2027-03-05T05:55:00", sunset: "2027-03-05T17:42:00",
    tithi: [27, "dvādaśī", "2027-03-05T09:53:00"], nakshatra: [22, "śravaṇa", "2027-03-06T04:20:00"], yoga: [19, "parigha", "2027-03-06T02:42:00"], karana: [54, "taitila", "2027-03-05T09:53:00"] },
] as const;

describe("agrees with a published almanac (Drik Panchang)", () => {
  it.each(PUBLISHED)("$city, $date", (c) => {
    const p = panchangFor(IST(c.at), city(c.city));
    expect(p.date).toBe(c.date);
    expect(p.vara.term.iast).toBe(c.vara);
    expect(minutesApart(p.sunrise, IST(c.sunrise))).toBeLessThanOrEqual(2);
    expect(minutesApart(p.sunset, IST(c.sunset))).toBeLessThanOrEqual(2);
    for (const k of ["tithi", "nakshatra", "yoga", "karana"] as const) {
      const [num, name, ends] = c[k];
      expect(p[k].number, `${k} number`).toBe(num);
      expect(p[k].term.iast, `${k} name`).toBe(name);
      if (ends) expect(minutesApart(p[k].endsAt, IST(ends)), `${k} end time`).toBeLessThanOrEqual(2);
    }
    expect(p.tithi.paksha.iast).toBe(c.tithi[0] <= 15 ? "śukla-pakṣaḥ" : "kṛṣṇa-pakṣaḥ");
  });
});

describe("sunrise and sunset elsewhere in the world (independent reference, PyEphem)", () => {
  const WORLD = [
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles", now: "2026-11-19T12:00:00-08:00", sunrise: "2026-11-19T14:29:14Z", sunset: "2026-11-20T00:47:19Z" },
    { name: "Sydney", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney", now: "2026-11-19T12:00:00+11:00", sunrise: "2026-11-18T18:41:09Z", sunset: "2026-11-19T08:40:10Z" },
    { name: "London", lat: 51.5072, lon: -0.1276, tz: "Europe/London", now: "2026-11-19T12:00:00Z", sunrise: "2026-11-19T07:24:47Z", sunset: "2026-11-19T16:06:29Z" },
  ];
  it.each(WORLD)("$name", (w) => {
    const p = panchangFor(new Date(w.now), { lat: w.lat, lon: w.lon, tz: w.tz, label: w.name });
    expect(p.date).toBe("2026-11-19"); // the civil date at the place, whatever the device's zone
    expect(minutesApart(p.sunrise, new Date(w.sunrise))).toBeLessThanOrEqual(2);
    expect(minutesApart(p.sunset, new Date(w.sunset))).toBeLessThanOrEqual(2);
  });
});

describe("the traditional day starts at sunrise", () => {
  it("is still the previous day's panchang before sunrise, and the new day's after", () => {
    const bengaluru = city("Bengaluru");
    const before = panchangFor(IST("2026-11-19T05:00:00"), bengaluru);
    expect(before.date).toBe("2026-11-18");
    expect(before.vara.term.iast).toBe("budhavāsaraḥ"); // Wednesday
    const after = panchangFor(IST("2026-11-19T07:00:00"), bengaluru);
    expect(after.date).toBe("2026-11-19");
    expect(after.vara.term.iast).toBe("guruvāsaraḥ"); // Thursday
  });

  it("takes the values at sunrise, not at the moment you look", () => {
    const early = panchangFor(IST("2026-11-19T07:00:00"), city("Bengaluru"));
    const late = panchangFor(IST("2026-11-19T22:00:00"), city("Bengaluru"));
    expect(early.tithi.number).toBe(late.tithi.number); // navamī at sunrise, even though dashamī runs all evening
    expect(early.tithi.number).toBe(9);
  });
});

describe("consistency", () => {
  it("advances the tithi by 0, 1 or 2 from one sunrise to the next, never backwards (60 days)", () => {
    let prev = 0;
    for (let day = 0; day < 60; day++) {
      const now = new Date(IST("2026-11-01T12:00:00").getTime() + day * 86_400_000);
      const n = panchangFor(now, city("Ujjain")).tithi.number;
      if (prev) expect([0, 1, 2], `day ${day}: ${prev} -> ${n}`).toContain(((n - prev + 30) % 30));
      prev = n;
    }
  });

  it("ends every limb after sunrise and names what follows", () => {
    const p = panchangFor(IST("2026-11-19T12:00:00"), city("Mysuru"));
    for (const k of ["tithi", "nakshatra", "yoga", "karana"] as const) {
      expect(p[k].endsAt.getTime(), k).toBeGreaterThan(p.sunrise!.getTime());
      expect(p[k].next.dev.length, k).toBeGreaterThan(0);
      expect(p[k].next.iast, k).not.toBe(p[k].term.iast);
    }
    expect(p.tithi.next.iast).toBe(tithiTerm(10).iast);
  });

  it("gives the same answer for the same moment (pure)", () => {
    const a = panchangFor(IST("2026-11-19T12:00:00"), FALLBACK_PLACE);
    const b = panchangFor(IST("2026-11-19T12:00:00"), FALLBACK_PLACE);
    expect(b).toEqual(a);
  });

  it("copes with a place that has no sunrise (polar night) instead of crashing", () => {
    const p = panchangFor(new Date("2026-12-21T12:00:00Z"), { lat: 80, lon: 0, tz: "UTC", label: "Arctic" });
    expect(p.sunrise).toBeNull();
    expect(p.tithi.number).toBeGreaterThanOrEqual(1);
    expect(p.tithi.number).toBeLessThanOrEqual(30);
  });
});

describe("close calls (a change within minutes of sunrise)", () => {
  it("flags a tithi that changes right at sunrise (Kolkata, 5 Aug 2027: 15 seconds apart in an independent check)", () => {
    const p = panchangFor(IST("2027-08-05T12:00:00"), city("Kolkata"));
    expect(p.tithi.closeCall).toBe(true);
    expect(p.karana.closeCall).toBe(true);
  });
  it("does not flag an ordinary day", () => {
    const p = panchangFor(IST("2026-11-24T12:00:00"), city("Bengaluru"));
    expect(p.tithi.closeCall).toBe(false);
    expect(p.nakshatra.closeCall).toBe(false);
  });
});

describe("places", () => {
  it("lists real cities, in India, shown in IST", () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(10);
    for (const c of CITIES) {
      expect(c.tz).toBe("Asia/Kolkata");
      expect(c.lat).toBeGreaterThan(6);
      expect(c.lat).toBeLessThan(37);
      expect(c.lon).toBeGreaterThan(67);
      expect(c.lon).toBeLessThan(98);
    }
    expect(new Set(CITIES.map((c) => c.label)).size).toBe(CITIES.length);
  });
});
