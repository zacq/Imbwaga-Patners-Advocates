import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Languages } from "lucide-react";
import { readStore } from "@/lib/store";
import { FIRM_CONTACT, SITE_DISCLAIMER } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "About the Firm",
  description:
    "Background, professional values, and Nakuru chambers of Imbwaga, Yogo & Partners Advocates, practising since 2017.",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const store = readStore();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-4 border-b border-[#E4DFD5] pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          About the Firm
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          {FIRM_CONTACT.name}
        </h1>
        <p className="text-base sm:text-lg text-[#3D5260] leading-relaxed max-w-3xl">
          {store.firm.aboutIntro}
        </p>
      </div>

      <section className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7 space-y-4">
          <h2 className="font-serif text-2xl font-medium text-[#102430]">
            Practice background in Nakuru
          </h2>
          <p className="text-sm sm:text-base text-[#3D5260] leading-relaxed">
            {store.firm.firmBackground}
          </p>
          <p className="text-sm sm:text-base text-[#3D5260] leading-relaxed">
            Whether advising a family on succession, reviewing a land sale agreement, assisting an
            agricultural cooperative, or appearing before courts and tribunals in Nakuru, our
            advocates maintain direct communication and clear written instructions at every stage.
          </p>
        </div>

        <div className="md:col-span-5 rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
          <h2 className="font-serif text-xl font-medium text-[#102430]">
            Chambers &amp; Business Hours
          </h2>
          <div className="space-y-3 text-sm text-[#3D5260]">
            <p className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#9A7B3E] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{FIRM_CONTACT.address}</span>
            </p>
            <p className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-[#9A7B3E] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{store.firm.hours}</span>
            </p>
            <p className="flex items-start gap-2.5">
              <Languages className="h-4 w-4 text-[#9A7B3E] shrink-0 mt-0.5" aria-hidden="true" />
              <span>Languages of business: {store.firm.languages}</span>
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/advocates"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B]"
            >
              <span>Meet Our Advocates</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/request-consultation"
              className="inline-flex items-center justify-center min-h-[48px] px-4 rounded border border-[#E4DFD5] text-sm font-semibold text-[#102430] hover:border-[#9A7B3E]"
            >
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">
          How we approach client service
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {store.firm.aboutValues.map((val) => (
            <div key={val.title} className="rounded-lg border border-[#E4DFD5] bg-white p-5">
              <h3 className="font-semibold text-base text-[#102430]">{val.title}</h3>
              <p className="text-sm text-[#4A5E6B] mt-2 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </div>
  );
}
