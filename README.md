# Mahmut Can Çönger — Portfolyo

React, TypeScript, Vite, Tailwind CSS ve Motion ile hazırlanmış altı bölümlü, cam yüzeyli portfolyo. Masaüstünde bölümler tek kart içinde kaydırılır; mobilde belge doğal olarak kayar. Alt gezinme çubuğu bölüm geçişlerini ve imlece yakınlığa göre büyüyen simgeleri yönetir.

## Yerel geliştirme

```sh
npm install
cp .env.example .env.local
npm run dev
```

Mevcut Firebase istemci ayarlarını `.env.local` dosyasına ekleyin. Bu dosya Git tarafından yok sayılır. Ayarlar olmadan ana sayfa, hakkımda, yetenekler ve Medium makaleleri kullanılabilir; projeler hata/yeniden deneme görünümüne geçer, yönetici girişi ve form gönderimi devre dışı kalır.

```sh
npm run build
npm run lint
npm run preview
```

## Yapı

- `src/pages/Home.tsx`: kart sahnesi, dil seçimi ve adres üzerinden bölüm yönetimi.
- `src/components/portfolio/Dock.tsx`: yay hareketli alt gezinme.
- `src/components/portfolio/HomeCard.tsx`: portre, imza ve tanıtım.
- `src/components/portfolio/ProfileCards.tsx`: hakkımda ve yetenekler.
- `src/components/portfolio/ProjectsCard.tsx`: Firebase projeleri, deste, tüm projeler ve kart içi galeri.
- `src/components/portfolio/ArticlesCard.tsx`: Medium RSS akışı ve temizlenmiş HTML ile kart içi makale okuma.
- `src/components/portfolio/motion.ts`: ortak animasyon ve bölüm tanımları.
- `src/sections/Contact.tsx`: mevcut EmailJS doğrulamalı iletişim akışı.
- `src/portfolio.css`: ana kart, cam yüzeyler ve ekran boyutuna uyarlanan tasarım sistemi.

Bölüm adresleri `/#home`, `/#about`, `/#tech`, `/#projects`, `/#articles`, `/#contact` biçimindedir. Eski `/all-projects` adresi projeler kartına yönlenir. `/login` ve `/admin` korunmuştur.

## İçerik ve erişilebilirlik

Mevcut çeviriler `src/i18n.ts` içinde; fotoğraf ve CV dosyaları `public` içindedir. Projeler Firestore `projects` koleksiyonundan, makaleler mevcut Medium RSS aracısından alınır. Makale HTML içeriği DOMPurify ile temizlenir. Yükleme, boş içerik ve bağlantı hatası durumları ayrı gösterilir.

Klavye odağı, içerik atlama bağlantısı, aktif bölüm bildirimi ve detaylarda Escape ile geri dönüş desteklenir. Sistem hareket azaltma tercihi, 3B hareketleri ve sürekli arka plan animasyonlarını azaltır. Yazı tipleri uygulamayla birlikte sunulur. Geliştirme ortamında analitik olayları Firebase'e gönderilmez.

İletişim formu mevcut istemci tarafı EmailJS kod doğrulama yapısını korur. Bu akış sunucu tarafı kimlik doğrulama yerine geçmez. Gerçek e-posta gönderimi dış hizmetlerde yan etki oluşturduğundan yerel tasarım kontrollerinde otomatik olarak yapılmaz.
