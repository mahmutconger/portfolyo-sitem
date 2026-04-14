import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About",
        tech: "Skills",
        projects: "Projects",
        contact: "Contact",
        select_language: "Select Language"
      },
      hero: {
        title: "Full Stack Android Developer",
        description: "Transforming ideas into living mobile experiences with the power of Kotlin and Jetpack Compose. Focusing on modern architecture, clean code, and high performance.",
        projects_btn: "Explore My Projects",
        cv_download: "Download CV"
      },
      about: {
        profile: "Professional Profile",
        title_main: "Engineering Discipline",
        title_sub: "Modern Solutions",
        description: "Hello, I am Mahmut Can Çönger. I am a Software Engineering student at Manisa Celal Bayar University living in Manisa. I have a background focused on databases and software since high school. My goal is to build sustainable and scalable systems following Clean Architecture principles.",
        principles: "My Work Principles",
        git_title: "Advanced Git & Versioning",
        git_desc: "I apply 'Atomic Commit' principles. I manage projects with Semantic Versioning (v1.0) and maintain professional branch structures.",
        team_title: "Teamwork & Adaptation",
        team_desc: "Familiar with Agile/Scrum. I value transparency in team communication and adapt quickly to new technologies.",
        passion_title: "Technology Passion",
        passion_desc: "I closely follow the Android ecosystem (Jetpack Compose, AI, KMP) and share my learning through technical blog posts.",
        edu_title: "Education History",
        uni: "Software Engineering",
        uni_desc: "Comprehensive engineering education on SDLC, Agile, Java, C, MSSQL, and Machine Learning.",
        high: "Data Science & Storage",
        high_desc: "Technical foundation on database systems (C#, MSSQL) and desktop applications.",
        certs_title: "Certificates & Competencies"
      },
      tech: {
        title: "Technology & Skills",
        subtitle: "Modern tools and software principles I use in my development process.",
        clean_title: "Clean Architecture",
        clean_desc: "Sustainable and testable code structure",
        compose_title: "Jetpack Compose",
        compose_desc: "Modern UI development approach",
        async_title: "Async Programming",
        async_desc: "Efficient operations with Coroutines & Flow",
        atomic_title: "Atomic Commits",
        atomic_desc: "Organized and traceable Git history"
      },
      projects: {
        all_title: "All My Projects",
        featured_title: "Featured Projects",
        all_desc: "Archive of all applications I've developed.",
        featured_desc: "My best selected works.",
        back_home: "Back to Home",
        view_all: "View All Projects",
        featured_badge: "Featured",
        inspect: "Inspect",
        story: "Project Story",
        features: "Features",
        source_code: "Source Code",
        demo: "Play Store / Demo",
        linkedin: "LinkedIn Post",
        loading: "Loading Projects..."
      },
      contact: {
        label: "Contact & Social",
        title: "Connect with Me",
        desc: "I'm always here for new projects, collaborations, or just tech talks.",
        channels: "Contact Channels",
        channels_desc: "Follow me, review my projects, or download my CV through the platforms below.",
        cv_btn: "Download CV",
        cv_format: "PDF Format",
        direct_mail: "Direct Mail",
        copy_success: "Copied to clipboard!",
        form_name: "Full Name",
        form_email: "Email Address",
        form_msg: "Your Message",
        send_code: "Send Verification Code",
        sending: "Sending Code...",
        verify_title: "Check Your Email",
        verify_desc: "We sent a 6-digit code to",
        verify_btn: "Verify and Send",
        back_btn: "Back",
        success_title: "Message Sent!",
        success_desc: "Verification successful. I will get back to you soon."
      },
      footer: {
        cta: "Let's work together on your next project!",
        cta_desc: "Feel free to reach out to talk about Android apps, Jetpack Compose, or modern mobile technologies.",
        mail_btn: "Send Me an Email",
        rights: "All rights reserved."
      }
    }
  },
  tr: {
    translation: {
      nav: {
        home: "Ana Sayfa",
        about: "Hakkımda",
        tech: "Yetenekler",
        projects: "Projeler",
        contact: "İletişim",
        select_language: "Dil Seçin"
      },
      hero: {
        title: "Full Stack Android Geliştirici",
        description: "Fikirleri, Kotlin ve Jetpack Compose gücüyle yaşayan mobil deneyimlere dönüştürüyorum. Modern mimari, temiz kod ve yüksek performans odaklı çözümler üretiyorum.",
        projects_btn: "Projelerimi İncele",
        cv_download: "CV'yi İndir"
      },
      about: {
        profile: "Profesyonel Profil",
        title_main: "Mühendislik Disipliniyle",
        title_sub: "Modern Çözümler",
        description: "Merhaba, ben Mahmut Can Çönger. Manisa'da yaşayan, Manisa Celal Bayar Üniversitesi Yazılım Mühendisliği öğrencisiyim. Lise eğitimimden bu yana veri tabanı ve yazılım üzerine odaklanmış bir geçmişe sahibim. Clean Architecture prensiplerine uygun sistemler kurmayı hedefliyorum.",
        principles: "Çalışma Prensibim",
        git_title: "İleri Seviye Git & Versiyonlama",
        git_desc: "Projelerimde 'Atomic Commit' prensibini uygularım. Her projemi anlamsal versiyonlama (v1.0) ile yönetir, profesyonel standartlarda tutarım.",
        team_title: "Ekip Çalışması & Adaptasyon",
        team_desc: "Agile/Scrum metodolojilerine aşinayım. Takım içi şeffaflığa önem verir, yeni teknolojilere hızla adapte olurum.",
        passion_title: "Teknoloji Tutkusu",
        passion_desc: "Android ekosistemini yakından takip ederim (Jetpack Compose, AI, KMP). Öğrendiklerimi teknik blog yazılarıyla toplulukla paylaşırım.",
        edu_title: "Eğitim Geçmişim",
        uni: "Yazılım Mühendisliği",
        uni_desc: "Yazılım yaşam döngüsü, Çevik metodolojiler, Java, C, MSSQL ve Makine Öğrenmesi üzerine kapsamlı mühendislik eğitimi.",
        high: "Veri Bilimi ve Depolama",
        high_desc: "Veri tabanı sistemleri (C#, MSSQL) ve masaüstü uygulamaları üzerine teknik altyapı eğitimi.",
        certs_title: "Sertifikalar & Yetkinlikler"
      },
      tech: {
        title: "Teknoloji & Yetenekler",
        subtitle: "Geliştirme sürecimde kullandığım modern araçlar ve benimsediğim yazılım prensipleri.",
        clean_title: "Clean Architecture",
        clean_desc: "Sürdürülebilir ve test edilebilir kod yapısı",
        compose_title: "Jetpack Compose",
        compose_desc: "Modern UI geliştirme yaklaşımı",
        async_title: "Async Programming",
        async_desc: "Coroutines & Flow ile verimli işlemler",
        atomic_title: "Atomic Commits",
        atomic_desc: "Düzenli ve takip edilebilir Git geçmişi"
      },
      projects: {
        all_title: "Tüm Projelerim",
        featured_title: "Öne Çıkan Projeler",
        all_desc: "Geliştirdiğim bütün uygulamaların arşivi.",
        featured_desc: "Seçilmiş en iyi çalışmalarım.",
        back_home: "Ana Sayfaya Dön",
        view_all: "Tüm Projeleri Görüntüle",
        featured_badge: "Öne Çıkan",
        inspect: "İncele",
        story: "Proje Hikayesi",
        features: "Özellikler",
        source_code: "Kaynak Kod",
        demo: "Play Store / Demo",
        linkedin: "LinkedIn Gönderisi",
        loading: "Projeler Yükleniyor..."
      },
      contact: {
        label: "İletişim & Sosyal",
        title: "Benimle Bağlantı Kurun",
        desc: "Yeni projeler, iş birlikleri veya sadece teknoloji sohbetleri için her zaman buradayım.",
        channels: "İletişim Kanalları",
        channels_desc: "Platformlar üzerinden beni takip edebilir veya CV'mi indirebilirsiniz.",
        cv_btn: "CV İndir",
        cv_format: "PDF Formatında",
        direct_mail: "Doğrudan Mail",
        copy_success: "Panoya kopyalandı!",
        form_name: "İsim Soyisim",
        form_email: "Email Adresi",
        form_msg: "Mesajınız",
        send_code: "Doğrulama Kodu Gönder",
        sending: "Kod Gönderiliyor...",
        verify_title: "Mailinizi Kontrol Edin",
        verify_desc: "adresine 6 haneli bir kod gönderdik.",
        verify_btn: "Onayla ve Gönder",
        back_btn: "Geri Dön",
        success_title: "Mesajınız İletildi!",
        success_desc: "Doğrulama başarılı. En kısa sürede dönüş yapacağım."
      },
      footer: {
        cta: "Bir sonraki projenizde birlikte çalışalım!",
        cta_desc: "Android, Jetpack Compose veya modern teknolojiler hakkında konuşmak için bana ulaşabilirsiniz.",
        mail_btn: "Bana Mail Gönder",
        rights: "Tüm hakları saklıdır."
      }
    }
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'tr',
  interpolation: { escapeValue: false }
});

export default i18n;