import type { Language, Localized, Period, YearMonth } from "./types";

const monthNames: Localized<string[]> = {
  tr: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export function parseYearMonth(value: YearMonth): { year: number; month: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Geçersiz tarih: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) throw new Error(`Geçersiz ay: ${value}`);
  return { year, month };
}

/** "Nisan – Temmuz 2026", "Aralık 2024 – Eylül 2026" ya da "Mayıs 2025". */
export function formatPeriod(period: Period, language: Language): string {
  const start = parseYearMonth(period.start);
  const end = parseYearMonth(period.end);
  const names = monthNames[language];
  const endLabel = `${names[end.month - 1]} ${end.year}`;
  if (start.year === end.year && start.month === end.month) return endLabel;
  const startLabel =
    start.year === end.year
      ? names[start.month - 1]
      : `${names[start.month - 1]} ${start.year}`;
  return `${startLabel} – ${endLabel}`;
}

export const localize = <T>(value: Localized<T>, language: Language): T =>
  value[language];

/** i18next dil kodunu ("en-US", "tr") sitenin iki diline indirger. */
export const toLanguage = (code: string | undefined): Language =>
  code?.toLowerCase().startsWith("en") ? "en" : "tr";
