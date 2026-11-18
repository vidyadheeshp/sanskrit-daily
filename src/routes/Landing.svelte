<script lang="ts">
  import { REPO_URL, SCHEDULE, SITE_NAME, SITE_NAME_DEV, SITE_SUBTITLE } from "../config";
  import { dayNumber, formatISO, formatISOShort } from "../lib/date";
  import { openThrough, scheduleToday } from "../lib/access";
  import { unlockDate } from "../lib/schedule";
  import { app } from "../lib/store.svelte";
  import { getLesson, lessonCount } from "../lessons";
  import Logo from "../components/Logo.svelte";
  import RevealCards from "../components/RevealCards.svelte";

  // This page is shown once; remember that it has been (also when opened from the "What is this?" link).
  app.markWelcomeSeen();

  const scheduleDay = scheduleToday();
  const open = openThrough(scheduleDay);
  const launch = SCHEDULE.launchDate;
  const dayN = launch ? dayNumber(scheduleDay, launch) : 0;
  const live = dayN >= 1;

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
        Daily lessons start soon — date to be announced
      {:else if !live && launch}
        Daily lessons start {formatISO(launch)} at 12:00 AM IST
      {:else if dayN <= lessonCount}
        Lesson {dayN} is open today
      {:else}
        New lessons every day at 12:00 AM IST
      {/if}
    </span>
  </p>

  <h1 id="hero-h">Learn Sanskrit, one small step a day.</h1>
  <p class="lede">
    A new five-minute lesson every day at 12 AM IST. Free, no login, no ads — it works right in your browser.
  </p>
  <div class="cta-row">
    <a class="btn btn-primary btn-lg" href="#/day/1">Start with lesson 1</a>
    <a class="btn btn-lg" href="#/why">Read the full story</a>
  </div>
  <p class="muted" style="margin-top: 0.9rem">
    <span class="dev" lang="sa">{SITE_NAME_DEV}</span> means “day by day”.
  </p>
</section>

{#if taste.length > 0}
  <section class="section card stack" aria-labelledby="taste-h">
    <h2 id="taste-h">Try it — ten seconds</h2>
    <p>
      Every Sanskrit greeting is a tiny sentence with a meaning you can see. Tap a word to open it up.
    </p>
    <RevealCards cards={taste} required={taste.length} onDone={() => {}} />
  </section>
{/if}

<section class="section" aria-labelledby="how-h" id="how-it-works">
  <h2 id="how-h">How a lesson works</h2>
  <ol class="steps">
    <li>
      <span class="num" aria-hidden="true">1</span>
      <h3>Learn the why</h3>
      <p>Each lesson starts with a puzzle and one clear idea, not a wall of grammar tables.</p>
    </li>
    <li>
      <span class="num" aria-hidden="true">2</span>
      <h3>Play with it</h3>
      <p>Tap, build and match. You can't skip ahead until it clicks.</p>
    </li>
    <li>
      <span class="num" aria-hidden="true">3</span>
      <h3>Check it stuck</h3>
      <p>A few questions, with a kind explanation for every wrong answer. Then it ends. No streaks, no guilt.</p>
    </li>
  </ol>
</section>

<section class="section card" aria-labelledby="week-h">
  <h2 id="week-h">Your first week</h2>
  <p>
    Everyday conversation: hello, your name, and what people are doing. One lesson unlocks each day at
    <strong>12:00 AM IST</strong> — for everyone, wherever you are.
  </p>
  <ol class="week" aria-label="First seven lessons">
    {#each week as d (d.n)}
      <li class:open={d.open}>
        <strong>Day {d.n}</strong>
        {#if d.open}
          <span>open</span>
        {:else if d.date}
          <span>🔒 {formatISOShort(d.date)}</span>
        {:else}
          <span>🔒 after launch</span>
        {/if}
      </li>
    {/each}
  </ol>
</section>

<section class="section card stack" aria-labelledby="why-h">
  <h2 id="why-h">Why it exists</h2>
  <p>
    Most language apps are built on streaks and notifications meant to make you open them more. Sanskrit's sounds,
    rhythm and grammar reward patience, so this does the opposite: one small lesson, a clear end, and nothing to lose if
    you miss a day.
  </p>
  <p><a href="#/why">Read the full story →</a></p>
</section>

<section class="section card stack" aria-labelledby="promises-h">
  <h2 id="promises-h">What you will not find here</h2>
  <ul class="promises">
    <li>No accounts or logins</li>
    <li>No ads</li>
    <li>No streaks, timers or notifications</li>
    <li>Your progress stays in your own browser</li>
    <li>Open source — <a href={REPO_URL} target="_blank" rel="noopener noreferrer">see the code ↗</a></li>
    <li>Works offline once installed on your phone</li>
  </ul>
</section>

<div class="section callout caution" role="note">
  <strong>An early version.</strong> These lessons have <strong>not yet been reviewed by a Sanskrit scholar</strong>. If you
  spot a mistake, please tell us —
  <a href="{REPO_URL}/issues" target="_blank" rel="noopener noreferrer">report it here ↗</a>.
</div>

<section class="section card faq" aria-labelledby="faq-h">
  <h2 id="faq-h">Questions</h2>
  <details>
    <summary>Do I need to read Devanagari?</summary>
    <p>
      No. Every Sanskrit word is shown in both Devanagari and Roman letters (IAST), and you can switch in Settings.
    </p>
  </details>
  <details>
    <summary>Is it really free?</summary>
    <p>Yes. No ads, no accounts, no hidden tiers. It is open source.</p>
  </details>
  <details>
    <summary>Where is my progress saved?</summary>
    <p>
      Only in your own browser — nothing is sent to a server. You can export it from Settings to move to another device.
    </p>
  </details>
  <details>
    <summary>Can I use it on my phone like an app?</summary>
    <p>
      Yes. In your browser's menu choose “Install” or “Add to Home Screen”. It then opens like an app and works offline.
    </p>
  </details>
  <details>
    <summary>What if I miss a day?</summary>
    <p>Nothing happens. There are no streaks, and every lesson that has unlocked stays open in the Archive.</p>
  </details>
</section>

<section class="section card stack" style="text-align: center">
  <h2>Ready? It takes five minutes.</h2>
  <div class="cta-row">
    <a class="btn btn-primary btn-lg" href="#/day/1">Start with lesson 1</a>
  </div>
</section>
