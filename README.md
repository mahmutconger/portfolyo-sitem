# Mahmut Can Çönger — Portfolyo

React, TypeScript, Vite, Tailwind CSS ve Motion ile hazırlanmış yedi bölümlü, cam yüzeyli portfolyo. Masaüstünde bölümler tek kart içinde kaydırılır; mobilde belge doğal olarak kayar. Alt gezinme çubuğu bölüm geçişlerini ve imlece yakınlığa göre büyüyen simgeleri yönetir. Site Vercel'de yayındadır; Firebase yalnızca Firestore, Auth ve Storage için kullanılır.

## Yerel geliştirme

```sh
npm install
cp .env.example .env.local
npm run dev
```

Mevcut Firebase istemci ayarlarını `.env.local` dosyasına ekleyin. Bu dosya Git tarafından yok sayılır. Ayarlar olmadan da bütün bölümler açılır; proje görselleri yedek görsele düşer, yönetici girişi ve form gönderimi devre dışı kalır.

```sh
npm run build
npm run lint
npm test          # Vitest: içerik modeli, çeviriler ve bileşen testleri
npm run test:e2e  # Playwright: masaüstü + 375×812 mobil (yüklü Google Chrome ile)
npm run preview
```

E2E testleri `--mode e2e` ile derlenen bir kopya üzerinde çalışır (`.env.e2e` analitiği kapatır) ve Firebase isteklerini keser; canlı Firestore'a yazılmaz. Üretim derlemesini yerelde `vite preview` ile açarsanız analitik olayları canlı Firestore'a yazılır; bundan kaçınmak için `vite build --mode e2e` kullanın.

## Yapı

- `src/content/`: sitenin bütün içeriği için tipli, iki dilli (TR/EN) tek doğru kaynak. Profil, CV dosyaları, deneyim, projeler, yetenekler ve hakkımda burada durur. `validation.ts` proje kurallarını (boş başlık, tarih, bağlantı etiketi ↔ hedef) ve yasaklı ifadeleri tanımlar.
- `src/locales/{tr,en}.json`: arayüz metinleri.
- `src/services/portfolioRepository.ts`: herkese açık sitenin bütün veri erişimi (Firestore proje görselleri, iletişim mesajları, analitik, Medium RSS).
- `src/hooks/`: `useProjects` (içerik + Firestore görselleri), `useLanguage`, `useAnalytics`.
- `src/pages/Home.tsx`: kart sahnesi, dil seçimi, sayfa başlığı/meta ve adres üzerinden bölüm yönetimi.
- `src/components/portfolio/`: sunum bileşenleri (`HomeCard`, `ProfileCards`, `ExperienceCard`, `ProjectsCard`, `ArticlesCard`, `CvDownloadMenu`, `ProjectImage`, `Dock`).
- `src/sections/`: içeriği sunum bileşenlerine bağlayan bölümler (`ExperienceSection`, `Contact`).
- `vite/vercelRedirects.ts`: `vercel.json` yönlendirmelerini yerel sunucuda da uygular.
- `src/portfolio.css`: ana kart, cam yüzeyler ve ekran boyutuna uyarlanan tasarım sistemi.

Bölüm adresleri `/#home`, `/#about`, `/#tech`, `/#experience`, `/#projects`, `/#articles`, `/#contact` biçimindedir. Bir proje kartı doğrudan `/?project=walktalk#projects` adresiyle açılır. Eski `/all-projects` adresi projeler kartına, eski `/Mahmut_Can_CONGER_CV.pdf` ve `/CV_TR.pdf` adresleri mobil CV'ye yönlenir. `/login` ve `/admin` korunmuştur.

## İçerik ve erişilebilirlik

CV dosyaları `public/cv/` altındadır. Proje metinleri `src/content/projects.ts` içindedir; Firestore `projects` koleksiyonundan yalnızca yönetici panelinden yüklenen görseller (`image`, `gallery`) okunur ve belge kimliğiyle eşleştirilir. Görsel yüklenemezse `public/projects/fallback.svg` gösterilir. Makaleler Medium RSS aracısından alınır ve HTML içeriği DOMPurify ile temizlenir.

Klavye odağı, içerik atlama bağlantısı, aktif bölüm bildirimi ve detaylarda Escape ile geri dönüş desteklenir. CV menüsü ok tuşları ve Escape ile kullanılabilir. Sistem hareket azaltma tercihi, 3B hareketleri ve sürekli arka plan animasyonlarını azaltır. Yazı tipleri uygulamayla birlikte sunulur.

İletişim formu e-posta kodu istemeden mesajı Firestore'a kaydeder ve ardından EmailJS ile yöneticiye bildirim gönderir. Aynı tarayıcıda başarılı gönderimden sonra 60 saniye bekleme ve otomatik doldurulan botları yakalamaya yönelik gizli bir alan vardır. Bu önlemler istemci tarafındadır; tarayıcı verisi temizlenerek aşılabilir. Gerçek sunucu tarafı hız sınırı için ayrı bir API ve merkezi kayıt gerekir.
