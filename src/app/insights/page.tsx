import type { Metadata } from "next";
import { readStore } from "@/lib/store";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import { InsightsFilterList } from "@/components/InsightsFilterList";

export const metadata: Metadata = {
  title: "Legal Insights",
  description:
    "Plain-language legal articles written by advocates at Imbwaga, Yogo & Partners Advocates in Nakuru.",
};

export const dynamic = "force-dynamic";

export default function InsightsPage() {
  const store = readStore();
  const publishedInsights = store.insights.filter((i) => i.status === "published");
  const publishedAreas = store.practiceAreas.filter((a) => a.status === "published");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E4DFD5] pb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Legal Insights
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          Legal briefings from our advocates
        </h1>
        <p className="text-base text-[#3D5260] max-w-3xl leading-relaxed">
          General legal information authored by advocates of the firm in accordance with Rule 8 of
          the Advocates (Marketing and Advertising) Rules, 2014.
        </p>
      </div>

      <InsightsFilterList insights={publishedInsights} areas={publishedAreas} />

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </div>
  );
}
