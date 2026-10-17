import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "ink" | "ghost";

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gold text-espresso-deep hover:bg-gold-deep hover:text-paper shadow-sm",
  ink: "bg-espresso text-paper hover:bg-espresso-deep",
  ghost: "border border-line text-ink hover:border-gold hover:text-gold-deep",
};

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  children: ReactNode;
}

export function ButtonLink({
  variant = "gold",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-colors duration-300 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
