<script lang="ts">
  import { parseMarkup, parseInline, type Token } from "../lib/markup";
  import { app } from "../lib/store.svelte";

  /**
   * Lesson text (still English-only). When the interface is in another language, this text is tagged lang="en" so
   * screen readers pronounce it correctly; the surrounding interface text keeps the interface language.
   */
  let { text, inline = false }: { text: string; inline?: boolean } = $props();

  const paragraphs = $derived<Token[][]>(inline ? [parseInline(text)] : parseMarkup(text));
</script>

{#snippet tokens(list: Token[])}
  {#each list as tok}
    {#if tok.t === "text"}{tok.text}{:else if tok.t === "b"}<strong>{tok.text}</strong>{:else if tok.t === "i"}<em>{tok.text}</em>{:else if app.script === "dev"}<span class="dev" lang="sa">{tok.dev}</span>{:else if app.script === "iast"}<span class="iast" lang="sa-Latn">{tok.iast}</span>{:else}<span class="dev" lang="sa">{tok.dev}</span>{" "}<span class="iast-paren" lang="sa-Latn">({tok.iast})</span>{/if}
  {/each}
{/snippet}

{#if inline}
  {#if app.lessonLang}<span lang={app.lessonLang}>{@render tokens(paragraphs[0] ?? [])}</span>{:else}{@render tokens(paragraphs[0] ?? [])}{/if}
{:else}
  {#each paragraphs as para}
    <p lang={app.lessonLang}>{@render tokens(para)}</p>
  {/each}
{/if}
