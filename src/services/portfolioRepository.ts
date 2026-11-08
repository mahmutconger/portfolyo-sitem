// Herkese açık sitenin bütün veri erişimi bu modülden geçer: Firestore'daki
// proje görselleri, iletişim mesajları, analitik olayları ve Medium RSS.
// Bileşenler Firebase'i ya da ağ katmanını doğrudan çağırmaz.
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../firebase";

export interface ProjectMedia {
  image?: string;
  gallery: string[];
}

export type ProjectMediaMap = Record<string, ProjectMedia>;

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description?: string;
  content?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type AnalyticsEventType =
  | "page_view"
  | "section_view"
  | "cv_download"
  | "project_click"
  | "social_click"
  | "contact_submit"
  | "page_duration";

export interface AnalyticsEventInput {
  type: AnalyticsEventType;
  page: string;
  target?: string;
  sessionId: string;
  referrer: string;
  device: "mobile" | "desktop";
  language: string;
  duration?: number;
}

const MEDIUM_FEED =
  "https://api.rss2json.com/v1/api.json?rss_url=" +
  encodeURIComponent("https://medium.com/feed/@mahmutconger");

/**
 * Analitik yalnızca yayındaki üretim derlemesinde açıktır. Geliştirme
 * sunucusu, testler ve yerel ölçümler (`VITE_ANALYTICS_DISABLED=true`)
 * canlı Firestore'a hiçbir şey yazmaz.
 */
export const analyticsEnabled =
  firebaseConfigured &&
  !import.meta.env.DEV &&
  import.meta.env.MODE !== "test" &&
  import.meta.env.VITE_ANALYTICS_DISABLED !== "true";

const isHttpsUrl = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("https://");

/**
 * Yönetici panelinden yüklenen görselleri Firestore belge kimliğine göre
 * döndürür. Proje metinleri `src/content/projects.ts` içindedir; burada
 * yalnızca `image` ve `gallery` alanları okunur.
 */
export async function fetchProjectMedia(): Promise<ProjectMediaMap> {
  if (!firebaseConfigured) throw new Error("Firebase yapılandırması eksik");
  const snapshot = await getDocs(collection(db, "projects"));
  const media: ProjectMediaMap = {};
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const gallery = Array.isArray(data.gallery)
      ? data.gallery.filter(isHttpsUrl)
      : [];
    media[doc.id] = {
      image: isHttpsUrl(data.image) ? data.image : undefined,
      gallery,
    };
  });
  return media;
}

export async function fetchArticles(signal?: AbortSignal): Promise<Article[]> {
  const response = await fetch(MEDIUM_FEED, { signal });
  if (!response.ok) throw new Error("Makaleler alınamadı");
  const result = await response.json();
  if (result.status !== "ok" || !Array.isArray(result.items))
    throw new Error("Geçersiz makale verisi");
  return result.items as Article[];
}

export async function saveContactMessage(message: ContactMessage): Promise<void> {
  if (!firebaseConfigured) throw new Error("Firebase yapılandırması eksik");
  await addDoc(collection(db, "messages"), {
    ...message,
    createdAt: serverTimestamp(),
    isRead: false,
  });
}

/** Analitik hataları arayüzü bozmaz; yalnızca konsola yazılır. */
export async function recordAnalyticsEvent(event: AnalyticsEventInput): Promise<void> {
  if (!analyticsEnabled) return;
  try {
    await addDoc(collection(db, "analytics_events"), {
      ...event,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.warn("[Analytics] Olay yazılamadı:", error);
  }
}
