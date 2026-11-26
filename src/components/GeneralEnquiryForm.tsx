"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { PracticeArea } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function GeneralEnquiryForm({ areas }: { areas: PracticeArea[] }) {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [areaSlug, setAreaSlug] = useState(areas[0]?.slug || "general");
  const [otherParty, setOtherParty] = useState("");
  const [summary, setSummary] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enquiry",
          clientName,
          phone,
          email,
          areaSlug,
          otherParty,
          summary,
          consent,
          sourcePage: "/contact",
          website_url: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not send enquiry.");
      } else {
        trackEvent("enquiry_submit", { page: "/contact", areaSlug });
        setSubmittedRef(data.reference);
      }
    } catch {
      setError("Network error. Please call +254 726 111 198.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedRef) {
    return (
      <div className="rounded-lg border border-[#1B5E3F]/40 bg-white p-6 space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-[#1B5E3F] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-[#1B5E3F]">Reference: {submittedRef}</p>
            <h3 className="font-serif text-xl font-medium text-[#102430] mt-1">
              Confidential Enquiry Received
            </h3>
            <p className="text-sm text-[#3D5260] mt-1">
              We have received your request. A member of our team will contact you to confirm a
              time. This does not yet create an advocate–client relationship.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
      <h2 className="font-serif text-2xl font-medium text-[#102430]">
        Send a confidential enquiry
      </h2>
      <p className="text-xs text-[#5B6D78]">
        Do not include confidential documents or sensitive evidence prior to conflict screening.
      </p>

      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      {error && (
        <div role="alert" className="rounded bg-red-50 border border-red-300 px-3 py-2 text-xs text-red-900">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="block text-sm font-semibold text-[#102430] mb-1">
            Full name *
          </label>
          <input
            id="c-name"
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="c-phone" className="block text-sm font-semibold text-[#102430] mb-1">
            Phone (WhatsApp-capable) *
          </label>
          <input
            id="c-phone"
            type="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-base"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="block text-sm font-semibold text-[#102430] mb-1">
            Email (optional)
          </label>
          <input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="c-area" className="block text-sm font-semibold text-[#102430] mb-1">
            Area of practice
          </label>
          <select
            id="c-area"
            value={areaSlug}
            onChange={(e) => setAreaSlug(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3 text-base"
          >
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="c-other" className="block text-sm font-semibold text-[#102430] mb-1">
          Other party name (for conflict check, if applicable)
        </label>
        <input
          id="c-other"
          type="text"
          value={otherParty}
          onChange={(e) => setOtherParty(e.target.value)}
          className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-base"
        />
      </div>

      <div>
        <label htmlFor="c-summary" className="block text-sm font-semibold text-[#102430] mb-1">
          Brief enquiry *
        </label>
        <textarea
          id="c-summary"
          required
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full rounded border border-[#D4CEC2] p-3 text-base"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-5 w-5 accent-[#102430]"
        />
        <span className="text-xs text-[#3D5260]">
          I consent to be contacted and agree to the{" "}
          <Link href="/legal#privacy" className="underline font-semibold text-[#102430]">
            Privacy Notice (Kenya Data Protection Act, 2019)
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto min-h-[48px] px-6 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B] disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Confidential Enquiry"}
      </button>
    </form>
  );
}
