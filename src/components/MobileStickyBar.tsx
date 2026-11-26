"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, CalendarCheck } from "lucide-react";
import { buildWhatsAppUrl, FIRM_CONTACT } from "@/lib/compliance";
import { trackEvent } from "@/lib/analytics";

const AREA_SLUG_NAMES: Record<string, string> = {
  "land-property-conveyancing": "Land, Property & Conveyancing",
  "succession-probate": "Succession & Probate",
  "civil-commercial-litigation": "Civil & Commercial Litigation",
  "family-children": "Family & Children",
  "employment-labour": "Employment & Labour",
  "corporate-commercial": "Corporate & Commercial",
  "banking-securities-debt-recovery": "Banking, Securities & Debt Recovery",
  "agriculture-cooperatives-saccos": "Agriculture, Cooperatives & SACCOs",
  "insurance-personal-injury": "Insurance & Personal Injury",
  "criminal-defence": "Criminal Defence",
  "constitutional-administrative-law": "Constitutional & Administrative Law",
  "alternative-dispute-resolution": "Alternative Dispute Resolution",
};

export function MobileStickyBar() {
  const pathname = usePathname();
  const match = pathname.match(/^\/areas-of-practice\/([^/]+)/);
  const areaSlug = match?.[1];
  const areaName = areaSlug ? AREA_SLUG_NAMES[areaSlug] : undefined;

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const requestHref = areaSlug
    ? `/request-consultation?area=${encodeURIComponent(areaSlug)}`
    : "/request-consultation";

  return (
    <div
      role="region"
      aria-label="Quick contact actions"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-[#E4DFD5] bg-white/95 backdrop-blur shadow-[0_-4px_16px_rgba(16,36,48,0.08)]"
    >
      <div className="grid grid-cols-3 divide-x divide-[#E4DFD5]">
        <a
          href={buildWhatsAppUrl(areaName)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { page: pathname, areaSlug })}
          className="flex items-center justify-center gap-1.5 min-h-[54px] px-2 text-xs font-semibold text-[#1B5E3F] active:bg-[#F1F6F3]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>

        <a
          href={FIRM_CONTACT.phoneHref}
          onClick={() => trackEvent("call_click", { page: pathname, areaSlug })}
          className="flex items-center justify-center gap-1.5 min-h-[54px] px-2 text-xs font-semibold text-[#102430] active:bg-[#FAF8F4]"
        >
          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Call</span>
        </a>

        <Link
          href={requestHref}
          className="flex items-center justify-center gap-1.5 min-h-[54px] px-2 bg-[#102430] text-xs font-semibold text-white active:bg-[#1B394B]"
        >
          <CalendarCheck className="h-4 w-4 shrink-0 text-[#D4B475]" aria-hidden="true" />
          <span>Request</span>
        </Link>
      </div>
    </div>
  );
}
