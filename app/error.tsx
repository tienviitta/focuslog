"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh min-w-0 flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground sm:px-6">
      <div className="w-full max-w-md rounded-xl border border-card-border bg-card p-4 shadow-sm sm:p-6">
        <h1 className="text-lg font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted">
          {process.env.NODE_ENV === "development"
            ? error.message
            : "Please try again."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 h-11 w-full rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
