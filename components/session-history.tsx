import type { FocusSession } from "@/lib/focus-storage";

type SessionHistoryProps = {
  sessions: FocusSession[];
};

function formatCompletedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );

  return (
    <div className="min-w-0">
      <h2 className="text-sm font-semibold text-foreground md:text-base">
        Today
      </h2>
      {sorted.length === 0 ? (
        <p className="mt-3 text-pretty text-sm text-muted md:text-base">
          No completed sessions yet today.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-card-border rounded-lg border border-card-border bg-card">
          {sorted.map((s) => (
            <li
              key={s.id}
              className="px-3 py-3 first:rounded-t-lg last:rounded-b-lg sm:px-4"
            >
              <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="min-w-0 shrink-0 text-sm font-medium text-foreground md:text-base">
                  {s.durationMinutes} min
                </span>
                <time
                  dateTime={s.completedAt}
                  className="shrink-0 text-xs text-muted tabular-nums md:text-sm"
                >
                  {formatCompletedTime(s.completedAt)}
                </time>
              </div>
              {s.note ? (
                <p className="mt-1 break-words text-sm text-muted md:text-base">
                  {s.note}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
