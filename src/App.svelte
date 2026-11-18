<script lang="ts">
  import { SITE_NAME, COUNTER_CODE } from "./config";
  import { app } from "./lib/store.svelte";
  import { countingAllowed, countPage } from "./lib/counter";
  import Footer from "./components/Footer.svelte";
  import { router } from "./lib/router.svelte";
  import Today from "./routes/Today.svelte";
  import DayPage from "./routes/DayPage.svelte";
  import Archive from "./routes/Archive.svelte";
  import Notes from "./routes/Notes.svelte";
  import Review from "./routes/Review.svelte";
  import Settings from "./routes/Settings.svelte";
  import About from "./routes/About.svelte";

  const links = [
    { href: "#/", name: "today", label: "Today" },
    { href: "#/archive", name: "archive", label: "Archive" },
    { href: "#/notes", name: "notes", label: "My notes" },
    { href: "#/settings", name: "settings", label: "Settings" },
    { href: "#/about", name: "about", label: "About" },
  ];

  const route = $derived(router.route);
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
      <a class="brand" href="#/">{SITE_NAME}</a>
      <nav aria-label="Main">
        <ul>
          {#each links as l}
            <li><a href={l.href} aria-current={current(l.name) ? "page" : undefined}>{l.label}</a></li>
          {/each}
        </ul>
      </nav>
    </div>
  </header>

  <main>
    {#if route.name === "today"}
      <Today />
    {:else if route.name === "day"}
      <DayPage n={route.n} />
    {:else if route.name === "archive"}
      <Archive />
    {:else if route.name === "notes"}
      <Notes />
    {:else if route.name === "review"}
      <Review />
    {:else if route.name === "settings"}
      <Settings />
    {:else}
      <About />
    {/if}
  </main>

  <Footer />
</div>
