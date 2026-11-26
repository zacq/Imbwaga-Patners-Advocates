"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ, PracticeArea } from "@/lib/types";

export function FaqsAccordion({ faqs, areas }: { faqs: FAQ[]; areas: PracticeArea[] }) {
  const [group, setGroup] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const areaMap = new Map(areas.map((a) => [a.slug, a.name]));
  const usedGroups = Array.from(new Set(faqs.map((f) => f.areaSlug)));

  const filtered = group === "all" ? faqs : faqs.filter((f) => f.areaSlug === group);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroup("all")}
          className={`min-h-[40px] px-3.5 rounded-full text-xs font-semibold border ${
            group === "all"
              ? "bg-[#102430] text-white border-[#102430]"
              : "bg-white text-[#3D5260] border-[#E4DFD5]"
          }`}
        >
          All FAQs ({faqs.length})
        </button>
        {usedGroups.map((slug) => (
          <button
            key={slug}
            type="button"
            onClick={() => setGroup(slug)}
            className={`min-h-[40px] px-3.5 rounded-full text-xs font-semibold border ${
              group === slug
                ? "bg-[#102430] text-white border-[#102430]"
                : "bg-white text-[#3D5260] border-[#E4DFD5]"
            }`}
          >
            {slug === "general" ? "General & Fees" : areaMap.get(slug) || slug}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-lg border border-[#E4DFD5] bg-white overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full min-h-[56px] px-5 py-4 flex items-center justify-between gap-4 text-left"
              >
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E5525]">
                    {faq.areaSlug === "general"
                      ? "General & First Meeting"
                      : areaMap.get(faq.areaSlug) || faq.areaSlug}
                  </span>
                  <span className="block font-medium text-base text-[#102430] mt-0.5">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-[#6E5525] shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-[#3D5260] leading-relaxed border-t border-[#E4DFD5]/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
