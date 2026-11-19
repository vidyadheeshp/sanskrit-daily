import { loadState, saveState, clearState, defaultState, type State } from "./storage";
import { localISO } from "./date";
import { clearPlace } from "./place";
import { newCard, grade } from "./srs";
import type { ScriptSetting } from "./markup";
import type { Lang } from "../i18n/langs";

class AppStore {
  state = $state<State>(loadState());
  /** false when the browser refused a write — shown on the Settings page. */
  persisted = $state(true);

  private commit() {
    this.persisted = saveState($state.snapshot(this.state) as State);
  }

  get script(): ScriptSetting {
    return this.state.settings.script;
  }

  get completedCount(): number {
    return Object.keys(this.state.completed).length;
  }

  /** Number of distinct calendar days on which the learner finished a lesson. Only ever grows. */
  get daysPractised(): number {
    return new Set(Object.values(this.state.completed)).size;
  }

  isCompleted(n: number): boolean {
    return String(n) in this.state.completed;
  }

  isWeekDone(n: number): boolean {
    return String(n) in this.state.weeks;
  }

  /** Record that the weekly check was finished. The first date is kept; taking it again changes nothing. */
  completeWeek(n: number) {
    const key = String(n);
    if (!(key in this.state.weeks)) this.state.weeks[key] = localISO();
    this.commit();
  }

  setScript(script: ScriptSetting) {
    this.state.settings.script = script;
    this.commit();
  }

  /** The landing page is shown once; remember that it has been. */
  markWelcomeSeen() {
    if (this.state.settings.welcomeSeen) return;
    this.state.settings.welcomeSeen = true;
    this.commit();
  }

  /** The interface language. English is the default; learners opt in to another. */
  get language(): Lang {
    return this.state.settings.language;
  }

  /** `lang` attribute for lesson text, which is English-only for now: undefined (inherit) when the interface is English. */
  get lessonLang(): string | undefined {
    return this.state.settings.language === "en" ? undefined : "en";
  }

  setLanguage(l: Lang) {
    this.state.settings.language = l;
    this.commit();
  }

  setShowPanchang(on: boolean) {
    this.state.settings.showPanchang = on;
    this.commit();
  }

  setCountVisits(on: boolean) {
    this.state.settings.countVisits = on;
    this.commit();
  }

  completeLesson(n: number, rule: string, reviewIds: string[]) {
    const today = localISO();
    const key = String(n);
    if (!(key in this.state.completed)) this.state.completed[key] = today;
    this.state.notes[key] = rule;
    for (const id of reviewIds) {
      if (!(id in this.state.review)) this.state.review[id] = newCard(today);
    }
    this.commit();
  }

  gradeReview(id: string, correct: boolean) {
    const card = this.state.review[id];
    if (!card) return;
    this.state.review[id] = grade(card, correct, localISO());
    this.commit();
  }

  replace(next: State) {
    this.state = next;
    this.commit();
  }

  reset() {
    clearState();
    clearPlace(); // the saved panchang location is deleted with everything else
    this.state = defaultState();
    this.persisted = true;
  }
}

export const app = new AppStore();
