export const FOCUSLOG_STORAGE_KEY = "focuslog-sessions";

export type FocusSession = {
  id: string;
  durationMinutes: number;
  completedAt: string;
  note?: string;
};

function isFocusSession(value: unknown): value is FocusSession {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    o.id.length === 0 ||
    typeof o.durationMinutes !== "number" ||
    !Number.isFinite(o.durationMinutes) ||
    o.durationMinutes <= 0 ||
    typeof o.completedAt !== "string" ||
    o.completedAt.length === 0
  ) {
    return false;
  }
  if (o.note !== undefined && typeof o.note !== "string") return false;
  return !Number.isNaN(Date.parse(o.completedAt));
}

function parseStoredSessions(raw: string | null): FocusSession[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isFocusSession);
}

function writeSessions(sessions: FocusSession[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(FOCUSLOG_STORAGE_KEY, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
}

/** Read all stored sessions (newest-first order is not guaranteed; sort at display time). */
export function loadSessions(): FocusSession[] {
  if (typeof window === "undefined") return [];
  return parseStoredSessions(localStorage.getItem(FOCUSLOG_STORAGE_KEY));
}

/** Replace the entire stored list. Invalid entries are dropped. Returns whether the write succeeded. */
export function saveSessions(sessions: FocusSession[]): boolean {
  const valid = sessions.filter(isFocusSession);
  return writeSessions(valid);
}

/** Append one session after existing entries. Returns whether the write succeeded. */
export function appendSession(session: FocusSession): boolean {
  if (!isFocusSession(session)) return false;
  const existing = loadSessions();
  existing.push(session);
  return writeSessions(existing);
}

/** Remove all sessions from storage. Returns whether the write succeeded. */
export function clearSessions(): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(FOCUSLOG_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

function sameLocalCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getTodaySessions(
  sessions: FocusSession[],
  now: Date = new Date(),
): FocusSession[] {
  return sessions.filter((s) =>
    sameLocalCalendarDay(new Date(s.completedAt), now),
  );
}
