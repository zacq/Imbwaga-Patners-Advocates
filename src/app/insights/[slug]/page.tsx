import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { readStore } from "@/lib/store";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import { getAreaImage } from "@/lib/images";
import { PageViewTracker, TrackedWhatsAppButton } from "@/components/TrackedLinks";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = readStore();
  const ins = store.insights.find((i) => i.slug === slug && i.status === "published");
  if (!ins) return { title: "Legal Insight" };
  return {
    title: ins.title,
    description: ins.excerpt,
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = readStore();
  const ins = store.insights.find((i) => i.slug === slug && i.status === "published");

  if (!ins) {
    notFound();
  }

  const primaryAreaSlug = ins.areaTags[0];
  const primaryArea = store.practiceAreas.find((a) => a.slug === primaryAreaSlug);
  const authorAdvocate = store.advocates.find((a) => a.id === ins.authorId);
  const coverImage = getAreaImage(primaryAreaSlug);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-8">
      <PageViewTracker eventName="insight_read" areaSlug={primaryAreaSlug} />

      <Link
        href="/insights"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3D5260] hover:text-[#102430]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>All Legal Insights</span>
      </Link>

      <header className="space-y-4 border-b border-[#E4DFD5] pb-6">
        {primaryArea && (
          <Link
            href={`/areas-of-practice/${primaryArea.slug}`}
            className="inline-block rounded bg-[#FAF8F4] border border-[#E4DFD5] px-3 py-1 text-xs font-semibold text-[#6E5525] hover:border-[#9A7B3E]"
          >
            {primaryArea.name}
          </Link>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430] leading-tight">
          {ins.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4A5E6B]">
          <div>
            By{" "}
            {authorAdvocate ? (
              <Link
                href={`/advocates/${authorAdvocate.slug}`}
                className="font-semibold text-[#102430] underline decoration-[#9A7B3E] underline-offset-4"
              >
                {ins.authorName}
              </Link>
            ) : (
              <strong className="text-[#102430]">{ins.authorName}</strong>
            )}
            , {ins.authorProfession}
          </div>
          <span>·</span>
          <span>Published {ins.publishedAt}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-[#9A7B3E]" aria-hidden="true" />
            {ins.readingTimeMinutes} min read
          </span>
        </div>
      </header>

      <div className="relative h-56 sm:h-72 w-full rounded-lg overflow-hidden border border-[#E4DFD5]">
        <Image
          src={coverImage.src}
          alt={coverImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="space-y-5 text-base leading-relaxed text-[#243946]">
        {ins.body.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      <section className="rounded-lg border border-[#E4DFD5] bg-[#102430] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-medium">Need advice on a specific matter?</h2>
          <p className="text-sm text-[#D6D9DC] mt-1">
            Request a confidential consultation with our Nakuru chambers.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={
              primaryArea
                ? `/request-consultation?area=${encodeURIComponent(primaryArea.slug)}`
                : "/request-consultation"
            }
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded bg-[#9A7B3E] text-white text-sm font-semibold hover:bg-[#846832]"
          >
            <span>Request consultation</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <TrackedWhatsAppButton
            areaName={primaryArea?.name}
            areaSlug={primaryArea?.slug}
            page={`/insights/${ins.slug}`}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded border border-white/25 bg-[#173242] text-white text-sm font-semibold"
          />
        </div>
      </section>

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </article>
  );
}
