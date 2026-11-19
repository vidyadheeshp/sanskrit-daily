<script lang="ts">
  import type { ExerciseStep } from "../lib/schema";
  import { t } from "../i18n";
  import Rich from "./Rich.svelte";
  import ChoiceExercise from "./ChoiceExercise.svelte";
  import TilesExercise from "./TilesExercise.svelte";
  import MatchExercise from "./MatchExercise.svelte";

  /**
   * `showHint`: offer the hint button (guided questions during a lesson; never in review).
   * `onDone(firstTry)` fires once, when the learner has the right answer.
   */
  let {
    step,
    showHint = false,
    onDone,
  }: { step: ExerciseStep; showHint?: boolean; onDone: (firstTry: boolean) => void } = $props();

  let hintOpen = $state(false);
</script>

<h2><Rich text={step.prompt} inline /></h2>

{#if showHint && step.hint}
  {#if hintOpen}
    <div class="callout" role="note"><strong>{t("exercise.hint")}</strong> <Rich text={step.hint} inline /></div>
  {:else}
    <button type="button" class="btn btn-quiet" onclick={() => (hintOpen = true)}>{t("exercise.needHint")}</button>
  {/if}
{/if}

{#if step.type === "choice"}
  <ChoiceExercise {step} {onDone} />
{:else if step.type === "tiles"}
  <TilesExercise {step} {onDone} />
{:else if step.type === "match"}
  <MatchExercise {step} {onDone} />
{/if}
