import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { BRAND, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Help & FAQ — wholesale ordering, pricing & discounts",
  description:
    "Answers to common questions about wholesale pricing, sign-in pricing, minimum orders, discounts, custom manufacturing and shipping at Bali Handmade.",
};

interface Faq {
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  {
    question: "Do I need a business account or reseller licence to buy?",
    answer:
      "No. Our wholesale pricing is open to everyone — individual makers, designers and shops alike. There is no licence or membership requirement.",
  },
  {
    question: "Why are prices hidden until I sign in?",
    answer:
      "Wholesale pricing is shown to signed-in customers. Create a free account and sign in to see live per-piece prices across the whole catalog.",
  },
  {
    question: "Is there a minimum order?",
    answer:
      "Minimums are set per design and shown on each product (for example, 'min 10 pcs'). You can mix designs freely to build an order.",
  },
  {
    question: "Do you offer volume discounts?",
    answer:
      "Yes. Larger quantities qualify for better per-piece pricing, and we run periodic promotions on the On Sale page. Message us for a quote on big or repeat orders.",
  },
  {
    question: "Can you make custom or private-label designs?",
    answer:
      "Absolutely. We are a one-stop manufacturer: 3D design and CAD, casting, plating and vermeil, engraving, stone setting and oxidising — all under one roof since " +
      BRAND.since +
      ".",
  },
  {
    question: "What does 'restocked' mean?",
    answer:
      "Restocked designs are popular pieces we have just produced again and that are ready to ship now. Out-of-stock pieces are between production runs — contact us to reserve the next batch.",
  },
  {
    question: "How do you ship and how long does it take?",
    answer:
      "We ship worldwide via " +
      CONTACT.shipping.join(" and ") +
      " with tracking. Free shipping applies on orders over " +
      BRAND.freeShippingThreshold +
      " to major regions. See the Shipping page for details.",
  },
];

export default function HelpPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Help centre"
        title="Help & frequently asked questions"
        subtitle="Everything you need to know about wholesale ordering, pricing, discounts and custom manufacturing. Still stuck? Message us any time."
      />

      <section className="mx-auto max-w-3xl px-4 py-[var(--spacing-section)] sm:px-6">
        <dl className="divide-y divide-line">
          {FAQS.map((faq) => (
            <div key={faq.question} className="py-7 first:pt-0">
              <dt className="font-display text-xl text-ink">{faq.question}</dt>
              <dd className="mt-3 text-base leading-relaxed text-ink-soft">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 rounded-2xl border border-line bg-paper-deep p-7 sm:p-10">
          <h2 className="font-display text-2xl text-ink">Still have a question?</h2>
          <p className="mt-3 text-ink-soft">
            Message us on WhatsApp at {CONTACT.whatsapp[0].number} or email{" "}
            <a
              href={`mailto:${CONTACT.emails[0].address}`}
              className="text-gold-deep underline-offset-4 hover:underline"
            >
              {CONTACT.emails[0].address}
            </a>{" "}
            and we will get back to you quickly.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
