<script lang="ts">
  import { REPO_URL, SCHEDULE, SITE_NAME, SITE_NAME_DEV, SITE_SUBTITLE } from "../config";
  import { dayNumber, formatISO, formatISOShort } from "../lib/date";
  import { openThrough, scheduleToday } from "../lib/access";
  import { unlockDate } from "../lib/schedule";
  import { app } from "../lib/store.svelte";
  import { dyn, locale, t, unlockTime } from "../i18n";
  import { getLesson, lessonCount } from "../lessons";
  import Logo from "../components/Logo.svelte";
  import Msg from "../components/Msg.svelte";
  import RevealCards from "../components/RevealCards.svelte";

  // This page is shown once; remember that it has been (also when opened from the "What is this?" link).
  app.markWelcomeSeen();

  const scheduleDay = scheduleToday();
  const open = openThrough(scheduleDay);
  const launch = SCHEDULE.launchDate;
  const dayN = launch ? dayNumber(scheduleDay, launch) : 0;
  const live = dayN >= 1;
  const time = unlockTime();

  // The taste is lesson 1's own first two words, so it can never drift from the real lesson.
  const demo = getLesson(1)?.steps.find((s) => s.kind === "demo" && s.widget === "reveal-cards");
  const taste = demo && demo.kind === "demo" ? (demo.cards ?? []).slice(0, 2) : [];

  // Week 1 by date only. Locked lessons' titles and contents are deliberately not shown.
  const week = Array.from({ length: 7 }, (_, i) => ({ n: i + 1, open: i + 1 <= open, date: unlockDate(i + 1, SCHEDULE) }));
</script>

<section class="landing-hero" aria-labelledby="hero-h">
  <Logo size={72} />
  <div class="landing-name dev" lang="sa">{SITE_NAME_DEV}</div>
  <div class="muted">{SITE_NAME} · {SITE_SUBTITLE}</div>

  <p style="margin: 0.9rem 0 0">
    <span class="chip">
      {#if !live && !launch}
        {t("landing.status.soon")}
      {:else if !live && launch}
        {t("landing.status.start", { date: formatISO(launch, locale()), time })}
      {:else if dayN <= lessonCount}
        {t("landing.status.open", { n: dayN })}
      {:else}
        {t("landing.status.daily", { time })}
      {/if}
    </span>
  </p>

  <h1 id="hero-h">{t("landing.hero.title")}</h1>
  <p class="lede">{t("landing.hero.lede", { time })}</p>
  <div class="cta-row">
    <a class="btn btn-primary btn-lg" href="#/day/1">{t("landing.cta.start")}</a>
    <a class="btn btn-lg" href="#/why">{t("landing.cta.story")}</a>
  </div>
  <p class="muted" style="margin-top: 0.9rem">
    <span class="dev" lang="sa">{SITE_NAME_DEV}</span> {t("landing.means")}
  </p>
</section>

{#if taste.length > 0}
  <section class="section card stack" aria-labelledby="taste-h">
    <h2 id="taste-h">{t("landing.taste.title")}</h2>
    <p>{t("landing.taste.body")}</p>
    <RevealCards cards={taste} required={taste.length} onDone={() => {}} />
  </section>
{/if}

<section class="section" aria-labelledby="how-h" id="how-it-works">
  <h2 id="how-h">{t("landing.how.title")}</h2>
  <ol class="steps">
    {#each [1, 2, 3] as i}
      <li>
        <span class="num" aria-hidden="true">{i}</span>
        <h3>{dyn("landing.how", `${i}.title`)}</h3>
        <p>{dyn("landing.how", `${i}.body`)}</p>
      </li>
    {/each}
  </ol>
</section>

<section class="section card" aria-labelledby="week-h">
  <h2 id="week-h">{t("landing.week.title")}</h2>
  <p><Msg k="landing.week.body" p={{ time }} /></p>
  <ol class="week" aria-label={t("landing.week.aria")}>
    {#each week as d (d.n)}
      <li class:open={d.open}>
        <strong>{t("landing.week.day", { n: d.n })}</strong>
        {#if d.open}
          <span>{t("landing.week.open")}</span>
        {:else if d.date}
          <span>{t("landing.week.locked", { date: formatISOShort(d.date, locale()) })}</span>
        {:else}
          <span>{t("landing.week.afterLaunch")}</span>
        {/if}
      </li>
    {/each}
  </ol>
</section>

<section class="section card stack" aria-labelledby="why-h">
  <h2 id="why-h">{t("landing.why.title")}</h2>
  <p>{t("landing.why.body")}</p>
  <p><a href="#/why">{t("landing.why.link")}</a></p>
</section>

<section class="section card stack" aria-labelledby="promises-h">
  <h2 id="promises-h">{t("landing.promises.title")}</h2>
  <ul class="promises">
    {#each [1, 2, 3, 4, 5, 6] as i}
      <li><Msg text={dyn("landing.promises", i, { repo: REPO_URL })} /></li>
    {/each}
  </ul>
</section>

<div class="section callout caution" role="note"><Msg k="landing.early" p={{ repo: REPO_URL }} /></div>

<section class="section card faq" aria-labelledby="faq-h">
  <h2 id="faq-h">{t("landing.faq.title")}</h2>
  {#each [1, 2, 3, 4, 5] as i}
    <details>
      <summary>{dyn("landing.faq", `${i}.q`)}</summary>
      <p>{dyn("landing.faq", `${i}.a`)}</p>
    </details>
  {/each}
</section>

<section class="section card stack" style="text-align: center">
  <h2>{t("landing.ready")}</h2>
  <div class="cta-row">
    <a class="btn btn-primary btn-lg" href="#/day/1">{t("landing.cta.start")}</a>
  </div>
</section>
