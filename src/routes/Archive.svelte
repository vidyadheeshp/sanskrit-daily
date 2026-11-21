<script lang="ts">
  import { openThrough, scheduleToday, unlockText } from "../lib/access";
  import { LESSONS_PER_WEEK } from "../lib/schedule";
  import { app } from "../lib/store.svelte";
  import { dyn, t } from "../i18n";
  import { allNumbers, lessonCount, lessons } from "../lessons";
  import { getWeek, lessonRange } from "../weeks";

  const open = openThrough(scheduleToday());
  const available = lessons.filter((l) => l.number <= open);
  const locked = allNumbers.filter((n) => n > open);

  /** The newest week that has an open lesson: the one expanded by default. */
  const latestOpen = Math.min(open, lessonCount);
  const currentWeek = Math.max(1, Math.ceil(latestOpen / LESSONS_PER_WEEK));

  const done = (n: number) => app.isCompleted(n);

  /** One entry per week that has at least one open lesson, newest first. */
  const weekRows = $derived(
    Array.from({ length: Math.ceil(latestOpen / LESSONS_PER_WEEK) }, (_, i) => i + 1)
      .map((n) => {
        const [first, last] = lessonRange(n);
        const items = available.filter((l) => l.number >= first && l.number <= last);
        const check = getWeek(n);
        return {
          n,
          items,
          done: items.filter((l) => done(l.number)).length,
          // The check is offered once the week's last lesson is open.
          check: check && last <= open ? check : undefined,
        };
      })
      .filter((w) => w.items.length > 0)
      .reverse(),
  );
</script>

<h1>{t("archive.title")}</h1>
<p class="muted">{t("archive.lede")}</p>

{#if available.length === 0}
  <div class="card"><p>{t("archive.none")}</p></div>
{:else}
  <section class="card stack" aria-labelledby="overview-h">
    <h2 id="overview-h">{t("archive.overview.title")}</h2>
    <ul class="wk-overview">
      {#each weekRows as w (w.n)}
        <li>
          <div class="row spread">
            <strong>{t("archive.week.title", { n: w.n })}</strong>
            <span class="muted" style="font-size: 0.9rem">
              {t("archive.week.progress", { done: w.done, total: w.items.length })}
              {#if w.check}
                · <a href="#/week/{w.n}">{app.isWeekDone(w.n) ? t("archive.week.checkDone") : t("archive.week.check")}</a>
              {/if}
            </span>
          </div>
          <div
            class="progress"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax={w.items.length}
            aria-valuenow={w.done}
            aria-label={t("archive.week.title", { n: w.n })}
          >
            <div style="width: {(w.done / w.items.length) * 100}%"></div>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  {#each weekRows as w (w.n)}
    <details class="wk" open={w.n === currentWeek}>
      <summary>
        <span class="wk-name">{t("archive.week.title", { n: w.n })}</span>
        <span class="chip">{t("archive.week.progress", { done: w.done, total: w.items.length })}</span>
        {#if w.done === w.items.length && w.items.length === LESSONS_PER_WEEK}<span class="chip">{t("common.done")}</span>{/if}
      </summary>
      <ul class="lesson-list">
        {#each w.items as l (l.number)}
          <li>
            <a href="#/day/{l.number}">
              <div class="card row spread">
                <div class="row">
                  <span class="big-number">{l.number}</span>
                  <div>
                    <strong lang={app.lessonLang}>{l.title}</strong>
                    <div class="muted" style="font-size: 0.9rem">
                      {t("archive.meta", { minutes: l.minutes, rhythm: dyn("rhythm", l.rhythm) })}
                    </div>
                  </div>
                </div>
                {#if done(l.number)}<span class="chip">{t("common.done")}</span>{/if}
              </div>
            </a>
          </li>
        {/each}
        {#if w.check}
          <li>
            <a href="#/week/{w.n}">
              <div class="card row spread">
                <div>
                  <strong>{t("week.cta.done", { n: w.n })}</strong>
                  <div class="muted" style="font-size: 0.9rem">
                    {t("week.archive.sub", { first: lessonRange(w.n)[0], last: lessonRange(w.n)[1] })}
                  </div>
                </div>
                {#if app.isWeekDone(w.n)}<span class="chip">{t("common.done")}</span>{/if}
              </div>
            </a>
          </li>
        {/if}
      </ul>
    </details>
  {/each}
{/if}

{#if locked.length > 0}
  <h2 style="margin-top: 1.5rem">{t("archive.coming")}</h2>
  <ul class="lesson-list" aria-label={t("archive.locked.aria")}>
    {#each locked as n (n)}
      <li>
        <div class="card row" style="opacity: 0.8">
          <span class="big-number" aria-hidden="true">🔒</span>
          <div>
            <strong>{t("archive.lockedLesson", { n })}</strong>
            <div class="muted" style="font-size: 0.9rem">{unlockText(n)}</div>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .wk-overview {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.9rem;
  }
  .wk-overview .progress {
    margin-top: 0.35rem;
  }
  .wk {
    margin-top: 1rem;
  }
  .wk summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    padding: 0.4rem 0;
    margin-bottom: 0.4rem;
  }
  .wk-name {
    font-weight: 700;
    font-size: 1.1rem;
  }
</style>
