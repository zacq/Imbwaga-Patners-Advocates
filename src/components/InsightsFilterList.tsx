"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Insight, PracticeArea } from "@/lib/types";
import { getAreaImage } from "@/lib/images";

export function InsightsFilterList({
  insights,
  areas,
}: {
  insights: Insight[];
  areas: PracticeArea[];
}) {
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const filtered =
    selectedArea === "all"
      ? insights
      : insights.filter((i) => i.areaTags.includes(selectedArea));

  const areaNameMap = new Map(areas.map((a) => [a.slug, a.name]));

  return (
    <div className="space-y-8">
      {/* Area Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedArea("all")}
          className={`min-h-[40px] px-3.5 rounded-full text-xs font-semibold border transition-colors ${
            selectedArea === "all"
              ? "bg-[#102430] text-white border-[#102430]"
              : "bg-white text-[#3D5260] border-[#E4DFD5] hover:border-[#9A7B3E]"
          }`}
        >
          All areas ({insights.length})
        </button>
        {areas
          .filter((a) => insights.some((i) => i.areaTags.includes(a.slug)))
          .map((area) => (
            <button
              key={area.slug}
              type="button"
              onClick={() => setSelectedArea(area.slug)}
              className={`min-h-[40px] px-3.5 rounded-full text-xs font-semibold border transition-colors ${
                selectedArea === area.slug
                  ? "bg-[#102430] text-white border-[#102430]"
                  : "bg-white text-[#3D5260] border-[#E4DFD5] hover:border-[#9A7B3E]"
              }`}
            >
              {area.name}
            </button>
          ))}
      </div>

      {/* Articles */}
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((ins) => {
          const cover = getAreaImage(ins.areaTags[0]);
          return (
            <Link
              key={ins.id}
              href={`/insights/${ins.slug}`}
              className="group rounded-lg border border-[#E4DFD5] bg-white overflow-hidden hover:border-[#9A7B3E] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full border-b border-[#E4DFD5]">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5525] font-medium">
                    {ins.areaTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[#FAF8F4] border border-[#E4DFD5] px-2.5 py-0.5"
                      >
                        {areaNameMap.get(tag) || tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-serif text-xl font-medium text-[#102430] group-hover:text-[#6E5525]">
                    {ins.title}
                  </h2>
                  <p className="text-sm text-[#4A5E6B] leading-relaxed">{ins.excerpt}</p>
                </div>
              </div>

              <div className="mx-6 mb-6 pt-4 border-t border-[#E4DFD5] flex items-center justify-between text-xs text-[#5B6D78]">
                <div>
                  <span className="font-semibold text-[#102430]">{ins.authorName}</span>
                  <span className="block">{ins.authorProfession}</span>
                </div>
                <span className="inline-flex items-center gap-1 font-semibold text-[#102430]">
                  <BookOpen className="h-3.5 w-3.5 text-[#9A7B3E]" aria-hidden="true" />
                  {ins.readingTimeMinutes} min · {ins.publishedAt}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
