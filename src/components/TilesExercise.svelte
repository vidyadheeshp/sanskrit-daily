<script lang="ts">
  import type { TilesStep } from "../lib/schema";
  import { seededShuffle } from "../lib/shuffle";
  import { t } from "../i18n";
  import Rich from "./Rich.svelte";

  let { step, onDone }: { step: TilesStep; onDone: (firstTry: boolean) => void } = $props();

  const pool = $derived(
    seededShuffle(
      step.tiles.map((text, id) => ({ id, text })),
      step.id,
    ),
  );

  let picked = $state<number[]>([]); // tile ids in the order tapped
  let solved = $state(false);
  let misses = $state(0);
  let message = $state<"" | "wrong">("");

  const text = (id: number) => step.tiles[id];

  function add(id: number) {
    if (solved) return;
    picked = [...picked, id];
    message = "";
  }
  function remove(id: number) {
    if (solved) return;
    picked = picked.filter((p) => p !== id);
    message = "";
  }
  function check() {
    const ok = picked.length === step.answer.length && picked.every((id, i) => text(id) === step.answer[i]);
    if (ok) {
      solved = true;
      message = "";
      onDone(misses === 0);
    } else {
      misses += 1;
      message = "wrong";
    }
  }
</script>

<p class="muted" style="margin-bottom: 0">{t("tiles.yourAnswer")}</p>
<div class="tile-area" class:solved aria-label={t("tiles.answer.aria")}>
  {#each picked as id (id)}
    <button type="button" class="tile" disabled={solved} onclick={() => remove(id)}>
      <Rich text={text(id)} inline />
    </button>
  {:else}
    <span class="muted">{t("tiles.tapBelow")}</span>
  {/each}
</div>

<p class="muted" style="margin-bottom: 0">{t("tiles.pieces")}</p>
<div class="tile-area" aria-label={t("tiles.pieces.aria")}>
  {#each pool as tile (tile.id)}
    {#if !picked.includes(tile.id)}
      <button type="button" class="tile" disabled={solved} onclick={() => add(tile.id)}>
        <Rich text={tile.text} inline />
      </button>
    {/if}
  {/each}
</div>

{#if !solved}
  <div class="row">
    <button type="button" class="btn btn-primary" disabled={picked.length === 0} onclick={check}>{t("tiles.check")}</button>
    <button type="button" class="btn btn-quiet" disabled={picked.length === 0} onclick={() => (picked = [])}>
      {t("tiles.clear")}
    </button>
  </div>
{/if}

<div aria-live="polite">
  {#if message === "wrong"}
    <div class="feedback bad"><strong>{t("tiles.notQuiteLead")}</strong> {t("tiles.rearrange")}</div>
  {/if}
  {#if solved}
    <div class="feedback good"><strong>{t("choice.yes")}</strong> <Rich text={step.why} inline /></div>
  {/if}
</div>
