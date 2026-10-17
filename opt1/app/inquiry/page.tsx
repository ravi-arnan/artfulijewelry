import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { InquiryPageClient } from "@/components/inquiry/InquiryPageClient";

export const metadata: Metadata = {
  title: "Your wholesale inquiry",
  description:
    "Review the pieces in your wholesale quote request and send it to Bali Handmade via WhatsApp or email.",
  robots: { index: false },
};

export default function InquiryPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <InquiryPageClient />
      </main>
      <Footer />
    </>
  );
}
