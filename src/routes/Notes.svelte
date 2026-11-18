<script lang="ts">
  import { app } from "../lib/store.svelte";
  import { getLesson } from "../lessons";
  import Rich from "../components/Rich.svelte";

  const entries = $derived(
    Object.keys(app.state.notes)
      .map(Number)
      .sort((a, b) => a - b)
      .map((n) => ({ n, title: getLesson(n)?.title ?? `Lesson ${n}`, rule: app.state.notes[String(n)] })),
  );
</script>

<h1>My notes</h1>
<p class="muted">The one-line rule from each lesson you finish. Stored only on this device.</p>

{#if entries.length === 0}
  <div class="card"><p>Nothing here yet. Finish a lesson and its rule will appear.</p></div>
{:else}
  {#each entries as e (e.n)}
    <div class="card">
      <div class="muted" style="font-size: 0.9rem">Lesson {e.n} — {e.title}</div>
      <Rich text={e.rule} />
    </div>
  {/each}
{/if}
