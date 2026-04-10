import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SessionPicker } from "./session-picker";

describe("SessionPicker", () => {
  it("calls onStart with the selected duration and trimmed note", () => {
    const onStart = vi.fn();
    render(<SessionPicker onStart={onStart} />);

    fireEvent.click(screen.getByRole("button", { name: "5 min" }));
    fireEvent.change(screen.getByLabelText(/note/i), {
      target: { value: "  draft  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Start session" }));

    expect(onStart).toHaveBeenCalledWith(5, "draft");
  });
});
