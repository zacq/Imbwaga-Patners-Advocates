"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Scale, Phone } from "lucide-react";
import { FIRM_CONTACT } from "@/lib/compliance";
import { trackEvent } from "@/lib/analytics";

const DESKTOP_LINKS = [
  { href: "/about", label: "About" },
  { href: "/advocates", label: "Advocates" },
  { href: "/areas-of-practice", label: "Areas of Practice" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

// PRD Section 6 exact mobile order
const MOBILE_LINKS = [
  { href: "/areas-of-practice", label: "Areas of Practice" },
  { href: "/advocates", label: "Our Advocates" },
  { href: "/about", label: "About" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/insights", label: "Insights" },
  { href: "/faqs", label: "FAQs" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E4DFD5] bg-[#FAF8F4]/95 backdrop-blur">
      {/* Subtle utility bar */}
      <div className="hidden md:block border-b border-[#E4DFD5]/70 bg-[#102430] text-[#E6E2D8] text-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          <span>{FIRM_CONTACT.address}</span>
          <div className="flex items-center gap-5">
            <span>Languages: {FIRM_CONTACT.languages}</span>
            <a
              href={FIRM_CONTACT.phoneHref}
              onClick={() => trackEvent("call_click", { page: pathname })}
              className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#D4B475]"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {FIRM_CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 min-h-[48px] group"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#9A7B3E]/40 bg-[#102430] text-[#D4B475]">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <span className="block font-serif text-base sm:text-lg font-semibold tracking-tight text-[#102430] group-hover:text-[#6E5525] transition-colors">
              Imbwaga, Yogo &amp; Partners
            </span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-[#5B6D78]">
              Advocates · Nakuru
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
          {DESKTOP_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors py-2 ${
                  active
                    ? "text-[#102430] underline decoration-[#9A7B3E] decoration-2 underline-offset-8"
                    : "text-[#3D5260] hover:text-[#102430]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/request-consultation"
            className="inline-flex items-center justify-center min-h-[48px] px-5 rounded bg-[#102430] text-white text-sm font-medium hover:bg-[#1B394B] transition-colors"
          >
            Request a consultation
          </Link>
        </nav>

        {/* Mobile / tablet controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/request-consultation"
            className="hidden sm:inline-flex items-center justify-center min-h-[48px] px-4 rounded bg-[#102430] text-white text-sm font-medium"
          >
            Request consultation
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex items-center justify-center h-12 w-12 rounded border border-[#E4DFD5] bg-white text-[#102430]"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-[#E4DFD5] bg-white px-4 py-4 space-y-1"
        >
          {MOBILE_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center min-h-[48px] px-3 rounded text-base font-medium ${
                  active
                    ? "bg-[#FAF8F4] text-[#102430] border-l-4 border-[#9A7B3E]"
                    : "text-[#3D5260] hover:bg-[#FAF8F4] hover:text-[#102430]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#E4DFD5] flex flex-col gap-2">
            <Link
              href="/request-consultation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center min-h-[48px] rounded bg-[#102430] text-white font-medium"
            >
              Request a consultation
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center min-h-[44px] rounded border border-[#E4DFD5] text-xs font-medium text-[#5B6D78]"
            >
              Staff CMS &amp; Enquiry Inbox
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
