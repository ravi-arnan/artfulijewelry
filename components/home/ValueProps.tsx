import { BadgeCheck, Globe, Handshake, Hammer } from "lucide-react";
import { VALUE_PROPS } from "@/lib/data";
import { RevealWrapper } from "@/components/ui/RevealWrapper";

const ICONS = [BadgeCheck, Handshake, Globe, Hammer];

export function ValueProps() {
  return (
    <section className="border-y border-line bg-paper-deep">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 py-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {VALUE_PROPS.map((prop, i) => {
          const Icon = ICONS[i];
          return (
            <RevealWrapper
              key={prop.title}
              delay={i * 90}
              className="px-2 py-8 sm:px-6"
            >
              <Icon className="h-6 w-6 text-gold-deep" aria-hidden />
              <h3 className="mt-4 font-display text-lg text-ink">{prop.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {prop.text}
              </p>
            </RevealWrapper>
          );
        })}
      </div>
    </section>
  );
}
