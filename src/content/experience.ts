import type { ExperienceEntry } from "./types";

// Deneyim bölümü. Metinler CV'lerle birebir aynı olmalıdır.
export const experience: ExperienceEntry[] = [
  {
    id: "znosoft",
    organization: "ZNOSOFT",
    role: { tr: "Stajyer Android Geliştirici", en: "Android Developer Intern" },
    period: { start: "2026-06", end: "2026-08" },
    context: {
      tr: "1 mentor ve 3 stajyerden oluşan ekip",
      en: "Team of 1 mentor and 3 interns",
    },
    bullets: {
      tr: [
        "Akustik altın doğrulama uygulaması \"Altınım Sahte mi?\" için 192/96/48 kHz PCM işleyip darbe algılayan, Android bağımsız core-audio modülünü JVM testleriyle geliştirdi.",
        "Dört altın sınıfı için etiketli ses verisi toplayan offline-first saha uygulamasını tasarladı (Room, WorkManager).",
        "Bu verilerle sınıflandırma modelini eğitti ve cihazda çalışacak şekilde uygulamaya gömdü.",
      ],
      en: [
        "Built an Android-independent core-audio module, covered by JVM tests, that processes 192/96/48 kHz PCM and detects impulses for the acoustic gold verification app \"Altınım Sahte mi?\".",
        "Designed an offline-first field app that collects labelled audio data for four gold classes (Room, WorkManager).",
        "Trained a classification model on this data and embedded it in the app to run on-device.",
      ],
    },
    projectIds: [],
  },
  {
    id: "freelance",
    role: { tr: "Freelance Mobil Geliştirici", en: "Freelance Mobile Developer" },
    period: { start: "2026-03", end: "2026-11" },
    context: {
      tr: "Müşteri projeleri, uzaktan",
      en: "Client projects, remote",
    },
    bullets: { tr: [], en: [] },
    projectIds: ["walktalk", "mook"],
  },
];
