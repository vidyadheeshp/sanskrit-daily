<script lang="ts">
  import type { RecapStep } from "../lib/schema";
  import { app } from "../lib/store.svelte";
  import { t } from "../i18n";
  import Msg from "./Msg.svelte";
  import Rich from "./Rich.svelte";

  let { step }: { step: RecapStep } = $props();
</script>

<h2>{t("recap.title")}</h2>
<div class="rule-box">
  <Rich text={step.rule} />
  {#if step.example}
    <div class="example">
      {#if app.script !== "iast"}<div class="dev" lang="sa">{step.example.dev}</div>{/if}
      {#if app.script !== "dev"}<div class="iast" lang="sa-Latn">{step.example.iast}</div>{/if}
    </div>
  {/if}
</div>
<p class="muted" style="margin-top: 0.8rem"><Msg k="recap.note" /></p>
