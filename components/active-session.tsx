"use client";

type ActiveSessionProps = {
  durationMinutes: number;
  countdownLabel: string;
  note: string;
  onNoteChange: (note: string) => void;
  onCancel: () => void;
};

export function ActiveSession({
  durationMinutes,
  countdownLabel,
  note,
  onNoteChange,
  onCancel,
}: ActiveSessionProps) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="min-w-0 text-center">
        <p className="text-sm text-muted md:text-base">
          {durationMinutes} minute{durationMinutes === 1 ? "" : "s"} session
        </p>
        <p
          className="mt-2 font-mono text-4xl font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-5xl md:text-6xl lg:text-7xl"
          aria-live="polite"
        >
          {countdownLabel}
        </p>
      </div>
      <div className="min-w-0">
        <label
          htmlFor="focus-note-active"
          className="mb-2 block text-sm font-medium text-foreground md:text-base"
        >
          Note <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="focus-note-active"
          rows={3}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="What are you focusing on?"
          className="w-full min-h-11 resize-y rounded-lg border border-card-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
        />
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="h-11 w-full rounded-lg border border-card-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted-bg"
      >
        Cancel session
      </button>
    </div>
  );
}
