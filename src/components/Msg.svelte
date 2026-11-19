<script lang="ts">
  import { t, type Key, type Params } from "../i18n";
  import { linkKind, parseUi, type UiToken } from "../i18n/markup";

  /**
   * A translated interface message with light markup (**bold**, *italic*, ^^देवनागरी^^, [links](#/route)).
   * Pass `k` (a catalog key) and optional params `p`, or `text` for an already-translated string.
   */
  let { k, p, text }: { k?: Key; p?: Params; text?: string } = $props();

  const tokens = $derived(parseUi(text ?? (k ? t(k, p) : "")));
</script>

{#snippet render(list: UiToken[])}
  {#each list as tok}
    {#if tok.t === "text"}{tok.text}{:else if tok.t === "b"}<strong>{@render render(tok.children)}</strong>{:else if tok.t === "i"}<em>{@render render(tok.children)}</em>{:else if tok.t === "dev"}<span class="dev" lang="sa">{tok.text}</span>{:else if linkKind(tok.href) === "internal"}<a href={tok.href}>{tok.label}</a>{:else if linkKind(tok.href) === "external"}<a href={tok.href} target="_blank" rel="noopener noreferrer">{tok.label}</a>{:else}{tok.label}{/if}
  {/each}
{/snippet}

{@render render(tokens)}
