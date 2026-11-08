import type { Project } from "./types";

// Projeler sitede bu dizideki sırayla gösterilir. Metinler yalnızca CV'deki
// doğrulanmış bilgilere dayanır; ölçülmemiş ya da mutlak iddia eklenmez.
export const projects: Project[] = [
  {
    id: "walktalk",
    firestoreId: "01F3ZvY8UrV0AtSodXGy",
    kind: "client",
    period: { start: "2026-04", end: "2026-07" },
    title: { tr: "WalkTalk", en: "WalkTalk" },
    tagline: {
      tr: "Gerçek zamanlı sesli çeviri",
      en: "Real-time voice translation",
    },
    status: {
      tr: "Android: Google Play'de yayında (1.000+ indirme, 5,0 puan) · iOS: yayına hazır",
      en: "Android: live on Google Play (1,000+ downloads, 5.0 rating) · iOS: ready for release",
    },
    summary: {
      tr: "Müşteri Samet Yanan için geliştirilen, farklı dilleri konuşan kişilerin sesli aramada birbirini altyazıyla anlamasını sağlayan uygulama. Android sürümü Kotlin, iOS sürümü Swift ile yazıldı.",
      en: "An app built for the client Samet Yanan that lets people who speak different languages follow each other through subtitles during voice calls. The Android version is written in Kotlin, the iOS version in Swift.",
    },
    story: {
      tr: [
        "Arama sırasında Agora RTC ses akışı Azure Speech'e aktarılır. Tanınan metin bir Cloud Function üzerinden DeepL'e gönderilir ve çeviri karşı tarafa altyazı olarak iletilir.",
        "Gelen aramalar yüksek öncelikli FCM mesajı ve full-screen intent'li Foreground Service ile gösterilir. DeepL çağrıları ve Agora token üretimi sunucuda yapılır; istemcide gizli anahtar tutulmaz.",
        "WalkTalk, MOOK ile aynı Firebase projesini kullanır. MOOK'ta eşleşen kullanıcılar deep link ve SSO ile WalkTalk'a geçer.",
      ],
      en: [
        "During a call, the Agora RTC audio stream is forwarded to Azure Speech. The recognised text is sent to DeepL through a Cloud Function, and the translation reaches the other person as subtitles.",
        "Incoming calls are shown with high-priority FCM messages and a Foreground Service with a full-screen intent. DeepL calls and Agora token generation run on the server, so no secret keys are kept in the client.",
        "WalkTalk shares a Firebase project with MOOK. Users who match in MOOK move to WalkTalk through a deep link and SSO.",
      ],
    },
    highlights: {
      tr: [
        "Agora RTC → Azure Speech → Cloud Function → DeepL çeviri ve altyazı hattı",
        "Yüksek öncelikli FCM ve full-screen intent'li Foreground Service ile gelen arama akışı",
        "DeepL ve Agora token üretimi sunucuda; istemcide gizli anahtar yok",
        "MOOK ile ortak Firebase projesi ve deep link/SSO geçişi",
      ],
      en: [
        "Agora RTC → Azure Speech → Cloud Function → DeepL translation and subtitle pipeline",
        "Incoming call flow with high-priority FCM and a Foreground Service using a full-screen intent",
        "DeepL and Agora token generation on the server; no secret keys in the client",
        "Shared Firebase project with MOOK and deep link/SSO hand-off",
      ],
    },
    tags: [
      "Kotlin",
      "Swift",
      "Agora RTC",
      "Azure Speech",
      "DeepL",
      "Cloud Functions",
      "FCM",
      "Foreground Service",
    ],
    links: [
      { kind: "website", url: "https://walktalkk.com" },
      {
        kind: "googlePlay",
        url: "https://play.google.com/store/apps/details?id=com.istaps.walktalk2",
      },
    ],
  },
  {
    id: "mook",
    firestoreId: "AUAA3FDsigzkLXAyFaNY",
    kind: "client",
    period: { start: "2026-07", end: "2026-10" },
    title: { tr: "MOOK", en: "MOOK" },
    tagline: {
      tr: "Dil değişimi uygulaması · tek geliştirici",
      en: "Language exchange app · sole developer",
    },
    status: {
      tr: "Google Play'de yayında · iOS: yayına hazır",
      en: "Live on Google Play · iOS: ready for release",
    },
    summary: {
      tr: "Müşteri Samet Yanan için tek geliştirici olarak yazılan uygulama. Android ve iOS sürümleri Kotlin Multiplatform ve Compose Multiplatform ile tek kod tabanından çıkıyor; UI dahil kodun ~%87'si ortak.",
      en: "An app written as the sole developer for the client Samet Yanan. The Android and iOS versions come from a single Kotlin Multiplatform and Compose Multiplatform codebase; ~87% of the code, UI included, is shared.",
    },
    story: {
      tr: [
        "Uygulama Kotlin Multiplatform ve Compose Multiplatform ile yazıldı, bağımlılıklar Koin ile yönetiliyor. Ağırlıkla birim testlerinden oluşan 386 otomatik test var.",
        "Reklam sıklığı ve zorunlu güncelleme Firebase Remote Config'e bağlı; bu ayarlar mağazaya yeni sürüm göndermeden değiştirilebiliyor. Sunucu tarafı 30'dan fazla TypeScript Cloud Function'dan oluşuyor.",
        "Uygulama 39 dilde kullanılabiliyor ve WalkTalk ile aynı Firebase projesini paylaşıyor.",
      ],
      en: [
        "The app is written with Kotlin Multiplatform and Compose Multiplatform, with dependencies managed by Koin. It has 386 automated tests, mostly unit tests.",
        "Ad frequency and forced updates are driven by Firebase Remote Config, so they can be changed without shipping a new store release. The backend consists of more than 30 TypeScript Cloud Functions.",
        "The app is available in 39 languages and shares a Firebase project with WalkTalk.",
      ],
    },
    highlights: {
      tr: [
        "KMP + Compose Multiplatform; UI dahil kodun ~%87'si ortak",
        "386 otomatik test (ağırlıkla birim)",
        "Remote Config ile mağaza sürümü gerektirmeden reklam sıklığı ve zorunlu güncelleme",
        "30'dan fazla TypeScript Cloud Function",
        "39 dil",
      ],
      en: [
        "KMP + Compose Multiplatform; ~87% shared code, UI included",
        "386 automated tests (mostly unit tests)",
        "Ad frequency and forced updates via Remote Config, without a store release",
        "More than 30 TypeScript Cloud Functions",
        "39 languages",
      ],
    },
    tags: [
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "Koin",
      "Firebase Remote Config",
      "Cloud Functions (TypeScript)",
    ],
    links: [{ kind: "website", url: "https://mookswipe.com" }],
  },
  {
    id: "delivery-tracking",
    firestoreId: "hWTlzHf7vtA3LbJhZPlf",
    kind: "client",
    period: { start: "2026-03", end: "2026-05" },
    title: {
      tr: "Delivery Tracking & Ops Console",
      en: "Delivery Tracking & Ops Console",
    },
    tagline: {
      tr: "Kurye operasyonu için saha uygulaması ve yönetim paneli",
      en: "Field app and operations console for courier operations",
    },
    status: {
      tr: "Müşteri işi · uygulama ve panel tek başına geliştirildi",
      en: "Client project · app and console built solo",
    },
    summary: {
      tr: "Bir müşterinin kurye operasyonu için tek başına geliştirilen Android kurye uygulaması ve Next.js/TypeScript yönetim paneli.",
      en: "An Android courier app and a Next.js/TypeScript operations console, built solo for a client's courier operation.",
    },
    story: {
      tr: [
        "Kurye uygulaması Jetpack Compose ve XML Views ile yazıldı. İşlemler WorkManager kuyruğuna alınan offline-first bir yapıda tutuluyor; konum takibi arka planda sürüyor.",
        "Next.js/TypeScript panelinde Mapbox ile canlı harita, sürücü ve rota yönetimi, teslimat kanıtı ve Twilio ile gönderilen bildirimler bulunuyor.",
      ],
      en: [
        "The courier app is built with Jetpack Compose and XML Views. Actions are kept in an offline-first structure queued with WorkManager, and location tracking runs in the background.",
        "The Next.js/TypeScript console provides a live Mapbox map, driver and route management, proof of delivery and notifications sent through Twilio.",
      ],
    },
    highlights: {
      tr: [
        "WorkManager kuyruklu offline-first kurye uygulaması",
        "Arka plan konum takibi",
        "Mapbox canlı harita, sürücü/rota yönetimi ve teslimat kanıtı",
        "Twilio bildirimleri",
      ],
      en: [
        "Offline-first courier app with a WorkManager queue",
        "Background location tracking",
        "Live Mapbox map, driver/route management and proof of delivery",
        "Twilio notifications",
      ],
    },
    tags: [
      "Kotlin",
      "Jetpack Compose",
      "XML Views",
      "WorkManager",
      "Next.js",
      "TypeScript",
      "Mapbox",
      "Twilio",
    ],
    links: [],
  },
  {
    id: "timofy",
    firestoreId: "vWvfBFdVKLpsUCi5W3lF",
    kind: "personal",
    period: { start: "2024-12", end: "2026-09" },
    title: { tr: "Timofy", en: "Timofy" },
    tagline: {
      tr: "Harita tabanlı anı uygulaması (eski adı Memories Book)",
      en: "Map-based memories app (formerly Memories Book)",
    },
    status: {
      tr: "Eylül 2026'dan beri Google Play kapalı testte",
      en: "In closed testing on Google Play since September 2026",
    },
    summary: {
      tr: "Kişisel ürün olarak geliştirdiğim harita tabanlı anı uygulaması. Çevrimdışı senkronizasyon, açılış süresi ve medya maliyeti üzerine çalıştım.",
      en: "A map-based memories app I build as a personal product. My work focused on offline sync, start-up time and media cost.",
    },
    story: {
      tr: [
        "Çevrimdışı yapılan kayıtlar Room + WorkManager tabanlı bir Outbox ile tutuluyor ve bağlantı gelince sunucuyla eşitleniyor. Baseline Profile entegrasyonu soğuk açılışı %43 kısalttı.",
        "Fotoğraflar yüklenmeden önce WebP'ye sıkıştırılıyor: 20–30 görsellik testte boyut ~%75 küçüldü, kalite PSNR ≥40 dB eşiğiyle doğrulandı. EXIF-GPS verisi yüklemeden önce temizleniyor.",
        "Egress ücretini ortadan kaldırmak için medya Cloudflare R2'ye (Workers) taşındı. Haritada MapLibre ile özel pin kümeleme kullanılıyor.",
      ],
      en: [
        "Entries made offline are kept in a Room + WorkManager based Outbox and synced with the server once a connection is available. Integrating a Baseline Profile cut cold start time by 43%.",
        "Photos are compressed to WebP before upload: in a test with 20–30 images, size dropped by ~75%, with quality verified against a PSNR ≥40 dB threshold. EXIF-GPS data is stripped before upload.",
        "Media was moved to Cloudflare R2 (Workers) to remove egress fees. The map uses custom pin clustering built with MapLibre.",
      ],
    },
    highlights: {
      tr: [
        "Room + WorkManager tabanlı Outbox ile çevrimdışı senkronizasyon",
        "Baseline Profile ile soğuk açılış %43 kısaldı",
        "WebP sıkıştırma hattı: 20–30 görsellik testte ~%75 küçülme, PSNR ≥40 dB",
        "Yüklemeden önce EXIF-GPS temizleme",
        "Egress ücretini ortadan kaldırmak için medya Cloudflare R2'de (Workers)",
        "MapLibre ile özel pin kümeleme",
      ],
      en: [
        "Offline sync with a Room + WorkManager based Outbox",
        "Cold start cut by 43% with a Baseline Profile",
        "WebP compression pipeline: ~75% smaller in a 20–30 image test, PSNR ≥40 dB",
        "EXIF-GPS stripped before upload",
        "Media on Cloudflare R2 (Workers) to remove egress fees",
        "Custom pin clustering with MapLibre",
      ],
    },
    tags: [
      "Kotlin",
      "Jetpack Compose",
      "Room",
      "WorkManager",
      "MapLibre",
      "Cloudflare R2",
      "Cloudflare Workers",
      "Baseline Profiles",
    ],
    links: [
      { kind: "website", url: "https://timofy.site" },
      {
        kind: "linkedin",
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7369273897449472002/",
      },
    ],
  },
  {
    id: "smartexam",
    firestoreId: "CnuDyBf6CMNsaxC7vH2U",
    kind: "thesis",
    period: { start: "2025-09", end: "2026-04" },
    title: { tr: "SmartExam", en: "SmartExam" },
    tagline: {
      tr: "Sınav analitiği · bitirme tezi (Profesyonel Yazılım Geliştirme dersi) · 2 kişilik ekip",
      en: "Exam analytics · graduation thesis (Professional Software Development course) · team of 2",
    },
    status: {
      tr: "Geliştirme aşamasında (canlı kullanım yok) · tez yazımı sürüyor",
      en: "In development (no live usage) · thesis writing in progress",
    },
    summary: {
      tr: "2 kişilik ekiple geliştirilen sınav analitiği sistemi: Android öğrenci uygulaması, Next.js kurum ve yayınevi panelleri ve ortak Cloud Functions arka ucu.",
      en: "An exam analytics system built by a team of two: an Android student app, Next.js institution and publisher dashboards, and a shared Cloud Functions backend.",
    },
    story: {
      tr: [
        "Sistem; Android öğrenci uygulaması (Compose, Hilt, MVVM), Next.js kurum ve yayınevi panelleri ve ortak Cloud Functions arka ucundan oluşuyor. Puanlama ve sıralama sunucuda tek transaction içinde hesaplanıyor.",
        "Kurum verisi 6 rollü RBAC ile kiracı bazında ayrılıyor. Kâğıt optik formlar Pub/Sub ve FastAPI/OpenCV ile asenkron okunuyor; bu hat klasik görüntü işlemeye dayanıyor, model kullanılmıyor.",
        "Firestore kuralları sürümlenmiş ayrı bir repoda tutuluyor ve 35 emülatör testiyle GitHub Actions üzerinde doğrulanıyor. Uygulamada Gemini tabanlı bir eğitim koçu bulunuyor.",
      ],
      en: [
        "The system consists of an Android student app (Compose, Hilt, MVVM), Next.js institution and publisher dashboards, and a shared Cloud Functions backend. Scoring and ranking are computed on the server in a single transaction.",
        "Institution data is isolated per tenant with 6-role RBAC. Paper optical forms are read asynchronously with Pub/Sub and FastAPI/OpenCV; this pipeline relies on classical image processing, with no model involved.",
        "Firestore rules live in a separate versioned repository and are verified with 35 emulator tests on GitHub Actions. The app includes a Gemini-based study coach.",
      ],
    },
    highlights: {
      tr: [
        "Puanlama ve sıralama sunucuda tek transaction'da",
        "6 rollü RBAC ile kiracı bazında veri izolasyonu",
        "Pub/Sub + FastAPI/OpenCV ile asenkron optik form okuma (klasik görüntü işleme, model yok)",
        "Sürümlenmiş Firestore kuralları: 35 emülatör testi ve GitHub Actions",
        "Gemini tabanlı eğitim koçu",
      ],
      en: [
        "Scoring and ranking on the server in a single transaction",
        "Per-tenant data isolation with 6-role RBAC",
        "Asynchronous optical form reading with Pub/Sub + FastAPI/OpenCV (classical image processing, no model)",
        "Versioned Firestore rules: 35 emulator tests and GitHub Actions",
        "Gemini-based study coach",
      ],
    },
    tags: [
      "Kotlin",
      "Jetpack Compose",
      "Hilt",
      "Next.js",
      "Cloud Functions",
      "Pub/Sub",
      "FastAPI",
      "OpenCV",
      "Gemini API",
      "GitHub Actions",
    ],
    links: [],
  },
  {
    id: "latteproje",
    firestoreId: "vkxqvIDSvZygNgl1iDvz",
    kind: "hackathon",
    period: { start: "2025-05", end: "2025-05" },
    title: { tr: "LatteProje", en: "LatteProje" },
    tagline: {
      tr: "Yapay zekâ destekli kalite kontrol uygulaması",
      en: "AI-assisted quality control app",
    },
    status: {
      tr: "Hackathon'da geliştirildi · kaynak kod GitHub'da",
      en: "Built at a hackathon · source code on GitHub",
    },
    summary: {
      tr: "Üretim bandındaki ürünlerin hatalı ya da sağlam olduğunu yalnızca bir mobil cihaz kamerasıyla ayırt etmeyi amaçlayan Android kalite kontrol uygulaması.",
      en: "An Android quality control app that aims to tell defective products on a production line from sound ones using only a mobile device camera.",
    },
    story: {
      tr: [
        "Görüntü sınıflandırma TensorFlow Lite ile cihaz üzerinde yapılıyor. Kullanıcı girişi Firebase Authentication ile sağlanıyor; analiz sonuçları SQLite'ta tutulduğu için geriye dönük raporlanabiliyor.",
        "Kamera görüntüsünün dönüş açısı algılanıp otomatik olarak düzeltiliyor.",
      ],
      en: [
        "Image classification runs on the device with TensorFlow Lite. Sign-in uses Firebase Authentication, and analysis results are stored in SQLite so they can be reported on later.",
        "The rotation of the camera image is detected and corrected automatically.",
      ],
    },
    highlights: {
      tr: [
        "TensorFlow Lite ile cihaz üzerinde görüntü sınıflandırma",
        "CameraX ile görüntü alma ve dönüş düzeltme",
        "Firebase Authentication ile giriş",
        "SQLite üzerinde geriye dönük raporlama",
      ],
      en: [
        "On-device image classification with TensorFlow Lite",
        "Image capture with CameraX and rotation correction",
        "Sign-in with Firebase Authentication",
        "Historical reporting on SQLite",
      ],
    },
    tags: [
      "Kotlin",
      "TensorFlow Lite",
      "CameraX",
      "XML Views",
      "ViewBinding",
      "Jetpack Compose",
      "SQLite",
      "Room",
      "Firebase Authentication",
    ],
    links: [
      { kind: "source", url: "https://github.com/mahmutconger/LatteProject" },
      {
        kind: "linkedin",
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7331975710070169600/",
      },
    ],
  },
  {
    id: "penlingu",
    firestoreId: "wILv3v6YYViVtFryF7kn",
    kind: "school",
    period: { start: "2025-04", end: "2025-06" },
    title: { tr: "Penlingu", en: "Penlingu" },
    tagline: {
      tr: "İngilizce kelime öğrenme uygulaması · 4 kişilik ekip",
      en: "English vocabulary app · team of 4",
    },
    status: {
      tr: "Okul projesi · kaynak kod GitHub'da",
      en: "School project · source code on GitHub",
    },
    summary: {
      tr: "4 kişilik ekiple geliştirilen İngilizce kelime öğrenme uygulaması. Depo sahibi olarak ekip üyelerinden gelen 20 PR'ı inceleyip birleştirdim.",
      en: "An English vocabulary app built by a team of four. As the repository owner, I reviewed and merged 20 pull requests from team members.",
    },
    story: {
      tr: [
        "Kelimeler 6 aşamada, 1 ile 180 gün arasında uzayan aralıklarla tekrar ediliyor (aralıklı tekrar).",
        "Seçilen kelimelerle OpenRouter (Mistral 7B) üzerinden hikâye üretiliyor.",
      ],
      en: [
        "Words move through 6 stages with review intervals growing from 1 to 180 days (spaced repetition).",
        "Stories are generated from selected words through OpenRouter (Mistral 7B).",
      ],
    },
    highlights: {
      tr: [
        "Depo sahibi: ekip üyelerinden gelen 20 PR'ı inceleyip birleştirdim",
        "6 aşamalı, 1–180 günlük aralıklı tekrar algoritması",
        "OpenRouter (Mistral 7B) ile hikâye üretimi",
      ],
      en: [
        "Repository owner: reviewed and merged 20 pull requests from team members",
        "6-stage spaced repetition with 1–180 day intervals",
        "Story generation with OpenRouter (Mistral 7B)",
      ],
    },
    tags: ["Kotlin", "XML Views", "Firebase", "OpenRouter (Mistral 7B)"],
    links: [
      { kind: "source", url: "https://github.com/mahmutconger/EnglishWordApp" },
      {
        kind: "linkedin",
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7342925617782267904/",
      },
    ],
  },
];

export const findProject = (id: string): Project | undefined =>
  projects.find((project) => project.id === id);
