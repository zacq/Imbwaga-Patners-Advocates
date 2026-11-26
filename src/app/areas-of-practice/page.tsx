import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readStore } from "@/lib/store";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import { getAreaImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Areas of Practice",
  description:
    "Twelve areas of legal practice at Imbwaga, Yogo & Partners Advocates in Nakuru, from Land & Conveyancing and Succession to Commercial Litigation and Criminal Defence.",
};

export const dynamic = "force-dynamic";

export default function AreasOfPracticeIndexPage() {
  const store = readStore();
  const areas = store.practiceAreas.filter((a) => a.status === "published");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E4DFD5] pb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Areas of Practice
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          Matters our firm handles in Nakuru
        </h1>
        <p className="text-base text-[#3D5260] max-w-3xl leading-relaxed">
          Each practice page explains who the service is for, common matters we handle, typical
          procedural steps, and the documents to bring to a first consultation.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => {
          const img = getAreaImage(area.slug);
          return (
            <Link
              key={area.id}
              href={`/areas-of-practice/${area.slug}`}
              className="group rounded-lg border border-[#E4DFD5] bg-white overflow-hidden hover:border-[#9A7B3E] hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 w-full border-b border-[#E4DFD5]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded bg-[#102430]/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-[#E5C98B]">
                    AREA {String(area.number).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5 space-y-2.5">
                  <h2 className="font-serif text-xl font-medium text-[#102430] group-hover:text-[#6E5525]">
                    {area.name}
                  </h2>
                  <p className="text-sm text-[#4A5E6B] leading-relaxed">{area.summary}</p>
                </div>
              </div>
              <div className="mx-5 mb-5 pt-4 border-t border-[#E4DFD5] flex items-center justify-between text-xs font-semibold text-[#102430]">
                <span>View process &amp; documents</span>
                <ArrowRight
                  className="h-4 w-4 text-[#9A7B3E] group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </div>
  );
}
