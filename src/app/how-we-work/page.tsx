import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, FileText } from "lucide-react";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import { APPROVED_IMAGES } from "@/lib/images";
import { TrackedWhatsAppButton, TrackedCallButton } from "@/components/TrackedLinks";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "How Imbwaga, Yogo & Partners Advocates handles enquiries, conflict checks, consultations, engagement letters, and fees under the Advocates Remuneration Order.",
};

const WORKFLOW_STEPS = [
  {
    step: "1. Confidential Enquiry",
    body: "You reach out using the consultation request form, WhatsApp, or phone (+254 726 111 198). You receive an immediate acknowledgement confirming your request has been logged. Please do not send confidential documents before a conflict check is completed.",
  },
  {
    step: "2. Conflict Check",
    body: "Before confirming any appointment or receiving substantive instructions, we screen the name of the other party (where applicable) against our records. This protects confidentiality and ensures the firm has no conflict of interest.",
  },
  {
    step: "3. Consultation",
    body: "Once cleared, our team contacts you to confirm a date and time—either in person at Gate House, 6th Floor, Suite 603, Mburu Gichua Road, Nakuru, or virtually by phone or video. During the consultation, we review your documents and outline the legal options.",
  },
  {
    step: "4. Engagement Letter",
    body: "If you decide to instruct the firm and we agree to act, we issue a written engagement letter setting out the scope of representation, who will handle the matter, and the agreed communication cadence. An advocate–client relationship begins only upon written confirmation.",
  },
  {
    step: "5. Fees Under the Advocates Remuneration Order",
    body: "We do not publish fee schedules or offer 'free consultations' on this website. Any applicable consultation fee and the fee structure for your instruction are explained clearly when our team contacts you, strictly in accordance with the Advocates Remuneration Order.",
  },
  {
    step: "6. Communication & Updates",
    body: "Clients receive timely updates at every filing, registry step, negotiation milestone, or court appearance, in English or Kiswahili.",
  },
  {
    step: "7. Confidentiality & Data Protection",
    body: "Enquiry details are stored securely with restricted staff access and handled in accordance with advocate–client confidentiality obligations and the Kenya Data Protection Act, 2019.",
  },
];

export default function HowWeWorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-10">
      <div className="grid gap-8 md:grid-cols-12 items-center border-b border-[#E4DFD5] pb-8">
        <div className="md:col-span-7 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
            Client Intake &amp; Engagement
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
            How we work with clients
          </h1>
          <p className="text-base text-[#3D5260] leading-relaxed">
            From your first enquiry to formal engagement, every step follows a structured process
            designed to protect your confidentiality and give you clarity on procedure and fees.
          </p>
        </div>

        <div className="md:col-span-5">
          <div className="relative h-52 rounded-lg overflow-hidden border border-[#E4DFD5]">
            <Image
              src={APPROVED_IMAGES.consultationRoom.src}
              alt={APPROVED_IMAGES.consultationRoom.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {WORKFLOW_STEPS.map((item) => (
          <section
            key={item.step}
            className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-2"
          >
            <h2 className="font-serif text-xl font-medium text-[#102430]">{item.step}</h2>
            <p className="text-sm sm:text-base text-[#3D5260] leading-relaxed">{item.body}</p>
          </section>
        ))}
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[#E4DFD5] bg-[#FAF8F4] p-5 space-y-2">
          <ShieldCheck className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
          <h3 className="font-semibold text-sm text-[#102430]">Conflict Screening First</h3>
          <p className="text-xs text-[#4A5E6B] leading-relaxed">
            If we cannot act due to a conflict, we notify you politely without disclosing any third
            party&apos;s identity.
          </p>
        </div>
        <div className="rounded-lg border border-[#E4DFD5] bg-[#FAF8F4] p-5 space-y-2">
          <FileText className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
          <h3 className="font-semibold text-sm text-[#102430]">Clear Written Scope</h3>
          <p className="text-xs text-[#4A5E6B] leading-relaxed">
            All instructions are documented in a written engagement letter prior to filing or formal
            representation.
          </p>
        </div>
        <div className="rounded-lg border border-[#E4DFD5] bg-[#FAF8F4] p-5 space-y-2">
          <Lock className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
          <h3 className="font-semibold text-sm text-[#102430]">Data Protection Compliance</h3>
          <p className="text-xs text-[#4A5E6B] leading-relaxed">
            Enquiries that do not proceed to engagement are deleted per our retention policy under
            the Data Protection Act, 2019.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[#E4DFD5] bg-[#102430] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-medium">Ready to start a confidential enquiry?</h2>
          <p className="text-sm text-[#D6D9DC]">
            Request a consultation online or reach our Nakuru chambers directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/request-consultation"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded bg-[#9A7B3E] text-white text-sm font-semibold hover:bg-[#846832]"
          >
            <span>Request a consultation</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <TrackedWhatsAppButton
            page="/how-we-work"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded border border-white/25 bg-[#173242] text-white text-sm font-semibold hover:bg-[#1F4257]"
          />
          <TrackedCallButton
            page="/how-we-work"
            label="Call"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 rounded border border-white/25 text-white text-sm font-semibold hover:bg-white/10"
          />
        </div>
      </section>

      <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
        <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
      </div>
    </div>
  );
}
