import { useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────
export type EventType =
  | 'page_view'
  | 'section_view'
  | 'cv_download'
  | 'project_click'
  | 'social_click'
  | 'contact_submit'
  | 'page_duration';

export interface AnalyticsEvent {
  type: EventType;
  page: string;
  target?: string;       // bölüm adı, proje başlığı, sosyal platform vb.
  sessionId: string;
  referrer: string;
  device: 'mobile' | 'desktop';
  language: string;
  timestamp: any;        // serverTimestamp
  duration?: number;     // ms – sadece page_duration event'inde
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Oturum başına benzersiz ID — tarayıcı kapanınca sıfırlanır */
function getOrCreateSessionId(): string {
  const KEY = 'portfolio_session_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

function getDevice(): 'mobile' | 'desktop' {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

/** Firestore'a güvenli yaz — hata olursa console'a log at, UI'ı kırma */
async function writeEvent(payload: Omit<AnalyticsEvent, 'timestamp'> & { timestamp: any }) {
  try {
    await addDoc(collection(db, 'analytics_events'), payload);
  } catch (err) {
    console.warn('[Analytics] Event yazılamadı:', err);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAnalytics
 *
 * Kullanımı:
 *   const { trackEvent } = useAnalytics();
 *   trackEvent('cv_download');
 *   trackEvent('project_click', 'WalkTalk');
 *
 * @param autoPageView  true ise mount anında 'page_view' otomatik gönderilir.
 * @param autoPageDuration  true ise unmount'ta 'page_duration' gönderilir.
 */
export function useAnalytics(
  autoPageView = false,
  autoPageDuration = false,
) {
  const sessionId = getOrCreateSessionId();
  const pageStart = useRef<number>(Date.now());
  const language = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('i18nextLng') ?? 'tr')
    : 'tr';

  const trackEvent = (type: EventType, target?: string) => {
    const payload: AnalyticsEvent = {
      type,
      page: window.location.pathname,
      target: target ?? undefined,
      sessionId,
      referrer: document.referrer,
      device: getDevice(),
      language,
      timestamp: serverTimestamp(),
    };
    writeEvent(payload);
  };

  useEffect(() => {
    if (autoPageView) {
      trackEvent('page_view');
    }

    if (autoPageDuration) {
      pageStart.current = Date.now();
      return () => {
        const duration = Date.now() - pageStart.current;
        // Sadece 3 saniyeden uzun ziyaretleri kaydet (bot filtreleme)
        if (duration > 3000) {
          writeEvent({
            type: 'page_duration',
            page: window.location.pathname,
            sessionId,
            referrer: document.referrer,
            device: getDevice(),
            language,
            timestamp: serverTimestamp(),
            duration,
          });
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trackEvent };
}

// ─── Standalone section tracker ───────────────────────────────────────────────

/**
 * useSectionTracking
 *
 * IntersectionObserver ile bölüm görüntülemelerini takip eder.
 * Her bölüm ID'si yalnızca bir kez raporlanır.
 *
 * @param sectionIds  Takip edilecek section id'leri
 */
export function useSectionTracking(sectionIds: string[]) {
  const { trackEvent } = useAnalytics();
  const reported = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !reported.current.has(id)) {
            reported.current.add(id);
            trackEvent('section_view', id);
          }
        });
      },
      { threshold: 0.3 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
