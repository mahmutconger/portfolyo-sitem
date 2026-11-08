// Kart sahnesindeki bölümlerin sırası. Sayaç (01 / 07), alt gezinme çubuğu ve
// bölüm başlıklarındaki numaralar bu diziden türetilir.
export const sectionIds = [
  "home",
  "about",
  "tech",
  "experience",
  "projects",
  "articles",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

const pad = (value: number) => String(value).padStart(2, "0");

export const sectionNumber = (id: SectionId): string =>
  pad(sectionIds.indexOf(id) + 1);

export const sectionTotal = pad(sectionIds.length);

export const isSectionId = (value: string): value is SectionId =>
  (sectionIds as readonly string[]).includes(value);

/** Proje kartını doğrudan açan, paylaşılabilir adres. */
export const projectHref = (id: string): string =>
  `/?project=${encodeURIComponent(id)}#projects`;
