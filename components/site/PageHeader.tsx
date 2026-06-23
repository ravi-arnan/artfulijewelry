interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-paper-deep">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
