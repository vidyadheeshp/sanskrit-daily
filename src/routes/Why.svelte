<script lang="ts">
  import { REPO_URL, SITE_NAME, SITE_NAME_DEV, SITE_SUBTITLE, SITE_TAGLINE } from "../config";
  import { t } from "../i18n";
  import Msg from "../components/Msg.svelte";
</script>

<h1>{t("why.title", { name: SITE_NAME })}</h1>
<p class="muted" style="font-size: 1.1rem"><Msg k="why.sub" /></p>
<div class="callout" role="note" style="margin-bottom: 1rem">
  <Msg
    k="why.callout"
    p={{
      nameDev: SITE_NAME_DEV,
      nameLower: SITE_NAME.toLowerCase(),
      tagline: SITE_TAGLINE,
      taglineEn: t("brand.tagline"),
      name: SITE_NAME,
      subtitle: SITE_SUBTITLE,
    }}
  />
</div>

<div class="card stack">
  <h2>{t("why.gap.title")}</h2>
  <p><Msg k="why.gap.1" /></p>
  <p><Msg k="why.gap.2" /></p>
  <p><Msg k="why.gap.3" /></p>
</div>

<div class="card stack">
  <h2>{t("why.diff.title")}</h2>
  <ul style="margin: 0; padding-left: 1.2rem">
    <li><Msg k="why.diff.1" /></li>
    <li><Msg k="why.diff.2" /></li>
    <li><Msg k="why.diff.3" /></li>
    <li><Msg k="why.diff.4" /></li>
    <li><Msg k="why.diff.5" /></li>
  </ul>
</div>

<div class="card stack">
  <h2>{t("why.early.title")}</h2>
  <p><Msg k="why.early.body" /></p>
  <div class="row">
    <a class="btn btn-primary" href="#/day/1">{t("why.btn.start")}</a>
    <a class="btn" href="{REPO_URL}/issues" target="_blank" rel="noopener noreferrer">{t("why.btn.report")}</a>
    <a class="btn btn-quiet" href="#/about">{t("why.btn.about")}</a>
  </div>
</div>
