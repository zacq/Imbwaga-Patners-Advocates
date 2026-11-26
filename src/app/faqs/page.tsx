import type { Metadata } from "next";
import Link from "next/link";
import { readStore } from "@/lib/store";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import { FaqsAccordion } from "@/components/FaqsAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "General legal information on booking consultations, conflict checks, fees under the Advocates Remuneration Order, and common Nakuru legal matters.",
};

export const dynamic = "force-dynamic";

export default function FaqsPage() {
  const store = readStore();
  const faqs = store.faqs.filter((f) => f.status === "published");
  const areas = store.practiceAreas.filter((a) => a.status === "published");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E4DFD5] pb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Frequently Asked Questions
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          Common questions about working with our firm
        </h1>
        <p className="text-base text-[#3D5260] leading-relaxed">
          Answers below provide general procedural information only and do not constitute legal
          advice for a specific matter.
        </p>
      </div>

      <FaqsAccordion faqs={faqs} areas={areas} />

      <div className="rounded-lg border border-[#E4DFD5] bg-[#FAF8F4] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-[#3D5260]">
          Have a specific question not covered above? Request a confidential consultation.
        </p>
        <Link
          href="/request-consultation"
          className="inline-flex items-center justify-center min-h-[48px] px-5 rounded bg-[#102430] text-white text-sm font-semibold shrink-0"
        >
          Request a consultation
        </Link>
      </div>

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </div>
  );
}
