<script lang="ts">
  import { app } from "../lib/store.svelte";

  let { required, onDone }: { required: number; onDone: () => void } = $props();

  interface Option {
    id: string;
    dev: string;
    iast: string;
    resultDev: string;
    out: string; // what the final t becomes (IAST)
    changed: boolean;
    note: string;
  }

  const options: Option[] = [
    {
      id: "ca",
      dev: "च",
      iast: "ca",
      resultDev: "तच्च",
      out: "c",
      changed: true,
      note: "c is made at the palate. The t moves to the palate and becomes c.",
    },
    {
      id: "jayati",
      dev: "जयति",
      iast: "jayati",
      resultDev: "तज्जयति",
      out: "j",
      changed: true,
      note: "j is a palate sound too. The t copies it exactly and becomes j.",
    },
    {
      id: "tika",
      dev: "टीका",
      iast: "ṭīkā",
      resultDev: "तट्टीका",
      out: "ṭ",
      changed: true,
      note: "ṭ is made at the roof of the mouth. The t moves there and becomes ṭ.",
    },
    {
      id: "labhate",
      dev: "लभते",
      iast: "labhate",
      resultDev: "तल्लभते",
      out: "l",
      changed: true,
      note: "The t becomes a copy of the next sound: l.",
    },
    {
      id: "karoti",
      dev: "करोति",
      iast: "karoti",
      resultDev: "तत्करोति",
      out: "t",
      changed: false,
      note: "k is not one of the sounds that pulls the t. Nothing changes.",
    },
    {
      id: "pathati",
      dev: "पठति",
      iast: "paṭhati",
      resultDev: "तत्पठति",
      out: "t",
      changed: false,
      note: "p is made at the lips, far from where the shift happens. Nothing changes.",
    },
  ];

  let selected = $state<string | null>(null);
  let tried = $state<string[]>([]);

  const current = $derived(options.find((o) => o.id === selected) ?? null);

  function pick(id: string) {
    selected = id;
    if (!tried.includes(id)) {
      tried = [...tried, id];
      if (tried.length >= required) onDone();
    }
  }
</script>

<p class="muted" style="margin-bottom: 0.3rem">What comes after तत् (tat)?</p>
<div class="picker" role="group" aria-label="Choose the following word">
  {#each options as o (o.id)}
    <button
      type="button"
      class="place-btn"
      style="width: auto"
      aria-pressed={selected === o.id}
      onclick={() => pick(o.id)}
    >
      {#if app.script !== "iast"}<span class="dev" lang="sa">{o.dev}</span>{/if}
      {#if app.script !== "dev"}<span class="iast" lang="sa-Latn">{o.iast}</span>{/if}
    </button>
  {/each}
</div>

<div aria-live="polite">
  {#if current}
    <div class="sandhi-stage">
      <div class="word-tile">
        {#if app.script !== "iast"}<span class="dev" lang="sa">तत्</span>{/if}
        {#if app.script !== "dev"}<span class="iast" lang="sa-Latn">tat</span>{/if}
      </div>
      <span class="arrow" aria-hidden="true">+</span>
      <div class="word-tile">
        {#if app.script !== "iast"}<span class="dev" lang="sa">{current.dev}</span>{/if}
        {#if app.script !== "dev"}<span class="iast" lang="sa-Latn">{current.iast}</span>{/if}
      </div>
      <span class="arrow" aria-hidden="true">⇒</span>
      <div class="word-tile result">
        {#if app.script !== "iast"}<span class="dev" lang="sa">{current.resultDev}</span>{/if}
        {#if app.script !== "dev"}
          {#key current.id}
            <span class="iast" lang="sa-Latn"
              >ta<span class:changed={current.changed} class:pop={current.changed}>{current.out}</span
              > {current.iast}</span
            >
          {/key}
        {/if}
      </div>
    </div>
    <div class="callout">
      <strong>{current.changed ? "The t changed." : "The t stayed."}</strong>
      {current.note}
    </div>
  {/if}
</div>

<p class="counter">{Math.min(tried.length, required)} of {required} tried</p>
