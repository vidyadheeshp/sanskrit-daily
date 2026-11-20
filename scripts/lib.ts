/** Shared helpers for the build scripts (run with tsx). Not part of the shipped app. */
import { readdirSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import type { Lesson } from "../src/lib/schema";
import type { ScheduleConfig } from "../src/lib/schedule";

export const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

export interface Schedule extends ScheduleConfig {
  unlockHourIST: number;
  siteUrl: string | null;
}

export function readSchedule(): Schedule {
  return JSON.parse(readFileSync(join(root, "schedule.json"), "utf8").replace(/^﻿/, ""));
}

/** Loads every src/lessons/day-NNN.ts, in order. */
export async function loadLessons(): Promise<Lesson[]> {
  const dir = join(root, "src", "lessons");
  const files = readdirSync(dir)
    .filter((f) => /^day-\d+\.ts$/.test(f))
    .sort();
  const out: Lesson[] = [];
  for (const f of files) {
    const mod = (await import(pathToFileURL(join(dir, f)).href)) as { lesson: Lesson };
    out.push(mod.lesson);
  }
  return out.sort((a, b) => a.number - b.number);
}

/** "https://user.github.io/repo/" — always with one trailing slash; "" if not configured. */
export function siteUrl(schedule: Schedule): string {
  const raw = (process.env.SITE_URL ?? schedule.siteUrl ?? "").trim();
  return raw ? raw.replace(/\/*$/, "/") : "";
}

export function basePath(): string {
  const raw = process.env.BASE_PATH ?? "/";
  return raw.endsWith("/") ? raw : raw + "/";
}

export const todayUTC = () => new Date().toISOString().slice(0, 10);

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

interface PostLesson {
  number: number;
  title: string;
  teaser: string;
  minutes: number;
}

/** Ready-to-paste LinkedIn text for a lesson. */
export const linkedinPost = (l: PostLesson, url: string): string =>
  [
    `🪔 Dine Dine · Sanskrit Daily · Lesson ${l.number}`,
    ``,
    l.teaser,
    ``,
    `Today's lesson takes about ${l.minutes} minutes. Free, no login, no ads — it works in your browser.`,
    ``,
    `👉 ${url}`,
    ``,
    `New lesson every day. #Sanskrit #LearnSanskrit #LanguageLearning #IndianLanguages`,
  ].join("\n");

/** Ready-to-paste WhatsApp text for a lesson. */
export const whatsappPost = (l: PostLesson, url: string): string =>
  [`🪔 *Dine Dine · Sanskrit Daily #${l.number}*`, l.teaser, `${l.minutes} min, free, no login 👉 ${url}`].join("\n");
