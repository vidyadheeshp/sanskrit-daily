"""
Compares the app's Sun and Moon positions with PyEphem at 600 random instants (2025-2030).

    pip install ephem
    python docs/panchang/validate/compare_positions.py        (run from the project root)
"""
import json, math, pathlib, subprocess, ephem

ROOT = pathlib.Path(__file__).resolve().parents[3]
out = subprocess.run("npx tsx docs/panchang/validate/gen_positions.ts", shell=True, cwd=ROOT, capture_output=True, encoding="utf-8").stdout
rows = json.loads(out)

def ecl_lon(body, d):
    body.compute(d, epoch=d)  # astrometric geocentric position, mean equinox of date
    eq = ephem.Equatorial(body.g_ra, body.g_dec, epoch=d)
    return math.degrees(ephem.Ecliptic(eq, epoch=d).lon) % 360

wrap = lambda x: (x + 180) % 360 - 180
ds, dm, de = [], [], []
for r in rows:
    d = ephem.Date(r["iso"].replace("T", " ").replace("Z", "").split(".")[0].replace("-", "/"))
    s, m = ecl_lon(ephem.Sun(), d), ecl_lon(ephem.Moon(), d)
    ds.append(wrap(r["sun"] - s)); dm.append(wrap(r["moon"] - m)); de.append(wrap((r["moon"] - r["sun"]) - (m - s)))

def stats(name, v):
    print(f"{name:11} max |diff| = {max(abs(x) for x in v):.4f} deg   mean |diff| = {sum(abs(x) for x in v)/len(v):.4f} deg   bias = {sum(v)/len(v):+.4f} deg")
print(f"{len(rows)} random instants, 2025-2030")
stats("Sun", ds); stats("Moon", dm); stats("Elongation", de)
print(f"worst elongation error {max(abs(x) for x in de):.4f} deg = about {max(abs(x) for x in de)/12.2*24*60:.1f} minutes of tithi-boundary time")
