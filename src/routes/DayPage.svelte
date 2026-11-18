<script lang="ts">
  import { openThrough, scheduleToday, unlockText } from "../lib/access";
  import { allNumbers, getLesson } from "../lessons";
  import LessonPlayer from "../components/LessonPlayer.svelte";

  let { n }: { n: number } = $props();

  const today = scheduleToday(); // IST
  const known = $derived(allNumbers.includes(n));
  const locked = $derived(n > openThrough(today));
  const lesson = $derived(getLesson(n));
</script>

{#if !known}
  <div class="card stack">
    <h1>Lesson {n} isn't written yet</h1>
    <p>That lesson doesn't exist (yet). Try the archive.</p>
    <a class="btn btn-primary" href="#/archive">Open the archive</a>
  </div>
{:else if locked}
  <div class="card stack">
    <h1>🔒 Lesson {n}</h1>
    <p><strong>{unlockText(n)}.</strong></p>
    <p class="muted">Good things come one day at a time. Come back then — or revisit an earlier lesson in the meantime.</p>
    <div class="row">
      <a class="btn btn-primary" href="#/">Back to today</a>
      <a class="btn" href="#/archive">Archive</a>
    </div>
  </div>
{:else if lesson}
  {#key lesson.number}
    <LessonPlayer {lesson} />
  {/key}
{:else}
  <div class="card stack">
    <h1>Lesson {n} isn't available yet</h1>
    <p>Please check back soon.</p>
    <a class="btn btn-primary" href="#/">Back to today</a>
  </div>
{/if}
