<script lang="ts">
  import type { DemoStep } from "../lib/schema";
  import Rich from "./Rich.svelte";
  import PlaceChart from "./PlaceChart.svelte";
  import SandhiDemo from "./SandhiDemo.svelte";
  import RevealCards from "./RevealCards.svelte";
  import WordByWord from "./WordByWord.svelte";

  let { step, onDone }: { step: DemoStep; onDone: () => void } = $props();
</script>

{#if step.title}<h2>{step.title}</h2>{/if}
<Rich text={step.prompt} />
{#if step.widget === "place-chart"}
  <PlaceChart required={step.requiredInteractions} {onDone} />
{:else if step.widget === "sandhi-demo"}
  <SandhiDemo required={step.requiredInteractions} {onDone} />
{:else if step.widget === "reveal-cards"}
  <RevealCards cards={step.cards ?? []} required={step.requiredInteractions} {onDone} />
{:else if step.widget === "word-by-word"}
  <WordByWord sentences={step.sentences ?? []} required={step.requiredInteractions} {onDone} />
{/if}
