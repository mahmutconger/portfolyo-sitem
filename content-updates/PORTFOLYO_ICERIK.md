# Portfolyo içerik güncellemesi (CV uyumu)

## 0. İnceleme: içerik nereden geliyor? (değişiklikten önce, 8 Kasım 2026)

| İçerik | Kaynak | Not |
| --- | --- | --- |
| Hero (isim, "Yazılım Mühendisi", odak satırı, CV butonu) | Kodda sabit: `src/components/portfolio/HomeCard.tsx` + `src/i18n.ts` | Rol metni bileşen içinde `tr ? … : …` ile yazılmış. |
| `<title>`, meta description, og/twitter etiketleri | `index.html` (sabit) + `src/pages/Home.tsx` (`document.title` sabit "Software Engineer") | og:image Firebase Storage'daki `web.jpg` dosyasını gösteriyor (aşağıdaki Storage sorununa bakın). |
| Hakkımda, eğitim, "Çalışma Prensibim" kartları, sertifika etiketleri | Kodda sabit: `src/components/portfolio/ProfileCards.tsx` + `src/i18n.ts` | "Atomic Commit / v1.0" metni `about.git_desc` anahtarında. Sertifika etiketleri bileşen içinde dizi olarak yazılmış. |
| Yetenekler ızgarası | Kodda sabit: `src/components/portfolio/technologies.ts` | Aynı dizi ana sayfadaki portre logolarında da kullanılıyor. |
| Projeler | **Firestore `projects` koleksiyonu** (7 belge), `ProjectsCard.tsx` içinde doğrudan `getDocs` ile okunuyor | Alanlar: `title`, `description`, `longDescription`, `features` (TR/EN harita ya da eski belgelerde düz metin), `tags`, `image`, `gallery`, `githubUrl`, `liveUrl`, `linkedinUrl`, `isFeatured`, `createdAt`. Yazma yalnızca `/admin` panelinden (`src/pages/Admin.tsx`). Repoda seed ya da yönetici betiği **yok**. |
| Proje görselleri | **Firebase Storage** `images/…` (yönetici panelinden yüklenen, token'lı indirme URL'leri) | Ayrıntı aşağıda. |
| Makaleler | Medium RSS → `api.rss2json.com` (`ArticlesCard.tsx`) | Firebase değil. |
| İletişim kanalları, CV kutusu | Kodda sabit: `src/sections/Contact.tsx` | LinkedIn eski adresle (`…-4305b1299`) yazılmış. Form Firestore `messages` koleksiyonuna yazıyor. |
| Sosyal bağlantılar (hero) | Kodda sabit: `src/components/portfolio/shared.tsx` | LinkedIn eski adresle yazılmış. |
| CV dosyaları | `public/Mahmut_Can_CONGER_CV.pdf`, `public/CV_TR.pdf` (aynı dosya, eski CV) | `CV_TR.pdf` hiçbir yerden bağlanmıyor ama yayında. |
| Analitik | Firestore `analytics_events` koleksiyonu (`useAnalytics.ts`) | Yalnızca `import.meta.env.DEV` iken kapalı. **Üretim derlemesi yerelde `vite preview` ile açılırsa canlı Firestore'a olay yazar.** Testler ve Lighthouse bu yüzden yazma engelli çalıştırıldı. |
| Kullanılmayan eski dosyalar | `src/sections/{Hero,About,TechStack,Projects,Footer,Articles}.tsx`, `src/components/Navbar.tsx`, `src/pages/AllProjects.tsx`, `src/locales/{tr,en}.json` | Hiçbir yerden içe aktarılmıyor; eski LinkedIn adresi ve eski CV bağlantısı bunlarda da geçiyor. |

### Firestore'daki 7 proje belgesi

| Belge kimliği | Mevcut başlık | Sorunlar |
| --- | --- | --- |
| `01F3ZvY8UrV0AtSodXGy` | WalkTalk: Gerçek Zamanlı Çeviri Destekli… | EN alanları boş. "saniye altı gecikme (sub-second latency)", "milisaniyeler içinde", "WhatsApp veya Telegram standartlarında", "kusursuz" geçiyor. `githubUrl` alanında Google Play adresi var, bu yüzden "Kaynak Kod" butonu Google Play'e gidiyor. Kapak görseli `images/…_FREELANCE1.jpg`. |
| `AUAA3FDsigzkLXAyFaNY` | Mook: Kotlin Multiplatform Tabanlı… | EN boş. "üretim seviyesi (production-ready)". `githubUrl` yalnızca GitHub profilini gösteriyor (kaynak kod değil). |
| `hWTlzHf7vtA3LbJhZPlf` | Delivery Tracking Suite… | EN boş. "tamamen dijitalleştiren", "kurumsal seviye", "üretim seviyesi (production-ready)". Panelde Leaflet yazıyor (CV'de Mapbox). Kaynak kod bağlantısı herkese açık repoya gidiyor (müşteri işi). |
| `vWvfBFdVKLpsUCi5W3lF` | Memories Book… | Eski ad. TR/EN haritası yok (düz metin), EN modunda Türkçe görünüyor. "%80'e varan" ölçülmemiş oran. `githubUrl` (MemoriesBookKotlin) 404 veriyor. |
| `CnuDyBf6CMNsaxC7vH2U` | SmartExam… | EN boş. "üretim seviyesi", "milyonlarca deneme verisi". `githubUrl` yalnızca profil. |
| `vkxqvIDSvZygNgl1iDvz` | LatteProje: AI Destekli Kalite Kontrol Sistemi | EN alanları Türkçe metnin kopyası. "gerçek zamanlı", "yüksek performans sağlar", "ölçeklenebilir bir çözüm". |
| `wILv3v6YYViVtFryF7kn` | İngilizce Kelime Öğrenme Uygulaması (Penlingu) | Ad yok. Düz metin. "Kalıcı Öğrenme Garantisi", "%100 uygun görseller", GPT-4 (CV'de OpenRouter / Mistral 7B). |

### Bozuk görseller: asıl neden

WalkTalk kapağı tek bozuk görsel değil. Storage'daki **bütün** görsel adresleri (7 projedeki 32 görselin hepsi ve og:image `web.jpg`) şu hatayı veriyor:

```
HTTP 402 — "The billing account for the owning project is disabled in state closed"
```

Yani token ya da dosya sorunu yok: `my-dev-portfolio-8033b` projesinin faturalandırma hesabı kapalı. `*.firebasestorage.app` kovaları Blaze planı gerektiriyor. Firestore okumaları şu an çalışıyor. Kodla düzeltilemez. Görseller ancak faturalandırma yeniden açılınca ya da görseller başka bir yere taşınınca geri gelir. Kod tarafında yapılan: her proje görseline ortak bir yedek görsel (`onError`) eklendi; og:image siteyle birlikte sunulan bir dosyaya taşındı.

### Barındırma

Site **Vercel**'de yayında (`server: Vercel` başlığı, repoda `vercel.json` var, `firebase.json` yok). Firebase yalnızca Firestore, Auth ve Storage için kullanılıyor. Bu yüzden eski CV yönlendirmesi `vercel.json` içine yazıldı. Yayına alma `firebase deploy` ile değil, Vercel üzerinden oluyor (büyük olasılıkla `main` dalına push ile).

### Bu bulgulara göre seçilen yaklaşım

- Proje metinleri (TR + EN), türü, tarihi, durumu ve bağlantıları artık kodda tipli içerik modelinde (`src/content/`) duruyor. Firestore'daki EN alanları boş, kapsamlı düzeltme gerekiyor ve canlı veriye yazmak yasak; bu içeriği tek doğru kaynak olarak kodda tutmak hem test edilebilir hem de deploy ile hemen yayına çıkar.
- Firestore `projects` koleksiyonu yalnızca **görseller** (`image`, `gallery`) için okunuyor; eşleştirme belge kimliğiyle yapılıyor. Yönetici panelinden yüklenen görseller böylece çalışmaya devam ediyor. Firestore okunamazsa site metinlerle ve yedek görselle açılıyor.
- Yönetici panelinin proje kayıtları ile site metni birbirinden kopmasın diye, her belge için yapıştırmaya hazır yeni TR/EN metinler aşağıda (bölüm 2) duruyor. Repoda seed/yönetici betiği olmadığı için betik yazılmadı.
