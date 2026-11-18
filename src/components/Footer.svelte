<script lang="ts">
  import { COUNTER_CODE } from "../config";
  import { app } from "../lib/store.svelte";
  import { countingAllowed, fetchTotal } from "../lib/counter";

  let total = $state<string | null>(null);

  const enabled = $derived(
    countingAllowed({
      code: COUNTER_CODE,
      setting: app.state.settings.countVisits,
      dnt: typeof navigator === "undefined" ? null : navigator.doNotTrack,
    }),
  );

  $effect(() => {
    if (!enabled) {
      total = null;
      return;
    }
    let cancelled = false;
    fetchTotal(COUNTER_CODE).then((v) => {
      if (!cancelled) total = v;
    });
    return () => {
      cancelled = true;
    };
  });
</script>

<footer class="site-footer">
  <div>No accounts, no ads. Your progress and answers stay in this browser.</div>
  {#if COUNTER_CODE}
    <div>
      {#if enabled}
        Visits are counted anonymously (no cookies, nothing about what you answer) —
        <a href="#/settings">switch off</a>.
        {#if total}<strong>👣 {total}</strong> visitors so far.{/if}
      {:else}
        Visit counting is off.
      {/if}
    </div>
  {/if}
</footer>
