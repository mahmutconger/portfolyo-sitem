import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectImage, { PROJECT_IMAGE_FALLBACK } from "./ProjectImage";

const STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/x/o/images%2FFREELANCE1.jpg?alt=media";

describe("ProjectImage", () => {
  it("adres yoksa doğrudan yedek görseli gösterir", () => {
    render(<ProjectImage alt="WalkTalk" />);
    const image = screen.getByRole("img", { name: "WalkTalk" });
    expect(image).toHaveAttribute("src", PROJECT_IMAGE_FALLBACK);
    expect(image).toHaveAttribute("data-fallback", "true");
  });

  it("görsel yüklenemezse (ör. Storage 402) yedeğe geçer", () => {
    render(<ProjectImage src={STORAGE_URL} alt="WalkTalk" />);
    const image = screen.getByRole("img", { name: "WalkTalk" });
    expect(image).toHaveAttribute("src", STORAGE_URL);
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", PROJECT_IMAGE_FALLBACK);
    expect(image).toHaveAttribute("data-fallback", "true");
  });

  it("yeni bir adres gelince tekrar dener", () => {
    const { rerender } = render(<ProjectImage src={STORAGE_URL} alt="MOOK" />);
    fireEvent.error(screen.getByRole("img"));
    rerender(<ProjectImage src="https://example.com/ok.jpg" alt="MOOK" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/ok.jpg");
  });
});
