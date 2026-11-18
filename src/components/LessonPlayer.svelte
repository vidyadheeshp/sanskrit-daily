<script lang="ts">
  import { tick } from "svelte";
  import type { Lesson, RecapStep } from "../lib/schema";
  import { app } from "../lib/store.svelte";
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

  const stage = $derived(
    step.kind === "explain"
      ? "Learn"
      : step.kind === "demo"
        ? "Explore"
        : step.kind === "exercise"
          ? step.guided
            ? "Try it"
            : "Prove it"
          : "Remember",
  );

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
    <h1 id="done-h">Done for today 🌿</h1>
    <p>Nicely done. That is the whole lesson — there is nothing more to do, and no streak to protect.</p>
    <div class="rule-box"><Rich text={recap.rule} /></div>
    <p class="muted">
      Saved to My Notes on this device. You have practised on <strong>{app.daysPractised}</strong>
      {app.daysPractised === 1 ? "day" : "days"} in total.
    </p>
    <div class="row">
      <a class="btn btn-primary" href="#/">Back home</a>
      <a class="btn" href="#/notes">My notes</a>
      <a class="btn" href="#/archive">Archive</a>
    </div>
    <h2 style="margin-top: 0.5rem">Know someone who'd enjoy this?</h2>
    <ShareButton {lesson} />
  </section>
{:else}
  <header class="stack" style="margin-bottom: 1rem">
    <div class="row spread">
      <span class="chip">Lesson {lesson.number} · ~{lesson.minutes} min</span>
      {#if !lesson.reviewed}<span class="chip warn" title="See About for what this means">Not yet scholar-reviewed</span>{/if}
    </div>
    <h1>{lesson.title}</h1>
    <div
      class="progress"
      role="progressbar"
      aria-valuemin="1"
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-label="Lesson progress"
    >
      <div style="width: {((index + 1) / total) * 100}%"></div>
    </div>
    <div class="muted" style="font-size: 0.9rem">Step {index + 1} of {total}</div>
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
    <button type="button" class="btn btn-quiet" disabled={index === 0} onclick={() => go(-1)}>← Back</button>
    <button type="button" class="btn btn-primary" disabled={!canContinue} onclick={next}>
      {isLast ? "Finish lesson" : "Continue →"}
    </button>
  </div>
  {#if !canContinue}
    <p class="muted" style="text-align: right; font-size: 0.9rem; margin-top: 0.4rem">
      {step.kind === "demo" ? "Finish exploring to continue." : "Answer correctly to continue."}
    </p>
  {/if}
{/if}
