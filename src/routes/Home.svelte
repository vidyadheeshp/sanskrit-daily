<script lang="ts">
  import { app } from "../lib/store.svelte";
  import Landing from "./Landing.svelte";
  import Today from "./Today.svelte";

  /**
   * The home page shows the landing page ONCE, to a genuinely new visitor: someone who has not seen it and has no
   * lesson progress yet. Everyone else goes straight to today's lesson. Decided once, when this page opens
   * (a plain const, deliberately not reactive), so marking it as seen does not flip the page away mid-read.
   */
  const firstVisit = !app.state.settings.welcomeSeen && app.completedCount === 0;
</script>

{#if firstVisit}
  <Landing />
{:else}
  <Today />
{/if}
