import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, Mail, Languages, ArrowUpRight } from "lucide-react";
import { readStore } from "@/lib/store";
import { FIRM_CONTACT, SITE_DISCLAIMER } from "@/lib/compliance";
import { APPROVED_IMAGES } from "@/lib/images";
import { TrackedWhatsAppButton, TrackedCallButton } from "@/components/TrackedLinks";
import { GeneralEnquiryForm } from "@/components/GeneralEnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Visit or contact Imbwaga, Yogo & Partners Advocates at Gate House, 6th Floor, Suite 603, Mburu Gichua Road, Nakuru. Phone +254 726 111 198, email info@iypadvocates.com.",
};

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const store = readStore();
  const areas = store.practiceAreas.filter((a) => a.status === "published");
  const mapsDirectionsUrl =
    "https://www.google.com/maps/search/?api=1&query=Gate+House+Mburu+Gichua+Road+Nakuru";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-[#E4DFD5] pb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
          Contact Us
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
          Nakuru Chambers &amp; Direct Contacts
        </h1>
        <p className="text-base text-[#3D5260] max-w-2xl">
          Reach us by phone, WhatsApp, email, or confidential enquiry form. Business is conducted
          in English and Kiswahili.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-lg border border-[#E4DFD5] bg-white overflow-hidden">
            <div className="relative h-48 w-full border-b border-[#E4DFD5]">
              <Image
                src={APPROVED_IMAGES.nakuruOffice.src}
                alt={APPROVED_IMAGES.nakuruOffice.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="p-6 space-y-5">
              <h2 className="font-serif text-2xl font-medium text-[#102430]">Office Details</h2>

              <div className="space-y-4 text-sm text-[#3D5260]">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#9A7B3E] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <strong className="block text-[#102430]">Address</strong>
                    <span>{FIRM_CONTACT.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-[#9A7B3E] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <strong className="block text-[#102430]">Business Hours</strong>
                    <span>{store.firm.hours}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Languages className="h-4 w-4 text-[#9A7B3E] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <strong className="block text-[#102430]">Languages of Business</strong>
                    <span>{store.firm.languages}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#9A7B3E] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <strong className="block text-[#102430]">Email</strong>
                    <a href={`mailto:${FIRM_CONTACT.email}`} className="underline text-[#102430]">
                      {FIRM_CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-2">
                <TrackedCallButton page="/contact" />
                <TrackedWhatsAppButton page="/contact" label="WhatsApp Chambers" />
              </div>
            </div>
          </div>

          {/* Map & Directions card */}
          <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#102430]">
                Location Map · Gate House, Nakuru
              </h3>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E5525] underline"
              >
                <span>Google Maps</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="overflow-hidden rounded border border-[#E4DFD5] bg-[#FAF8F4]">
              <iframe
                title="Map showing Gate House, Mburu Gichua Road, Nakuru"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.0640%2C-0.2900%2C36.0760%2C-0.2800&layer=mapnik&marker=-0.2850%2C36.0700"
                className="w-full h-56 border-0"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-[#5B6D78]">
              Directions: Gate House is situated along Mburu Gichua Road in Nakuru Town CBD,
              opposite the main commercial corridor and a short walk from Nakuru Law Courts.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <GeneralEnquiryForm areas={areas} />

          <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 text-xs text-[#4A5E6B] leading-relaxed">
            <strong className="text-[#102430]">Disclaimer:</strong> {SITE_DISCLAIMER}
          </div>
        </div>
      </div>
    </div>
  );
}
