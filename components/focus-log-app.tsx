"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ActiveSession } from "@/components/active-session";
import { FocusTimer } from "@/components/focus-timer";
import { SessionHistory } from "@/components/session-history";
import { SessionPicker } from "@/components/session-picker";
import {
  appendSession,
  getTodaySessions,
  loadSessions,
  type FocusSession,
} from "@/lib/focus-storage";
type ActiveRun = {
  durationMinutes: number;
  endsAt: number;
  note: string;
};

export function FocusLogApp() {
  const [active, setActive] = useState<ActiveRun | null>(null);
  const [todaySessions, setTodaySessions] = useState<FocusSession[]>([]);
  const activeRef = useRef<ActiveRun | null>(null);

  useEffect(() => {
    activeRef.current = active;
  });

  const refreshToday = useCallback(() => {
    const all = loadSessions();
    setTodaySessions(getTodaySessions(all));
  }, []);

  const finishSession = useCallback(
    (run: ActiveRun) => {
      const session: FocusSession = {
        id: crypto.randomUUID(),
        durationMinutes: run.durationMinutes,
        completedAt: new Date().toISOString(),
        note: run.note.trim() || undefined,
      };
      appendSession(session);
      setActive(null);
      refreshToday();
    },
    [refreshToday],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => refreshToday());
    return () => cancelAnimationFrame(id);
  }, [refreshToday]);

  const handleTimerComplete = useCallback(() => {
    const run = activeRef.current;
    if (run) finishSession(run);
  }, [finishSession]);

  const handleStart = (durationMinutes: number, note: string) => {
    const endsAt = Date.now() + durationMinutes * 60 * 1000;
    setActive({ durationMinutes, endsAt, note });
  };

  const handleCancel = () => setActive(null);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="border-b border-card-border px-4 py-6 sm:px-6 sm:py-8 md:py-10">
        <div className="mx-auto w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            FocusLog
          </h1>
          <p className="mt-1 max-w-prose text-pretty text-sm text-muted md:text-base">
            Run a timed focus block and see what you finished today.
          </p>
        </div>
      </header>

      <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6 md:max-w-2xl md:gap-8 lg:max-w-3xl">
          <section
            className="rounded-xl border border-card-border bg-card p-4 shadow-sm sm:p-6 md:p-8"
            aria-labelledby="session-heading"
          >
            <h2 id="session-heading" className="sr-only">
              Focus session
            </h2>
            {active ? (
              <FocusTimer
                endsAt={active.endsAt}
                onComplete={handleTimerComplete}
              >
                {({ label }) => (
                  <ActiveSession
                    durationMinutes={active.durationMinutes}
                    countdownLabel={label}
                    note={active.note}
                    onNoteChange={(note) => setActive({ ...active, note })}
                    onCancel={handleCancel}
                  />
                )}
              </FocusTimer>
            ) : (
              <SessionPicker onStart={handleStart} />
            )}
          </section>

          <section
            className="rounded-xl border border-card-border bg-card p-4 shadow-sm sm:p-6 md:p-8"
            aria-labelledby="history-heading"
          >
            <h2 id="history-heading" className="sr-only">
              Today&apos;s log
            </h2>
            <SessionHistory sessions={todaySessions} />
          </section>
        </div>
      </main>
    </div>
  );
}
