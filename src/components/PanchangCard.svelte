<script lang="ts">
  import { onMount } from "svelte";
  import { formatISOShort } from "../lib/date";
  import { app } from "../lib/store.svelte";
  import { civilDateAt, panchangFor, CITIES, FALLBACK_PLACE, type Limb, type Panchang, type Place } from "../lib/panchang/panchang";
  import type { Term } from "../lib/panchang/terms";
  import { clearPlace, loadPlace, roundCoord, savePlace, type SavedPlace } from "../lib/place";

  /**
   * "Today in the Sanskrit calendar": a compact, language-first card of the five limbs of the day.
   * Compact by design: one or two lines per term. Definitions and the note on what a pañcāṅga is live in the
   * collapsed "About these terms" section.
   * Deliberately NOT included: auspicious/inauspicious timings, rahu kāla, muhūrta or any prediction.
   * Calculated entirely in the browser. Location is optional, opt-in, rounded, and never leaves the device.
   */

  let saved = $state<SavedPlace | null>(loadPlace());
  let status = $state<"" | "locating" | "denied" | "unsupported">("");
  const now = new Date();

  const place = $derived<Place>(
    saved
      ? { lat: saved.lat, lon: saved.lon, label: saved.label, tz: saved.mode === "city" ? "Asia/Kolkata" : undefined }
      : FALLBACK_PLACE,
  );
  const pc = $derived<Panchang>(panchangFor(now, place));

  const pad = (n: number) => String(n).padStart(2, "0");
  const time = (d: Date) =>
    new Intl.DateTimeFormat("en-IN", { timeZone: place.tz, hour: "numeric", minute: "2-digit", hour12: true }).format(d);
  const endText = (d: Date) => {
    const c = civilDateAt(d, place.tz);
    if (`${c.y}-${pad(c.m)}-${pad(c.d)}` === pc.date) return time(d);
    return `${new Intl.DateTimeFormat("en-IN", { timeZone: place.tz, weekday: "short" }).format(d)} ${time(d)}`;
  };
  const beforeSunrise = $derived.by(() => {
    const c = civilDateAt(now, place.tz);
    return `${c.y}-${pad(c.m)}-${pad(c.d)}` !== pc.date;
  });

  /** One short, accurate line of meaning beside the term (language value: ordinals and planets). */
  const tithiHint = $derived.by(() => {
    const n = pc.tithi.number;
    if (n === 15) return "full moon";
    if (n === 30) return "new moon";
    return `${pc.tithi.term.gloss} · ${n <= 15 ? "bright" : "dark"} fortnight`;
  });
  /** The longer wording, shown in "About these terms". */
  const tithiDetail = $derived.by(() => {
    const n = pc.tithi.number;
    if (n === 15) return "Full moon: the last day of the bright fortnight";
    if (n === 30) return "New moon: the last day of the dark fortnight";
    return `The ${pc.tithi.term.gloss} day of the ${pc.tithi.paksha.iast} — ${pc.tithi.paksha.gloss}`;
  });

  const limbs = $derived<
    Array<{ key: string; name: string; dev: string; what: string; term: Term; hint?: string; detail?: string; limb?: Limb }>
  >([
    { key: "vara", name: "Vāra", dev: "वार", what: "the day of the week", term: pc.vara.term, hint: pc.vara.term.short, detail: pc.vara.term.gloss },
    {
      key: "tithi",
      name: "Tithi",
      dev: "तिथि",
      what: "the lunar day: the Moon gains 12° on the Sun, so there are 30 in a cycle",
      term: pc.tithi.term,
      hint: tithiHint,
      detail: tithiDetail,
      limb: pc.tithi,
    },
    { key: "nakshatra", name: "Nakṣatra", dev: "नक्षत्र", what: "the star-group the Moon is passing through, one of 27", term: pc.nakshatra.term, limb: pc.nakshatra },
    { key: "yoga", name: "Yoga", dev: "योग", what: "a measure from the Sun's and Moon's positions added together, one of 27", term: pc.yoga.term, limb: pc.yoga },
    { key: "karana", name: "Karaṇa", dev: "करण", what: "half a tithi", term: pc.karana.term, limb: pc.karana },
  ]);
  const anyCloseCall = $derived(limbs.some((l) => l.limb?.closeCall));

  function locate(silent = false) {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      if (!silent) status = "unsupported";
      return;
    }
    if (!silent) status = "locating";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: SavedPlace = {
          mode: "device",
          lat: roundCoord(pos.coords.latitude),
          lon: roundCoord(pos.coords.longitude),
          label: "Your location",
        };
        saved = p;
        savePlace(p);
        status = "";
      },
      () => {
        if (!silent) status = "denied";
      },
      { maximumAge: 3_600_000, timeout: 15_000 },
    );
  }

  function pickCity(e: Event) {
    const label = (e.currentTarget as HTMLSelectElement).value;
    const city = CITIES.find((c) => c.label === label);
    if (!city) return;
    saved = { mode: "city", lat: city.lat, lon: city.lon, label: city.label };
    savePlace(saved);
    status = "";
  }

  function forget() {
    clearPlace();
    saved = null;
    status = "";
  }

  // Someone who already shared their location: refresh it quietly, but only if the browser will not ask again.
  onMount(() => {
    if (saved?.mode !== "device") return;
    navigator.permissions
      ?.query({ name: "geolocation" as PermissionName })
      .then((r) => {
        if (r.state === "granted") locate(true);
      })
      .catch(() => {});
  });

  const coords = $derived(
    saved?.mode === "device"
      ? `${Math.abs(saved.lat).toFixed(2)}°${saved.lat >= 0 ? "N" : "S"} ${Math.abs(saved.lon).toFixed(2)}°${saved.lon >= 0 ? "E" : "W"}`
      : "",
  );
</script>

{#snippet sk(t: Term)}
  {#if app.script === "dev"}<span class="dev" lang="sa">{t.dev}</span>{:else if app.script === "iast"}<span class="iast" lang="sa-Latn">{t.iast}</span>{:else}<span class="dev" lang="sa">{t.dev}</span>{" "}<span class="iast-paren" lang="sa-Latn">({t.iast})</span>{/if}
{/snippet}

<details class="card panchang" open>
  <summary>
    <h2 style="display: inline; font-size: 1.15rem">Today in the Sanskrit calendar</h2>
    <span class="chip" style="margin-left: 0.5rem"><span class="dev" lang="sa">पञ्चाङ्ग</span></span>
  </summary>

  <p class="where">
    📍 {place.label}{#if coords}{" "}({coords}){:else if !saved}{" "}(default){/if} · {formatISOShort(pc.date)}
    {#if pc.sunrise}· sunrise {time(pc.sunrise)}{/if}
    {#if pc.sunset}· sunset {time(pc.sunset)}{/if}
    {#if beforeSunrise && pc.sunrise}<br />Before sunrise, so this is still yesterday's panchang.{/if}
  </p>

  <dl>
    {#each limbs as l (l.key)}
      <div class="limb">
        <dt>{l.name}</dt>
        <dd>
          <span class="big">{@render sk(l.term)}</span>
          {#if l.hint}<span class="hint">{l.hint}</span>{/if}
          {#if l.limb}<span class="until">until {endText(l.limb.endsAt)}</span>{/if}
        </dd>
      </div>
    {/each}
  </dl>

  {#if anyCloseCall}
    <p class="muted" style="margin: 0.3rem 0 0; font-size: 0.9rem">
      ⚠ One of these changes within minutes of sunrise, so other almanacs may name it differently today.
    </p>
  {/if}

  <div class="row controls">
    <button type="button" class="btn" onclick={() => locate()}>
      📍 {saved?.mode === "device" ? "Update my location" : "Use my location"}
    </button>
    <label class="visually-hidden" for="pc-city">Choose a city</label>
    <select id="pc-city" onchange={pickCity} style="min-height: 44px; font: inherit; padding: 0 0.5rem">
      <option value="" selected={saved?.mode !== "city"}>or choose a city…</option>
      {#each CITIES as c (c.label)}
        <option value={c.label} selected={saved?.mode === "city" && saved.label === c.label}>{c.label}</option>
      {/each}
    </select>
    {#if saved}<button type="button" class="btn btn-quiet" onclick={forget}>Forget my location</button>{/if}
  </div>
  <div aria-live="polite">
    {#if status === "locating"}
      <p class="muted" style="margin: 0.3rem 0 0">Finding your location…</p>
    {:else if status === "denied"}
      <p class="muted" style="margin: 0.3rem 0 0">Couldn't get your location, so this is showing {place.label}. You can pick a city instead.</p>
    {:else if status === "unsupported"}
      <p class="muted" style="margin: 0.3rem 0 0">This browser can't share a location. Please pick a city.</p>
    {/if}
  </div>

  <details class="faq about" style="margin-top: 0.4rem">
    <summary>About these terms</summary>
    <dl class="terms">
      {#each limbs as l (l.key)}
        <div class="limb">
          <dt>{l.name} · <span class="dev" lang="sa">{l.dev}</span></dt>
          <dd>{l.what}.{#if l.detail} <strong>Today:</strong> {l.detail}.{/if}</dd>
        </div>
      {/each}
    </dl>
    <p>
      <strong>Pañcāṅga</strong> (<span class="dev" lang="sa">पञ्चाङ्ग</span>): <em>pañca</em> means five and <em>aṅga</em>
      means limb. It is the traditional Indian almanac, built on these five elements of the day.
    </p>
    <p>
      <strong>Significance.</strong> It reckons time by the Sun and the Moon, which is why festival dates move around the
      calendar from year to year.
      <strong>Relevance.</strong> It is still used across India to fix festival and observance dates and family ceremonies.
      <strong>Usage here.</strong> A daily taste of Sanskrit time-words, not for predictions. Weekdays, ordinal numbers and
      star names are everyday vocabulary.
    </p>
    <p class="muted">
      {#if saved}Using {saved.label}.{:else}Showing {FALLBACK_PLACE.label} until you choose a place.{/if} Sunrise, and so the
      tithi, depend on where you are; your location stays on this device. Calculated astronomically (Lahiri ayanamsa) with
      values taken at sunrise. It can differ by a few minutes from printed almanacs, and traditions and regions differ, so for
      observance dates please check your local panchang. These names have not yet been reviewed by a Sanskrit scholar.
    </p>
  </details>
</details>
