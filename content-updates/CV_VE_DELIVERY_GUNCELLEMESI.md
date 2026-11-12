# CV ve Delivery güncellemesi

## 0. İnceleme (değişiklikten önce, 12 Kasım 2026)

| Ne | Nerede | Not |
| --- | --- | --- |
| Deneyim → "Freelance Mobil Geliştirici" bloğu | `src/content/experience.ts` (`freelance.projectIds`) | `walktalk`, `mook`, `delivery-tracking` listeleniyordu. Bileşen (`ExperienceCard.tsx`) bu listeyi yalnızca gösteriyor. |
| Proje kartları (Delivery, Penlingu) | `src/content/projects.ts` | Tür, tarih, durum, özet, hikâye, öne çıkanlar ve bağlantılar burada; tür etiketi `src/locales/{tr,en}.json` → `projects.kind.*`. Delivery `kind: "client"` idi ve durum/özet metinlerinde "Müşteri işi", "bir müşterinin", "client's" geçiyordu. |
| Proje sırası | `src/content/projects.ts` dizisinin sırası | Site sırayı doğrudan bu diziden alıyor. |
| Firestore `projects` | Delivery: `hWTlzHf7vtA3LbJhZPlf`, Penlingu: `wILv3v6YYViVtFryF7kn` | Site bu belgelerden yalnızca görselleri (`image`, `gallery`) okuyor; metinler koddan geliyor. Yönetici panelindeki kayıtlar için yeni metinler aşağıda (2. bölüm). Repoda seed/yönetici betiği yok. |
| CV indirme menüsü | `src/content/cv.ts` + `src/components/portfolio/CvDownloadMenu.tsx` (hero ve iletişim) | Menü zaten var: Mobil (varsayılan), Full Stack, İME. |
| CV dosyaları | `public/cv/Mahmut_Can_Conger_CV_{Mobil,FullStack,IME}.pdf` | Repodakiler 8 Kasım sürümü. `~/Downloads` içinde aynı adlarla 12 Kasım tarihli yeni sürümler var; metinlerinde Delivery "Bağımsız proje" olarak geçiyor. |
| Hero kısa tanıtım paragrafı | `src/content/profile.ts` → `heroDescription` | CV profil satırının karşılığı. Hakkımda bölümündeki biyografi (`about.ts`) CV'yi yansıtmıyor, kişisel tanıtım. |
| Barındırma ayarı | **`vercel.json`** | Repoda `firebase.json` yok. Canlı sitenin yanıt başlıkları `server: Vercel`. Eski `/Mahmut_Can_CONGER_CV.pdf` şu an **307** ile mobil CV'ye yönleniyor; `/cv/**` için özel önbellek başlığı yok. |

### Barındırma hakkında karar

İstenen 301 yönlendirmesi ve `Cache-Control: no-cache` başlığı, siteyi gerçekten sunan **`vercel.json`** dosyasına yazıldı. Firebase Hosting kullanılmadığı için bir `firebase.json` dosyası canlı sitede hiçbir şeyi değiştirmez; eklenmesi yanlış bir güven duygusu yaratırdı. Yayına alma da `firebase deploy` ile değil, Vercel üzerinden oluyor. Yerel geliştirme/önizleme sunucusu (`vite/vercelRedirects.ts`) aynı kuralları `vercel.json`'dan okuyarak uyguluyor; e2e testleri bunu doğruluyor.

### Çalışma alanında dokunulmayanlar

`main` üzerinde commit'lenmemiş tasarım çalışmaların (`src/components/portfolio/ProjectsCard.tsx`, `src/portfolio.css`, `src/portfolio-1.css`, `Claude outputs/`) yeni dala olduğu gibi taşındı. Bu çalışmada hiçbirine dokunulmadı ve hiçbiri commit'lenmedi.

## 1. Yapılan değişiklikler

**Delivery Tracking & Ops Console → bağımsız proje**
- Tür `client` → `independent`; etiket TR "Bağımsız proje" / EN "Independent project" (`src/locales/*.json` → `projects.kind.independent`).
- Durum: "Tek başına geliştirildi · Android uygulaması ve Next.js paneli" / "Built solo · Android app and Next.js console".
- Özet: "Kurye operasyonları için tek başına geliştirilen offline-first Android kurye uygulaması ve Next.js/TypeScript yönetim paneli." / "An offline-first Android courier app and a Next.js/TypeScript operations console for courier operations, built solo."
- Projenin hiçbir alanında (kart, ayrıntı, meta, alt metin, aria etiketi) "müşteri / client / customer" geçmiyor. "kurumsal seviye", "tamamen dijitalleştiren", "enterprise-grade" hiçbir yerde yok; "enterprise-grade" yasaklı ifadeler listesine eklendi.
- Proje sırası: WalkTalk, MOOK, Timofy, SmartExam, Delivery Tracking, LatteProje, Penlingu.

**Deneyim → Freelance Mobil Geliştirici**
- Blokta yalnızca WalkTalk ve MOOK var; tarih "Mart – Kasım 2026" / "March – November 2026" olarak kaldı.
- İçerik modeline isteğe bağlı `client` alanı eklendi. WalkTalk ve MOOK'ta `client: "Samet Yanan"` var; Delivery'de bu alan yok. Doğrulama kuralı: müşteri işinde müşteri adı zorunlu, diğer türlerde müşteri alanı olamaz. Freelance bloğu müşteri adını bu alandan okuyup "Müşteri: Samet Yanan" / "Client: Samet Yanan" olarak gösteriyor.

**Penlingu**
- Açıklama: "… Depo sahibi olarak projenin mimari zeminini hazırladı; ekipten gelen 20 PR'ı inceleyip birleştirdi." / "… As repository owner, laid the project's architectural foundation and reviewed and merged 20 pull requests from the team." Öne çıkanlar maddesi buna uyduruldu. Okul projesi, Nisan–Haziran 2025, 4 kişilik ekip ve GitHub bağlantısı değişmedi.

**Hero tanıtım paragrafı** (CV profilinin karşılığı; `src/content/profile.ts`)
- TR: "Mobil uygulama geliştirmeye odaklanan Yazılım Mühendisliği öğrencisi. Kotlin, Compose ve KMP ile Android ve iOS uygulamaları, Firebase ve Cloud Functions ile arka uçlarını geliştirdi."
- EN: "Software Engineering student focused on mobile development. Built Android and iOS apps with Kotlin, Compose and KMP, and their back ends with Firebase and Cloud Functions."
- Ana başlık "Yazılım Mühendisliği Öğrencisi" / "Software Engineering Student" olarak kaldı. Hakkımda biyografisi CV'yi yansıtmadığı için değiştirilmedi.

**CV dosyaları ve barındırma**
- `public/cv/` altındaki üç PDF, `~/Downloads` içindeki aynı adlı 12 Kasım sürümleriyle değiştirildi (dosyalar düzenlenmedi, bayt bayt kopyalandı; metinlerinde Delivery "Bağımsız proje" olarak geçiyor).
- CV menüsü zaten vardı (hero ve iletişim: Mobil varsayılan, Full Stack, İME); değişmedi.
- `vercel.json`: `/Mahmut_Can_CONGER_CV.pdf` ve `/CV_TR.pdf` artık **301** ile mobil CV'ye yönleniyor (önce 307). `/cv/(.*)` ve `/Mahmut_Can_CONGER_CV.pdf` için `Cache-Control: no-cache` başlığı eklendi. `firebase.json` oluşturulmadı (0. bölüm).
- `vite/vercelRedirects.ts`: yerel sunucu artık `statusCode` ve `headers` kurallarını da `vercel.json`'dan okuyup uyguluyor.

## 2. Firestore'a elle girilecek metin (isteğe bağlı)

Site proje metinlerini Firestore'dan okumadığı için bu değişikliklerin yayına çıkması Firestore düzenlemesi **gerektirmiyor**. Yönetici panelindeki kayıtların siteyle aynı kalması için `/admin` → Projeler → Düzenle ekranında iki belgeyi aşağıdakilerle güncelle. `image` ve `gallery` alanlarına dokunma. Repoda seed/yönetici betiği olmadığı için güncelleme betiği yazılmadı. `PORTFOLYO_ICERIK.md` içindeki Delivery ve Penlingu metinlerinin yerine bunlar geçerli.

### Delivery Tracking & Ops Console · belge `hWTlzHf7vtA3LbJhZPlf`

**title.tr**
```text
Delivery Tracking & Ops Console
```
**title.en**
```text
Delivery Tracking & Ops Console
```
**description.tr**
```text
Kurye operasyonları için tek başına geliştirilen offline-first Android kurye uygulaması ve Next.js/TypeScript yönetim paneli.
```
**description.en**
```text
An offline-first Android courier app and a Next.js/TypeScript operations console for courier operations, built solo.
```
**longDescription.tr**
```text
Kurye operasyonu için saha uygulaması ve yönetim paneli

Tek başına geliştirildi · Android uygulaması ve Next.js paneli

Kurye uygulaması Jetpack Compose ve XML Views ile yazıldı. İşlemler WorkManager kuyruğuna alınan offline-first bir yapıda tutuluyor; konum takibi arka planda sürüyor.

Next.js/TypeScript panelinde Mapbox ile canlı harita, sürücü ve rota yönetimi, teslimat kanıtı ve Twilio ile gönderilen bildirimler bulunuyor.
```
**longDescription.en**
```text
Field app and operations console for courier operations

Built solo · Android app and Next.js console

The courier app is built with Jetpack Compose and XML Views. Actions are kept in an offline-first structure queued with WorkManager, and location tracking runs in the background.

The Next.js/TypeScript console provides a live Mapbox map, driver and route management, proof of delivery and notifications sent through Twilio.
```
**features.tr** (her satır ayrı madde)
```text
WorkManager kuyruklu offline-first kurye uygulaması
Arka plan konum takibi
Mapbox canlı harita, sürücü/rota yönetimi ve teslimat kanıtı
Twilio bildirimleri
```
**features.en** (her satır ayrı madde)
```text
Offline-first courier app with a WorkManager queue
Background location tracking
Live Mapbox map, driver/route management and proof of delivery
Twilio notifications
```
**tags**
```text
Kotlin, Jetpack Compose, XML Views, WorkManager, Next.js, TypeScript, Mapbox, Twilio
```
| Alan | Değer |
| --- | --- |
| githubUrl | (boş bırakın) |
| liveUrl | (boş bırakın) |
| linkedinUrl | (boş bırakın) |

### Penlingu · belge `wILv3v6YYViVtFryF7kn`

**title.tr**
```text
Penlingu
```
**title.en**
```text
Penlingu
```
**description.tr**
```text
4 kişilik ekiple geliştirilen İngilizce kelime öğrenme uygulaması. Depo sahibi olarak projenin mimari zeminini hazırladı; ekipten gelen 20 PR'ı inceleyip birleştirdi.
```
**description.en**
```text
An English vocabulary app built by a team of four. As repository owner, laid the project's architectural foundation and reviewed and merged 20 pull requests from the team.
```
**longDescription.tr**
```text
İngilizce kelime öğrenme uygulaması · 4 kişilik ekip

Okul projesi · kaynak kod GitHub'da

Kelimeler 6 aşamada, 1 ile 180 gün arasında uzayan aralıklarla tekrar ediliyor (aralıklı tekrar).

Seçilen kelimelerle OpenRouter (Mistral 7B) üzerinden hikâye üretiliyor.
```
**longDescription.en**
```text
English vocabulary app · team of 4

School project · source code on GitHub

Words move through 6 stages with review intervals growing from 1 to 180 days (spaced repetition).

Stories are generated from selected words through OpenRouter (Mistral 7B).
```
**features.tr** (her satır ayrı madde)
```text
Depo sahibi: mimari zemin, ekipten gelen 20 PR'ın incelenip birleştirilmesi
6 aşamalı, 1–180 günlük aralıklı tekrar algoritması
OpenRouter (Mistral 7B) ile hikâye üretimi
```
**features.en** (her satır ayrı madde)
```text
Repository owner: architectural foundation, reviewed and merged 20 pull requests from the team
6-stage spaced repetition with 1–180 day intervals
Story generation with OpenRouter (Mistral 7B)
```
**tags**
```text
Kotlin, XML Views, Firebase, OpenRouter (Mistral 7B)
```
| Alan | Değer |
| --- | --- |
| githubUrl | https://github.com/mahmutconger/EnglishWordApp |
| liveUrl | (boş bırakın) |
| linkedinUrl | https://www.linkedin.com/feed/update/urn:li:activity:7342925617782267904/ |

## 3. Son rapor

### Commit'ler (`cv-ve-delivery-guncellemesi` dalı; push ve deploy yapılmadı)

1. CV ve Delivery güncellemesi için inceleme notlarını ekle
2. Delivery Tracking'i bağımsız proje yap ve freelance bloğundan çıkar
3. Penlingu açıklamasına mimari zemin ve PR incelemesini ekle
4. Hero tanıtım metnini yeni CV profiliyle güncelle
5. CV dosyalarını 12 Kasım sürümleriyle güncelle
6. Eski CV adresini 301 ile yönlendir ve CV'lerde önbelleği kapat
7. E2E testlerini 301, önbellek ve Delivery kurallarına göre güncelle
8. CV ve Delivery güncelleme raporunu tamamla

### Test sonuçları

Bütün kontroller iki kez çalıştırıldı: bir kez çalışma alanındaki commit'lenmemiş tasarım değişikliklerinle, bir kez de onlar geçici olarak kenara alınmış temiz ağaçta. İki seferde de sonuç aynı.

| Kontrol | Sonuç |
| --- | --- |
| `npm run build` | Geçti |
| `npm run lint` | Geçti |
| `npm test` (Vitest) | 6 dosya, **60/60 geçti**. Yeni testler: Delivery `kind === "independent"` ve `client` alanı yok; TR/EN etiketleri; Delivery metninde müşteri/client/customer yok; müşteri alanı yalnızca WalkTalk ve MOOK'ta; müşteri alanı doğrulama kuralı; freelance bloğu tam olarak WalkTalk + MOOK ve "Mart – Kasım 2026"; Penlingu cümlesi TR/EN; vercel.json'da 301 ve `no-cache`. Bileşen: freelance bloğu "Delivery" göstermiyor ve iki kez "Müşteri: Samet Yanan" gösteriyor; Delivery ayrıntısı TR'de "Bağımsız proje", EN'de "Independent project" gösteriyor. Bütün TR anahtarlarının EN karşılığı var (mevcut çeviri testi). |
| `npm run test:e2e` (masaüstü + mobil 375×812) | **22/22 geçti**: 3 CV 200 + `application/pdf` + `Cache-Control: no-cache`; `/Mahmut_Can_CONGER_CV.pdf` ve `/CV_TR.pdf` → **301** → mobil CV → 200 PDF; Delivery kartında ve ayrıntısında (metin, alt, aria-label, title; TR ve EN) "müşteri/client/customer" yok; freelance bloğunda Delivery yok; önceki bütün testler. |

### Senin yapman gerekenler

1. **CV PDF'leri:** Yeni üç PDF'i `~/Downloads`'tan kopyalayıp commit'ledim (5. commit). Başka bir sürüm koymak istersen aynı adlarla değiştirip yeniden commit'le.
2. **Firestore (isteğe bağlı):** Yönetici paneli kayıtlarının siteyle aynı olması için 2. bölümdeki metinleri gir. Site için gerekli değil.
3. **Yayına alma:** `firebase deploy` bu siteyi yayına almaz; site Vercel'de. Dalı push edip `main`'e birleştir; Vercel `main`'i yayınlar. Yayından sonra şunu kontrol et: `curl -sI https://mahmutcanconger.com/Mahmut_Can_CONGER_CV.pdf` yanıtı `301` ve `cache-control: no-cache` vermeli.
4. **Commit'lenmemiş tasarım çalışman:** `ProjectsCard.tsx`, `portfolio.css`, `src/portfolio-1.css` ve `Claude outputs/` bu dala taşındı ama commit'lenmedi. `Claude outputs/` klasörünü commit'lemek istemiyorsan `.gitignore`'a ekle ya da repodan taşı.
