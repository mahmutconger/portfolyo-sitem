import type { Principle, SkillGroup } from "./types";

// Yetenekler ızgarası: CV'deki teknik beceriler satırıyla aynı gruplar.
export const skillGroups: SkillGroup[] = [
  {
    id: "android",
    title: { tr: "Android", en: "Android" },
    items: [
      "Kotlin",
      "Jetpack Compose",
      "XML Views",
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "Coroutines/Flow",
      "Room",
      "WorkManager",
      "Hilt",
      "Koin",
    ],
  },
  {
    id: "ios",
    title: { tr: "iOS", en: "iOS" },
    items: ["Swift"],
  },
  {
    id: "backend",
    title: { tr: "Ağ & Backend", en: "Networking & Backend" },
    items: [
      "Retrofit",
      "Ktor",
      "Firebase (Firestore, Cloud Functions, FCM, Remote Config)",
      "TypeScript",
      "Cloudflare R2",
      "Next.js",
    ],
  },
  {
    id: "testing",
    title: { tr: "Test & Performans", en: "Testing & Performance" },
    items: [
      "JUnit",
      "MockK",
      "Compose UI Test",
      "Macrobenchmark",
      "Baseline Profiles",
      "GitHub Actions",
    ],
  },
  {
    id: "tools",
    title: { tr: "Araçlar", en: "Tools" },
    items: ["Git", "Google Play Console"],
  },
];

// "Kodun arkasındaki yaklaşım" bloğu.
export const approach: Principle[] = [
  {
    id: "clean",
    title: {
      tr: "Clean Architecture / MVVM",
      en: "Clean Architecture / MVVM",
    },
    description: {
      tr: "Katmanları ayrılmış, test edilebilir kod yapısı",
      en: "Layered, testable code structure",
    },
  },
  {
    id: "compose",
    title: { tr: "Jetpack Compose", en: "Jetpack Compose" },
    description: {
      tr: "Bildirimsel arayüz geliştirme",
      en: "Declarative UI development",
    },
  },
  {
    id: "async",
    title: { tr: "Coroutines & Flow", en: "Coroutines & Flow" },
    description: {
      tr: "Asenkron işler ve reaktif veri akışları",
      en: "Asynchronous work and reactive data streams",
    },
  },
  {
    id: "offline",
    title: { tr: "Offline-first", en: "Offline-first" },
    description: {
      tr: "Room ve WorkManager ile bağlantı yokken de çalışan veri katmanı",
      en: "Data layer that keeps working offline with Room and WorkManager",
    },
  },
];
