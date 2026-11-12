import { parseYearMonth } from "./format";
import type { Period, Project, ProjectLink } from "./types";

export interface ValidationIssue {
  path: string;
  message: string;
}

// Sitede hiçbir dilde geçmemesi gereken, ölçülmemiş ya da mutlak ifadeler.
export const bannedPhrases = [
  "saniye altı gecikme",
  "sub-second latency",
  "milisaniyeler içinde",
  "whatsapp veya telegram standartlarında",
  "kusursuz",
  "üretim seviyesi",
  "production-ready",
  "kurumsal seviye",
  "tamamen dijitalleştiren",
  "enterprise-grade",
  "atomic commit",
  "(advanced)",
  "ileri seviye",
];

const hostOf = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.hostname.replace(/^www\./, "") : null;
  } catch {
    return null;
  }
};

/** Bağlantı türü ile hedef adresin uyuşup uyuşmadığını denetler. */
export function linkMatchesTarget(link: ProjectLink): boolean {
  const host = hostOf(link.url);
  if (!host) return false;
  switch (link.kind) {
    case "googlePlay":
      return host === "play.google.com";
    case "source": {
      // Kaynak kod yalnızca bir GitHub deposuna gidebilir (profil değil).
      const segments = new URL(link.url).pathname.split("/").filter(Boolean);
      return host === "github.com" && segments.length >= 2;
    }
    case "linkedin":
      return host === "linkedin.com";
    case "website":
      return !["play.google.com", "github.com", "linkedin.com"].includes(host);
  }
}

function comparePeriod(period: Period): number {
  const start = parseYearMonth(period.start);
  const end = parseYearMonth(period.end);
  return start.year * 12 + start.month - (end.year * 12 + end.month);
}

export function validatePeriod(period: Period | undefined, path: string): ValidationIssue[] {
  if (!period?.start || !period.end)
    return [{ path, message: "Başlangıç ve bitiş tarihi zorunlu" }];
  try {
    return comparePeriod(period) > 0
      ? [{ path, message: "Başlangıç bitişten sonra olamaz" }]
      : [];
  } catch (error) {
    return [{ path, message: (error as Error).message }];
  }
}

export function validateProjects(list: Project[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  list.forEach((project, index) => {
    const path = `projects[${index}](${project.id || "?"})`;
    if (!project.id) issues.push({ path, message: "Kimlik boş" });
    if (seen.has(project.id)) issues.push({ path, message: "Kimlik tekrar ediyor" });
    seen.add(project.id);
    for (const field of ["title", "tagline", "status", "summary"] as const) {
      for (const language of ["tr", "en"] as const) {
        if (!project[field][language]?.trim())
          issues.push({ path: `${path}.${field}.${language}`, message: "Boş metin" });
      }
    }
    for (const field of ["story", "highlights"] as const) {
      const { tr, en } = project[field];
      if (!tr.length || !en.length)
        issues.push({ path: `${path}.${field}`, message: "Liste boş" });
      if (tr.length !== en.length)
        issues.push({ path: `${path}.${field}`, message: "TR ve EN madde sayısı farklı" });
      [...tr, ...en].forEach((item, i) => {
        if (!item.trim()) issues.push({ path: `${path}.${field}[${i}]`, message: "Boş madde" });
      });
    }
    issues.push(...validatePeriod(project.period, `${path}.period`));
    if (!project.tags.length) issues.push({ path: `${path}.tags`, message: "Etiket yok" });
    // Müşteri adı yalnızca müşteri işlerinde olabilir ve orada zorunludur.
    if (project.kind === "client" && !project.client?.trim())
      issues.push({ path: `${path}.client`, message: "Müşteri işinde müşteri adı zorunlu" });
    if (project.kind !== "client" && project.client !== undefined)
      issues.push({ path: `${path}.client`, message: "Müşteri işi olmayan projede müşteri alanı olamaz" });
    project.links.forEach((link, i) => {
      if (!linkMatchesTarget(link))
        issues.push({
          path: `${path}.links[${i}]`,
          message: `"${link.kind}" etiketi ${link.url} hedefiyle uyuşmuyor`,
        });
    });
  });
  return issues;
}

/**
 * İçerik ağacındaki her `{ tr, en }` nesnesinin iki dilde de dolu olduğunu
 * denetler ve eksik olanların yolunu döndürür.
 */
export function findLocalizationGaps(value: unknown, path = "content"): string[] {
  if (Array.isArray(value))
    return value.flatMap((item, i) => findLocalizationGaps(item, `${path}[${i}]`));
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  const isLocalized = keys.length === 2 && "tr" in record && "en" in record;
  if (isLocalized) {
    const empty = (item: unknown) =>
      item === undefined ||
      item === null ||
      (typeof item === "string" && !item.trim()) ||
      (Array.isArray(item) && item.some((entry) => typeof entry === "string" && !entry.trim()));
    const gaps = (["tr", "en"] as const).filter((language) => empty(record[language]));
    if (Array.isArray(record.tr) && Array.isArray(record.en) && record.tr.length !== record.en.length)
      return [`${path} (TR ve EN liste uzunluğu farklı)`];
    return gaps.map((language) => `${path}.${language}`);
  }
  return keys.flatMap((key) => findLocalizationGaps(record[key], `${path}.${key}`));
}
