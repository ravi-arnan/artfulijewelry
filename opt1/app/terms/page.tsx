import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Ordering info, privacy policy, special handling and the full terms for wholesale orders from Bali Handmade.",
};

const ORDERING_INFO = [
  "We accept payment through Wire Transfer.",
  "All prices are Free On Board (FOB) and quoted in US dollars.",
  "All weights and measures for the silver beads shown on our site are approximate.",
  "We ship your order directly from Bali to your destination with DHL International and Postal Service.",
];

const PRIVACY_POLICY = [
  "This policy covers how we use your personal information. We take your privacy seriously and will take all measures to protect your personal information.",
  "Any personal information received will only be used to fill your order. We will not sell or redistribute your information to anyone.",
];

const SPECIAL_HANDLING = [
  "You can freely choose any of our products to be finished in gold vermeil (24 karat gold), rose gold, black or white rhodium plating, black solid oxidation, any colour lacquer plating, or anti-tarnish silver bright (non-oxidised), whether beads, findings or anything else. Please note in the inquiry comments which items you would like in vermeil or silver bright (non-oxidised).",
  "We offer the highest quality handmade sterling silver beads from experienced crafters at a very reasonable price, with flexible payment methods to handle your order.",
  "We are pleased to include a free gift of a jewellery component once your order reaches a specific value.",
  "When you have a special design in mind, we are ready to make your order within 2 to 3 weeks.",
];

const TERMS = [
  "Please make sure your order is covered with adequate insurance. We will not be responsible for any loss or damaged goods once the package is sent through the shipping company.",
  "We are not responsible for any typographical errors in the content of this website, including but not limited to pricing, specifications and item codes.",
  "If you have a problem placing an order online, please email your order to sales@bali-handmade.com or balihandmade@gmail.com.",
  "All prices are subject to change without prior notice. Should there be a change to any item, or to the total of an order, we will advise you in the confirmation letter.",
  "The beads pictured on this site are all handmade. Because of the nature of the process, no two are exactly alike and slight variations may occur, so the item you receive may vary slightly from the one shown, although we try to keep consistency as close as possible.",
  "While we keep a large range of stock, we cannot guarantee that any specific item will be available at all times. As all of our beads are handmade, we sometimes experience delays that leave us temporarily out of stock on certain items.",
  "We sell our products by the piece and not by the gram. The weight shown on this site is for shipping reference only.",
  "We are not responsible for any injury caused by the wearing or use of our products.",
  "Customers are responsible for any customs fees or other government charges in their country, in addition to the shipping fee. We are unable to predict which shipments will be assessed these fees or the amount that may be charged.",
];

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-soft">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TermsPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Policies"
        title="Terms & Conditions"
        subtitle="How ordering works, how we handle your data, and the terms that apply to every wholesale order."
      />

      <section className="mx-auto max-w-3xl px-4 py-[var(--spacing-section)] sm:px-6">
        <div className="space-y-12">
          <BulletSection title="Ordering info" items={ORDERING_INFO} />
          <BulletSection title="Privacy policy" items={PRIVACY_POLICY} />
          <BulletSection title="Special handling" items={SPECIAL_HANDLING} />

          <div>
            <h2 className="font-display text-2xl text-ink">Terms &amp; conditions</h2>
            <ol className="mt-4 space-y-4">
              {TERMS.map((item, i) => (
                <li key={item} className="flex gap-4 text-base leading-relaxed text-ink-soft">
                  <span className="font-display text-lg text-gold-deep">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
