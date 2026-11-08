import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import tr from "./locales/tr.json";
import en from "./locales/en.json";

// Arayüz metinleri `src/locales/` altında; proje, deneyim ve profil gibi
// içerikler `src/content/` altında iki dilli olarak tutulur.
export const resources = {
  tr: { translation: tr },
  en: { translation: en },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    interpolation: {
      escapeValue: false, // React çıktıyı zaten kaçırır.
    },
    detection: {
      // Dil algılama sırası: önce localStorage, sonra tarayıcı dili.
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "appLang",
    },
  });

export default i18n;
