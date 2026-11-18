<script lang="ts">
  import { parseMarkup, parseInline, type Token } from "../lib/markup";
  import { app } from "../lib/store.svelte";

  let { text, inline = false }: { text: string; inline?: boolean } = $props();

  const paragraphs = $derived<Token[][]>(inline ? [parseInline(text)] : parseMarkup(text));
</script>

{#snippet tokens(list: Token[])}
  {#each list as tok}
    {#if tok.t === "text"}{tok.text}{:else if tok.t === "b"}<strong>{tok.text}</strong>{:else if tok.t === "i"}<em>{tok.text}</em>{:else if app.script === "dev"}<span class="dev" lang="sa">{tok.dev}</span>{:else if app.script === "iast"}<span class="iast" lang="sa-Latn">{tok.iast}</span>{:else}<span class="dev" lang="sa">{tok.dev}</span>{" "}<span class="iast-paren" lang="sa-Latn">({tok.iast})</span>{/if}
  {/each}
{/snippet}

{#if inline}
  {@render tokens(paragraphs[0] ?? [])}
{:else}
  {#each paragraphs as para}
    <p>{@render tokens(para)}</p>
  {/each}
{/if}
