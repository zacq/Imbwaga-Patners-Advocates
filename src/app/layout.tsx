import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyBar } from "@/components/MobileStickyBar";
import { CookieNotice } from "@/components/CookieNotice";
import { FIRM_CONTACT } from "@/lib/compliance";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${FIRM_CONTACT.domain}`),
  title: {
    default: "Imbwaga, Yogo & Partners Advocates | Advocates in Nakuru",
    template: "%s | Imbwaga, Yogo & Partners Advocates",
  },
  description:
    "Imbwaga, Yogo & Partners Advocates is a Nakuru law firm at Gate House, Mburu Gichua Road, advising individuals, families, cooperatives, and businesses since 2017.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: FIRM_CONTACT.name,
    title: "Imbwaga, Yogo & Partners Advocates | Nakuru, Kenya",
    description:
      "Advocates in Nakuru advising individuals, families, and businesses across 12 areas of law.",
  },
};

const legalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LegalService", "LocalBusiness"],
  name: FIRM_CONTACT.name,
  url: `https://${FIRM_CONTACT.domain}`,
  telephone: "+254726111198",
  email: FIRM_CONTACT.email,
  foundingDate: FIRM_CONTACT.foundedYear,
  priceRange: "Assessed under the Advocates Remuneration Order",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gate House, 6th Floor, Suite 603, Mburu Gichua Road",
    addressLocality: "Nakuru",
    addressRegion: "Nakuru County",
    addressCountry: "KE",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "13:00",
    },
  ],
  knowsLanguage: ["English", "Kiswahili"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF8F4] text-[#102430]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[#102430] focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileStickyBar />
        <CookieNotice />
      </body>
    </html>
  );
}
