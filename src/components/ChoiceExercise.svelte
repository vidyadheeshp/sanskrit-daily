<script lang="ts">
  import type { ChoiceStep } from "../lib/schema";
  import { t } from "../i18n";
  import Rich from "./Rich.svelte";

  let { step, onDone }: { step: ChoiceStep; onDone: (firstTry: boolean) => void } = $props();

  let tried = $state<number[]>([]);
  let last = $state<number | null>(null);
  let solved = $state(false);
  let misses = $state(0);

  function pick(i: number) {
    if (solved || tried.includes(i)) return;
    tried = [...tried, i];
    last = i;
    if (step.options[i].correct) {
      solved = true;
      onDone(misses === 0);
    } else {
      misses += 1;
    }
  }
</script>

<div class="options" role="group" aria-label={t("choice.answers")}>
  {#each step.options as opt, i}
    <button
      type="button"
      class="option"
      class:wrong={tried.includes(i) && !opt.correct}
      class:right={solved && opt.correct}
      disabled={solved || tried.includes(i)}
      onclick={() => pick(i)}
    >
      {#if tried.includes(i) && !opt.correct}<span aria-hidden="true">✗ </span><span class="visually-hidden">{t("choice.incorrect")}</span>{/if}
      {#if solved && opt.correct}<span aria-hidden="true">✓ </span><span class="visually-hidden">{t("choice.correct")}</span>{/if}
      <Rich text={opt.text} inline />
    </button>
  {/each}
</div>

<div aria-live="polite">
  {#if last !== null}
    {@const opt = step.options[last]}
    <div class="feedback" class:good={opt.correct} class:bad={!opt.correct}>
      <strong>{opt.correct ? t("choice.yes") : t("choice.notQuite")}</strong>
      <Rich text={opt.why} inline />
    </div>
  {/if}
</div>
