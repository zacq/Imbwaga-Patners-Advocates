"use client";

import { useEffect } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { buildWhatsAppUrl, FIRM_CONTACT } from "@/lib/compliance";
import { trackEvent } from "@/lib/analytics";

export function TrackedWhatsAppButton({
  areaName,
  areaSlug,
  page,
  className,
  label = "WhatsApp",
}: {
  areaName?: string;
  areaSlug?: string;
  page?: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(areaName)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { page, areaSlug })}
      className={
        className ||
        "inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded border border-[#1B5E3F] bg-white text-[#1B5E3F] text-sm font-semibold hover:bg-[#F1F6F3] transition-colors"
      }
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

export function TrackedCallButton({
  areaSlug,
  page,
  className,
  label,
}: {
  areaSlug?: string;
  page?: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={FIRM_CONTACT.phoneHref}
      onClick={() => trackEvent("call_click", { page, areaSlug })}
      className={
        className ||
        "inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded border border-[#E4DFD5] bg-white text-[#102430] text-sm font-semibold hover:bg-[#FAF8F4] transition-colors"
      }
    >
      <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label || `Call ${FIRM_CONTACT.phoneDisplay}`}</span>
    </a>
  );
}

export function PageViewTracker({
  eventName,
  areaSlug,
}: {
  eventName: "practice_page_view" | "insight_read";
  areaSlug?: string;
}) {
  useEffect(() => {
    trackEvent(eventName, { areaSlug });
  }, [eventName, areaSlug]);
  return null;
}
