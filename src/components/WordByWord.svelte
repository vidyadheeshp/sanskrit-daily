<script lang="ts">
  import type { WordSentence } from "../lib/schema";
  import { t } from "../i18n";
  import Rich from "./Rich.svelte";

  let {
    sentences,
    required,
    onDone,
  }: { sentences: WordSentence[]; required: number; onDone: () => void } = $props();

  /** "sentenceIndex:wordIndex" of every word the learner has opened. */
  let revealed = $state<string[]>([]);

  const isOpen = (s: number, w: number) => revealed.includes(`${s}:${w}`);
  const allOpen = (s: number) => sentences[s].words.every((_, w) => isOpen(s, w));

  function open(s: number, w: number) {
    const key = `${s}:${w}`;
    if (revealed.includes(key)) return;
    revealed = [...revealed, key];
    if (revealed.length >= required) onDone();
  }
</script>

{#each sentences as sentence, s}
  <div class="card" style="margin-top: 0.9rem">
    <div class="wbw-row">
      {#each sentence.words as word, w}
        <button
          type="button"
          class="wbw-tile"
          class:open={isOpen(s, w)}
          aria-label={isOpen(s, w) ? t("wbw.means", { word: word.text.replace(/[{}|]/g, " "), gloss: word.gloss }) : undefined}
          onclick={() => open(s, w)}
        >
          <span class="wbw-word"><Rich text={word.text} inline /></span>
          <span class="wbw-gloss">{isOpen(s, w) ? word.gloss : t("wbw.tap")}</span>
        </button>
        {#if sentence.gap && sentence.gap.after === w && allOpen(s)}
          <div class="wbw-gap pop" aria-live="polite">
            <span class="wbw-gap-label">{sentence.gap.label}</span>
            <span class="wbw-gloss">{t("wbw.notNeeded")}</span>
          </div>
        {/if}
      {/each}
    </div>

    {#if allOpen(s)}
      <p style="margin: 0.7rem 0 0">
        {t("wbw.inEnglish", { text: sentence.english })}
      </p>
      {#if sentence.gap}<p class="muted" style="margin: 0.3rem 0 0"><Rich text={sentence.gap.note} inline /></p>{/if}
    {/if}
  </div>
{/each}

<p class="counter">{t("wbw.counter", { done: Math.min(revealed.length, required), total: required })}</p>
