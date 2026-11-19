<script lang="ts">
  import type { Lesson } from "../lib/schema";
  import { shareText, shareUrl } from "../lib/share";
  import { t } from "../i18n";

  let { lesson }: { lesson: Lesson } = $props();

  let status = $state<"" | "copied" | "manual">("");

  const url = $derived(shareUrl(lesson.number, location.origin, import.meta.env.BASE_URL));
  const text = $derived(shareText(lesson, url));
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      status = "copied";
    } catch {
      status = "manual"; // clipboard blocked: show the text so it can be copied by hand
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: `Sanskrit Daily #${lesson.number}`, text: lesson.teaser, url });
    } catch {
      /* the user closed the share sheet — nothing to do */
    }
  }
</script>

<div class="stack">
  <div class="row">
    <button type="button" class="btn" onclick={copy}>{t("share.copy")}</button>
    {#if canShare}<button type="button" class="btn" onclick={nativeShare}>{t("share.native")}</button>{/if}
  </div>
  <div aria-live="polite">
    {#if status === "copied"}
      <p class="muted" style="margin: 0">{t("share.copied")}</p>
    {:else if status === "manual"}
      <p class="muted" style="margin: 0 0 0.3rem">{t("share.manual")}</p>
      <textarea readonly rows="3" style="width: 100%; font: inherit" onfocus={(e) => e.currentTarget.select()}>{text}</textarea>
    {/if}
  </div>
</div>
