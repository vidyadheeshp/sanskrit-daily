<script lang="ts">
  import { SITE_NAME, SITE_NAME_DEV, SITE_SUBTITLE, COUNTER_CODE } from "./config";
  import Logo from "./components/Logo.svelte";
  import LanguageSwitch from "./components/LanguageSwitch.svelte";
  import { app } from "./lib/store.svelte";
  import { countingAllowed, countPage } from "./lib/counter";
  import { t, type Key } from "./i18n";
  import Footer from "./components/Footer.svelte";
  import { router } from "./lib/router.svelte";
  import Home from "./routes/Home.svelte";
  import Landing from "./routes/Landing.svelte";
  import DayPage from "./routes/DayPage.svelte";
  import Archive from "./routes/Archive.svelte";
  import Notes from "./routes/Notes.svelte";
  import Review from "./routes/Review.svelte";
  import Settings from "./routes/Settings.svelte";
  import About from "./routes/About.svelte";
  import Why from "./routes/Why.svelte";

  const links: Array<{ href: string; name: string; label: Key }> = [
    { href: "#/", name: "today", label: "nav.today" },
    { href: "#/archive", name: "archive", label: "nav.archive" },
    { href: "#/notes", name: "notes", label: "nav.notes" },
    { href: "#/welcome", name: "welcome", label: "nav.welcome" },
    { href: "#/settings", name: "settings", label: "nav.settings" },
    { href: "#/about", name: "about", label: "nav.about" },
  ];

  const route = $derived(router.route);

  // Tell the browser (and screen readers) which language the interface is in.
  $effect(() => {
    document.documentElement.lang = app.language;
  });

  // Anonymous page-view count (only if configured, switched on, and Do Not Track is off).
  $effect(() => {
    void route; // re-run on every navigation
    const allowed = countingAllowed({
      code: COUNTER_CODE,
      setting: app.state.settings.countVisits,
      dnt: navigator.doNotTrack,
    });
    if (allowed) countPage(COUNTER_CODE, location.hash.replace(/^#/, "") || "/", document.title);
  });

  const current = (name: string) => route.name === name || (name === "today" && route.name === "day");
</script>

<div class="shell">
  <header class="site-header">
    <div class="inner">
      <a class="brand" href="#/" aria-label={t("brand.home", { name: SITE_NAME, subtitle: SITE_SUBTITLE })}>
        <Logo size={38} />
        <span class="brand-text">
          <span class="brand-name dev" lang="sa">{SITE_NAME_DEV}</span>
          <span class="brand-sub">{SITE_NAME} · {SITE_SUBTITLE}</span>
        </span>
      </a>
      <div class="header-tools">
        <nav aria-label={t("nav.main")}>
          <ul>
            {#each links as l}
              <li><a href={l.href} aria-current={current(l.name) ? "page" : undefined}>{t(l.label)}</a></li>
            {/each}
          </ul>
        </nav>
        <LanguageSwitch />
      </div>
    </div>
  </header>

  <main>
    <!-- Keyed on the language so every page re-creates itself with fresh translated text when it changes. -->
    {#key app.language}
      {#if route.name === "today"}
        <Home />
      {:else if route.name === "welcome"}
        <Landing />
      {:else if route.name === "day"}
        <DayPage n={route.n} />
      {:else if route.name === "archive"}
        <Archive />
      {:else if route.name === "notes"}
        <Notes />
      {:else if route.name === "review"}
        <Review />
      {:else if route.name === "why"}
        <Why />
      {:else if route.name === "settings"}
        <Settings />
      {:else}
        <About />
      {/if}
    {/key}
  </main>

  <Footer />
</div>
