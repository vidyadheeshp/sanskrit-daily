<script lang="ts">
  import { COUNTER_CODE } from "../config";
  import { app } from "../lib/store.svelte";
  import { exportJSON, parseImport } from "../lib/storage";
  import { localISO } from "../lib/date";
  import { t, type Key } from "../i18n";
  import { LANGUAGES } from "../i18n/langs";
  import type { ScriptSetting } from "../lib/markup";

  const scripts: { value: ScriptSetting; label: Key }[] = [
    { value: "both", label: "settings.script.both" },
    { value: "dev", label: "settings.script.dev" },
    { value: "iast", label: "settings.script.iast" },
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
    message = t("settings.msg.downloaded");
  }

  async function upload(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      message = t("settings.msg.tooLarge");
      return;
    }
    const parsed = parseImport(await file.text());
    if (!parsed) message = t("settings.msg.invalid");
    else if (confirm(t("settings.msg.confirmImport"))) {
      app.replace(parsed);
      message = t("settings.msg.imported");
    }
    input.value = "";
  }

  function reset() {
    if (confirm(t("settings.msg.confirmReset"))) {
      app.reset();
      message = t("settings.msg.deleted");
    }
  }
</script>

<h1>{t("settings.title")}</h1>

{#if !app.persisted}
  <div class="callout caution" role="alert">{t("settings.storageBlocked")}</div>
{/if}

<fieldset class="card">
  <legend>{t("settings.lang.legend")}</legend>
  {#each LANGUAGES as l (l.code)}
    <label class="radio">
      <input
        type="radio"
        name="language"
        value={l.code}
        checked={app.language === l.code}
        onchange={() => app.setLanguage(l.code)}
      />
      <span lang={l.code}>{l.native}</span>
      {#if l.native !== l.english}<span class="muted">({l.english})</span>{/if}
    </label>
  {/each}
  <p class="muted" style="margin: 0.4rem 0 0">{t("settings.lang.note")}</p>
</fieldset>

<fieldset class="card">
  <legend>{t("settings.script.legend")}</legend>
  {#each scripts as s}
    <label class="radio">
      <input type="radio" name="script" value={s.value} checked={app.script === s.value} onchange={() => app.setScript(s.value)} />
      {t(s.label)}
    </label>
  {/each}
</fieldset>

<div class="card stack">
  <h2>{t("settings.cal.title")}</h2>
  <label class="radio">
    <input
      type="checkbox"
      checked={app.state.settings.showPanchang}
      onchange={(e) => app.setShowPanchang(e.currentTarget.checked)}
    />
    {t("settings.cal.toggle")}
  </label>
  <p class="muted" style="margin: 0">{t("settings.cal.note")}</p>
</div>

<div class="card stack">
  <h2>{t("settings.counter.title")}</h2>
  {#if COUNTER_CODE}
    <label class="radio">
      <input
        type="checkbox"
        checked={app.state.settings.countVisits}
        onchange={(e) => app.setCountVisits(e.currentTarget.checked)}
      />
      {t("settings.counter.toggle")}
    </label>
    <p class="muted" style="margin: 0">{t("settings.counter.note")}</p>
  {:else}
    <p class="muted" style="margin: 0">{t("settings.counter.none")}</p>
  {/if}
</div>

<div class="card stack">
  <h2>{t("settings.progress.title")}</h2>
  <p class="muted">{t("settings.progress.body")}</p>
  <div class="row">
    <button type="button" class="btn" onclick={download}>{t("settings.btn.export")}</button>
    <label class="btn">
      {t("settings.btn.import")}
      <input type="file" accept="application/json,.json" onchange={upload} class="visually-hidden" />
    </label>
    <button type="button" class="btn btn-danger" onclick={reset}>{t("settings.btn.delete")}</button>
  </div>
  <div aria-live="polite">{#if message}<p>{message}</p>{/if}</div>
</div>
