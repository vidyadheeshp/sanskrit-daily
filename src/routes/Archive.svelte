<script lang="ts">
  import { openThrough, scheduleToday, unlockText } from "../lib/access";
  import { app } from "../lib/store.svelte";
  import { dyn, t } from "../i18n";
  import { allNumbers, lessons } from "../lessons";

  const open = openThrough(scheduleToday());
  const available = lessons.filter((l) => l.number <= open);
  const locked = allNumbers.filter((n) => n > open);
</script>

<h1>{t("archive.title")}</h1>
<p class="muted">{t("archive.lede")}</p>

{#if available.length === 0}
  <div class="card"><p>{t("archive.none")}</p></div>
{:else}
  <ul class="lesson-list">
    {#each [...available].reverse() as l (l.number)}
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
            {#if app.isCompleted(l.number)}<span class="chip">{t("common.done")}</span>{/if}
          </div>
        </a>
      </li>
    {/each}
  </ul>
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
