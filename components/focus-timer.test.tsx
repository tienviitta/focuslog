import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FocusTimer } from "./focus-timer";

describe("FocusTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onComplete once when the countdown reaches zero", () => {
    const onComplete = vi.fn();
    const endsAt = Date.now() + 2_000;

    render(
      <FocusTimer endsAt={endsAt} onComplete={onComplete}>
        {({ label }) => <span>{label}</span>}
      </FocusTimer>,
    );

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
