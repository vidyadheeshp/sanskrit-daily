# The panchang card

A small card on the Today page: **"Today in the Sanskrit calendar"**. It is a *language* feature first: it teaches
the Sanskrit words people meet in an Indian almanac (weekdays, ordinal numbers, star names). It is deliberately not
an astrology or "auspicious times" feature.

## Scope

**Shows (compact):** one row per limb: vāra (weekday), tithi (lunar day), nakṣatra, yoga and karaṇa. Each row has the
Sanskrit name, a short hint where it teaches something ("Jupiter's day", "ninth · bright fortnight", "full moon") and
when it ends, under a one-line header with the place, date, sunrise and sunset. Definitions, the full tithi wording and
the note on what a pañcāṅga is (significance, relevance, usage) are folded into **About these terms**, one tap away.
A test keeps the default view short (under 500 characters; it was about 975 before the compact redesign).

**Deliberately does not show:** rahu kāla, muhūrta or abhijit timings, "auspicious/inauspicious" labels, horoscopes
or predictions. A test fails if such words appear on the card. This keeps the project a language tool, not a religious
or astrological one (see docs/DESIGN-PRINCIPLES.md).

It can be switched off in **Settings → Sanskrit calendar**.

## How it is calculated

Entirely in the browser, with no server and no external data. `src/lib/panchang/`:

| File | What it does |
|---|---|
| `astro.ts` | Sun and Moon positions (Meeus, *Astronomical Algorithms*: ch. 25 Sun; ch. 47 Moon with the 60 largest longitude terms), Lahiri ayanamsa, sunrise/sunset (NOAA method), and a boundary finder |
| `terms.ts` | The Sanskrit names (Devanagari + IAST) and the few glosses we are sure of |
| `panchang.ts` | Combines them into the five limbs for a place and an instant |

**Definitions used**
- **Tithi** = floor((Moon longitude − Sun longitude) / 12°) + 1; 1–15 śukla pakṣa (waxing), 16–30 kṛṣṇa pakṣa (waning).
- **Karaṇa** = half a tithi (60 per cycle; 1 = kiṃstughna, 2–57 the seven movable ones repeating eight times, 58–60 the fixed ones).
- **Nakṣatra** = which 13°20′ slice of the *sidereal* zodiac the Moon is in (27).
- **Yoga** = which 13°20′ slice the *sum* of the sidereal Sun and Moon longitudes is in (27).
- **Sidereal** uses the **Lahiri (Chitrapaksha)** ayanamsa, the Government of India standard.
- **Values are taken at local sunrise** (the traditional start of the day, *udaya*). Before sunrise the card shows the
  previous day's panchang and says so. Sunrise is the upper limb with standard refraction (zenith 90.833°).
- **Dynamical time:** Meeus' formulas expect dynamical time, which runs ≈69 s ahead of UT in this era. Leaving this out
  shifts every boundary by about a minute; a test catches its removal.

## How we know it is right

Three independent checks (reproducible: `docs/panchang/validate/`, needs `pip install ephem`).

1. **Positions vs PyEphem** — 600 random instants, 2025–2030.
   Sun max error 0.009°, Moon 0.008°; **worst tithi-boundary error ≈ 1.4 minutes**.
2. **Whole panchang vs PyEphem** — 250 (place, moment) samples across 5 cities, 2026–2027:

   | quantity | max difference | mean |
   |---|---|---|
   | sunrise / sunset | 0.30 / 0.28 min | 0.24 / 0.23 min |
   | tithi / karaṇa end | 1.42 min | 0.47 min |
   | nakṣatra end | 0.68 min | 0.39 min |
   | yoga end | 0.95 min | 0.44 min |

   Of 1,000 limb numbers, **2 differed**, both the same event (Kolkata, 5 Aug 2027) where an independent calculation puts
   the tithi boundary **15 seconds** from sunrise: a genuine coin-flip that two correct implementations can resolve
   differently. The card flags such cases ("changes within minutes of sunrise").
3. **A published almanac** — Drik Panchang (drikpanchang.com), read on 19 Nov 2026 for Bengaluru (19 and 24 Nov 2026),
   Mumbai (10 Dec 2026) and Kolkata (5 Mar 2027). **Every name matched, and every time agreed within about one
   minute** (sunrise, sunset, and the end of tithi, nakṣatra, yoga, karaṇa). This also confirms the *conventions*
   (Lahiri, sunrise values) match what published panchangs use. These four are committed as tests
   (`panchang.test.ts`), alongside independent reference values for new/full moons, the equinox and sunrise in Los
   Angeles, Sydney and London.

Tests also deliberately break the maths (wrong ayanamsa, no dynamical-time correction, wrong sunrise convention, wrong
karaṇa offset, a dropped Moon term, values at the wrong moment) and confirm each is caught.

## Known limits (stated on the card where it matters)

- **Regional and traditional differences.** Some almanacs (for example certain *vākya*-based South Indian ones) use
  different methods and can differ by a day on some dates. We follow the *drik* (observational) convention with Lahiri.
  For observance dates (fasts, festivals, ceremonies) people should check their own local panchang.
- **Close calls.** A change within ~4 minutes of sunrise is flagged, since almanacs may differ there.
- **Month names, years and festivals are not shown.** *Māsa* depends on Amānta/Pūrṇimānta conventions that differ by
  region; including it is a possible later addition, ideally with scholar input.
- **Accuracy range.** The formulas and the dynamical-time approximation are tuned for roughly 2015–2040.
- **Polar regions.** If the Sun does not rise or set, values are taken at local noon instead.
- **Content review.** The Sanskrit names have **not yet been reviewed by a scholar**. Glosses are given only for weekdays,
  ordinal tithi names and the two pakṣas; no etymologies are attached to the 27 nakṣatras or 27 yogas.

## Location and privacy

- **Default:** a fixed city (New Delhi) is shown until the learner chooses otherwise, and the card says so.
- **"Use my location"** asks the browser for permission (the learner taps the button; nothing is requested on load).
  Coordinates are **rounded to about 1 km**.
- It is stored under its **own** localStorage key, **not in the exportable progress file**, so sharing an export
  never shares a location. **Delete everything** and **Forget my location** both remove it.
- **Nothing is sent anywhere.** The calculation is local. (No geocoding or maps service is used.)
- Someone who already shared their location has it refreshed quietly on later visits, but only if the browser would not
  ask again (permission already granted).
- Alternatively a city can be picked from a list; those are shown in IST. A shared location is shown in the device's time zone.

## Extending it

Anything beyond the five limbs (month, year, festival names, sankranti, eclipses) should be added with a named
reviewer and its own validation against independent data, as above. Keep the scope rule: language first.
