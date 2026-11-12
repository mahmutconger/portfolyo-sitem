import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProjectsCard from "./ProjectsCard";
import i18n from "../../i18n";

// Testler canlı Firebase'e hiç bağlanmaz: görseller alınamamış gibi davranılır.
vi.mock("../../services/portfolioRepository", () => ({
  fetchProjectMedia: vi.fn().mockRejectedValue(new Error("test")),
  recordAnalyticsEvent: vi.fn(),
}));

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ProjectsCard />
    </MemoryRouter>,
  );
}

afterEach(async () => {
  await i18n.changeLanguage("tr");
});

describe("ProjectsCard — Delivery Tracking", () => {
  it("ayrıntı sayfası 'Bağımsız proje' gösterir, müşteri ifadesi yok (TR)", () => {
    renderAt("/?project=delivery-tracking#projects");
    const detail = screen.getByTestId("project-detail-delivery-tracking");
    expect(within(detail).getByText("Bağımsız proje")).toBeInTheDocument();
    expect(detail).toHaveTextContent("Mart – Mayıs 2026");
    expect(detail.textContent).not.toMatch(/müşteri|client|customer/i);
  });

  it("ayrıntı sayfası 'Independent project' gösterir, client ifadesi yok (EN)", async () => {
    await i18n.changeLanguage("en");
    renderAt("/?project=delivery-tracking#projects");
    const detail = screen.getByTestId("project-detail-delivery-tracking");
    expect(within(detail).getByText("Independent project")).toBeInTheDocument();
    expect(detail).toHaveTextContent("March – May 2026");
    expect(detail.textContent).not.toMatch(/müşteri|client|customer/i);
  });
});
