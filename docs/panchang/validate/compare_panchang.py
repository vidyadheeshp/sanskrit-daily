"""
Compares the app's whole panchang (sunrise, sunset, tithi, nakshatra, yoga, karana and their end times) with an
independent PyEphem calculation, for 250 (place, moment) samples. The ayanamsa formula is shared (it is a published
constant, not an ephemeris); the Sun and Moon positions and the sunrise are independent.

    pip install ephem
    python docs/panchang/validate/compare_panchang.py         (run from the project root)

A tithi boundary that falls within seconds of sunrise can legitimately be assigned to either day by two correct
implementations; those cases are reported separately.
"""
import json, math, pathlib, subprocess, ephem, datetime as dt

ROOT = pathlib.Path(__file__).resolve().parents[3]
rows = json.loads(subprocess.run("npx tsx docs/panchang/validate/gen_panchang.ts", shell=True, cwd=ROOT, capture_output=True, encoding="utf-8").stdout)

parse = lambda iso: dt.datetime.fromisoformat(iso.replace("Z", "+00:00"))
to_ephem = lambda t: ephem.Date(t.strftime("%Y/%m/%d %H:%M:%S.%f"))
from_ephem = lambda d: parse(ephem.Date(d).datetime().strftime("%Y-%m-%dT%H:%M:%S.%f") + "+00:00")
minutes = lambda a, b: (a - b).total_seconds() / 60

def lon_of(body, d):
    body.compute(d, epoch=d)
    return math.degrees(ephem.Ecliptic(ephem.Equatorial(body.g_ra, body.g_dec, epoch=d), epoch=d).lon) % 360

def ayan(d):
    jd = d + 2415020.0 - 0.5  # ephem.Date counts days from 1899-12-31 12:00
    return 23.853056 + 0.013969 * ((jd - 2451545.0) / 365.25)

def angles(d):
    s, m, a = lon_of(ephem.Sun(), d), lon_of(ephem.Moon(), d), ayan(d)
    return {"elong": (m - s) % 360, "nak": (m - a) % 360, "sum": ((s - a) + (m - a)) % 360}

def boundary(kind, size, t0):
    idx = math.floor(angles(t0)[kind] / size)
    lo, step = t0, 15 / 1440
    for _ in range(400):
        hi = lo + step
        if math.floor(angles(hi)[kind] / size) != idx: break
        lo = hi
    for _ in range(40):
        mid = (lo + hi) / 2
        if math.floor(angles(mid)[kind] / size) == idx: lo = mid
        else: hi = mid
    return hi

errs = {k: [] for k in ("sunrise", "sunset", "tithi_end", "nak_end", "yoga_end", "karana_end")}
mismatch = []
for r in rows:
    if not r["sunrise"]: continue
    sr, ss = parse(r["sunrise"]), parse(r["sunset"])
    obs = ephem.Observer(); obs.lat, obs.lon, obs.elevation = str(r["place"]["lat"]), str(r["place"]["lon"]), 0
    sun = ephem.Sun()
    obs.date = to_ephem(sr - dt.timedelta(hours=6)); errs["sunrise"].append(minutes(sr, from_ephem(obs.next_rising(sun))))
    obs.date = to_ephem(ss - dt.timedelta(hours=6)); errs["sunset"].append(minutes(ss, from_ephem(obs.next_setting(sun))))
    t0 = to_ephem(sr); a0 = angles(t0)
    expected = {"tithi": math.floor(a0["elong"] / 12) + 1, "nakshatra": math.floor(a0["nak"] / (360 / 27)) + 1,
                "yoga": math.floor(a0["sum"] / (360 / 27)) + 1, "karana": math.floor(a0["elong"] / 6) + 1}
    for k, v in expected.items():
        if r[k]["n"] != v: mismatch.append((r["place"]["label"], r["date"], k, r[k]["n"], v))
    errs["tithi_end"].append(minutes(parse(r["tithi"]["end"]), from_ephem(boundary("elong", 12, t0))))
    errs["nak_end"].append(minutes(parse(r["nakshatra"]["end"]), from_ephem(boundary("nak", 360 / 27, t0))))
    errs["yoga_end"].append(minutes(parse(r["yoga"]["end"]), from_ephem(boundary("sum", 360 / 27, t0))))
    errs["karana_end"].append(minutes(parse(r["karana"]["end"]), from_ephem(boundary("elong", 6, t0))))

clean = lambda v: [x for x in v if abs(x) < 100]  # drop whole-tithi disagreements (boundary within seconds of sunrise)
print(f"{len(rows)} samples, 5 cities, 2026-2027.  minutes, app minus PyEphem (near-sunrise boundary cases excluded):")
for k, v in errs.items():
    c = clean(v)
    print(f"  {k:11} n={len(c):3}  max |diff| = {max(abs(x) for x in c):5.2f}   mean |diff| = {sum(abs(x) for x in c)/len(c):4.2f}")
print(f"limb numbers that differ at sunrise: {len(mismatch)} of {len(rows) * 4}  (boundary within seconds of sunrise)")
for m in mismatch: print("   ", m)
