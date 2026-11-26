"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Upload } from "lucide-react";
import type { CareerOpening } from "@/lib/types";

export function CareerApplicationForm({ openings }: { openings: CareerOpening[] }) {
  const [openingId, setOpeningId] = useState(openings[0]?.id || "");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [cvSizeLabel, setCvSizeLabel] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const chosen = openings.find((o) => o.id === openingId);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "career",
          clientName,
          phone,
          email,
          areaSlug: "careers",
          openingId,
          openingTitle: chosen?.title || "General Application",
          summary: summary || `Application for ${chosen?.title || "Legal Position"}`,
          cvFileName: cvFileName || "CV_Attached.pdf",
          cvSizeLabel,
          consent,
          sourcePage: "/careers",
          website_url: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not submit application.");
      } else {
        setSubmittedRef(data.reference);
      }
    } catch {
      setError("Network error while submitting application.");
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
              Application Received
            </h3>
            <p className="text-sm text-[#3D5260] mt-1">
              Thank you for applying to Imbwaga, Yogo &amp; Partners Advocates. Our office will
              review your application and contact shortlisted candidates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
      <h2 className="font-serif text-2xl font-medium text-[#102430]">
        Submit a Pupillage or Career Application
      </h2>

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

      <div>
        <label htmlFor="car-role" className="block text-sm font-semibold text-[#102430] mb-1">
          Position / Intake *
        </label>
        <select
          id="car-role"
          value={openingId}
          onChange={(e) => setOpeningId(e.target.value)}
          className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3 text-base"
        >
          {openings.map((op) => (
            <option key={op.id} value={op.id}>
              {op.title} ({op.type})
            </option>
          ))}
          <option value="speculative">Speculative Legal / Pupillage Application</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="car-name" className="block text-sm font-semibold text-[#102430] mb-1">
            Full name *
          </label>
          <input
            id="car-name"
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="car-phone" className="block text-sm font-semibold text-[#102430] mb-1">
            Phone number *
          </label>
          <input
            id="car-phone"
            type="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-base"
          />
        </div>
      </div>

      <div>
        <label htmlFor="car-email" className="block text-sm font-semibold text-[#102430] mb-1">
          Email address *
        </label>
        <input
          id="car-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-base"
        />
      </div>

      <div>
        <label htmlFor="car-cv" className="block text-sm font-semibold text-[#102430] mb-1">
          Upload CV (PDF or DOCX) *
        </label>
        <label
          htmlFor="car-cv"
          className="flex items-center gap-3 min-h-[52px] rounded border border-dashed border-[#9A7B3E] bg-[#FAF8F4] px-4 cursor-pointer text-sm text-[#3D5260]"
        >
          <Upload className="h-4 w-4 text-[#9A7B3E]" aria-hidden="true" />
          <span>{cvFileName ? `${cvFileName} (${cvSizeLabel})` : "Choose CV file..."}</span>
          <input
            id="car-cv"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCvFileName(file.name);
                setCvSizeLabel(`${Math.max(1, Math.round(file.size / 1024))} KB`);
              }
            }}
          />
        </label>
      </div>

      <div>
        <label htmlFor="car-note" className="block text-sm font-semibold text-[#102430] mb-1">
          Cover note (KSL admission year / qualifications)
        </label>
        <textarea
          id="car-note"
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
          I consent to the firm processing my recruitment application under the{" "}
          <Link href="/legal#privacy" className="underline font-semibold text-[#102430]">
            Privacy Notice (Kenya Data Protection Act, 2019)
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[48px] px-6 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B] disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
