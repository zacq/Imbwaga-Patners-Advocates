import type { Metadata } from "next";
import { FIRM_CONTACT, SITE_DISCLAIMER } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Legal, Disclaimer & Privacy Notice",
  description:
    "Website disclaimer, Kenya Data Protection Act 2019 privacy notice, terms of use, and cookie notice for Imbwaga, Yogo & Partners Advocates.",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E4DFD5] pb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Governance &amp; Regulatory Notices
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          Legal, Privacy &amp; Terms
        </h1>
        <p className="text-sm text-[#4A5E6B]">
          Published in accordance with the Advocates (Marketing and Advertising) Rules, 2014 and
          the Kenya Data Protection Act, 2019.
        </p>
      </div>

      <section id="disclaimer" className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">Website Disclaimer</h2>
        <p className="text-sm text-[#3D5260] leading-relaxed">{SITE_DISCLAIMER}</p>
        <p className="text-sm text-[#3D5260] leading-relaxed">
          Articles and FAQs on this website reflect general Kenyan statutory principles at their
          date of publication and may not account for subsequent legislative amendments or the
          specific facts of your matter. You should obtain formal legal advice before acting or
          refraining from acting on any information contained on this site.
        </p>
      </section>

      <section id="privacy" className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">
          Privacy Notice (Kenya Data Protection Act, 2019)
        </h2>
        <p className="text-sm text-[#3D5260] leading-relaxed">
          {FIRM_CONTACT.name} ({FIRM_CONTACT.address}) acts as the data controller for personal data
          submitted through {FIRM_CONTACT.domain}.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#3D5260]">
          <li>
            <strong>Data collected:</strong> Name, telephone number, optional email address, area of
            practice, other party name (solely for conflict screening), preferred appointment times,
            and brief non-sensitive enquiry summary—or CV details submitted under Careers.
          </li>
          <li>
            <strong>Purpose &amp; lawful basis:</strong> To run mandatory professional conflict
            checks, respond to your consultation request or enquiry, or evaluate a career/pupillage
            application, based on your consent and our legitimate/statutory professional duties.
          </li>
          <li>
            <strong>Confidentiality &amp; access:</strong> Submissions are encrypted in transit and
            accessible only to authorized firm partners, advocates, and administrative staff via
            authenticated access.
          </li>
          <li>
            <strong>Retention:</strong> Enquiries that do not result in formal client engagement are
            deleted after 12 months unless a longer statutory retention period applies.
          </li>
          <li>
            <strong>Your rights:</strong> Under the Data Protection Act, 2019, you may request
            access to, correction of, or deletion of your enquiry data by emailing{" "}
            <a href={`mailto:${FIRM_CONTACT.email}`} className="underline text-[#102430]">
              {FIRM_CONTACT.email}
            </a>{" "}
            or calling {FIRM_CONTACT.phoneDisplay}.
          </li>
        </ul>
      </section>

      <section id="terms" className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">Terms of Use</h2>
        <p className="text-sm text-[#3D5260] leading-relaxed">
          By accessing {FIRM_CONTACT.domain}, you agree to use the site solely for lawful purposes
          and not to submit automated spam, malicious payloads, or confidential third-party
          materials through public intake forms. All original text and insights on this website
          remain the intellectual property of {FIRM_CONTACT.name}.
        </p>
      </section>

      <section id="cookies" className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
        <h2 className="font-serif text-2xl font-medium text-[#102430]">Cookie Notice</h2>
        <p className="text-sm text-[#3D5260] leading-relaxed">
          We use strictly necessary session cookies (for staff CMS authentication) and privacy-safe
          aggregate event tracking (page views, WhatsApp clicks, and call button clicks). Analytics
          never record form field inputs, names, phone numbers, or enquiry summaries.
        </p>
      </section>
    </div>
  );
}
