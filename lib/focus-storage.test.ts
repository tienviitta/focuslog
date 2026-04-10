import { afterEach, describe, expect, it } from "vitest";
import {
  FOCUSLOG_STORAGE_KEY,
  appendSession,
  clearSessions,
  getTodaySessions,
  loadSessions,
} from "./focus-storage";

afterEach(() => {
  localStorage.removeItem(FOCUSLOG_STORAGE_KEY);
});

describe("loadSessions", () => {
  it("returns an empty array when storage is empty", () => {
    expect(loadSessions()).toEqual([]);
  });

  it("drops invalid JSON", () => {
    localStorage.setItem(FOCUSLOG_STORAGE_KEY, "not-json");
    expect(loadSessions()).toEqual([]);
  });

  it("drops non-arrays and invalid entries", () => {
    localStorage.setItem(FOCUSLOG_STORAGE_KEY, JSON.stringify({}));
    expect(loadSessions()).toEqual([]);

    localStorage.setItem(
      FOCUSLOG_STORAGE_KEY,
      JSON.stringify([
        null,
        { id: "", durationMinutes: 1, completedAt: new Date().toISOString() },
        {
          id: "a",
          durationMinutes: 1,
          completedAt: "not-a-date",
        },
        {
          id: "ok",
          durationMinutes: 25,
          completedAt: new Date().toISOString(),
          note: "Deep work",
        },
      ]),
    );
    const loaded = loadSessions();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("ok");
  });
});

describe("appendSession", () => {
  it("persists a valid session", () => {
    const session = {
      id: "1",
      durationMinutes: 25,
      completedAt: new Date().toISOString(),
    };
    expect(appendSession(session)).toBe(true);
    expect(loadSessions()).toEqual([session]);
  });
});

describe("getTodaySessions", () => {
  it("filters to the local calendar day", () => {
    const now = new Date(2026, 3, 10, 12, 0, 0);
    const sameDayMorning = new Date(2026, 3, 10, 1, 0, 0).toISOString();
    const nextDay = new Date(2026, 3, 11, 0, 0, 0).toISOString();

    const sessions = [
      { id: "a", durationMinutes: 5, completedAt: sameDayMorning },
      { id: "b", durationMinutes: 10, completedAt: nextDay },
    ];

    const today = getTodaySessions(sessions, now);
    expect(today.map((s) => s.id)).toEqual(["a"]);
  });
});

describe("clearSessions", () => {
  it("removes stored sessions", () => {
    localStorage.setItem(FOCUSLOG_STORAGE_KEY, JSON.stringify([]));
    expect(clearSessions()).toBe(true);
    expect(localStorage.getItem(FOCUSLOG_STORAGE_KEY)).toBeNull();
  });
});
