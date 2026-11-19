<script lang="ts">
  import { tick, untrack } from "svelte";
  import { app } from "../lib/store.svelte";
  import { t } from "../i18n";
  import { getWeek, lessonRange } from "../weeks";
  import { badgePng, badgeShareText, badgeSvg } from "../lib/badge";
  import ExerciseStepView from "../components/ExerciseStep.svelte";
  import Msg from "../components/Msg.svelte";

  /**
   * The weekly check: a short set of questions on the whole week, then a plain thank-you badge.
   * No pass mark, no timer, unlimited retakes. Finishing (not scoring) earns the badge; nothing leaves the device.
   */
  let { n }: { n: number } = $props();

  const week = $derived(getWeek(n));
  const first = $derived(lessonRange(n)[0]);
  const last = $derived(lessonRange(n)[1]);
  const missing = $derived(Array.from({ length: last - first + 1 }, (_, i) => first + i).filter((k) => !app.isCompleted(k)));

  let mode = $state<"intro" | "quiz" | "result">(untrack(() => app.isWeekDone(n)) ? "result" : "intro");
  let index = $state(0);
  let answered = $state(false);
  let rightFirstTry = $state<number | null>(null); // only known after taking the check in this visit
  let panel: HTMLElement | undefined = $state();

  const total = $derived(week?.questions.length ?? 0);
  const question = $derived(week?.questions[index]);
  const isLast = $derived(index === total - 1);

  const siteUrl = $derived(new URL(import.meta.env.BASE_URL, location.origin).href);
  const svg = $derived(badgeSvg(n, siteUrl.replace(/^https?:\/\//, "")));
  const message = $derived(badgeShareText(n, siteUrl));
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  let status = $state<"" | "copied" | "manual" | "imageFailed">("");

  function start() {
    index = 0;
    answered = false;
    rightFirstTry = 0;
    mode = "quiz";
  }

  async function advance() {
    if (isLast) {
      app.completeWeek(n);
      mode = "result";
    } else {
      index += 1;
      answered = false;
    }
    await tick();
    panel?.focus();
  }

  function onDone(firstTry: boolean) {
    answered = true;
    if (firstTry && rightFirstTry !== null) rightFirstTry += 1;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      status = "copied";
    } catch {
      status = "manual";
    }
  }

  async function download() {
    const blob = await badgePng(svg);
    if (!blob) {
      status = "imageFailed";
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dine-dine-week-${n}.png`;
    a.click();
    URL.revokeObjectURL(url);
    status = "";
  }

  async function nativeShare() {
    try {
      const blob = await badgePng(svg);
      const file = blob ? new File([blob], `dine-dine-week-${n}.png`, { type: "image/png" }) : null;
      const withFile = file && navigator.canShare?.({ files: [file] });
      await navigator.share(withFile ? { text: message, files: [file] } : { text: message });
    } catch {
      /* the share sheet was closed — nothing to do */
    }
  }
</script>

{#if !week}
  <div class="card stack">
    <h1>{t("week.missing.title")}</h1>
    <p>{t("week.missing.body")}</p>
    <a class="btn btn-primary" href="#/archive">{t("week.back")}</a>
  </div>
{:else if mode === "intro" && missing.length > 0}
  <div class="card stack">
    <h1>{t("week.locked.title")}</h1>
    <p>{t("week.locked.body", { n, first, last })}</p>
    <ul class="row" style="list-style: none; padding: 0; margin: 0">
      {#each missing as k (k)}
        <li><a class="btn" href="#/day/{k}">{t("week.locked.item", { n: k })}</a></li>
      {/each}
    </ul>
  </div>
{:else if mode === "intro"}
  <div class="card stack">
    <div class="row spread">
      <span class="chip">{t("week.title", { n })}</span>
      {#if !week.reviewed}<span class="chip warn" title={t("lesson.notReviewedTitle")}>{t("lesson.notReviewed")}</span>{/if}
    </div>
    <h1>{t("week.title", { n })}</h1>
    <p>{t("week.intro", { count: total })}</p>
    <div class="row">
      <button type="button" class="btn btn-primary" onclick={start}>{t("week.start")}</button>
      <a class="btn btn-quiet" href="#/archive">{t("week.back")}</a>
    </div>
  </div>
{:else if mode === "quiz" && question}
  <header class="stack" style="margin-bottom: 1rem">
    <span class="chip">{t("week.title", { n })}</span>
    <div
      class="progress"
      role="progressbar"
      aria-valuemin="1"
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-label={t("week.progress.aria")}
    >
      <div style="width: {((index + 1) / total) * 100}%"></div>
    </div>
    <div class="muted" style="font-size: 0.9rem">{t("week.question", { n: index + 1, total })}</div>
  </header>

  <section class="card" bind:this={panel} tabindex="-1" aria-label={t("week.title", { n })} style="outline: none">
    {#key question.id}
      <ExerciseStepView step={question} {onDone} />
    {/key}
  </section>

  <div class="step-actions">
    <span></span>
    <button type="button" class="btn btn-primary" disabled={!answered} onclick={advance}>
      {isLast ? t("week.seeResult") : t("week.next")}
    </button>
  </div>
  {#if !answered}
    <p class="muted" style="text-align: right; font-size: 0.9rem; margin-top: 0.4rem">{t("lesson.hint.answer")}</p>
  {/if}
{:else}
  <section class="card stack" aria-labelledby="week-done-h">
    <h1 id="week-done-h">{t("week.result.title", { n })}</h1>
    <p>
      {#if rightFirstTry !== null}
        <Msg k="week.result.score" p={{ right: rightFirstTry, total }} />
      {:else}
        {t("week.result.done", { n })}
      {/if}
    </p>

    <h2>{t("week.badge.title")}</h2>
    <figure class="badge" aria-label={t("week.badge.alt", { n })} style="margin: 0">
      {@html svg}
    </figure>
    <p class="muted" style="margin: 0">{t("week.badge.note")}</p>

    <div class="row">
      <button type="button" class="btn btn-primary" onclick={download}>{t("week.badge.download")}</button>
      <button type="button" class="btn" onclick={copy}>{t("week.badge.copy")}</button>
      {#if canShare}<button type="button" class="btn" onclick={nativeShare}>{t("week.badge.share")}</button>{/if}
    </div>
    <div aria-live="polite">
      {#if status === "copied"}
        <p class="muted" style="margin: 0">{t("week.badge.copied")}</p>
      {:else if status === "manual"}
        <p class="muted" style="margin: 0 0 0.3rem">{t("week.badge.manual")}</p>
        <textarea readonly rows="3" style="width: 100%; font: inherit" onfocus={(e) => e.currentTarget.select()}>{message}</textarea>
      {:else if status === "imageFailed"}
        <p class="muted" style="margin: 0">{t("week.badge.imageFailed")}</p>
      {/if}
    </div>

    {#if week.next}
      <div class="callout" role="note">
        <strong>{t("week.next.title")}</strong>
        <p lang={app.lessonLang} style="margin: 0.3rem 0 0">{week.next}</p>
      </div>
    {/if}

    <div class="row">
      <button type="button" class="btn" onclick={start}>{t("week.result.again")}</button>
      <a class="btn btn-quiet" href="#/">{t("common.backHome")}</a>
      <a class="btn btn-quiet" href="#/archive">{t("common.archive")}</a>
    </div>
  </section>
{/if}

<style>
  .badge :global(svg) {
    display: block;
    width: 100%;
    max-width: 340px;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  }
</style>
