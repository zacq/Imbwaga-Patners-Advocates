import type { Metadata } from "next";
import Image from "next/image";
import { readStore } from "@/lib/store";
import { ConsultationForm } from "@/components/ConsultationForm";
import { TrackedWhatsAppButton, TrackedCallButton } from "@/components/TrackedLinks";
import { FIRM_CONTACT } from "@/lib/compliance";
import { APPROVED_IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Request a Consultation",
  description:
    "Request a confidential legal consultation with Imbwaga, Yogo & Partners Advocates in Nakuru. Every request undergoes a conflict check before confirmation.",
};

export const dynamic = "force-dynamic";

export default async function RequestConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; advocate?: string }>;
}) {
  const sp = await searchParams;
  const store = readStore();
  const areas = store.practiceAreas.filter((a) => a.status === "published");
  const advocates = store.advocates.filter((a) => a.status === "published");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-8">
      <div className="grid gap-6 md:grid-cols-12 items-center border-b border-[#E4DFD5] pb-6">
        <div className="md:col-span-7 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E5525]">
            Confidential Intake
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#102430]">
            Request a consultation
          </h1>
          <p className="text-sm sm:text-base text-[#3D5260] leading-relaxed">
            Complete the form below in under two minutes. Consultations are confirmed after a
            conflict check; any applicable consultation fee is explained when our team contacts you
            under the Advocates Remuneration Order.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <TrackedWhatsAppButton
              page="/request-consultation"
              label="Message on WhatsApp"
            />
            <TrackedCallButton
              page="/request-consultation"
              label={`Call ${FIRM_CONTACT.phoneDisplay}`}
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative h-48 rounded-lg overflow-hidden border border-[#E4DFD5]">
            <Image
              src={APPROVED_IMAGES.consultationRoom.src}
              alt={APPROVED_IMAGES.consultationRoom.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102430]/90 to-transparent px-3 py-2">
              <p className="text-[11px] font-medium text-white">
                In-person at Gate House, Nakuru or virtual
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConsultationForm
        areas={areas}
        advocates={advocates}
        initialAreaSlug={sp.area}
        initialAdvocateSlug={sp.advocate}
      />
    </div>
  );
}
