import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, BookOpen, Calendar } from "lucide-react";
import { readStore } from "@/lib/store";
import { SITE_DISCLAIMER } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Our Advocates",
  description:
    "Meet the advocates at Imbwaga, Yogo & Partners Advocates in Nakuru: dates of admission, qualifications, professional memberships, and published legal articles.",
};

export const dynamic = "force-dynamic";

export default function AdvocatesPage() {
  const store = readStore();
  const advocates = store.advocates.filter((a) => a.status === "published");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E4DFD5] pb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Our Advocates
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          Advocates of the High Court of Kenya
        </h1>
        <p className="text-base text-[#3D5260] max-w-3xl leading-relaxed">
          In accordance with Rule 5 of the Advocates (Marketing and Advertising) Rules, 2014,
          advocate profiles display verified dates of admission, post-admission qualifications,
          professional memberships, and published legal contributions without photographs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {advocates.map((adv) => (
          <article
            key={adv.id}
            className="rounded-lg border border-[#E4DFD5] bg-white p-6 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Monogram name card — zero photos per Rule 5(2)(b) */}
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#9A7B3E]/40 bg-[#102430] font-serif text-xl font-semibold text-[#D4B475]"
                >
                  {adv.monogram}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-[#102430]">{adv.name}</h2>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6E5525]">
                    {adv.role}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#3D5260] leading-relaxed">{adv.bioNote}</p>

              <div className="space-y-2.5 pt-2 border-t border-[#E4DFD5] text-xs text-[#3D5260]">
                <p className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#9A7B3E] shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#102430]">Admitted:</strong> {adv.admissionDate}
                  </span>
                </p>
                <div className="flex items-start gap-2">
                  <GraduationCap
                    className="h-3.5 w-3.5 text-[#9A7B3E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <strong className="text-[#102430]">Qualifications:</strong>
                    <ul className="mt-1 space-y-0.5 text-[#4A5E6B]">
                      {adv.qualifications.slice(0, 2).map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-[#9A7B3E] shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-[#102430]">Published contributions:</strong>{" "}
                    {adv.publications.length}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/advocates/${adv.slug}`}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B]"
              >
                <span>View full profile</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/request-consultation?advocate=${encodeURIComponent(adv.slug)}`}
                className="inline-flex items-center justify-center min-h-[44px] px-4 rounded border border-[#E4DFD5] text-xs font-semibold text-[#102430] hover:border-[#9A7B3E]"
              >
                Request consultation with {adv.name}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </div>
  );
}
