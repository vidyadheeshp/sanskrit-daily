<script lang="ts">
  import { openThrough, scheduleToday, unlockText } from "../lib/access";
  import { t } from "../i18n";
  import { allNumbers, getLesson } from "../lessons";
  import LessonPlayer from "../components/LessonPlayer.svelte";

  let { n }: { n: number } = $props();

  const today = scheduleToday(); // IST
  const known = $derived(allNumbers.includes(n));
  const locked = $derived(n > openThrough(today));
  const lesson = $derived(getLesson(n));
</script>

{#if !known}
  <div class="card stack">
    <h1>{t("day.missing.title", { n })}</h1>
    <p>{t("day.missing.body")}</p>
    <a class="btn btn-primary" href="#/archive">{t("common.openArchive")}</a>
  </div>
{:else if locked}
  <div class="card stack">
    <h1>{t("day.locked.title", { n })}</h1>
    <p><strong>{unlockText(n)}.</strong></p>
    <p class="muted">{t("day.locked.body")}</p>
    <div class="row">
      <a class="btn btn-primary" href="#/">{t("common.backToday")}</a>
      <a class="btn" href="#/archive">{t("common.archive")}</a>
    </div>
  </div>
{:else if lesson}
  {#key lesson.number}
    <LessonPlayer {lesson} />
  {/key}
{:else}
  <div class="card stack">
    <h1>{t("day.unavailable.title", { n })}</h1>
    <p>{t("day.unavailable.body")}</p>
    <a class="btn btn-primary" href="#/">{t("common.backToday")}</a>
  </div>
{/if}
