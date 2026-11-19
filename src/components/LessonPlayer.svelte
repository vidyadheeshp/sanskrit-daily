<script lang="ts">
  import { tick } from "svelte";
  import type { Lesson, RecapStep } from "../lib/schema";
  import { app } from "../lib/store.svelte";
  import { t, type Key } from "../i18n";
  import Msg from "./Msg.svelte";
  import Rich from "./Rich.svelte";
  import ShareButton from "./ShareButton.svelte";
  import ExplainStepView from "./ExplainStep.svelte";
  import DemoStepView from "./DemoStep.svelte";
  import ExerciseStepView from "./ExerciseStep.svelte";
  import RecapStepView from "./RecapStep.svelte";

  let { lesson }: { lesson: Lesson } = $props();

  let index = $state(0);
  let done = $state<Record<string, boolean>>({});
  let finished = $state(false);
  let panel: HTMLElement | undefined = $state();

  const total = $derived(lesson.steps.length);
  const step = $derived(lesson.steps[index]);
  const isLast = $derived(index === total - 1);
  const canContinue = $derived(step.kind === "explain" || step.kind === "recap" || done[step.id] === true);

  const stageKey = $derived<Key>(
    step.kind === "explain"
      ? "stage.learn"
      : step.kind === "demo"
        ? "stage.explore"
        : step.kind === "exercise"
          ? step.guided
            ? "stage.try"
            : "stage.prove"
          : "stage.remember",
  );
  const stage = $derived(t(stageKey));

  async function go(delta: number) {
    index += delta;
    await tick();
    panel?.focus();
  }

  function finish() {
    const recap = lesson.steps[total - 1] as RecapStep;
    const reviewIds = lesson.steps
      .filter((s) => s.kind === "exercise" && s.reviewItem)
      .map((s) => `${lesson.number}:${s.id}`);
    app.completeLesson(lesson.number, recap.rule, reviewIds);
    finished = true;
  }

  function next() {
    if (isLast) finish();
    else go(1);
  }
</script>

{#if finished}
  {@const recap = lesson.steps[total - 1] as RecapStep}
  <section class="card stack" aria-labelledby="done-h">
    <h1 id="done-h">{t("done.title")}</h1>
    <p>{t("done.body")}</p>
    <div class="rule-box"><Rich text={recap.rule} /></div>
    <p class="muted">
      <Msg k={app.daysPractised === 1 ? "done.practised.one" : "done.practised.many"} p={{ n: app.daysPractised }} />
    </p>
    <div class="row">
      <a class="btn btn-primary" href="#/">{t("common.backHome")}</a>
      <a class="btn" href="#/notes">{t("nav.notes")}</a>
      <a class="btn" href="#/archive">{t("common.archive")}</a>
    </div>
    <h2 style="margin-top: 0.5rem">{t("done.share")}</h2>
    <ShareButton {lesson} />
  </section>
{:else}
  <header class="stack" style="margin-bottom: 1rem">
    <div class="row spread">
      <span class="chip">{t("common.lessonMeta", { n: lesson.number, minutes: lesson.minutes })}</span>
      {#if !lesson.reviewed}<span class="chip warn" title={t("lesson.notReviewedTitle")}>{t("lesson.notReviewed")}</span>{/if}
    </div>
    <h1 lang={app.lessonLang}>{lesson.title}</h1>
    {#if app.lessonLang}
      <div class="callout" role="note"><Msg k="lang.lessonsEnglish" /></div>
    {/if}
    <div
      class="progress"
      role="progressbar"
      aria-valuemin="1"
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-label={t("lesson.progress.aria")}
    >
      <div style="width: {((index + 1) / total) * 100}%"></div>
    </div>
    <div class="muted" style="font-size: 0.9rem">{t("lesson.step", { n: index + 1, total })}</div>
  </header>

  <section class="card" bind:this={panel} tabindex="-1" aria-label={stage} style="outline: none">
    <div class="stage">{stage}</div>
    {#key step.id}
      {#if step.kind === "explain"}
        <ExplainStepView {step} />
      {:else if step.kind === "demo"}
        <DemoStepView {step} onDone={() => (done[step.id] = true)} />
      {:else if step.kind === "exercise"}
        <ExerciseStepView {step} showHint={step.guided === true} onDone={() => (done[step.id] = true)} />
      {:else}
        <RecapStepView {step} />
      {/if}
    {/key}
  </section>

  <div class="step-actions">
    <button type="button" class="btn btn-quiet" disabled={index === 0} onclick={() => go(-1)}>{t("lesson.back")}</button>
    <button type="button" class="btn btn-primary" disabled={!canContinue} onclick={next}>
      {isLast ? t("lesson.finish") : t("lesson.continue")}
    </button>
  </div>
  {#if !canContinue}
    <p class="muted" style="text-align: right; font-size: 0.9rem; margin-top: 0.4rem">
      {step.kind === "demo" ? t("lesson.hint.demo") : t("lesson.hint.answer")}
    </p>
  {/if}
{/if}
