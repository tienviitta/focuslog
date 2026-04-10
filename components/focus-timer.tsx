"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { computeRemainingMs, formatCountdown } from "@/lib/focus-timer";

export type FocusTimerRenderState = {
  remainingMs: number;
  label: string;
};

type FocusTimerProps = {
  endsAt: number;
  onComplete: () => void;
  children: (state: FocusTimerRenderState) => ReactNode;
};

export function FocusTimer({ endsAt, onComplete, children }: FocusTimerProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const endsAtRef = useRef(endsAt);
  const completedForEndsAtRef = useRef<number | null>(null);

  useEffect(() => {
    endsAtRef.current = endsAt;
  }, [endsAt]);

  useEffect(() => {
    const targetEndsAt = endsAt;
    completedForEndsAtRef.current = null;

    const tick = () => {
      const now = Date.now();
      setNowMs(now);
      const remaining = computeRemainingMs(targetEndsAt, now);
      if (remaining <= 0 && endsAtRef.current === targetEndsAt) {
        if (completedForEndsAtRef.current !== targetEndsAt) {
          completedForEndsAtRef.current = targetEndsAt;
          onComplete();
        }
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt, onComplete]);

  const remainingMs = computeRemainingMs(endsAt, nowMs);
  const label = formatCountdown(remainingMs);

  return <>{children({ remainingMs, label })}</>;
}
