import { loadState, saveState, clearState, defaultState, type State } from "./storage";
import { localISO } from "./date";
import { newCard, grade } from "./srs";
import type { ScriptSetting } from "./markup";

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
    this.state = defaultState();
    this.persisted = true;
  }
}

export const app = new AppStore();
