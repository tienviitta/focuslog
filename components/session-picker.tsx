"use client";

import { useState } from "react";

const DURATIONS = [1, 5, 25, 45, 60] as const;

type SessionPickerProps = {
  onStart: (durationMinutes: number, note: string) => void;
  disabled?: boolean;
};

export function SessionPicker({ onStart, disabled }: SessionPickerProps) {
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(25);
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="min-w-0">
        <p className="mb-2 text-sm font-medium text-foreground md:text-base">
          Duration
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start md:gap-3">
          {DURATIONS.map((m) => (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => setDuration(m)}
              className={`min-h-11 min-w-[4.5rem] rounded-lg border px-4 text-sm font-medium transition-colors disabled:opacity-50 ${
                duration === m
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-card-border bg-muted-bg/60 text-foreground hover:bg-muted-bg"
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <label
          htmlFor="focus-note"
          className="mb-2 block text-sm font-medium text-foreground md:text-base"
        >
          Note <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="focus-note"
          rows={3}
          disabled={disabled}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What are you focusing on?"
          className="w-full min-h-11 resize-y rounded-lg border border-card-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:text-sm"
        />
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onStart(duration, note.trim())}
        className="h-11 w-full rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        Start session
      </button>
    </div>
  );
}
