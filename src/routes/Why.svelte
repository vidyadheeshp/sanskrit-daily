<script lang="ts">
  import { REPO_URL, SITE_NAME, SITE_NAME_DEV, SITE_SUBTITLE, SITE_TAGLINE, SITE_TAGLINE_EN } from "../config";
</script>

<h1>Why {SITE_NAME}?</h1>
<p class="muted" style="font-size: 1.1rem">
  A slow, steady way to learn <span class="dev" lang="sa">संस्कृतम्</span> — one small lesson at a time.
</p>
<div class="callout" role="note" style="margin-bottom: 1rem">
  <strong><span class="dev" lang="sa">{SITE_NAME_DEV}</span> ({SITE_NAME.toLowerCase()})</strong> means “every day”.
  <span class="dev" lang="sa">{SITE_TAGLINE}</span> — {SITE_TAGLINE_EN}. {SITE_NAME} is the name; “{SITE_SUBTITLE}” says what it is.
</div>

<div class="card stack">
  <h2>The gap</h2>
  <p>
    Sanskrit runs through everyday Indian life — in names, prayers and the words of many Indian languages — yet a
    friendly way to <em>begin</em> is surprisingly hard to find.
  </p>
  <p>
    Most language apps are built on streaks, notifications and reward loops, all designed to maximise how often you open
    them. That is a poor fit for a classical language. Sanskrit's sounds, rhythm and grammar are precise systems that
    reward patience; they are meant to be absorbed slowly, not gamified.
  </p>
  <p>
    And many Sanskrit apps are closed-source, so nobody outside the team can check that what they teach is correct.
  </p>
</div>

<div class="card stack">
  <h2>So this does it differently</h2>
  <ul style="margin: 0; padding-left: 1.2rem">
    <li><strong>One small lesson a day</strong> — about five minutes, with a clear end. Missing a day costs nothing.</li>
    <li><strong>The “why” first.</strong> Every lesson explains the idea, lets you play with it, then checks it stuck.</li>
    <li><strong>Everyday Sanskrit from day one</strong> — hello, your name, what you are doing — not a wall of grammar tables.</li>
    <li><strong>No accounts, no ads, no streaks.</strong> Your progress stays in your own browser.</li>
    <li><strong>Open source</strong>, so teachers and scholars can review and improve it — no coding needed.</li>
  </ul>
</div>

<div class="card stack">
  <h2>An early version</h2>
  <p>
    This is just the beginning, and it has <strong>not yet been reviewed by a Sanskrit scholar</strong>. If you spot a
    mistake or have an idea, please say so — it is the most useful thing you can do.
  </p>
  <div class="row">
    <a class="btn btn-primary" href="#/day/1">Start lesson 1</a>
    <a class="btn" href="{REPO_URL}/issues" target="_blank" rel="noopener noreferrer">Report a mistake or idea ↗</a>
    <a class="btn btn-quiet" href="#/about">About</a>
  </div>
</div>
