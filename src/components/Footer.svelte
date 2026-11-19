<script lang="ts">
  import { COUNTER_CODE, REPO_URL, SITE_TAGLINE } from "../config";
  import { app } from "../lib/store.svelte";
  import { countingAllowed, fetchTotal } from "../lib/counter";
  import { t } from "../i18n";
  import { languageInfo } from "../i18n/langs";
  import Msg from "./Msg.svelte";

  let total = $state<string | null>(null);

  const enabled = $derived(
    countingAllowed({
      code: COUNTER_CODE,
      setting: app.state.settings.countVisits,
      dnt: typeof navigator === "undefined" ? null : navigator.doNotTrack,
    }),
  );

  $effect(() => {
    if (!enabled) {
      total = null;
      return;
    }
    let cancelled = false;
    fetchTotal(COUNTER_CODE).then((v) => {
      if (!cancelled) total = v;
    });
    return () => {
      cancelled = true;
    };
  });
</script>

<footer class="site-footer">
  <div><span class="dev" lang="sa">{SITE_TAGLINE}</span> · {t("footer.privacy")}</div>
  {#if COUNTER_CODE}
    <div>
      {#if enabled}
        <Msg k="footer.counterOn" />
        {#if total}{" "}<Msg k="footer.visitors" p={{ total }} />{/if}
      {:else}
        {t("footer.counterOff")}
      {/if}
    </div>
  {/if}
  {#if !languageInfo(app.language).reviewed}
    <div class="draft-notice" lang={app.language}><Msg k="lang.draft" p={{ repo: REPO_URL }} /></div>
  {/if}
</footer>
