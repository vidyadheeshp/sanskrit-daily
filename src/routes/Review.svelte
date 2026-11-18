<script lang="ts">
  import { MAX_REVIEW_PER_SESSION } from "../config";
  import { localISO } from "../lib/date";
  import { dueItems } from "../lib/srs";
  import { app } from "../lib/store.svelte";
  import { getLesson } from "../lessons";
  import type { ExerciseStep } from "../lib/schema";
  import ExerciseStepView from "../components/ExerciseStep.svelte";

  interface Item {
    id: string;
    step: ExerciseStep;
  }

  // Computed once: answering changes due dates, but the session's queue stays fixed.
  const queue: Item[] = dueItems(app.state.review, localISO(), MAX_REVIEW_PER_SESSION).flatMap((id) => {
    const [n, stepId] = id.split(":");
    const step = getLesson(Number(n))?.steps.find((s) => s.id === stepId);
    return step && step.kind === "exercise" ? [{ id, step }] : [];
  });

  let pos = $state(0);
  let answered = $state(false);

  function onDone(firstTry: boolean) {
    app.gradeReview(queue[pos].id, firstTry);
    answered = true;
  }
  function next() {
    pos += 1;
    answered = false;
  }
</script>

<h1>Quick review</h1>

{#if queue.length === 0}
  <div class="card stack">
    <p>Nothing to review right now. 🌿</p>
    <a class="btn btn-primary" href="#/">Back home</a>
  </div>
{:else if pos >= queue.length}
  <div class="card stack">
    <h2>That's it for now 🌿</h2>
    <p>These questions will come back later, spaced further apart each time you get them right.</p>
    <a class="btn btn-primary" href="#/">Back home</a>
  </div>
{:else}
  <p class="muted">Question {pos + 1} of {queue.length}. No hints here — just recall.</p>
  <div class="card">
    {#key queue[pos].id}
      <ExerciseStepView step={queue[pos].step} showHint={false} {onDone} />
    {/key}
  </div>
  <div class="step-actions">
    <a class="btn btn-quiet" href="#/">Stop for now</a>
    <button type="button" class="btn btn-primary" disabled={!answered} onclick={next}>
      {pos === queue.length - 1 ? "Finish" : "Next →"}
    </button>
  </div>
{/if}
