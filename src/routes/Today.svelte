<script lang="ts">
  import { SCHEDULE, MAX_REVIEW_PER_SESSION } from "../config";
  import { dayNumber, formatISO, localISO } from "../lib/date";
  import { openThrough, scheduleToday, unlockText } from "../lib/access";
  import { dueItems } from "../lib/srs";
  import { app } from "../lib/store.svelte";
  import { locale, t, unlockTime } from "../i18n";
  import { getLesson, lessonCount, lessons } from "../lessons";
  import Msg from "../components/Msg.svelte";
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

<h1>{t("today.title")}</h1>

{#if !live}
  <div class="callout" role="note" style="margin-bottom: 1rem">
    {#if launch}
      <Msg k="today.preview.date" p={{ date: formatISO(launch, locale()), time: unlockTime() }} />
    {:else}
      <Msg k="today.preview.soon" />
    {/if}
  </div>
{/if}

{#if lesson}
  <a class="card" href="#/day/{lesson.number}" style="display:block; text-decoration:none; color:inherit">
    <div class="row spread">
      <span class="chip">{t("common.lessonMeta", { n: lesson.number, minutes: lesson.minutes })}</span>
      {#if app.isCompleted(lesson.number)}<span class="chip">{t("common.done")}</span>{/if}
    </div>
    <h2 style="margin-top: 0.6rem" lang={app.lessonLang}>{lesson.title}</h2>
    <p class="muted">{t("today.blurb")}</p>
    <span class="btn btn-primary">
      {app.isCompleted(lesson.number) ? t("today.btn.again") : live ? t("today.btn.start") : t("today.btn.try")}
    </span>
  </a>
{:else if caughtUp}
  <div class="card stack">
    <h2>{t("today.caughtUp.title")}</h2>
    <p>{t("today.caughtUp.body")}</p>
    <div class="row">
      <a class="btn btn-primary" href="#/archive">{t("common.openArchive")}</a>
      {#if latest}<a class="btn" href="#/day/{latest.number}">{t("today.btn.replay", { n: latest.number })}</a>{/if}
    </div>
  </div>
{:else}
  <div class="card"><p>{t("today.unavailable")}</p></div>
{/if}

{#if nextLocked}
  <a class="card" href="#/archive" style="display:block; text-decoration:none; color:inherit">
    <div class="row spread">
      <div>
        <strong>{t("today.next.title", { n: nextLocked })}</strong>
        <div class="muted" style="font-size: 0.95rem">{unlockText(nextLocked)}</div>
      </div>
      <span class="muted" aria-hidden="true">{t("today.next.tag")}</span>
    </div>
  </a>
{/if}

{#if dueCount > 0}
  <div class="card">
    <div class="row spread">
      <div>
        <strong>{t("today.review.title")}</strong> <span class="chip">{t("today.review.optional")}</span>
        <p class="muted" style="margin: 0.3rem 0 0">
          {t(dueCount === 1 ? "today.review.one" : "today.review.many", { n: dueCount })}
        </p>
      </div>
      <a class="btn" href="#/review">{t("today.review.btn")}</a>
    </div>
  </div>
{/if}

{#if app.state.settings.showPanchang}
  <PanchangCard />
{/if}

<p class="muted"><Msg k="today.practised" p={{ n: app.daysPractised }} /></p>
