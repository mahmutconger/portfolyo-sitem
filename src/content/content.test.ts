import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import tr from "../locales/tr.json";
import en from "../locales/en.json";
import { projects } from "./projects";
import { experience } from "./experience";
import { cvDocuments, defaultCv, legacyCvPaths } from "./cv";
import { profile, socialLinks } from "./profile";
import { aboutBio, competencies, education, workPrinciples } from "./about";
import { approach, skillGroups } from "./skills";
import { formatPeriod, toLanguage } from "./format";
import {
  bannedPhrases,
  findLocalizationGaps,
  linkMatchesTarget,
  validatePeriod,
  validateProjects,
} from "./validation";
import type { Project } from "./types";

const allContent = {
  projects,
  experience,
  cvDocuments,
  profile,
  socialLinks,
  aboutBio,
  competencies,
  education,
  workPrinciples,
  approach,
  skillGroups,
};

describe("içerik modeli: iki dil", () => {
  it("her { tr, en } alanı iki dilde de dolu", () => {
    expect(findLocalizationGaps(allContent)).toEqual([]);
  });

  it("eksik çeviriyi yakalar", () => {
    expect(findLocalizationGaps({ title: { tr: "Başlık", en: " " } })).toEqual([
      "content.title.en",
    ]);
    expect(findLocalizationGaps({ list: { tr: ["a", "b"], en: ["a"] } })).toHaveLength(1);
  });
});

describe("içerik modeli: projeler", () => {
  it("doğrulama kurallarının hepsinden geçer", () => {
    expect(validateProjects(projects)).toEqual([]);
  });

  it("CV ile aynı sırada", () => {
    expect(projects.map((project) => project.id)).toEqual([
      "walktalk",
      "mook",
      "timofy",
      "smartexam",
      "delivery-tracking",
      "latteproje",
      "penlingu",
    ]);
  });

  it("Delivery Tracking bağımsız proje ve müşteri alanı yok", () => {
    const delivery = projects.find((project) => project.id === "delivery-tracking");
    expect(delivery?.kind).toBe("independent");
    expect(delivery).not.toHaveProperty("client");
    expect(tr.projects.kind.independent).toBe("Bağımsız proje");
    expect(en.projects.kind.independent).toBe("Independent project");
  });

  it("Delivery Tracking metinlerinde müşteri/client/customer geçmiyor", () => {
    const delivery = projects.find((project) => project.id === "delivery-tracking");
    const text = JSON.stringify(delivery).toLocaleLowerCase("tr");
    for (const word of ["müşteri", "client", "customer"]) expect(text).not.toContain(word);
  });

  it("müşteri adı yalnızca müşteri işlerinde var", () => {
    const withClient = projects
      .filter((project) => project.client)
      .map((project) => [project.id, project.kind, project.client]);
    expect(withClient).toEqual([
      ["walktalk", "client", "Samet Yanan"],
      ["mook", "client", "Samet Yanan"],
    ]);
  });

  it("müşteri alanı kuralını uygular", () => {
    const [walktalk] = projects;
    const noClient: Project = { ...walktalk, id: "a", client: undefined };
    const strayClient: Project = { ...walktalk, id: "b", kind: "independent" };
    expect(validateProjects([noClient]).map((issue) => issue.path)).toContain(
      "projects[0](a).client",
    );
    expect(validateProjects([strayClient]).map((issue) => issue.path)).toContain(
      "projects[0](b).client",
    );
  });

});

describe("bağlantı etiketi ↔ hedef", () => {
  it.each([
    ["source", "https://github.com/mahmutconger/LatteProject", true],
    ["source", "https://github.com/mahmutconger", false],
    ["source", "https://play.google.com/store/apps/details?id=com.istaps.walktalk2", false],
    ["googlePlay", "https://play.google.com/store/apps/details?id=com.istaps.walktalk2", true],
    ["googlePlay", "https://walktalkk.com", false],
    ["website", "https://timofy.site", true],
    ["website", "https://github.com/mahmutconger/x", false],
    ["linkedin", "https://www.linkedin.com/feed/update/urn:li:activity:1/", true],
    ["website", "http://insecure.example", false],
  ] as const)("%s → %s = %s", (kind, url, expected) => {
    expect(linkMatchesTarget({ kind, url })).toBe(expected);
  });
});

describe("deneyim", () => {
  it("ZNOSOFT ve freelance kayıtları tarihli", () => {
    expect(experience.map((entry) => entry.id)).toEqual(["znosoft", "freelance"]);
    experience.forEach((entry) =>
      expect(validatePeriod(entry.period, entry.id)).toEqual([]),
    );
  });

  it("freelance bloğunda yalnızca WalkTalk ve MOOK var, tarih Mart – Kasım 2026", () => {
    const freelance = experience.find((entry) => entry.id === "freelance");
    expect(freelance?.projectIds).toEqual(["walktalk", "mook"]);
    expect(freelance && formatPeriod(freelance.period, "tr")).toBe("Mart – Kasım 2026");
    expect(freelance && formatPeriod(freelance.period, "en")).toBe("March – November 2026");
  });

  it("freelance altındaki projeler proje listesinde var", () => {
    const ids = new Set(projects.map((project) => project.id));
    const missing = experience.flatMap((entry) =>
      entry.projectIds.filter((id) => !ids.has(id)),
    );
    expect(missing).toEqual([]);
  });
});

describe("tarih biçimi", () => {
  it("TR ve EN aralıklarını yazar", () => {
    expect(formatPeriod({ start: "2026-04", end: "2026-07" }, "tr")).toBe("Nisan – Temmuz 2026");
    expect(formatPeriod({ start: "2026-04", end: "2026-07" }, "en")).toBe("April – July 2026");
    expect(formatPeriod({ start: "2024-12", end: "2026-09" }, "tr")).toBe("Aralık 2024 – Eylül 2026");
    expect(formatPeriod({ start: "2025-05", end: "2025-05" }, "tr")).toBe("Mayıs 2025");
  });

  it("dil kodunu sitenin iki diline indirger", () => {
    expect(toLanguage("en-US")).toBe("en");
    expect(toLanguage("tr-TR")).toBe("tr");
    expect(toLanguage("de")).toBe("tr");
  });
});

describe("CV dosyaları", () => {
  it("üç CV var ve varsayılan mobil CV", () => {
    expect(cvDocuments.map((cv) => cv.href)).toEqual([
      "/cv/Mahmut_Can_Conger_CV_Mobil.pdf",
      "/cv/Mahmut_Can_Conger_CV_FullStack.pdf",
      "/cv/Mahmut_Can_Conger_CV_IME.pdf",
    ]);
    expect(cvDocuments.filter((cv) => cv.isDefault)).toHaveLength(1);
    expect(defaultCv.variant).toBe("mobile");
  });

  it("eski CV adresleri vercel.json'da mobil CV'ye yönleniyor", () => {
    const config = JSON.parse(
      readFileSync(resolve(__dirname, "../../vercel.json"), "utf8"),
    ) as { redirects: { source: string; destination: string }[] };
    legacyCvPaths.forEach((path) => {
      expect(config.redirects).toContainEqual(
        expect.objectContaining({ source: path, destination: defaultCv.href }),
      );
    });
  });
});

describe("yasaklı ifadeler ve eski bağlantılar", () => {
  const corpus = JSON.stringify([allContent, tr, en]).toLocaleLowerCase("tr");

  it.each(bannedPhrases)("'%s' hiçbir yerde geçmiyor", (phrase) => {
    expect(corpus).not.toContain(phrase.toLocaleLowerCase("tr"));
  });

  it("eski LinkedIn adresi yok, yenisi var", () => {
    expect(corpus).not.toContain("4305b1299");
    expect(socialLinks.find((link) => link.id === "linkedin")?.href).toBe(
      "https://www.linkedin.com/in/mahmut-can-conger/",
    );
  });

  it("rol ve meta açıklaması CV ile aynı", () => {
    expect(profile.role).toEqual({
      tr: "Yazılım Mühendisliği Öğrencisi",
      en: "Software Engineering Student",
    });
    expect(profile.focus).toEqual(["Kotlin", "Jetpack Compose", "Kotlin Multiplatform"]);
    expect(profile.metaDescription.tr).not.toMatch(/Sivas|uzmanlığı/);
  });
});
