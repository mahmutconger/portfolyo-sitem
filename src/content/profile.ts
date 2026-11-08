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
    tr: "Kotlin, Jetpack Compose ve Kotlin Multiplatform ile Android ve iOS uygulamaları geliştiriyorum. Offline-first veri katmanları, gerçek zamanlı ses akışları ve test edilebilir mimari üzerine çalışıyorum.",
    en: "I build Android and iOS apps with Kotlin, Jetpack Compose and Kotlin Multiplatform. I work on offline-first data layers, real-time audio pipelines and testable architecture.",
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
