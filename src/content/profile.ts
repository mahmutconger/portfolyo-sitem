import type { Localized, SocialLink } from "./types";

// Kimlik bilgileri: hero, sayfa başlığı ve meta etiketleri buradan beslenir.
export const profile = {
  name: "Mahmut Can Çönger",
  location: "Manisa, Türkiye",
  email: "mahmutconger@gmail.com",
  role: {
    tr: "Yazılım Mühendisliği Öğrencisi",
    en: "Software Engineering Student",
  },
  focus: ["Kotlin", "Jetpack Compose", "Kotlin Multiplatform"],
  availability: {
    tr: "Şubat–Haziran 2027 uzun dönem İME'ye uygun · Mezuniyet: Haziran 2027",
    en: "Available for a long-term internship (Feb–Jun 2027) · Graduating June 2027",
  },
  heroDescription: {
    tr: "Mobil uygulama geliştirmeye odaklanan Yazılım Mühendisliği öğrencisi. Kotlin, Compose ve KMP ile Android ve iOS uygulamaları, Firebase ve Cloud Functions ile arka uçlarını geliştirdi.",
    en: "Software Engineering student focused on mobile development. Built Android and iOS apps with Kotlin, Compose and KMP, and their back ends with Firebase and Cloud Functions.",
  },
  metaDescription: {
    tr: "Kotlin, Jetpack Compose ve Kotlin Multiplatform ile Android ve iOS uygulamaları geliştiren Yazılım Mühendisliği öğrencisi.",
    en: "Software Engineering student building Android and iOS apps with Kotlin, Jetpack Compose and Kotlin Multiplatform.",
  },
} as const satisfies {
  name: string;
  location: string;
  email: string;
  role: Localized;
  focus: readonly string[];
  availability: Localized;
  heroDescription: Localized;
  metaDescription: Localized;
};

export const pageTitle: Localized = {
  tr: `${profile.name} | ${profile.role.tr}`,
  en: `${profile.name} | ${profile.role.en}`,
};

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: { tr: "GitHub", en: "GitHub" },
    href: "https://github.com/mahmutconger",
    handle: "@mahmutconger",
  },
  {
    id: "linkedin",
    label: { tr: "LinkedIn", en: "LinkedIn" },
    href: "https://www.linkedin.com/in/mahmut-can-conger/",
    handle: profile.name,
  },
  {
    id: "instagram",
    label: { tr: "Instagram", en: "Instagram" },
    href: "https://www.instagram.com/canconger58/",
    handle: "@canconger58",
  },
  {
    id: "email",
    label: { tr: "E-posta", en: "Email" },
    href: `mailto:${profile.email}`,
    handle: profile.email,
  },
];

export const socialLink = (id: SocialLink["id"]): SocialLink => {
  const link = socialLinks.find((item) => item.id === id);
  if (!link) throw new Error(`Sosyal bağlantı bulunamadı: ${id}`);
  return link;
};
