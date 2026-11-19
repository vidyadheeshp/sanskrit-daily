<script lang="ts">
  import { SCHEDULE, MAX_REVIEW_PER_SESSION, UNLOCK_TIME_LABEL } from "../config";
  import { dayNumber, formatISO, localISO } from "../lib/date";
  import { openThrough, scheduleToday, unlockText } from "../lib/access";
  import { dueItems } from "../lib/srs";
  import { app } from "../lib/store.svelte";
  import { getLesson, lessonCount, lessons } from "../lessons";
  import PanchangCard from "../components/PanchangCard.svelte";

  const today = localISO(); // the learner's own day: used for their review schedule
  const scheduleDay = scheduleToday(); // IST: used for which lesson is open
  const launch = SCHEDULE.launchDate;
  const n = launch ? dayNumber(scheduleDay, launch) : 0; // 0 or less = daily lessons haven't started
  const live = n >= 1;
  const current = live ? n : 1; // before launch, offer lesson 1 as a free preview
  const open = openThrough(scheduleDay);
  const lesson = current <= open ? getLesson(current) : undefined;
  const caughtUp = live && n > lessonCount;
  const nextLocked = Number.isFinite(open) && open + 1 <= lessonCount ? open + 1 : null;
  const latest = lessons.filter((l) => l.number <= open).at(-1);

  const dueCount = $derived(dueItems(app.state.review, today, MAX_REVIEW_PER_SESSION).length);
</script>

<h1>Today</h1>

{#if !live}
  <div class="callout" role="note" style="margin-bottom: 1rem">
    <strong>Preview.</strong>
    {#if launch}
      Daily lessons start on <strong>{formatISO(launch)}</strong> at {UNLOCK_TIME_LABEL}.
    {:else}
      Daily lessons start soon — the date will be announced.
    {/if}
    In the meantime, here is lesson 1 to try.
  </div>
{/if}

{#if lesson}
  <a class="card" href="#/day/{lesson.number}" style="display:block; text-decoration:none; color:inherit">
    <div class="row spread">
      <span class="chip">Lesson {lesson.number} · ~{lesson.minutes} min</span>
      {#if app.isCompleted(lesson.number)}<span class="chip">✓ done</span>{/if}
    </div>
    <h2 style="margin-top: 0.6rem">{lesson.title}</h2>
    <p class="muted">One small idea. Explained, explored, then checked.</p>
    <span class="btn btn-primary">
      {app.isCompleted(lesson.number) ? "Play again" : live ? "Start today's lesson" : "Try lesson 1"}
    </span>
  </a>
{:else if caughtUp}
  <div class="card stack">
    <h2>You're all caught up 🌿</h2>
    <p>
      You have seen every lesson written so far. New ones are on the way — in the meantime, the archive is always
      open.
    </p>
    <div class="row">
      <a class="btn btn-primary" href="#/archive">Open the archive</a>
      {#if latest}<a class="btn" href="#/day/{latest.number}">Replay lesson {latest.number}</a>{/if}
    </div>
  </div>
{:else}
  <div class="card"><p>Today's lesson isn't available yet. Please check back soon.</p></div>
{/if}

{#if nextLocked}
  <a class="card" href="#/archive" style="display:block; text-decoration:none; color:inherit">
    <div class="row spread">
      <div>
        <strong>🔒 Lesson {nextLocked}</strong>
        <div class="muted" style="font-size: 0.95rem">{unlockText(nextLocked)}</div>
      </div>
      <span class="muted" aria-hidden="true">next up</span>
    </div>
  </a>
{/if}

{#if dueCount > 0}
  <div class="card">
    <div class="row spread">
      <div>
        <strong>Quick review</strong> <span class="chip">optional</span>
        <p class="muted" style="margin: 0.3rem 0 0">
          {dueCount} {dueCount === 1 ? "question" : "questions"} from earlier lessons, whenever you feel like it.
        </p>
      </div>
      <a class="btn" href="#/review">Review</a>
    </div>
  </div>
{/if}

{#if app.state.settings.showPanchang}
  <PanchangCard />
{/if}

<p class="muted">
  Days practised: <strong>{app.daysPractised}</strong>. Missing a day costs nothing — there are no streaks here.
</p>
