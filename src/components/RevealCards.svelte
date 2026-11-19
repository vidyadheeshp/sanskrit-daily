<script lang="ts">
  import type { RevealCard } from "../lib/schema";
  import { t } from "../i18n";
  import Rich from "./Rich.svelte";

  let {
    cards,
    required,
    onDone,
  }: { cards: RevealCard[]; required: number; onDone: () => void } = $props();

  let selected = $state<number | null>(null);
  let seen = $state<number[]>([]);

  const current = $derived(selected === null ? null : cards[selected]);

  function pick(i: number) {
    selected = i;
    if (!seen.includes(i)) {
      seen = [...seen, i];
      if (seen.length >= required) onDone();
    }
  }
</script>

<div class="places">
  {#each cards as c, i}
    <button type="button" class="place-btn" aria-pressed={selected === i} onclick={() => pick(i)}>
      <span><Rich text={c.word} inline /></span>
      {#if seen.includes(i)}<span class="seen" aria-label={t("reveal.explored.aria")}>✓</span>{/if}
    </button>
  {/each}
</div>

<div aria-live="polite">
  {#if current}
    <div class="card" style="margin-top: 0.9rem">
      <p class="muted" style="margin-bottom: 0.3rem">{t("reveal.builtFrom")}</p>
      <div class="row" style="margin-bottom: 0.6rem">
        {#each current.parts as part, j}
          {#if j > 0}<span class="arrow" aria-hidden="true">+</span>{/if}
          <div class="word-tile">
            <div><Rich text={part.text} inline /></div>
            <div class="muted" style="font-size: 0.9rem">{part.meaning}</div>
          </div>
        {/each}
      </div>
      <p style="margin-bottom: 0.3rem"><strong><Rich text={current.meaning} inline /></strong></p>
      <p class="muted" style="margin: 0"><Rich text={t("reveal.when", { use: current.use })} inline /></p>
    </div>
  {/if}
</div>

<p class="counter">{t("reveal.counter", { done: Math.min(seen.length, required), total: required })}</p>
