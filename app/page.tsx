import { SiteShell } from "@/components/site/SiteShell";
import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { StorySection } from "@/components/home/StorySection";
import { Testimonials } from "@/components/home/Testimonials";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ContactBand } from "@/components/home/ContactBand";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <ValueProps />
      <CategoryShowcase />
      <FeaturedProducts />
      <StorySection />
      <Testimonials />
      <ServicesSection />
      <ContactBand />
    </SiteShell>
  );
}
