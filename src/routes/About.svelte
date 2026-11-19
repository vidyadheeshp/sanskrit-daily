<script lang="ts">
  import { SITE_NAME } from "../config";
  import { t } from "../i18n";
</script>

<h1>{t("about.title")}</h1>
<p><a href="#/why">{t("about.whyLink", { name: SITE_NAME })}</a></p>

<div class="card stack">
  <h2>{t("about.what.title")}</h2>
  <p>{t("about.what.body")}</p>
</div>

<div class="card stack">
  <h2>{t("about.never.title")}</h2>
  <p>{t("about.never.body")}</p>
</div>

<div class="card stack">
  <h2>{t("about.review.title")}</h2>
  <p>{t("about.review.body", { label: t("lesson.notReviewed") })}</p>
</div>
