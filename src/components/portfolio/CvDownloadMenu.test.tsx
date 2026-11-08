import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CvDownloadMenu from "./CvDownloadMenu";
import { cvDocuments } from "../../content/cv";
import i18n from "../../i18n";

describe("CvDownloadMenu", () => {
  it("ana düğme varsayılan (mobil) CV'yi indirir", () => {
    render(<CvDownloadMenu documents={cvDocuments} language="tr" variant="hero" />);
    const main = screen.getByRole("link", { name: /CV'yi İndir/ });
    expect(main).toHaveAttribute("href", "/cv/Mahmut_Can_Conger_CV_Mobil.pdf");
    expect(main).toHaveAttribute("download");
  });

  it("menü üç seçenek gösterir, varsayılan ilk sırada", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(
      <CvDownloadMenu
        documents={cvDocuments}
        language="tr"
        variant="tile"
        onDownload={onDownload}
      />,
    );
    const toggle = screen.getByRole("button", { name: "Diğer CV seçenekleri" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.textContent)).toEqual([
      "Mobil Geliştirici CVVarsayılan",
      "Full Stack CV",
      "İME (Uzun Dönem Staj) CV",
    ]);
    expect(items.map((item) => item.getAttribute("href"))).toEqual([
      "/cv/Mahmut_Can_Conger_CV_Mobil.pdf",
      "/cv/Mahmut_Can_Conger_CV_FullStack.pdf",
      "/cv/Mahmut_Can_Conger_CV_IME.pdf",
    ]);
    expect(items[0]).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();

    // jsdom indirmeyi gerçekleştirmez; tıklama yalnızca olayı tetikler.
    items[2].addEventListener("click", (event) => event.preventDefault());
    await user.click(items[2]);
    expect(onDownload).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "ime" }),
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("Escape menüyü kapatır ve odağı düğmeye döndürür", async () => {
    const user = userEvent.setup();
    await i18n.changeLanguage("en");
    render(<CvDownloadMenu documents={cvDocuments} language="en" variant="hero" />);
    const toggle = screen.getByRole("button", { name: "More CV options" });
    await user.click(toggle);
    expect(screen.getAllByRole("menuitem")[0]).toHaveTextContent("Mobile Developer CV");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
    await i18n.changeLanguage("tr");
  });
});
