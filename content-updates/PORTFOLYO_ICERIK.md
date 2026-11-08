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

## 1. Kodda yapılan değişiklikler (bölüm bölüm)

**Kimlik / hero**
- "Yazılım Mühendisi" yerine her yerde **"Yazılım Mühendisliği Öğrencisi" / "Software Engineering Student"** yazıyor: hero, `<title>` (dile göre değişiyor), og:title, twitter:title.
- Odak satırı: Kotlin · Jetpack Compose · Kotlin Multiplatform.
- Hero'ya uygunluk rozeti eklendi (TR/EN metinler istendiği gibi).
- Meta description TR/EN olarak yeniden yazıldı ve dil değişince güncelleniyor; "Sivas … uzmanlığı" ifadesi kaldırıldı. og:image Storage'dan (402) siteyle birlikte sunulan `/profile.jpg` dosyasına taşındı.
- Hero açıklaması CV profiline göre güncellendi (Kotlin/Compose/KMP, offline-first, gerçek zamanlı ses, test edilebilir mimari).

**CV indirme**
- Hero ve İletişim'deki tek düğmenin yerine bölünmüş düğme geldi: sol taraf varsayılan **Mobil Geliştirici CV**'yi indiriyor, ok üç seçeneği açıyor (Mobil, Full Stack, İME). Klavye: ok tuşları ve Escape çalışıyor.
- Dosya yolları: `public/cv/Mahmut_Can_Conger_CV_{Mobil,FullStack,IME}.pdf`.
- `/Mahmut_Can_CONGER_CV.pdf` ve hiçbir yerden bağlanmayan `/CV_TR.pdf`, `vercel.json` içinde 307 ile mobil CV'ye yönleniyor. Eski PDF'ler repodan silindi. Site Vercel'de olduğu için yönlendirme Firebase Hosting'e değil Vercel'e yazıldı.

**Deneyim (yeni bölüm)**
- Projeler'den önce 7. kart olarak eklendi; sayaç artık `/ 07`. Gezinme çubuğu 7 öğeyle 375 px mobil genişliğe de sığıyor (e2e testiyle doğrulandı), bu yüzden Projeler kartına sekme olarak birleştirmeye gerek kalmadı.
- ZNOSOFT girdisi verilen üç maddeyle; Freelance girdisi WalkTalk, MOOK ve Delivery Tracking'e bağlanıyor. Bağlantılar ilgili proje kartını doğrudan açıyor (`/?project=walktalk#projects`).

**Projeler**
- Sıra: WalkTalk, MOOK, Delivery Tracking, Timofy, SmartExam, LatteProje, Penlingu. Firestore'daki "öne çıkan" filtresi yerine bu sıralı listenin tamamı gösteriliyor.
- Her kartta tür (Müşteri işi / Kişisel ürün / Bitirme tezi / Okul projesi / Hackathon projesi), tarih aralığı ve durum satırı var; vitrin, liste ve ayrıntı görünümünün hepsinde.
- Metinler yalnızca kanonik bilgilerle yeniden yazıldı ve TR/EN olarak eksiksiz. Yasaklı ifadelerin hiçbiri yok (testle denetleniyor).
- "Memories Book" → **Timofy**; "eski adı Memories Book" notu alt başlıkta kalıyor.
- WalkTalk'taki Google Play'e giden "Kaynak Kod" düğmesi kaldırıldı; artık "Web sitesi" ve "Google Play" bağlantıları var. Müşteri işlerinde (WalkTalk, MOOK, Delivery Tracking) kaynak kod bağlantısı yok. Senin kararınla Delivery'nin herkese açık repo bağlantısı da kaldırıldı. MOOK ve SmartExam'deki yalnızca GitHub profiline giden "Kaynak Kod" bağlantıları ve 404 veren MemoriesBookKotlin bağlantısı da kaldırıldı.
- Bağlantı etiketi türünden geliyor ve hedefle uyuşması testte denetleniyor ("Kaynak Kod" yalnızca bir GitHub deposuna, "Google Play" yalnızca play.google.com'a gidebilir).
- Bütün proje görsellerine ortak bir `onError` yedek görseli eklendi. Kök neden kodla düzeltilemez; ayrıntı için 0. bölüme bakın.
- LatteProje: senin cevabınla "Hackathon projesi · Mayıs 2025". Mevcut bilgiler korundu; "gerçek zamanlı", "yüksek performans sağlar", "ölçeklenebilir çözüm" çıkarıldı.

**Hakkımda / Yetenekler**
- "Atomic Commit / v1.0" kartı kaldırıldı; kalan iki prensip kartı satırı eşit bölüyor.
- "Sertifikalar & Yetkinlikler" → "Yetkinlikler / Competencies"; "(Advanced)" ve "İleri Seviye" etiketleri kaldırıldı.
- Lise girdisi kısaltıldı. Biyografiye yalnızca "Haziran 2027'de mezun olacağım" eklendi.
- Yetenekler ızgarası istenen beş grupla değiştirildi (Android, iOS, Ağ & Backend, Test & Performans, Araçlar).
- "Kodun arkasındaki yaklaşım" bloğunda "Clean Architecture / MVVM" duruyor. Aynı Atomic Commit iddiası olduğu için "Atomic Commits" maddesi kaldırıldı; yerine CV'deki Room/WorkManager deneyimine dayanan "Offline-first" geldi.

**İletişim / bağlantılar**
- LinkedIn her yerde `https://www.linkedin.com/in/mahmut-can-conger/`; eski `-4305b1299` adresi hiçbir yerde kalmadı (silinen eski bileşenler dahil). GitHub, e-posta ve Instagram değişmedi.

**Mimari**
- `src/content/`: tipli içerik modeli (profil, CV, deneyim, projeler, yetenekler, hakkımda, bölümler) ve doğrulama kuralları.
- `src/locales/{tr,en}.json`: bütün arayüz metinleri (önceden `i18n.ts` içindeydi ve bileşenlere dağılmış `tr ? … : …` ifadeleri vardı).
- `src/services/portfolioRepository.ts`: herkese açık sitenin tek veri erişim noktası (proje görselleri, iletişim mesajı, analitik, Medium). Bileşenler Firebase'i doğrudan çağırmıyor. Yönetici paneli (`/admin`) bu çalışmanın dışında kaldı ve kendi Firebase çağrılarını kullanmaya devam ediyor.
- Analitik `VITE_ANALYTICS_DISABLED=true` ile kapatılabiliyor; testler ve yerel ölçümler canlı Firestore'a yazmıyor.
- Kullanılmayan eski dosyalar silindi (`sections/{Hero,About,TechStack,Projects,Footer,Articles}.tsx`, `Navbar.tsx`, `AllProjects.tsx`).
- `robots.txt` içindeki bozuk Sitemap satırı (Google arama adresi) ve site haritasındaki yönlenen `/all-projects` adresi düzeltildi.

## 2. Kodda değiştirilemeyen içerik: Firestore `projects` belgeleri

Site artık proje **metinlerini** Firestore'dan okumuyor; yukarıdaki değişikliklerin yayına çıkması için Firestore'u düzenlemen **gerekmiyor**. Yine de yönetici panelindeki kayıtlar eski metinleri göstermesin istersen, `/admin` → Projeler → Düzenle ekranında alanları aşağıdakilerle değiştir. Panel alanları ile içerik modelinin eşleşmesi: `description` = kısa özet, `longDescription` = alt başlık + durum + hikâye, `features` = öne çıkanlar. `image` ve `gallery` alanlarına dokunma; site görselleri hâlâ bu alanlardan okuyor.

Not: Repoda seed ya da yönetici betiği olmadığı için güncelleme betiği yazılmadı. `isFeatured` alanının sitede artık bir etkisi yok; sıralama koddaki listeden geliyor.

### WalkTalk · belge `01F3ZvY8UrV0AtSodXGy`

Tür: client · Nisan – Temmuz 2026 / April – July 2026

**title.tr**
```text
WalkTalk
```
**title.en**
```text
WalkTalk
```
**description.tr**
```text
Müşteri Samet Yanan için geliştirilen, farklı dilleri konuşan kişilerin sesli aramada birbirini altyazıyla anlamasını sağlayan uygulama. Android sürümü Kotlin, iOS sürümü Swift ile yazıldı.
```
**description.en**
```text
An app built for the client Samet Yanan that lets people who speak different languages follow each other through subtitles during voice calls. The Android version is written in Kotlin, the iOS version in Swift.
```
**longDescription.tr**
```text
Gerçek zamanlı sesli çeviri

Android: Google Play'de yayında (1.000+ indirme, 5,0 puan) · iOS: yayına hazır

Arama sırasında Agora RTC ses akışı Azure Speech'e aktarılır. Tanınan metin bir Cloud Function üzerinden DeepL'e gönderilir ve çeviri karşı tarafa altyazı olarak iletilir.

Gelen aramalar yüksek öncelikli FCM mesajı ve full-screen intent'li Foreground Service ile gösterilir. DeepL çağrıları ve Agora token üretimi sunucuda yapılır; istemcide gizli anahtar tutulmaz.

WalkTalk, MOOK ile aynı Firebase projesini kullanır. MOOK'ta eşleşen kullanıcılar deep link ve SSO ile WalkTalk'a geçer.
```
**longDescription.en**
```text
Real-time voice translation

Android: live on Google Play (1,000+ downloads, 5.0 rating) · iOS: ready for release

During a call, the Agora RTC audio stream is forwarded to Azure Speech. The recognised text is sent to DeepL through a Cloud Function, and the translation reaches the other person as subtitles.

Incoming calls are shown with high-priority FCM messages and a Foreground Service with a full-screen intent. DeepL calls and Agora token generation run on the server, so no secret keys are kept in the client.

WalkTalk shares a Firebase project with MOOK. Users who match in MOOK move to WalkTalk through a deep link and SSO.
```
**features.tr** (her satır ayrı madde)
```text
Agora RTC → Azure Speech → Cloud Function → DeepL çeviri ve altyazı hattı
Yüksek öncelikli FCM ve full-screen intent'li Foreground Service ile gelen arama akışı
DeepL ve Agora token üretimi sunucuda; istemcide gizli anahtar yok
MOOK ile ortak Firebase projesi ve deep link/SSO geçişi
```
**features.en** (her satır ayrı madde)
```text
Agora RTC → Azure Speech → Cloud Function → DeepL translation and subtitle pipeline
Incoming call flow with high-priority FCM and a Foreground Service using a full-screen intent
DeepL and Agora token generation on the server; no secret keys in the client
Shared Firebase project with MOOK and deep link/SSO hand-off
```
**tags**
```text
Kotlin, Swift, Agora RTC, Azure Speech, DeepL, Cloud Functions, FCM, Foreground Service
```
| Alan | Değer |
| --- | --- |
| githubUrl | (boş bırakın) |
| liveUrl | https://play.google.com/store/apps/details?id=com.istaps.walktalk2 |
| linkedinUrl | (boş bırakın) |

### MOOK · belge `AUAA3FDsigzkLXAyFaNY`

Tür: client · Temmuz – Ekim 2026 / July – October 2026

**title.tr**
```text
MOOK
```
**title.en**
```text
MOOK
```
**description.tr**
```text
Müşteri Samet Yanan için tek geliştirici olarak yazılan uygulama. Android ve iOS sürümleri Kotlin Multiplatform ve Compose Multiplatform ile tek kod tabanından çıkıyor; UI dahil kodun ~%87'si ortak.
```
**description.en**
```text
An app written as the sole developer for the client Samet Yanan. The Android and iOS versions come from a single Kotlin Multiplatform and Compose Multiplatform codebase; ~87% of the code, UI included, is shared.
```
**longDescription.tr**
```text
Dil değişimi uygulaması · tek geliştirici

Google Play'de yayında · iOS: yayına hazır

Uygulama Kotlin Multiplatform ve Compose Multiplatform ile yazıldı, bağımlılıklar Koin ile yönetiliyor. Ağırlıkla birim testlerinden oluşan 386 otomatik test var.

Reklam sıklığı ve zorunlu güncelleme Firebase Remote Config'e bağlı; bu ayarlar mağazaya yeni sürüm göndermeden değiştirilebiliyor. Sunucu tarafı 30'dan fazla TypeScript Cloud Function'dan oluşuyor.

Uygulama 39 dilde kullanılabiliyor ve WalkTalk ile aynı Firebase projesini paylaşıyor.
```
**longDescription.en**
```text
Language exchange app · sole developer

Live on Google Play · iOS: ready for release

The app is written with Kotlin Multiplatform and Compose Multiplatform, with dependencies managed by Koin. It has 386 automated tests, mostly unit tests.

Ad frequency and forced updates are driven by Firebase Remote Config, so they can be changed without shipping a new store release. The backend consists of more than 30 TypeScript Cloud Functions.

The app is available in 39 languages and shares a Firebase project with WalkTalk.
```
**features.tr** (her satır ayrı madde)
```text
KMP + Compose Multiplatform; UI dahil kodun ~%87'si ortak
386 otomatik test (ağırlıkla birim)
Remote Config ile mağaza sürümü gerektirmeden reklam sıklığı ve zorunlu güncelleme
30'dan fazla TypeScript Cloud Function
39 dil
```
**features.en** (her satır ayrı madde)
```text
KMP + Compose Multiplatform; ~87% shared code, UI included
386 automated tests (mostly unit tests)
Ad frequency and forced updates via Remote Config, without a store release
More than 30 TypeScript Cloud Functions
39 languages
```
**tags**
```text
Kotlin Multiplatform, Compose Multiplatform, Koin, Firebase Remote Config, Cloud Functions (TypeScript)
```
| Alan | Değer |
| --- | --- |
| githubUrl | (boş bırakın) |
| liveUrl | https://mookswipe.com |
| linkedinUrl | (boş bırakın) |

### Delivery Tracking & Ops Console · belge `hWTlzHf7vtA3LbJhZPlf`

Tür: client · Mart – Mayıs 2026 / March – May 2026

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
Bir müşterinin kurye operasyonu için tek başına geliştirilen Android kurye uygulaması ve Next.js/TypeScript yönetim paneli.
```
**description.en**
```text
An Android courier app and a Next.js/TypeScript operations console, built solo for a client's courier operation.
```
**longDescription.tr**
```text
Kurye operasyonu için saha uygulaması ve yönetim paneli

Müşteri işi · uygulama ve panel tek başına geliştirildi

Kurye uygulaması Jetpack Compose ve XML Views ile yazıldı. İşlemler WorkManager kuyruğuna alınan offline-first bir yapıda tutuluyor; konum takibi arka planda sürüyor.

Next.js/TypeScript panelinde Mapbox ile canlı harita, sürücü ve rota yönetimi, teslimat kanıtı ve Twilio ile gönderilen bildirimler bulunuyor.
```
**longDescription.en**
```text
Field app and operations console for courier operations

Client project · app and console built solo

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

### Timofy · belge `vWvfBFdVKLpsUCi5W3lF`

Tür: personal · Aralık 2024 – Eylül 2026 / December 2024 – September 2026

**title.tr**
```text
Timofy
```
**title.en**
```text
Timofy
```
**description.tr**
```text
Kişisel ürün olarak geliştirdiğim harita tabanlı anı uygulaması. Çevrimdışı senkronizasyon, açılış süresi ve medya maliyeti üzerine çalıştım.
```
**description.en**
```text
A map-based memories app I build as a personal product. My work focused on offline sync, start-up time and media cost.
```
**longDescription.tr**
```text
Harita tabanlı anı uygulaması (eski adı Memories Book)

Eylül 2026'dan beri Google Play kapalı testte

Çevrimdışı yapılan kayıtlar Room + WorkManager tabanlı bir Outbox ile tutuluyor ve bağlantı gelince sunucuyla eşitleniyor. Baseline Profile entegrasyonu soğuk açılışı %43 kısalttı.

Fotoğraflar yüklenmeden önce WebP'ye sıkıştırılıyor: 20–30 görsellik testte boyut ~%75 küçüldü, kalite PSNR ≥40 dB eşiğiyle doğrulandı. EXIF-GPS verisi yüklemeden önce temizleniyor.

Egress ücretini ortadan kaldırmak için medya Cloudflare R2'ye (Workers) taşındı. Haritada MapLibre ile özel pin kümeleme kullanılıyor.
```
**longDescription.en**
```text
Map-based memories app (formerly Memories Book)

In closed testing on Google Play since September 2026

Entries made offline are kept in a Room + WorkManager based Outbox and synced with the server once a connection is available. Integrating a Baseline Profile cut cold start time by 43%.

Photos are compressed to WebP before upload: in a test with 20–30 images, size dropped by ~75%, with quality verified against a PSNR ≥40 dB threshold. EXIF-GPS data is stripped before upload.

Media was moved to Cloudflare R2 (Workers) to remove egress fees. The map uses custom pin clustering built with MapLibre.
```
**features.tr** (her satır ayrı madde)
```text
Room + WorkManager tabanlı Outbox ile çevrimdışı senkronizasyon
Baseline Profile ile soğuk açılış %43 kısaldı
WebP sıkıştırma hattı: 20–30 görsellik testte ~%75 küçülme, PSNR ≥40 dB
Yüklemeden önce EXIF-GPS temizleme
Egress ücretini ortadan kaldırmak için medya Cloudflare R2'de (Workers)
MapLibre ile özel pin kümeleme
```
**features.en** (her satır ayrı madde)
```text
Offline sync with a Room + WorkManager based Outbox
Cold start cut by 43% with a Baseline Profile
WebP compression pipeline: ~75% smaller in a 20–30 image test, PSNR ≥40 dB
EXIF-GPS stripped before upload
Media on Cloudflare R2 (Workers) to remove egress fees
Custom pin clustering with MapLibre
```
**tags**
```text
Kotlin, Jetpack Compose, Room, WorkManager, MapLibre, Cloudflare R2, Cloudflare Workers, Baseline Profiles
```
| Alan | Değer |
| --- | --- |
| githubUrl | (boş bırakın) |
| liveUrl | https://timofy.site |
| linkedinUrl | https://www.linkedin.com/feed/update/urn:li:activity:7369273897449472002/ |

### SmartExam · belge `CnuDyBf6CMNsaxC7vH2U`

Tür: thesis · Eylül 2025 – Nisan 2026 / September 2025 – April 2026

**title.tr**
```text
SmartExam
```
**title.en**
```text
SmartExam
```
**description.tr**
```text
2 kişilik ekiple geliştirilen sınav analitiği sistemi: Android öğrenci uygulaması, Next.js kurum ve yayınevi panelleri ve ortak Cloud Functions arka ucu.
```
**description.en**
```text
An exam analytics system built by a team of two: an Android student app, Next.js institution and publisher dashboards, and a shared Cloud Functions backend.
```
**longDescription.tr**
```text
Sınav analitiği · bitirme tezi (Profesyonel Yazılım Geliştirme dersi) · 2 kişilik ekip

Geliştirme aşamasında (canlı kullanım yok) · tez yazımı sürüyor

Sistem; Android öğrenci uygulaması (Compose, Hilt, MVVM), Next.js kurum ve yayınevi panelleri ve ortak Cloud Functions arka ucundan oluşuyor. Puanlama ve sıralama sunucuda tek transaction içinde hesaplanıyor.

Kurum verisi 6 rollü RBAC ile kiracı bazında ayrılıyor. Kâğıt optik formlar Pub/Sub ve FastAPI/OpenCV ile asenkron okunuyor; bu hat klasik görüntü işlemeye dayanıyor, model kullanılmıyor.

Firestore kuralları sürümlenmiş ayrı bir repoda tutuluyor ve 35 emülatör testiyle GitHub Actions üzerinde doğrulanıyor. Uygulamada Gemini tabanlı bir eğitim koçu bulunuyor.
```
**longDescription.en**
```text
Exam analytics · graduation thesis (Professional Software Development course) · team of 2

In development (no live usage) · thesis writing in progress

The system consists of an Android student app (Compose, Hilt, MVVM), Next.js institution and publisher dashboards, and a shared Cloud Functions backend. Scoring and ranking are computed on the server in a single transaction.

Institution data is isolated per tenant with 6-role RBAC. Paper optical forms are read asynchronously with Pub/Sub and FastAPI/OpenCV; this pipeline relies on classical image processing, with no model involved.

Firestore rules live in a separate versioned repository and are verified with 35 emulator tests on GitHub Actions. The app includes a Gemini-based study coach.
```
**features.tr** (her satır ayrı madde)
```text
Puanlama ve sıralama sunucuda tek transaction'da
6 rollü RBAC ile kiracı bazında veri izolasyonu
Pub/Sub + FastAPI/OpenCV ile asenkron optik form okuma (klasik görüntü işleme, model yok)
Sürümlenmiş Firestore kuralları: 35 emülatör testi ve GitHub Actions
Gemini tabanlı eğitim koçu
```
**features.en** (her satır ayrı madde)
```text
Scoring and ranking on the server in a single transaction
Per-tenant data isolation with 6-role RBAC
Asynchronous optical form reading with Pub/Sub + FastAPI/OpenCV (classical image processing, no model)
Versioned Firestore rules: 35 emulator tests and GitHub Actions
Gemini-based study coach
```
**tags**
```text
Kotlin, Jetpack Compose, Hilt, Next.js, Cloud Functions, Pub/Sub, FastAPI, OpenCV, Gemini API, GitHub Actions
```
| Alan | Değer |
| --- | --- |
| githubUrl | (boş bırakın) |
| liveUrl | (boş bırakın) |
| linkedinUrl | (boş bırakın) |

### LatteProje · belge `vkxqvIDSvZygNgl1iDvz`

Tür: hackathon · Mayıs 2025 / May 2025

**title.tr**
```text
LatteProje
```
**title.en**
```text
LatteProje
```
**description.tr**
```text
Üretim bandındaki ürünlerin hatalı ya da sağlam olduğunu yalnızca bir mobil cihaz kamerasıyla ayırt etmeyi amaçlayan Android kalite kontrol uygulaması.
```
**description.en**
```text
An Android quality control app that aims to tell defective products on a production line from sound ones using only a mobile device camera.
```
**longDescription.tr**
```text
Yapay zekâ destekli kalite kontrol uygulaması

Hackathon'da geliştirildi · kaynak kod GitHub'da

Görüntü sınıflandırma TensorFlow Lite ile cihaz üzerinde yapılıyor. Kullanıcı girişi Firebase Authentication ile sağlanıyor; analiz sonuçları SQLite'ta tutulduğu için geriye dönük raporlanabiliyor.

Kamera görüntüsünün dönüş açısı algılanıp otomatik olarak düzeltiliyor.
```
**longDescription.en**
```text
AI-assisted quality control app

Built at a hackathon · source code on GitHub

Image classification runs on the device with TensorFlow Lite. Sign-in uses Firebase Authentication, and analysis results are stored in SQLite so they can be reported on later.

The rotation of the camera image is detected and corrected automatically.
```
**features.tr** (her satır ayrı madde)
```text
TensorFlow Lite ile cihaz üzerinde görüntü sınıflandırma
CameraX ile görüntü alma ve dönüş düzeltme
Firebase Authentication ile giriş
SQLite üzerinde geriye dönük raporlama
```
**features.en** (her satır ayrı madde)
```text
On-device image classification with TensorFlow Lite
Image capture with CameraX and rotation correction
Sign-in with Firebase Authentication
Historical reporting on SQLite
```
**tags**
```text
Kotlin, TensorFlow Lite, CameraX, XML Views, ViewBinding, Jetpack Compose, SQLite, Room, Firebase Authentication
```
| Alan | Değer |
| --- | --- |
| githubUrl | https://github.com/mahmutconger/LatteProject |
| liveUrl | (boş bırakın) |
| linkedinUrl | https://www.linkedin.com/feed/update/urn:li:activity:7331975710070169600/ |

### Penlingu · belge `wILv3v6YYViVtFryF7kn`

Tür: school · Nisan – Haziran 2025 / April – June 2025

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
4 kişilik ekiple geliştirilen İngilizce kelime öğrenme uygulaması. Depo sahibi olarak ekip üyelerinden gelen 20 PR'ı inceleyip birleştirdim.
```
**description.en**
```text
An English vocabulary app built by a team of four. As the repository owner, I reviewed and merged 20 pull requests from team members.
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
Depo sahibi: ekip üyelerinden gelen 20 PR'ı inceleyip birleştirdim
6 aşamalı, 1–180 günlük aralıklı tekrar algoritması
OpenRouter (Mistral 7B) ile hikâye üretimi
```
**features.en** (her satır ayrı madde)
```text
Repository owner: reviewed and merged 20 pull requests from team members
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

### Commit'ler (`portfolyo-cv-uyumu` dalı; push ve deploy yapılmadı)

1. İçerik kaynakları inceleme notlarını ekle
2. Tipli içerik modelini ve veri erişim katmanını ekle
3. CV indirme menüsünü, hero kimliğini ve eski CV yönlendirmesini ekle
4. Deneyim bölümünü ekle, projeleri ve yetenekleri CV ile uyumlu hale getir
5. Kullanılmayan eski bölüm ve sayfa bileşenlerini kaldır
6. robots.txt ve site haritası adreslerini düzelt
7. Vitest, Testing Library ve Playwright testlerini ekle
8. README ve içerik güncelleme belgesini tamamla

Kod içeren her commit'ten önce yalnızca o commit'in dosyalarıyla `tsc -b` çalıştırıldı.

### Test sonuçları

| Kontrol | Sonuç |
| --- | --- |
| `npm run build` | Geçti |
| `npm run lint` | Geçti (uyarı yok) |
| `npm test` (Vitest) | 5 dosya, **50/50 geçti**: TR↔EN anahtar eşleşmesi, boş çeviri, koddaki her `t("…")` anahtarının varlığı, içerik modeli doğrulaması (boş başlık, tarih, bağlantı etiketi ↔ hedef), yasaklı ifadeler, eski LinkedIn adresi, vercel.json yönlendirmesi; bileşen: Deneyim (ZNOSOFT + freelance), CV menüsü (3 seçenek, klavye, Escape), görsel yedeği. |
| `npm run test:e2e` (Playwright, masaüstü 1440×900 + mobil 375×812) | **18/18 geçti**: 7 bölümün hepsi ve sayaç; hero/başlık/meta TR+EN; hiçbir bölümde ve 7 proje ayrıntısının hiçbirinde kırık görsel yok; 3 CV bağlantısı 200 + `application/pdf`; eski CV adresleri 307 → mobil CV → 200 PDF; Deneyim → WalkTalk kartı; TR ve EN'de hiçbir "Kaynak Kod/Source Code" düğmesi play.google.com'a gitmiyor; kartlarda tür/tarih/durum; yeni LinkedIn adresi. Testlerde Firestore'a hiçbir yazma isteği gitmedi. |

E2E notu: Testler Firebase isteklerini keser, Medium RSS'i sabit bir dosyayla yanıtlar ve yüklü Google Chrome'u kullanır (`channel: "chrome"`). Storage'ın 402 döndüğü durum bileşen testinde canlandırılıyor.

### Lighthouse (mobil, yerel `vite preview`, 3 çalıştırma, Firebase istekleri her iki ölçümde de engelli)

| Kategori | Önce (3 çalıştırma) | Sonra (3 çalıştırma) | Medyan |
| --- | --- | --- | --- |
| Performance | 64 / 67 / 69 | 68 / 69 / 69 | 67 → **69** |
| Accessibility | 96 / 96 / 96 | 96 / 96 / 96 | 96 → **96** |
| SEO | 100 / 100 / 100 | 100 / 100 / 100 | 100 → **100** |

Erişilebilirlikte kalan iki uyarı (`color-contrast`, `label-content-name-mismatch`) değişiklikten önce de vardı; bu çalışmada dokunulmadı. Ana JS paketi gzip'te 118 KB'tan 123 KB'a çıktı (iki dilli profil/yetenek içeriği ve CV menüsü). Proje ve deneyim metinleri tembel yüklenen ayrı bir paket içinde.

### Senin yapman gerekenler

1. **CV PDF'leri:** Testler çalışsın diye `~/Downloads` klasöründeki 8 Kasım tarihli üç PDF'i `public/cv/` altına doğru adlarla kopyaladım ama **commit'lemedim** (git'te izlenmeyen dosya olarak duruyorlar). Bu sürümlerde CV notundaki açık düzeltmeler hâlâ var ("kurdu" tekrarı, "veri kaybını önledi", Mobil'deki "23 ViewModel" ve "12 bin satır"). Son hâllerini aynı adlarla koyup commit'le:
   - `public/cv/Mahmut_Can_Conger_CV_Mobil.pdf`
   - `public/cv/Mahmut_Can_Conger_CV_FullStack.pdf`
   - `public/cv/Mahmut_Can_Conger_CV_IME.pdf`
2. **Firebase faturalandırması:** Bütün proje görselleri (32 dosya) ve eski og:image, `my-dev-portfolio-8033b` projesinin faturalandırma hesabı kapalı olduğu için **HTTP 402** dönüyor. Görsellerin geri gelmesi için Firebase konsolunda faturalandırmayı (Blaze) yeniden aç ya da görselleri başka bir yere taşı. O zamana kadar sitede yedek görsel görünür.
3. **Firestore (isteğe bağlı):** Yönetici panelindeki kayıtların siteyle aynı olmasını istersen 2. bölümdeki metinleri gir. Site için gerekli değil.
4. **Yayına alma:** Site Vercel'de; `firebase deploy` bu değişiklikleri yayına çıkarmaz. Dalı `main`'e birleştirip Vercel'in derlemesini bekle (Vercel büyük olasılıkla `main`'e push ile otomatik yayınlıyor). Yayından sonra `https://mahmutcanconger.com/Mahmut_Can_CONGER_CV.pdf` adresinin mobil CV'yi açtığını kontrol et.

### Açık konular

- **Delivery Tracking durum satırı:** Kanonik bilgilerde durum yok; "Müşteri işi · uygulama ve panel tek başına geliştirildi" yazdım. Gerçek bir durum (ör. "müşteriye teslim edildi") varsa `src/content/projects.ts` içinde değiştir.
- **MOOK alt başlığı:** "Dil değişimi uygulaması" kanonik listede değil, CV'den ve eski Firestore metninden alındı.
- **Penlingu deposu (EnglishWordApp):** CV notunda bu herkese açık repoda bir OpenRouter anahtarı olduğu yazıyordu. Site artık bu repoya "Kaynak Kod" ile bağlanıyor. Anahtarı iptal ettiğinden emin ol.
- **Samet Yanan adı:** WalkTalk ve MOOK açıklamalarında müşteri olarak geçiyor (kanonik bilgilerde de var). CV notunda onay sorusu açıktı.
