import { describe, expect, it } from "vitest";
import { computeRemainingMs, formatCountdown } from "./focus-timer";

describe("computeRemainingMs", () => {
  it("returns the positive difference when end is in the future", () => {
    expect(computeRemainingMs(1_000, 0)).toBe(1_000);
  });

  it("returns 0 when end is in the past", () => {
    expect(computeRemainingMs(0, 1_000)).toBe(0);
  });
});

describe("formatCountdown", () => {
  it("pads minutes and seconds", () => {
    expect(formatCountdown(65_000)).toBe("01:05");
  });

  it("uses ceiling of fractional seconds", () => {
    expect(formatCountdown(500)).toBe("00:01");
  });
});
