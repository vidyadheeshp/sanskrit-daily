<script lang="ts">
  import { COUNTER_CODE } from "../config";
  import { app } from "../lib/store.svelte";
  import { exportJSON, parseImport } from "../lib/storage";
  import { localISO } from "../lib/date";
  import type { ScriptSetting } from "../lib/markup";

  const scripts: { value: ScriptSetting; label: string }[] = [
    { value: "both", label: "Both — देवनागरी and IAST" },
    { value: "dev", label: "Devanagari only — देवनागरी" },
    { value: "iast", label: "IAST (Roman) only" },
  ];

  let message = $state("");

  function download() {
    const blob = new Blob([exportJSON($state.snapshot(app.state))], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sanskrit-daily-progress-${localISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message = "Progress file downloaded.";
  }

  async function upload(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      message = "That file is too large to be a progress file.";
      return;
    }
    const parsed = parseImport(await file.text());
    if (!parsed) message = "That file isn't a valid progress file from this app. Nothing was changed.";
    else if (confirm("Replace the progress on this device with the contents of that file?")) {
      app.replace(parsed);
      message = "Progress imported.";
    }
    input.value = "";
  }

  function reset() {
    if (confirm("Delete all progress, notes and settings stored by this app on this device? This cannot be undone.")) {
      app.reset();
      message = "Everything was deleted.";
    }
  }
</script>

<h1>Settings</h1>

{#if !app.persisted}
  <div class="callout caution" role="alert">
    Your browser is not letting this app save data (private mode or blocked storage). Everything still works, but progress
    will be lost when you close the tab.
  </div>
{/if}

<fieldset class="card">
  <legend>Script</legend>
  {#each scripts as s}
    <label class="radio">
      <input type="radio" name="script" value={s.value} checked={app.script === s.value} onchange={() => app.setScript(s.value)} />
      {s.label}
    </label>
  {/each}
</fieldset>

<div class="card stack">
  <h2>Sanskrit calendar</h2>
  <label class="radio">
    <input
      type="checkbox"
      checked={app.state.settings.showPanchang}
      onchange={(e) => app.setShowPanchang(e.currentTarget.checked)}
    />
    Show today's panchang card on the Today page
  </label>
  <p class="muted" style="margin: 0">
    A small card of Sanskrit time-words for today. It is calculated in your browser; your location, if you share it, is
    never sent anywhere.
  </p>
</div>

<div class="card stack">
  <h2>Visit counter</h2>
  {#if COUNTER_CODE}
    <label class="radio">
      <input
        type="checkbox"
        checked={app.state.settings.countVisits}
        onchange={(e) => app.setCountVisits(e.currentTarget.checked)}
      />
      Count my visits anonymously
    </label>
    <p class="muted" style="margin: 0">
      This only adds one to a page-view total (via GoatCounter) — no cookies, no profile, and never what you answer
      or how you score. Your browser's “Do Not Track” setting is respected.
    </p>
  {:else}
    <p class="muted" style="margin: 0">This copy of the site has no visit counter.</p>
  {/if}
</div>

<div class="card stack">
  <h2>Your progress</h2>
  <p class="muted">
    There are no accounts. Your progress lives only in this browser. Export it to keep a backup or move to another device.
  </p>
  <div class="row">
    <button type="button" class="btn" onclick={download}>Export progress</button>
    <label class="btn">
      Import progress
      <input type="file" accept="application/json,.json" onchange={upload} class="visually-hidden" />
    </label>
    <button type="button" class="btn btn-danger" onclick={reset}>Delete everything</button>
  </div>
  <div aria-live="polite">{#if message}<p>{message}</p>{/if}</div>
</div>
