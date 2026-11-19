<script lang="ts">
  import { app } from "../lib/store.svelte";
  import { LANGUAGES } from "../i18n/langs";
  import { t } from "../i18n";
</script>

<div class="lang-switch" role="group" aria-label={t("lang.group")}>
  {#each LANGUAGES as l (l.code)}
    <button
      type="button"
      lang={l.code}
      title={l.english}
      class:active={app.language === l.code}
      aria-pressed={app.language === l.code}
      onclick={() => app.setLanguage(l.code)}
    >
      {l.native}
    </button>
  {/each}
</div>
