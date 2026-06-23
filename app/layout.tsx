import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { InquiryProvider } from "@/context/InquiryContext";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bali-handmade.com"),
  title: {
    default: "Bali Handmade — Wholesale Bali Silver, Gold Beads & Findings",
    template: "%s | Bali Handmade",
  },
  description:
    "Solid 925 sterling silver beads, caps, charms and findings handmade by artisans in Bali since 2004. Wholesale prices for everyone, no reseller required.",
  keywords: [
    "Bali beads wholesale",
    "925 sterling silver beads",
    "Bali silver findings",
    "wholesale jewelry supplies",
    "handmade silver charms",
  ],
  openGraph: {
    title: "Bali Handmade — Wholesale Bali Silver & Gold Beads",
    description:
      "Handmade 925 sterling silver beads and findings from Bali. Wholesale prices for everyone since 2004.",
    type: "website",
    locale: "en_US",
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
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <AuthProvider>
          <InquiryProvider>{children}</InquiryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
