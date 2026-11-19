<script lang="ts">
  import type { ExplainStep } from "../lib/schema";
  import { app } from "../lib/store.svelte";
  import { t } from "../i18n";
  import Rich from "./Rich.svelte";

  let { step }: { step: ExplainStep } = $props();
</script>

{#if step.title}<h2 lang={app.lessonLang}>{step.title}</h2>{/if}
<Rich text={step.body} />
{#if step.callout}
  <div class="callout {step.callout.tone}" role="note">
    <Rich text={(step.callout.tone === "caution" ? t("explain.keepInMind") : "") + step.callout.text} />
  </div>
{/if}
