<script lang="ts">
  import { app } from "../lib/store.svelte";
  import { t } from "../i18n";
  import { getLesson } from "../lessons";
  import Rich from "../components/Rich.svelte";

  const entries = $derived(
    Object.keys(app.state.notes)
      .map(Number)
      .sort((a, b) => a - b)
      .map((n) => ({ n, title: getLesson(n)?.title ?? t("archive.lockedLesson", { n }), rule: app.state.notes[String(n)] })),
  );
</script>

<h1>{t("notes.title")}</h1>
<p class="muted">{t("notes.lede")}</p>

{#if entries.length === 0}
  <div class="card"><p>{t("notes.empty")}</p></div>
{:else}
  {#each entries as e (e.n)}
    <div class="card">
      <div class="muted" style="font-size: 0.9rem">{t("notes.entry", { n: e.n, title: e.title })}</div>
      <Rich text={e.rule} />
    </div>
  {/each}
{/if}
