import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SkipLink } from "@/components/site/SkipLink";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <AnnouncementBar />
      <Header />
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}
