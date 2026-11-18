<script lang="ts">
  import type { MatchStep } from "../lib/schema";
  import { seededShuffle } from "../lib/shuffle";
  import Rich from "./Rich.svelte";

  let { step, onDone }: { step: MatchStep; onDone: (firstTry: boolean) => void } = $props();

  const left = $derived(step.pairs.map((p, i) => ({ i, text: p[0] })));
  const right = $derived(
    seededShuffle(
      step.pairs.map((p, i) => ({ i, text: p[1] })),
      step.id,
    ),
  );

  type Pick = { side: "L" | "R"; i: number } | null;
  let selection = $state<Pick>(null);
  let matched = $state<number[]>([]);
  let misses = $state(0);
  let miss = $state(false);

  const solved = $derived(matched.length === step.pairs.length);

  function choose(side: "L" | "R", i: number) {
    if (solved || matched.includes(i)) return;
    miss = false;
    if (!selection || selection.side === side) {
      selection = { side, i };
      return;
    }
    if (selection.i === i) {
      matched = [...matched, i];
      selection = null;
      if (matched.length === step.pairs.length) onDone(misses === 0);
    } else {
      misses += 1;
      miss = true;
      selection = null;
    }
  }

  const isSel = (side: "L" | "R", i: number) => selection?.side === side && selection.i === i;
</script>

<p class="muted" style="margin-bottom: 0">Tap one item on the left, then its partner on the right.</p>
<div class="match-grid">
  <div class="match-col">
    {#each left as item (item.i)}
      <button
        type="button"
        class="match-item"
        class:selected={isSel("L", item.i)}
        class:matched={matched.includes(item.i)}
        aria-pressed={isSel("L", item.i)}
        onclick={() => choose("L", item.i)}
      >
        <Rich text={item.text} inline />
      </button>
    {/each}
  </div>
  <div class="match-col">
    {#each right as item (item.i)}
      <button
        type="button"
        class="match-item"
        class:selected={isSel("R", item.i)}
        class:matched={matched.includes(item.i)}
        aria-pressed={isSel("R", item.i)}
        onclick={() => choose("R", item.i)}
      >
        <Rich text={item.text} inline />
      </button>
    {/each}
  </div>
</div>

<div aria-live="polite">
  {#if miss}
    <div class="feedback bad"><strong>Not a pair.</strong> Think about where each sound is made, then try again.</div>
  {/if}
  {#if solved}
    <div class="feedback good">
      <strong>All matched!</strong>
      {#if step.why}<Rich text={step.why} inline />{/if}
    </div>
  {/if}
</div>
