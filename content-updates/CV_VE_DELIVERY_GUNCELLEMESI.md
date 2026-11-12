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
