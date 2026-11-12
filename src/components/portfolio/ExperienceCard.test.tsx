import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ExperienceCard from "./ExperienceCard";
import { experience } from "../../content/experience";
import { projects } from "../../content/projects";
import i18n from "../../i18n";

function renderCard(language: "tr" | "en" = "tr") {
  return render(
    <MemoryRouter>
      <ExperienceCard entries={experience} projects={projects} language={language} />
    </MemoryRouter>,
  );
}

describe("ExperienceCard", () => {
  it("ZNOSOFT stajını tarih, ekip ve maddeleriyle gösterir", () => {
    renderCard();
    const znosoft = screen.getByTestId("experience-znosoft");
    expect(within(znosoft).getByRole("heading", { level: 2 })).toHaveTextContent(
      "ZNOSOFT · Stajyer Android Geliştirici",
    );
    expect(znosoft).toHaveTextContent("Haziran – Ağustos 2026");
    expect(znosoft).toHaveTextContent("1 mentor ve 3 stajyerden oluşan ekip");
    expect(within(znosoft).getAllByRole("listitem")).toHaveLength(3);
    expect(znosoft).toHaveTextContent("Altınım Sahte mi?");
  });

  it("freelance bloğunu yalnızca iki müşteri projesine bağlar", () => {
    renderCard();
    const freelance = screen.getByTestId("experience-freelance");
    expect(freelance).toHaveTextContent("Freelance Mobil Geliştirici");
    expect(freelance).toHaveTextContent("Mart – Kasım 2026");
    expect(freelance).toHaveTextContent("Müşteri projeleri, uzaktan");
    const links = within(freelance).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/?project=walktalk#projects",
      "/?project=mook#projects",
    ]);
    expect(links[0]).toHaveAccessibleName(/WalkTalk/);
    expect(freelance).not.toHaveTextContent(/Delivery/i);
    expect(within(freelance).getAllByText(/Müşteri: Samet Yanan/)).toHaveLength(2);
  });

  it("İngilizce içerikle de çalışır", async () => {
    await i18n.changeLanguage("en");
    renderCard("en");
    expect(screen.getByTestId("experience-znosoft")).toHaveTextContent(
      "Android Developer Intern",
    );
    expect(screen.getByTestId("experience-freelance")).toHaveTextContent(
      "March – November 2026",
    );
    await i18n.changeLanguage("tr");
  });
});
