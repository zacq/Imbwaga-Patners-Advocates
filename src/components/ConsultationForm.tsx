"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { PracticeArea, Advocate } from "@/lib/types";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import { trackEvent } from "@/lib/analytics";

export function ConsultationForm({
  areas,
  advocates,
  initialAreaSlug,
  initialAdvocateSlug,
}: {
  areas: PracticeArea[];
  advocates: Advocate[];
  initialAreaSlug?: string;
  initialAdvocateSlug?: string;
}) {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [areaSlug, setAreaSlug] = useState(
    areas.some((a) => a.slug === initialAreaSlug)
      ? initialAreaSlug!
      : areas[0]?.slug || "land-property-conveyancing"
  );
  const [preferredAdvocateSlug, setPreferredAdvocateSlug] = useState(
    advocates.some((a) => a.slug === initialAdvocateSlug) ? initialAdvocateSlug! : ""
  );
  const [otherParty, setOtherParty] = useState("");
  const [summary, setSummary] = useState("");
  const [slot1, setSlot1] = useState("");
  const [slot2, setSlot2] = useState("");
  const [mode, setMode] = useState<"In-person (Gate House, Nakuru)" | "Virtual (Phone / Video)">(
    "In-person (Gate House, Nakuru)"
  );
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    reference: string;
    acknowledgement: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation",
          clientName,
          phone,
          email,
          areaSlug,
          preferredAdvocateSlug: preferredAdvocateSlug || undefined,
          otherParty,
          summary,
          slot1,
          slot2,
          mode,
          consent,
          sourcePage: `/request-consultation${initialAreaSlug ? `?area=${initialAreaSlug}` : ""}`,
          website_url: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Unable to submit request. Please check required fields.");
      } else {
        trackEvent("consultation_request", {
          page: "/request-consultation",
          areaSlug,
        });
        setSubmitted({
          reference: data.reference,
          acknowledgement: data.acknowledgement,
        });
      }
    } catch {
      setError("Network error while sending request. Please call +254 726 111 198.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-[#1B5E3F]/40 bg-white p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-7 w-7 text-[#1B5E3F] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1B5E3F]">
              Reference: {submitted.reference}
            </p>
            <h2 className="font-serif text-2xl font-medium text-[#102430]">
              Consultation Request Received
            </h2>
            <p className="text-sm sm:text-base text-[#3D5260] leading-relaxed">
              {submitted.acknowledgement}
            </p>
          </div>
        </div>

        <div className="rounded border border-[#E4DFD5] bg-[#FAF8F4] p-4 text-xs sm:text-sm text-[#3D5260] space-y-1.5">
          <p className="font-semibold text-[#102430]">What happens next:</p>
          <p>1. Our front office and assigned advocate receive an immediate alert.</p>
          <p>
            2. We run a mandatory conflict check using the names provided before confirming a
            consultation time.
          </p>
          <p>
            3. Any applicable consultation fee is explained under the Advocates Remuneration Order
            when we contact you.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] px-5 rounded bg-[#102430] text-white text-sm font-semibold"
          >
            Return to Home
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmitted(null);
              setSummary("");
              setOtherParty("");
            }}
            className="inline-flex items-center justify-center min-h-[48px] px-5 rounded border border-[#E4DFD5] text-sm font-semibold text-[#102430]"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#E4DFD5] bg-white p-5 sm:p-8 space-y-6"
    >
      {/* Honeypot for bot protection (SC-4) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">Leave blank</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="rounded border border-[#9A7B3E]/40 bg-[#FAF8F4] p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-[#9A7B3E] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs sm:text-sm text-[#3D5260] leading-relaxed">
          <strong className="text-[#102430]">Confidentiality notice:</strong> Please give only a
          brief outline. <strong>Do not include sensitive details, ID numbers, or documents</strong>{" "}
          until a conflict check is cleared and engagement is confirmed.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="clientName" className="block text-sm font-semibold text-[#102430] mb-1.5">
            Full name <span className="text-red-700">*</span>
          </label>
          <input
            id="clientName"
            type="text"
            required
            autoComplete="name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Jane Wanjiru"
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3.5 text-base text-[#102430]"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#102430] mb-1.5">
            Phone number (WhatsApp-capable) <span className="text-red-700">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+254 7XX XXX XXX"
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3.5 text-base text-[#102430]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#102430] mb-1.5">
            Email address <span className="text-xs font-normal text-[#5B6D78]">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3.5 text-base text-[#102430]"
          />
        </div>

        <div>
          <label htmlFor="areaSlug" className="block text-sm font-semibold text-[#102430] mb-1.5">
            Area of practice <span className="text-red-700">*</span>
          </label>
          <select
            id="areaSlug"
            value={areaSlug}
            onChange={(e) => setAreaSlug(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3 text-base text-[#102430]"
          >
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="otherParty" className="block text-sm font-semibold text-[#102430] mb-1.5">
            Name of the other party (for conflict check)
          </label>
          <input
            id="otherParty"
            type="text"
            value={otherParty}
            onChange={(e) => setOtherParty(e.target.value)}
            placeholder="Person, company, or 'Not applicable'"
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3.5 text-base text-[#102430]"
          />
        </div>

        <div>
          <label
            htmlFor="preferredAdvocate"
            className="block text-sm font-semibold text-[#102430] mb-1.5"
          >
            Preferred advocate <span className="text-xs font-normal text-[#5B6D78]">(optional)</span>
          </label>
          <select
            id="preferredAdvocate"
            value={preferredAdvocateSlug}
            onChange={(e) => setPreferredAdvocateSlug(e.target.value)}
            className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3 text-base text-[#102430]"
          >
            <option value="">Any available advocate</option>
            {advocates.map((adv) => (
              <option key={adv.slug} value={adv.slug}>
                {adv.name} ({adv.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-semibold text-[#102430] mb-1.5">
          Brief summary of your matter <span className="text-red-700">*</span>
        </label>
        <textarea
          id="summary"
          required
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Briefly state the nature of the matter (without sensitive details or attachments)."
          className="w-full rounded border border-[#D4CEC2] bg-white p-3.5 text-base text-[#102430]"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[#102430]">
          Consultation format &amp; two preferred times
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["In-person (Gate House, Nakuru)", "Virtual (Phone / Video)"] as const).map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 min-h-[48px] rounded border px-4 cursor-pointer text-sm font-medium ${
                mode === opt
                  ? "border-[#102430] bg-[#FAF8F4] text-[#102430]"
                  : "border-[#D4CEC2] bg-white text-[#3D5260]"
              }`}
            >
              <input
                type="radio"
                name="mode"
                value={opt}
                checked={mode === opt}
                onChange={() => setMode(opt)}
                className="h-4 w-4 accent-[#102430]"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          <div>
            <label htmlFor="slot1" className="block text-xs font-semibold text-[#3D5260] mb-1">
              Preferred date &amp; time (Option 1)
            </label>
            <input
              id="slot1"
              type="text"
              value={slot1}
              onChange={(e) => setSlot1(e.target.value)}
              placeholder="e.g. Friday 10:00 AM"
              className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3.5 text-base text-[#102430]"
            />
          </div>
          <div>
            <label htmlFor="slot2" className="block text-xs font-semibold text-[#3D5260] mb-1">
              Preferred date &amp; time (Option 2)
            </label>
            <input
              id="slot2"
              type="text"
              value={slot2}
              onChange={(e) => setSlot2(e.target.value)}
              placeholder="e.g. Monday 2:30 PM"
              className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3.5 text-base text-[#102430]"
            />
          </div>
        </div>
      </fieldset>

      {/* DP-1 Consent */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-[#D4CEC2] accent-[#102430] shrink-0"
        />
        <span className="text-xs sm:text-sm text-[#3D5260] leading-relaxed">
          I consent to Imbwaga, Yogo &amp; Partners Advocates contacting me regarding this request
          and processing my details for conflict checking in accordance with the{" "}
          <Link href="/legal#privacy" className="underline font-semibold text-[#102430]">
            Privacy Notice (Kenya Data Protection Act, 2019)
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#E4DFD5]">
        <p className="inline-flex items-center gap-2 text-xs text-[#5B6D78]">
          <ShieldCheck className="h-4 w-4 text-[#9A7B3E] shrink-0" aria-hidden="true" />
          <span>Request only — no fees published; confirmed after conflict check.</span>
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="min-h-[52px] px-7 rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B] disabled:opacity-60 transition-colors"
        >
          {submitting ? "Submitting request..." : "Submit Consultation Request"}
        </button>
      </div>

      <p className="text-xs text-[#5B6D78] leading-relaxed">{SITE_DISCLAIMER}</p>
    </form>
  );
}
