import type { EducationEntry, Localized, Principle } from "./types";

export const aboutBio: Localized = {
  tr: "Merhaba, ben Mahmut Can Çönger. Manisa'da yaşayan, Manisa Celal Bayar Üniversitesi Yazılım Mühendisliği öğrencisiyim; Haziran 2027'de mezun olacağım. Lise eğitimimden bu yana veri tabanı ve yazılım üzerine odaklanmış bir geçmişe sahibim. Clean Architecture prensiplerine uygun sistemler kurmayı hedefliyorum.",
  en: "Hello, I'm Mahmut Can Çönger. I'm a Software Engineering student at Manisa Celal Bayar University, based in Manisa, graduating in June 2027. Since high school my background has focused on databases and software. My goal is to build systems that follow Clean Architecture principles.",
};

export const education: EducationEntry[] = [
  {
    id: "university",
    years: "2023 — 2027",
    title: { tr: "Yazılım Mühendisliği", en: "Software Engineering" },
    place: "Manisa Celal Bayar Üniversitesi",
    description: {
      tr: "Yazılım yaşam döngüsü, çevik yöntemler, Java, C, MSSQL ve makine öğrenmesi üzerine mühendislik eğitimi.",
      en: "Engineering education covering the software life cycle, Agile methods, Java, C, MSSQL and machine learning.",
    },
  },
  {
    id: "high-school",
    years: "2019 — 2023",
    title: { tr: "Veri Bilimi ve Depolama", en: "Data Science & Storage" },
    place: "Sivas Bilişim Tek. Lisesi",
    description: {
      tr: "Veri tabanı (C#, MSSQL) ve masaüstü uygulama temelleri.",
      en: "Foundations in databases (C#, MSSQL) and desktop apps.",
    },
  },
];

// Hakkımda bölümündeki çalışma biçimi kartları.
export const workPrinciples: Principle[] = [
  {
    id: "team",
    title: {
      tr: "Ekip Çalışması & Adaptasyon",
      en: "Teamwork & Adaptation",
    },
    description: {
      tr: "Agile/Scrum metodolojilerine aşinayım. Takım içi şeffaflığa önem verir, yeni teknolojilere hızla adapte olurum.",
      en: "Familiar with Agile/Scrum. I value transparency in team communication and adapt quickly to new technologies.",
    },
  },
  {
    id: "passion",
    title: { tr: "Teknoloji Tutkusu", en: "Passion for Technology" },
    description: {
      tr: "Android ekosistemini yakından takip ederim (Jetpack Compose, AI, KMP). Öğrendiklerimi teknik blog yazılarıyla toplulukla paylaşırım.",
      en: "I closely follow the Android ecosystem (Jetpack Compose, AI, KMP) and share what I learn through technical blog posts.",
    },
  },
];

export const competencies: Localized<string[]> = {
  tr: [
    "Git & GitHub",
    "Jetpack Compose UI",
    "Firebase Backend",
    "Kotlin",
    "Versiyon Kontrol Sistemleri",
  ],
  en: [
    "Git & GitHub",
    "Jetpack Compose UI",
    "Firebase Backend",
    "Kotlin",
    "Version Control Systems",
  ],
};
