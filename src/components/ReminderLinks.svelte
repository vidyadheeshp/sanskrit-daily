<script lang="ts">
  import { SCHEDULE, UNLOCK_HOUR_IST, UNLOCK_TIME_LABEL } from "../config";
  import { googleCalendarUrl } from "../lib/calendar";
  import { reminderOptions } from "../lib/reminder";
  import { istISO } from "../lib/date";
  import { t } from "../i18n";

  /** Two ways to add the same repeating 6:00 AM IST reminder to the learner's own calendar. */
  const today = istISO();
  const start = SCHEDULE.launchDate && SCHEDULE.launchDate > today ? SCHEDULE.launchDate : today;
  const site = new URL(import.meta.env.BASE_URL, location.origin).href;
  const google = googleCalendarUrl(reminderOptions(start, UNLOCK_HOUR_IST, site));
  const file = `${import.meta.env.BASE_URL}dine-dine-daily.ics`;
</script>

<div class="row">
  <a class="btn btn-primary" href={file} download="dine-dine-daily.ics">{t("reminder.ics")}</a>
  <a class="btn" href={google} target="_blank" rel="noopener noreferrer">{t("reminder.google")}</a>
</div>
<p class="muted" style="margin: 0.4rem 0 0; font-size: 0.9rem">{t("reminder.note", { time: UNLOCK_TIME_LABEL })}</p>
