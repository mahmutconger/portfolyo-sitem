// Sitedeki bütün içeriğin tipleri. Bileşenler yalnızca bu tipleri okur;
// metinlerin tek doğru kaynağı `src/content/` altındaki dosyalardır.

export const languages = ["tr", "en"] as const;
export type Language = (typeof languages)[number];

/** Her kullanıcıya görünen metin iki dilde de bulunmak zorundadır. */
export type Localized<T = string> = Record<Language, T>;

/** "YYYY-MM" biçiminde ay. */
export type YearMonth = `${number}-${number}`;

export interface Period {
  start: YearMonth;
  /** Tek aylık işlerde `start` ile aynıdır. */
  end: YearMonth;
}

export type ProjectKind =
  | "client"
  | "personal"
  | "thesis"
  | "school"
  | "hackathon";

/**
 * Bağlantının türü düğme etiketini belirler. Etiket ile hedefin uyuşması
 * `validation.ts` içindeki kurallarla denetlenir (ör. "Kaynak Kod" yalnızca
 * GitHub'a gidebilir).
 */
export type ProjectLinkKind = "website" | "googlePlay" | "source" | "linkedin";

export interface ProjectLink {
  kind: ProjectLinkKind;
  url: string;
}

export interface Project {
  /** Adreslerde kullanılan kısa kimlik (`?project=walktalk`). */
  id: string;
  /** Görsellerin okunduğu Firestore `projects` belgesinin kimliği. */
  firestoreId?: string;
  kind: ProjectKind;
  period: Period;
  title: Localized;
  /** Başlığın altındaki tek satırlık açıklama. */
  tagline: Localized;
  status: Localized;
  summary: Localized;
  story: Localized<string[]>;
  highlights: Localized<string[]>;
  tags: string[];
  links: ProjectLink[];
}

export interface ExperienceEntry {
  id: string;
  /** Şirket adı; freelance gibi kurumsuz deneyimlerde boş bırakılır. */
  organization?: string;
  role: Localized;
  period: Period;
  context: Localized;
  bullets: Localized<string[]>;
  /** Bu deneyim altında yürütülen projelerin `Project.id` değerleri. */
  projectIds: string[];
}

export type CvVariant = "mobile" | "fullstack" | "ime";

export interface CvDocument {
  variant: CvVariant;
  label: Localized;
  href: `/cv/${string}.pdf`;
  /** Menüde ilk sırada gösterilen, ana düğmenin indirdiği CV. */
  isDefault: boolean;
}

export interface SkillGroup {
  id: string;
  title: Localized;
  items: string[];
}

export interface Principle {
  id: string;
  title: Localized;
  description: Localized;
}

export interface EducationEntry {
  id: string;
  years: string;
  title: Localized;
  place: string;
  description: Localized;
}

export type SocialId = "github" | "linkedin" | "instagram" | "email";

export interface SocialLink {
  id: SocialId;
  label: Localized;
  href: string;
  handle: string;
}
