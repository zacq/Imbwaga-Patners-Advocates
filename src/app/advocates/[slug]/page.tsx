import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, GraduationCap, Award, BookOpen } from "lucide-react";
import { readStore } from "@/lib/store";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import { TrackedWhatsAppButton, TrackedCallButton } from "@/components/TrackedLinks";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = readStore();
  const adv = store.advocates.find((a) => a.slug === slug && a.status === "published");
  if (!adv) return { title: "Advocate Profile" };
  return {
    title: `${adv.name} — ${adv.role}`,
    description: `${adv.name} (${adv.role}) at Imbwaga, Yogo & Partners Advocates, Nakuru. Admitted ${adv.admissionDate}.`,
  };
}

export default async function AdvocateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = readStore();
  const adv = store.advocates.find((a) => a.slug === slug && a.status === "published");

  if (!adv) {
    notFound();
  }

  const areas = store.practiceAreas.filter((pa) => adv.areas.includes(pa.slug));
  const authoredInsights = store.insights.filter(
    (ins) => ins.authorId === adv.id && ins.status === "published"
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-10">
      <Link
        href="/advocates"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3D5260] hover:text-[#102430]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>All advocates</span>
      </Link>

      {/* Monogram Header */}
      <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-[#9A7B3E]/40 bg-[#102430] font-serif text-3xl font-semibold text-[#D4B475]"
          >
            {adv.monogram}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
              {adv.role}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430] mt-1">
              {adv.name}
            </h1>
            <p className="text-sm text-[#4A5E6B] mt-2 inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#9A7B3E]" aria-hidden="true" />
              <span>Date of Admission to the Roll of Advocates: {adv.admissionDate}</span>
            </p>
          </div>
        </div>

        <Link
          href={`/request-consultation?advocate=${encodeURIComponent(adv.slug)}`}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B] shrink-0"
        >
          <span>Request a consultation</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <p className="text-base text-[#3D5260] leading-relaxed">{adv.bioNote}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
          <h2 className="font-serif text-xl font-medium text-[#102430] flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
            <span>Academic &amp; Professional Qualifications</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#3D5260]">
            {adv.qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
          <h2 className="font-serif text-xl font-medium text-[#102430] flex items-center gap-2">
            <Award className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
            <span>Professional Memberships</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#3D5260]">
            {adv.memberships.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
        <h2 className="font-serif text-xl font-medium text-[#102430] flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
          <span>Published Articles &amp; Legal Education Contributions</span>
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#3D5260]">
          {adv.publications.map((pub) => (
            <li key={pub}>{pub}</li>
          ))}
        </ul>

        {authoredInsights.length > 0 && (
          <div className="pt-4 border-t border-[#E4DFD5] space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E5525]">
              Legal Insights on this Site
            </p>
            <div className="flex flex-wrap gap-2">
              {authoredInsights.map((ins) => (
                <Link
                  key={ins.id}
                  href={`/insights/${ins.slug}`}
                  className="text-sm text-[#102430] underline decoration-[#9A7B3E] underline-offset-4 hover:text-[#6E5525]"
                >
                  {ins.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">
          Areas of Practice Handled
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area.id}
              href={`/areas-of-practice/${area.slug}`}
              className="rounded-lg border border-[#E4DFD5] bg-white p-4 hover:border-[#9A7B3E] transition-colors flex items-center justify-between gap-2"
            >
              <span className="text-sm font-medium text-[#102430]">{area.name}</span>
              <ArrowRight className="h-4 w-4 text-[#9A7B3E] shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#E4DFD5] bg-[#102430] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-medium">
            Request a consultation with {adv.name}
          </h2>
          <p className="text-sm text-[#D6D9DC] mt-1">
            All consultations follow a conflict check prior to confirmation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/request-consultation?advocate=${encodeURIComponent(adv.slug)}`}
            className="inline-flex items-center justify-center min-h-[48px] px-5 rounded bg-[#9A7B3E] text-white text-sm font-semibold hover:bg-[#846832]"
          >
            Request Consultation
          </Link>
          <TrackedWhatsAppButton
            page={`/advocates/${adv.slug}`}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded border border-white/25 bg-[#173242] text-white text-sm font-semibold"
          />
          <TrackedCallButton
            page={`/advocates/${adv.slug}`}
            label="Call"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded border border-white/25 text-white text-sm font-semibold"
          />
        </div>
      </section>

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </div>
  );
}
