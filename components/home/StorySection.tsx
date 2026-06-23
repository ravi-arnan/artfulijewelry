import Image from "next/image";

export function StorySection() {
  return (
    <section
      id="story"
      className="mx-auto max-w-7xl px-4 py-[var(--spacing-section)] sm:px-6"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-line">
            <Image
              src="/products/B0572.jpg"
              alt="Hand-finished granulated sterling silver focal bead"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden w-48 rounded-2xl bg-espresso-deep p-5 text-paper shadow-xl sm:block">
            <p className="font-display text-3xl text-gold">Est. 2004</p>
            <p className="mt-1 text-xs text-paper/70">
              Two decades of bench craft in Bali
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
            Our story
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
            Every bead has its own story
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              Since 2004 our workshop in Bali has cast, soldered and finished
              every piece in solid 925 sterling silver, by hand, by artists who
              learned the craft from the generation before them.
            </p>
            <p>
              We built a complete facility around that craft: computerized laser
              engraving, imported casting machines, and a bench team for micro
              and stone setting. It means we can take a design from a sketch to a
              finished, plated, retail-ready piece without leaving the building.
            </p>
            <p className="font-display text-xl italic text-ink">
              “We guarantee the quality of what we make.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
