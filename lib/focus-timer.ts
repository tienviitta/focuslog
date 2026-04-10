export function computeRemainingMs(endsAtMs: number, nowMs: number): number {
  return Math.max(0, endsAtMs - nowMs);
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
