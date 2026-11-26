import Link from "next/link";
import { MapPin, Clock, Phone, Mail, ShieldCheck } from "lucide-react";
import { FIRM_CONTACT, SITE_DISCLAIMER } from "@/lib/compliance";

export function Footer() {
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Gate+House+Mburu+Gichua+Road+Nakuru";

  return (
    <footer className="bg-[#102430] text-[#E6E2D8] border-t border-[#1E3B4D]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div>
            <p className="font-serif text-xl font-semibold text-white">
              {FIRM_CONTACT.name}
            </p>
            <p className="text-sm text-[#B7C2C9] mt-1">
              Practising in Nakuru since {FIRM_CONTACT.foundedYear}. Languages of business:{" "}
              {FIRM_CONTACT.languages}.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm text-[#D6D9DC]">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#D4B475] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {FIRM_CONTACT.address}{" "}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#D4B475] hover:text-white ml-1"
                >
                  Directions
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-[#D4B475] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{FIRM_CONTACT.hours}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#D4B475] shrink-0" aria-hidden="true" />
              <a href={FIRM_CONTACT.phoneHref} className="hover:text-white">
                {FIRM_CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#D4B475] shrink-0" aria-hidden="true" />
              <a href={`mailto:${FIRM_CONTACT.email}`} className="hover:text-white">
                {FIRM_CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4B475] mb-3">
            Firm &amp; Practice
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/areas-of-practice" className="hover:text-white">
                Areas of Practice
              </Link>
            </li>
            <li>
              <Link href="/advocates" className="hover:text-white">
                Our Advocates
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About the Firm
              </Link>
            </li>
            <li>
              <Link href="/how-we-work" className="hover:text-white">
                How We Work
              </Link>
            </li>
            <li>
              <Link href="/insights" className="hover:text-white">
                Legal Insights
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:text-white">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4B475] mb-3">
            Client Intake &amp; Governance
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/request-consultation" className="hover:text-white">
                Request a Consultation
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white">
                Careers &amp; Pupillage
              </Link>
            </li>
            <li>
              <Link href="/legal#disclaimer" className="hover:text-white">
                Website Disclaimer
              </Link>
            </li>
            <li>
              <Link href="/legal#privacy" className="hover:text-white">
                Privacy Notice (DPA 2019)
              </Link>
            </li>
            <li>
              <Link href="/legal#terms" className="hover:text-white">
                Terms of Use
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-[#B7C2C9] hover:text-white"
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Staff CMS &amp; Inbox
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Site-wide CP-4 Disclaimer */}
      <div className="border-t border-[#1E3B4D] bg-[#0B1922]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 space-y-2">
          <p className="text-xs leading-relaxed text-[#B7C2C9]">
            <strong className="text-[#E6E2D8]">Disclaimer:</strong> {SITE_DISCLAIMER}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8FA0AB]">
            <span>
              &copy; {new Date().getFullYear()} {FIRM_CONTACT.name}. All rights reserved.
            </span>
            <span>
              Published in compliance with the Advocates (Marketing and Advertising) Rules, 2014.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
