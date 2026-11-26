import Link from "next/link";
import { ArrowRight, MapPin, Clock, Languages, ShieldCheck, BookOpen } from "lucide-react";
import { readStore } from "@/lib/store";
import { FIRM_CONTACT, SITE_DISCLAIMER } from "@/lib/compliance";
import { TrackedWhatsAppButton, TrackedCallButton } from "@/components/TrackedLinks";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const store = readStore();
  const publishedAreas = store.practiceAreas.filter((a) => a.status === "published");
  const latestInsights = store.insights
    .filter((i) => i.status === "published")
    .slice(0, 3);
  const publishedAdvocates = store.advocates.filter((a) => a.status === "published");

  const steps = [
    {
      num: "01",
      title: "Enquiry",
      text: "Submit a brief, non-sensitive summary by form, WhatsApp, or phone.",
    },
    {
      num: "02",
      title: "Conflict check",
      text: "We screen the other party's name to confirm we can act confidentially.",
    },
    {
      num: "03",
      title: "Consultation",
      text: "Meet at Gate House, Nakuru or virtually at a confirmed time.",
    },
    {
      num: "04",
      title: "Engagement",
      text: "Receive a written engagement letter explaining scope and statutory fees.",
    },
  ];

  return (
    <div>
      {/* FR-5 Hero */}
      <section className="border-b border-[#E4DFD5] bg-[#102430] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20 grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9A7B3E]/50 bg-[#173242] px-3.5 py-1 text-xs font-medium text-[#E5C98B]">
              <span>Nakuru · Practising since {FIRM_CONTACT.foundedYear}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15]">
              {store.firm.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-[#D6D9DC] max-w-2xl leading-relaxed">
              {store.firm.heroSubline}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
              <Link
                href="/request-consultation"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded bg-[#9A7B3E] text-white text-sm font-semibold hover:bg-[#846832] transition-colors"
              >
                <span>Request a consultation</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <TrackedWhatsAppButton
                page="/"
                label="WhatsApp the firm"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded border border-white/25 bg-[#173242] text-white text-sm font-semibold hover:bg-[#1F4257] transition-colors"
              />
              <TrackedCallButton
                page="/"
                label={`Call ${FIRM_CONTACT.phoneDisplay}`}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded border border-white/25 bg-transparent text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              />
            </div>

            <p className="text-xs text-[#9FB0BA] max-w-2xl leading-relaxed">
              Gate House, 6th Floor, Suite 603, Mburu Gichua Road, Nakuru · Consultations in{" "}
              {store.firm.languages}.
            </p>
          </div>

          {/* Architectural Legal Card (no advocate photos per Rule 5(2)(b)) */}
          <div className="lg:col-span-4 rounded-lg border border-[#244357] bg-[#152E3D] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#244357] pb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4B475]">
                Nakuru Chambers
              </span>
              <ShieldCheck className="h-5 w-5 text-[#D4B475]" aria-hidden="true" />
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-[#9FB0BA]">Office</dt>
                <dd className="text-white mt-0.5">{FIRM_CONTACT.address}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-[#9FB0BA]">Hours</dt>
                <dd className="text-white mt-0.5">{store.firm.hours}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-[#9FB0BA]">
                  Advocates ({publishedAdvocates.length})
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {publishedAdvocates.map((adv) => (
                    <Link
                      key={adv.id}
                      href={`/advocates/${adv.slug}`}
                      className="inline-flex items-center gap-2 rounded border border-[#2C4F66] bg-[#102430] px-2.5 py-1.5 text-xs text-white hover:border-[#D4B475]"
                    >
                      <span className="font-serif font-semibold text-[#D4B475]">
                        {adv.monogram}
                      </span>
                      <span>{adv.name}</span>
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* FR-6 Areas of Practice Grid (12 tiles) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
              Areas of Practice
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#102430] mt-1">
              Twelve areas of Kenyan law
            </h2>
            <p className="text-sm text-[#3D5260] mt-2 max-w-2xl">
              Select an area below to read who it serves, the matters the firm handles, the typical
              process, and documents to bring to a first meeting.
            </p>
          </div>
          <Link
            href="/areas-of-practice"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#102430] hover:text-[#6E5525] shrink-0"
          >
            <span>View all areas</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publishedAreas.map((area) => (
            <Link
              key={area.id}
              href={`/areas-of-practice/${area.slug}`}
              className="group rounded-lg border border-[#E4DFD5] bg-white p-5 hover:border-[#9A7B3E] hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#6E5525] font-semibold">
                  <span>{String(area.number).padStart(2, "0")}</span>
                  <ArrowRight
                    className="h-4 w-4 text-[#9FB0BA] group-hover:text-[#9A7B3E] group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#102430] mt-2 group-hover:text-[#6E5525]">
                  {area.name}
                </h3>
                <p className="text-sm text-[#4A5E6B] mt-2 leading-relaxed line-clamp-3">
                  {area.summary}
                </p>
              </div>
              <span className="mt-4 inline-block text-xs font-semibold text-[#102430] underline decoration-[#E4DFD5] group-hover:decoration-[#9A7B3E] underline-offset-4">
                Read process &amp; documents
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FR-7 How we work with you strip */}
      <section className="border-y border-[#E4DFD5] bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
                How We Work With You
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#102430] mt-1">
                From confidential enquiry to engagement
              </h2>
            </div>
            <Link
              href="/how-we-work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#102430] hover:text-[#6E5525]"
            >
              <span>Full client process &amp; fees basis</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-lg border border-[#E4DFD5] bg-[#FAF8F4] p-5 space-y-2"
              >
                <span className="font-serif text-xl font-semibold text-[#9A7B3E]">{step.num}</span>
                <h3 className="font-semibold text-base text-[#102430]">{step.title}</h3>
                <p className="text-sm text-[#4A5E6B] leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FR-8 Office block + FR-9 Latest insights */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16 grid gap-10 lg:grid-cols-12">
        {/* Office Block */}
        <div className="lg:col-span-5 rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
              Visit Our Office
            </p>
            <h2 className="font-serif text-2xl font-medium text-[#102430]">
              Gate House, Nakuru
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

            {/* Clean lightweight SVG map card for fast LCP under 2.5s */}
            <div className="rounded border border-[#E4DFD5] bg-[#FAF8F4] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#102430]">
                  Nakuru CBD · Mburu Gichua Road
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#102430] text-white">
                  6th Floor, Suite 603
                </span>
              </div>
              <p className="text-xs text-[#4A5E6B]">
                Located along Mburu Gichua Road in Nakuru Town, accessible from the Nakuru Law Courts
                and Lands Registry.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Gate+House+Mburu+Gichua+Road+Nakuru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E5525] underline"
              >
                Open in Google Maps
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[48px] px-5 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B]"
            >
              Contact &amp; Directions
            </Link>
            <Link
              href="/request-consultation"
              className="inline-flex items-center justify-center min-h-[48px] px-5 rounded border border-[#E4DFD5] bg-[#FAF8F4] text-[#102430] text-sm font-semibold hover:border-[#9A7B3E]"
            >
              Request Consultation
            </Link>
          </div>
        </div>

        {/* Latest Insights (3) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
                Legal Insights
              </p>
              <h2 className="font-serif text-2xl font-medium text-[#102430] mt-1">
                Articles by our advocates
              </h2>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#102430] hover:text-[#6E5525]"
            >
              <span>All insights</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-4">
            {latestInsights.map((ins) => (
              <Link
                key={ins.id}
                href={`/insights/${ins.slug}`}
                className="block rounded-lg border border-[#E4DFD5] bg-white p-5 hover:border-[#9A7B3E] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5B6D78]">
                  <span className="inline-flex items-center gap-1 font-medium text-[#6E5525]">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    {ins.readingTimeMinutes} min read
                  </span>
                  <span>·</span>
                  <span>{ins.publishedAt}</span>
                  <span>·</span>
                  <span>
                    By {ins.authorName}, {ins.authorProfession}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-medium text-[#102430] mt-2">
                  {ins.title}
                </h3>
                <p className="text-sm text-[#4A5E6B] mt-1.5 leading-relaxed">{ins.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Disclaimer Band */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
          <strong className="text-[#102430]">Notice:</strong> {SITE_DISCLAIMER}
        </div>
      </section>
    </div>
  );
}
