<script lang="ts">
  import { app } from "../lib/store.svelte";
  import Rich from "./Rich.svelte";

  let { required, onDone }: { required: number; onDone: () => void } = $props();

  interface Place {
    id: string;
    name: string;
    skt: string; // "{dev|iast}" markup
    how: string;
    x: number; // position on the front→back line
    letters: [string, string][];
  }

  // Ordered front of the mouth → back.
  const places: Place[] = [
    {
      id: "lips",
      name: "Lips",
      skt: "{ओष्ठ्य|oṣṭhya}",
      how: "Both lips touch.",
      x: 36,
      letters: [["प", "pa"], ["फ", "pha"], ["ब", "ba"], ["भ", "bha"], ["म", "ma"]],
    },
    {
      id: "teeth",
      name: "Teeth",
      skt: "{दन्त्य|dantya}",
      how: "The tongue tip touches the back of the upper teeth.",
      x: 100,
      letters: [["त", "ta"], ["थ", "tha"], ["द", "da"], ["ध", "dha"], ["न", "na"]],
    },
    {
      id: "roof",
      name: "Roof of the mouth",
      skt: "{मूर्धन्य|mūrdhanya}",
      how: "The tongue tip curls back to touch the ridge behind the teeth.",
      x: 168,
      letters: [["ट", "ṭa"], ["ठ", "ṭha"], ["ड", "ḍa"], ["ढ", "ḍha"], ["ण", "ṇa"]],
    },
    {
      id: "palate",
      name: "Palate",
      skt: "{तालव्य|tālavya}",
      how: "The flat of the tongue touches the hard palate.",
      x: 236,
      letters: [["च", "ca"], ["छ", "cha"], ["ज", "ja"], ["झ", "jha"], ["ञ", "ña"]],
    },
    {
      id: "back",
      name: "Back of the mouth",
      skt: "{कण्ठ्य|kaṇṭhya}",
      how: "The back of the tongue touches the soft palate, near the throat.",
      x: 296,
      letters: [["क", "ka"], ["ख", "kha"], ["ग", "ga"], ["घ", "gha"], ["ङ", "ṅa"]],
    },
  ];

  let selected = $state<string | null>(null);
  let visited = $state<string[]>([]);

  const current = $derived(places.find((p) => p.id === selected) ?? null);

  function pick(id: string) {
    selected = id;
    if (!visited.includes(id)) {
      visited = [...visited, id];
      if (visited.length >= required) onDone();
    }
  }
</script>

<svg class="mouth" viewBox="0 0 332 96" role="img" aria-label="A line from the front of the mouth (lips) to the back (throat) with five places marked">
  <text x="6" y="14" font-size="11" fill="currentColor" opacity="0.7">front</text>
  <text x="326" y="14" font-size="11" fill="currentColor" opacity="0.7" text-anchor="end">back</text>
  <line x1="20" y1="48" x2="312" y2="48" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.25" />
  {#each places as p (p.id)}
    <circle
      cx={p.x}
      cy="48"
      r={selected === p.id ? 13 : 8}
      fill={selected === p.id ? "var(--accent)" : visited.includes(p.id) ? "var(--ok)" : "var(--border)"}
      stroke="var(--accent)"
      stroke-width="2"
    />
    <text x={p.x} y="82" font-size="10.5" text-anchor="middle" fill="currentColor">{p.letters[0][1]}</text>
  {/each}
</svg>

<div class="places">
  {#each places as p (p.id)}
    <button type="button" class="place-btn" aria-pressed={selected === p.id} onclick={() => pick(p.id)}>
      <span>
        <strong>{p.name}</strong>
        <span class="muted"> — <Rich text={p.skt} inline /></span>
      </span>
      {#if visited.includes(p.id)}<span class="seen" aria-label="explored">✓</span>{/if}
    </button>
  {/each}
</div>

<div aria-live="polite">
  {#if current}
    <div class="card" style="margin-top: 0.9rem">
      <p><strong>{current.name}.</strong> {current.how}</p>
      <p class="muted" style="margin: 0">
        This group is called a <strong>varga</strong>. Say the first letter slowly:
      </p>
      <div class="letters">
        {#each current.letters as [dev, iast], i}
          <div class="letter" class:first={i === 0}>
            {#if app.script !== "iast"}<span class="dev" lang="sa">{dev}</span>{/if}
            {#if app.script !== "dev"}<span class="iast" lang="sa-Latn">{iast}</span>{/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<p class="counter">{Math.min(visited.length, required)} of {required} places explored</p>
