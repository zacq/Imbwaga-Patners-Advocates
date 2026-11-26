import type { Metadata } from "next";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { readStore } from "@/lib/store";
import { CareerApplicationForm } from "@/components/CareerApplicationForm";

export const metadata: Metadata = {
  title: "Careers & Pupillage",
  description:
    "Pupillage, legal internship, and career opportunities at Imbwaga, Yogo & Partners Advocates in Nakuru.",
};

export const dynamic = "force-dynamic";

export default function CareersPage() {
  const store = readStore();
  const openRoles = store.careers.filter((c) => c.isOpen);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E4DFD5] pb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Careers &amp; Pupillage
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          Pupillage &amp; Opportunities in Nakuru
        </h1>
        <p className="text-base text-[#3D5260] max-w-3xl leading-relaxed">
          Imbwaga, Yogo &amp; Partners Advocates welcomes applications from Kenya School of Law
          graduates, legal clerks, and advocates interested in litigation and conveyancing practice
          in Nakuru.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">Current Openings</h2>
        {openRoles.length === 0 ? (
          <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 text-sm text-[#4A5E6B]">
            There are no specific advertised vacancies right now, though speculative pupillage
            applications may be submitted below.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {openRoles.map((role) => (
              <article
                key={role.id}
                className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded bg-[#FAF8F4] border border-[#E4DFD5] px-2.5 py-1 text-xs font-semibold text-[#6E5525]">
                    <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                    {role.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#5B6D78]">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Closes {role.closingDate}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-medium text-[#102430]">{role.title}</h3>
                  <p className="text-xs text-[#5B6D78] mt-1 inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#9A7B3E]" aria-hidden="true" />
                    {role.location}
                  </p>
                </div>

                <p className="text-sm text-[#3D5260] leading-relaxed">{role.summary}</p>

                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#4A5E6B]">
                  {role.requirements.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <CareerApplicationForm openings={openRoles} />
    </div>
  );
}
