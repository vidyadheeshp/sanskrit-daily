// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * The counter is configured at build time (VITE_GOATCOUNTER_CODE), so each test sets the variable and
 * re-imports the app from scratch. The network is stubbed: no request ever leaves the test.
 */

const flush = () => new Promise((r) => setTimeout(r, 0));

async function boot(hash: string) {
  const { mount, unmount, tick, flushSync } = await import("svelte");
  const { default: App } = await import("./App.svelte");
  const app = mount(App, { target: document.getElementById("root")! });
  const go = async (h: string) => {
    location.hash = h;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    flushSync();
    await tick();
    await flush();
  };
  cleanup = () => unmount(app); // so old apps stop listening for navigation in later tests
  await go(hash);
  return { app, go, tick, flushSync };
}

const page = () => document.body.textContent ?? "";

let cleanup: (() => void) | null = null;

// Each test re-imports and recompiles the whole app from scratch, which can take several seconds on a cold cache.
describe("visit counter UI (configured)", { timeout: 30_000 }, () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_GOATCOUNTER_CODE", "sanskrit-test");
    localStorage.clear();
    document.body.innerHTML = '<div id="root"></div>';
    window.scrollTo = () => {};
  });
  afterEach(() => {
    cleanup?.();
    cleanup = null;
    document.head.querySelectorAll("script").forEach((el) => el.remove());
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    Object.defineProperty(navigator, "doNotTrack", { value: null, configurable: true });
  });

  it("shows the running total in the footer and discloses the counter", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ count_unique: "1 234" }) });
    vi.stubGlobal("fetch", fetchMock);
    await boot("#/");
    expect(page()).toContain("counted anonymously");
    expect(page()).toContain("1 234");
    expect(fetchMock).toHaveBeenCalledWith("https://sanskrit-test.goatcounter.com/counter/TOTAL.json");
  });

  it("switching it off in Settings stops counting, hides the total and is remembered", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ count_unique: "1 234" }) });
    vi.stubGlobal("fetch", fetchMock);
    const { go } = await boot("#/settings");

    const box = document.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(box.checked).toBe(true);
    box.click();
    await flush();

    expect(page()).toContain("Visit counting is off");
    expect(page()).not.toContain("1 234");
    expect(JSON.parse(localStorage.getItem("sanskrit-daily:v1")!).settings.countVisits).toBe(false);

    await go("#/"); // still off after navigating
    expect(page()).toContain("Visit counting is off");
  });

  it("does nothing at all when the browser sends Do Not Track", async () => {
    Object.defineProperty(navigator, "doNotTrack", { value: "1", configurable: true });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await boot("#/");
    expect(page()).toContain("Visit counting is off");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.querySelector('script[src*="goatcounter"], script[src*="gc.zgo.at"]')).toBeNull();
  });

  it("survives the counter being unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await boot("#/");
    expect(page()).toContain("counted anonymously");
    expect(page()).not.toContain("visitors so far");
  });
});
