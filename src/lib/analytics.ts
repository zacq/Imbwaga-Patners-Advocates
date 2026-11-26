export type TrackableEventName =
  | "consultation_request"
  | "enquiry_submit"
  | "whatsapp_click"
  | "call_click"
  | "practice_page_view"
  | "insight_read";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * AN-1 & AN-2: Dispatches privacy-safe analytics events (no personal data or form contents).
 * Also records channel & content engagement counts for CMS reporting.
 */
export function trackEvent(
  eventName: TrackableEventName,
  params: { page?: string; areaSlug?: string } = {}
): void {
  if (typeof window === "undefined") return;

  const safePayload = {
    page_path: params.page || window.location.pathname,
    area_slug: params.areaSlug || "general",
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, safePayload);
  }

  if (
    eventName === "whatsapp_click" ||
    eventName === "call_click" ||
    eventName === "practice_page_view" ||
    eventName === "insight_read"
  ) {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: eventName,
        page: safePayload.page_path,
        areaSlug: params.areaSlug,
      }),
      keepalive: true,
    }).catch(() => {});
  }
}
