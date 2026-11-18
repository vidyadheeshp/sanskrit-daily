<script lang="ts">
  import type { ExplainStep } from "../lib/schema";
  import Rich from "./Rich.svelte";

  let { step }: { step: ExplainStep } = $props();
</script>

{#if step.title}<h2>{step.title}</h2>{/if}
<Rich text={step.body} />
{#if step.callout}
  <div class="callout {step.callout.tone}" role="note">
    <Rich text={(step.callout.tone === "caution" ? "**Keep in mind:** " : "") + step.callout.text} />
  </div>
{/if}
