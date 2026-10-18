import type { Metadata } from "next";
import { Fraunces, Inter, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./landing.css";
import { AuthProvider } from "@/context/AuthContext";
import { InquiryProvider } from "@/context/InquiryContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND, CONTACT } from "@/lib/data";

const SITE_URL = "https://artfulijewelry.com";

const organizationLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Artfuli Jewelry",
      url: SITE_URL,
      slogan: "Handcrafted Balinese Fine Jewelry & Celuk Metallurgy",
      foundingDate: "2004",
      sameAs: ["https://instagram.com/artfulijewelry"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "Atelier Concierge",
          email: "care@artfulijewelry.com",
          telephone: "+62-812-3456-7890",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Artfuli Jewelry",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artfulijewelry.com"),
  title: {
    default: "Artfuli Jewelry | Fine Silver & Gold Vermeil Atelier, Celuk, Bali",
    template: "%s | Artfuli Jewelry",
  },
  description:
    "Handcrafted 925 sterling silver and 18k gold vermeil jewelry forged by master silversmiths in Celuk, Gianyar, Bali since 2004. Certified XRF metallurgy.",
  keywords: [
    "Artfuli Jewelry",
    "Bali silver jewelry",
    "Celuk metallurgy",
    "925 sterling silver handmade",
    "18k gold vermeil Bali",
    "artisan silver rings",
    "Celuk silversmiths",
    "wholesale Balinese jewelry",
  ],
  openGraph: {
    title: "Artfuli Jewelry | Fine Silver & Gold Vermeil Atelier, Celuk, Bali",
    description:
      "Handcrafted 925 sterling silver and 18k gold vermeil jewelry forged by master silversmiths in Celuk, Gianyar, Bali since 2004.",
    type: "website",
    locale: "en_US",
    url: "https://artfulijewelry.com",
    siteName: "Artfuli Jewelry",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${newsreader.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationLd} />
        <AuthProvider>
          <InquiryProvider>{children}</InquiryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
