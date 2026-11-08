import { useEffect, useRef } from "react";
import {
  recordAnalyticsEvent,
  type AnalyticsEventInput,
  type AnalyticsEventType,
} from "../services/portfolioRepository";

export type EventType = AnalyticsEventType;

/** Oturum başına benzersiz kimlik; tarayıcı kapanınca sıfırlanır. */
function getOrCreateSessionId(): string {
  const KEY = "portfolio_session_id";
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function getDevice(): "mobile" | "desktop" {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    ? "mobile"
    : "desktop";
}

function getLanguage(): string {
  try {
    return localStorage.getItem("appLang") ?? "tr";
  } catch {
    return "tr";
  }
}

/**
 * Kullanım:
 *   const { trackEvent } = useAnalytics();
 *   trackEvent("cv_download", "hero:mobile");
 *
 * @param autoPageView  true ise ilk açılışta "page_view" gönderilir.
 * @param autoPageDuration  true ise ayrılırken "page_duration" gönderilir.
 */
export function useAnalytics(autoPageView = false, autoPageDuration = false) {
  const sessionId = getOrCreateSessionId();
  const pageStart = useRef<number>(0);

  const baseEvent = (): Omit<AnalyticsEventInput, "type"> => ({
    page: window.location.pathname,
    sessionId,
    referrer: document.referrer,
    device: getDevice(),
    language: getLanguage(),
  });

  const trackEvent = (type: EventType, target?: string) => {
    void recordAnalyticsEvent({
      ...baseEvent(),
      type,
      ...(target ? { target } : {}),
    });
  };

  useEffect(() => {
    if (autoPageView) trackEvent("page_view");
    if (!autoPageDuration) return;
    pageStart.current = Date.now();
    return () => {
      const duration = Date.now() - pageStart.current;
      // Yalnızca 3 saniyeden uzun ziyaretler kaydedilir (bot filtresi).
      if (duration > 3000)
        void recordAnalyticsEvent({ ...baseEvent(), type: "page_duration", duration });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trackEvent };
}
