<script lang="ts">
  import { onMount } from "svelte";
  import { formatISOShort } from "../lib/date";
  import { app } from "../lib/store.svelte";
  import { civilDateAt, panchangFor, CITIES, FALLBACK_PLACE, type Limb, type Panchang, type Place } from "../lib/panchang/panchang";
  import { VARAS, type Term } from "../lib/panchang/terms";
  import { clearPlace, loadPlace, roundCoord, savePlace, type SavedPlace } from "../lib/place";
  import { cityName, dyn, locale, t, timeLocale, type Key } from "../i18n";
  import Msg from "./Msg.svelte";

  /**
   * "Today in the Sanskrit calendar": a compact, language-first card of the five limbs of the day.
   * Compact by design: one or two lines per term. Definitions and the note on what a pañcāṅga is live in the
   * collapsed "About these terms" section.
   * Deliberately NOT included: auspicious/inauspicious timings, rahu kāla, muhūrta or any prediction.
   * Calculated entirely in the browser. Location is optional, opt-in, rounded, and never leaves the device.
   * Interface text is translated; the Sanskrit names are shown in the learner's chosen script.
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
  /** The place's name for people: "Your location" for a shared location, else the city in this language. */
  const placeName = $derived(saved?.mode === "device" ? t("panchang.yourLocation") : cityName(place.label));

  const pad = (n: number) => String(n).padStart(2, "0");
  const time = (d: Date) =>
    new Intl.DateTimeFormat(timeLocale(), { timeZone: place.tz, hour: "numeric", minute: "2-digit", hour12: true }).format(d);
  const endText = (d: Date) => {
    const c = civilDateAt(d, place.tz);
    if (`${c.y}-${pad(c.m)}-${pad(c.d)}` === pc.date) return time(d);
    return `${new Intl.DateTimeFormat(timeLocale(), { timeZone: place.tz, weekday: "short" }).format(d)} ${time(d)}`;
  };
  const beforeSunrise = $derived.by(() => {
    const c = civilDateAt(now, place.tz);
    return `${c.y}-${pad(c.m)}-${pad(c.d)}` !== pc.date;
  });

  const weekday = $derived(VARAS.indexOf(pc.vara.term));
  const ordinal = $derived(dyn("panchang.ordinal", pc.tithi.numberInPaksha));

  /** One short, accurate line of meaning beside the term (language value: ordinals and planets). */
  const tithiHint = $derived.by(() => {
    const n = pc.tithi.number;
    if (n === 15) return t("panchang.hint.full");
    if (n === 30) return t("panchang.hint.new");
    return t(n <= 15 ? "panchang.hint.shukla" : "panchang.hint.krishna", { ordinal });
  });
  /** The longer wording, shown in "About these terms". */
  const tithiDetail = $derived.by(() => {
    const n = pc.tithi.number;
    if (n === 15) return t("panchang.detail.full");
    if (n === 30) return t("panchang.detail.new");
    return t(n <= 15 ? "panchang.detail.shukla" : "panchang.detail.krishna", { ordinal });
  });

  const limbs = $derived<
    Array<{ key: string; name: string; dev: string; what: string; term: Term; hint?: string; detail?: string; limb?: Limb }>
  >([
    {
      key: "vara",
      name: t("panchang.vara"),
      dev: "वार",
      what: t("panchang.what.vara"),
      term: pc.vara.term,
      hint: dyn("panchang.vara.short", weekday),
      detail: dyn("panchang.vara.gloss", weekday),
    },
    {
      key: "tithi",
      name: t("panchang.tithi"),
      dev: "तिथि",
      what: t("panchang.what.tithi"),
      term: pc.tithi.term,
      hint: tithiHint,
      detail: tithiDetail,
      limb: pc.tithi,
    },
    { key: "nakshatra", name: t("panchang.nakshatra"), dev: "नक्षत्र", what: t("panchang.what.nakshatra"), term: pc.nakshatra.term, limb: pc.nakshatra },
    { key: "yoga", name: t("panchang.yoga"), dev: "योग", what: t("panchang.what.yoga"), term: pc.yoga.term, limb: pc.yoga },
    { key: "karana", name: t("panchang.karana"), dev: "करण", what: t("panchang.what.karana"), term: pc.karana.term, limb: pc.karana },
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
          label: "Your location", // stored in English; shown translated (see placeName)
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

{#snippet sk(term: Term)}
  {#if app.script === "dev"}<span class="dev" lang="sa">{term.dev}</span>{:else if app.script === "iast"}<span class="iast" lang="sa-Latn">{term.iast}</span>{:else}<span class="dev" lang="sa">{term.dev}</span>{" "}<span class="iast-paren" lang="sa-Latn">({term.iast})</span>{/if}
{/snippet}

<details class="card panchang" open>
  <summary>
    <h2 style="display: inline; font-size: 1.15rem">{t("panchang.title")}</h2>
    <span class="chip" style="margin-left: 0.5rem"><span class="dev" lang="sa">पञ्चाङ्ग</span></span>
  </summary>

  <p class="where">
    📍 {placeName}{#if coords}{" "}({coords}){:else if !saved}{" "}{t("panchang.default")}{/if} · {formatISOShort(pc.date, locale())}
    {#if pc.sunrise}· {t("panchang.sunrise", { time: time(pc.sunrise) })}{/if}
    {#if pc.sunset}· {t("panchang.sunset", { time: time(pc.sunset) })}{/if}
    {#if beforeSunrise && pc.sunrise}<br />{t("panchang.beforeSunrise")}{/if}
  </p>

  <dl>
    {#each limbs as l (l.key)}
      <div class="limb">
        <dt>{l.name}</dt>
        <dd>
          <span class="big">{@render sk(l.term)}</span>
          {#if l.hint}<span class="hint">{l.hint}</span>{/if}
          {#if l.limb}<span class="until">{t("panchang.until", { time: endText(l.limb.endsAt) })}</span>{/if}
        </dd>
      </div>
    {/each}
  </dl>

  {#if anyCloseCall}
    <p class="muted" style="margin: 0.3rem 0 0; font-size: 0.9rem">{t("panchang.closeCall")}</p>
  {/if}

  <div class="row controls">
    <button type="button" class="btn" onclick={() => locate()}>
      {saved?.mode === "device" ? t("panchang.update") : t("panchang.locate")}
    </button>
    <label class="visually-hidden" for="pc-city">{t("panchang.city.label")}</label>
    <select id="pc-city" onchange={pickCity} style="min-height: 44px; font: inherit; padding: 0 0.5rem">
      <option value="" selected={saved?.mode !== "city"}>{t("panchang.city.placeholder")}</option>
      {#each CITIES as c (c.label)}
        <option value={c.label} selected={saved?.mode === "city" && saved.label === c.label}>{cityName(c.label)}</option>
      {/each}
    </select>
    {#if saved}<button type="button" class="btn btn-quiet" onclick={forget}>{t("panchang.forget")}</button>{/if}
  </div>
  <div aria-live="polite">
    {#if status === "locating"}
      <p class="muted" style="margin: 0.3rem 0 0">{t("panchang.locating")}</p>
    {:else if status === "denied"}
      <p class="muted" style="margin: 0.3rem 0 0">{t("panchang.denied", { place: placeName })}</p>
    {:else if status === "unsupported"}
      <p class="muted" style="margin: 0.3rem 0 0">{t("panchang.unsupported")}</p>
    {/if}
  </div>

  <details class="faq about" style="margin-top: 0.4rem">
    <summary>{t("panchang.about.summary")}</summary>
    <dl class="terms">
      {#each limbs as l (l.key)}
        <div class="limb">
          <dt>{l.name} · <span class="dev" lang="sa">{l.dev}</span></dt>
          <dd>{l.what}.{#if l.detail}{" "}<Msg k="panchang.about.today" p={{ detail: l.detail }} />{/if}</dd>
        </div>
      {/each}
    </dl>
    <p><Msg k="panchang.about.pancanga" /></p>
    <p><Msg k="panchang.about.meaning" /></p>
    <p class="muted">
      {saved
        ? t("panchang.about.using", { place: placeName })
        : t("panchang.about.showing", { place: cityName(FALLBACK_PLACE.label) })}
      {t("panchang.about.method")}
    </p>
  </details>
</details>
