import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, BookOpen, HelpCircle } from "lucide-react";
import { readStore } from "@/lib/store";
import { FIRM_CONTACT, SITE_DISCLAIMER } from "@/lib/compliance";
import {
  TrackedWhatsAppButton,
  TrackedCallButton,
  PageViewTracker,
} from "@/components/TrackedLinks";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = readStore();
  const area = store.practiceAreas.find((a) => a.slug === slug && a.status === "published");
  if (!area) return { title: "Area of Practice" };
  return {
    title: area.seoTitle,
    description: area.metaDescription,
    alternates: {
      canonical: `/areas-of-practice/${area.slug}`,
    },
  };
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = readStore();
  const area = store.practiceAreas.find((a) => a.slug === slug && a.status === "published");

  if (!area) {
    notFound();
  }

  const relatedFaqs = store.faqs.filter(
    (f) => f.status === "published" && (f.areaSlug === area.slug || f.areaSlug === "general")
  );
  const relatedInsights = store.insights.filter(
    (i) => i.status === "published" && i.areaTags.includes(area.slug)
  );
  const handlingAdvocates = store.advocates.filter(
    (a) => a.status === "published" && a.areas.includes(area.slug)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: `${area.name} — ${FIRM_CONTACT.name}`,
    description: area.summary,
    url: `https://${FIRM_CONTACT.domain}/areas-of-practice/${area.slug}`,
    areaServed: "Nakuru, Kenya",
    provider: {
      "@type": "LegalService",
      name: FIRM_CONTACT.name,
      telephone: "+254726111198",
      address: FIRM_CONTACT.address,
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker eventName="practice_page_view" areaSlug={area.slug} />

      <Link
        href="/areas-of-practice"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3D5260] hover:text-[#102430]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>All 12 Areas of Practice</span>
      </Link>

      {/* 1. Heading & one-sentence factual summary */}
      <header className="border-b border-[#E4DFD5] pb-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Area of Practice {String(area.number).padStart(2, "0")}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          {area.name}
        </h1>
        <p className="text-base sm:text-lg text-[#3D5260] leading-relaxed max-w-3xl">
          {area.summary}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href={`/request-consultation?area=${encodeURIComponent(area.slug)}`}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B]"
          >
            <span>Request a consultation</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <TrackedWhatsAppButton
            areaName={area.name}
            areaSlug={area.slug}
            page={`/areas-of-practice/${area.slug}`}
            label="WhatsApp about this area"
          />
          <TrackedCallButton
            areaSlug={area.slug}
            page={`/areas-of-practice/${area.slug}`}
          />
        </div>
      </header>

      {/* 2. Who this is for */}
      <section className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-2">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">Who this is for</h2>
        <p className="text-sm sm:text-base text-[#3D5260] leading-relaxed">{area.whoFor}</p>
      </section>

      {/* 3. Common matters the firm handles */}
      <section className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">
          Common matters the firm handles
        </h2>
        <ul className="space-y-3">
          {area.matters.map((matter) => (
            <li key={matter} className="flex items-start gap-3 text-sm sm:text-base text-[#3D5260]">
              <CheckCircle2
                className="h-5 w-5 text-[#9A7B3E] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{matter}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. What the process typically looks like */}
      <section className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-medium text-[#102430]">
            What the process typically looks like
          </h2>
          <p className="text-xs text-[#5B6D78]">
            General procedural information only; specific timelines depend on the facts and forum.
          </p>
        </div>
        <ol className="space-y-4">
          {area.processSteps.map((stepText, idx) => (
            <li key={stepText} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#102430] text-xs font-semibold text-[#D4B475]">
                {idx + 1}
              </span>
              <p className="text-sm sm:text-base text-[#3D5260] pt-1 leading-relaxed">{stepText}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Documents to bring to a first meeting */}
      <section className="rounded-lg border border-[#E4DFD5] bg-[#FAF8F4] p-6 space-y-4">
        <h2 className="font-serif text-2xl font-medium text-[#102430] flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
          <span>Documents to bring to a first meeting</span>
        </h2>
        <p className="text-xs text-[#5B6D78]">
          Bring copies where available; please do not upload sensitive original documents through the
          website form prior to a conflict check.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-[#3D5260]">
          {area.documents.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </section>

      {/* Advocates handling this area */}
      {handlingAdvocates.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-medium text-[#102430]">
            Advocates handling {area.name}
          </h2>
          <div className="flex flex-wrap gap-3">
            {handlingAdvocates.map((adv) => (
              <Link
                key={adv.id}
                href={`/advocates/${adv.slug}`}
                className="inline-flex items-center gap-3 rounded-lg border border-[#E4DFD5] bg-white px-4 py-3 hover:border-[#9A7B3E]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded bg-[#102430] font-serif text-sm font-semibold text-[#D4B475]">
                  {adv.monogram}
                </span>
                <div>
                  <span className="block text-sm font-semibold text-[#102430]">{adv.name}</span>
                  <span className="block text-xs text-[#6E5525]">{adv.role}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Related FAQs and insights */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
          <h2 className="font-serif text-xl font-medium text-[#102430] flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
            <span>Related FAQs</span>
          </h2>
          <div className="space-y-4">
            {relatedFaqs.slice(0, 3).map((faq) => (
              <div key={faq.id} className="border-b border-[#E4DFD5] last:border-0 pb-3 last:pb-0">
                <h3 className="text-sm font-semibold text-[#102430]">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-[#4A5E6B] mt-1 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          <Link href="/faqs" className="inline-block text-xs font-semibold text-[#6E5525] underline">
            Browse all FAQs
          </Link>
        </div>

        <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
          <h2 className="font-serif text-xl font-medium text-[#102430] flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
            <span>Related Legal Insights</span>
          </h2>
          {relatedInsights.length > 0 ? (
            <div className="space-y-3">
              {relatedInsights.map((ins) => (
                <Link
                  key={ins.id}
                  href={`/insights/${ins.slug}`}
                  className="block rounded border border-[#E4DFD5] p-3.5 hover:border-[#9A7B3E]"
                >
                  <span className="text-xs text-[#6E5525] font-medium">
                    By {ins.authorName} · {ins.readingTimeMinutes} min read
                  </span>
                  <h3 className="text-sm font-semibold text-[#102430] mt-1">{ins.title}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4A5E6B]">
              Browse our full Legal Insights library written by the firm&apos;s advocates.
            </p>
          )}
          <Link
            href="/insights"
            className="inline-block text-xs font-semibold text-[#6E5525] underline"
          >
            View all Legal Insights
          </Link>
        </div>
      </section>

      {/* 7. Bottom CTA block (area pre-selected) */}
      <section className="rounded-lg border border-[#E4DFD5] bg-[#102430] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl font-medium">
            Request a consultation on {area.name}
          </h2>
          <p className="text-sm text-[#D6D9DC]">
            Submit a confidential request in under two minutes or contact our Nakuru office.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/request-consultation?area=${encodeURIComponent(area.slug)}`}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded bg-[#9A7B3E] text-white text-sm font-semibold hover:bg-[#846832]"
          >
            <span>Request a consultation</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <TrackedWhatsAppButton
            areaName={area.name}
            areaSlug={area.slug}
            page={`/areas-of-practice/${area.slug}`}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded border border-white/25 bg-[#173242] text-white text-sm font-semibold"
          />
          <TrackedCallButton
            areaSlug={area.slug}
            page={`/areas-of-practice/${area.slug}`}
            label="Call"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded border border-white/25 text-white text-sm font-semibold"
          />
        </div>
      </section>

      {/* 8. Disclaimer */}
      <section className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </section>
    </div>
  );
}
