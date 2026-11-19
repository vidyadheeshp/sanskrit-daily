import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import { publishThrough, type ScheduleConfig } from "./src/lib/schedule.ts";

// BASE_PATH is "/" locally and "/<repo>/" on GitHub Pages (set by the deploy workflow).
const raw = process.env.BASE_PATH ?? "/";
const base = raw.endsWith("/") ? raw : raw + "/";

const schedule: ScheduleConfig = JSON.parse(
  readFileSync(new URL("./schedule.json", import.meta.url), "utf8").replace(/^﻿/, ""), // tolerate a Notepad BOM
);

/**
 * Production builds only: replace lessons that are beyond the publish window with an empty stub, so
 * unreleased lessons are never shipped to the browser. (They still exist in the repo.)
 */
function holdBackUnreleasedLessons(): Plugin {
  const today = new Date().toISOString().slice(0, 10); // UTC date; learners run on the IST date (UTC+5:30, at most one day ahead), which the buffer covers
  const through = publishThrough(today, schedule);
  let announced = false;
  return {
    name: "hold-back-unreleased-lessons",
    apply: "build",
    enforce: "pre",
    load(id) {
      const m = /[\\/]src[\\/]lessons[\\/]day-(\d+)\.ts$/.exec(id.split("?")[0]);
      if (!m) return null;
      if (!announced) {
        announced = true;
        console.log(`[schedule] build date ${today} (UTC): publishing lessons 1–${through}`);
      }
      return Number(m[1]) > through ? { code: "export const lesson = null;", map: null } : null;
    },
  };
}

export default defineConfig({
  base,
  plugins: [
    svelte(),
    holdBackUnreleasedLessons(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "og-image.png"],
      workbox: {
        // Per-lesson share pages (/d/N/) must reach the network so link-preview tags and the
        // redirect work, instead of being answered with the app shell.
        navigateFallbackDenylist: [/\/d\/\d+\/?$/],
      },
      manifest: {
        name: "Dine Dine — Sanskrit Daily",
        short_name: "Dine Dine",
        description: "One small Sanskrit lesson every day. No login, no ads.",
        theme_color: "#8a3b12",
        background_color: "#fbf6ec",
        display: "standalone",
        start_url: base,
        scope: base,
        icons: [
          { src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  // Under Vitest, resolve Svelte's browser build so components can be mounted in jsdom.
  resolve: process.env.VITEST ? { conditions: ["browser"] } : undefined,
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test-setup.ts"],
  },
});
