"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface WholesalePriceProps {
  price: number;
  variant?: "card" | "detail";
}

// App-level wholesale price gate (v1). Until the buyer is signed in we render a
// "sign in to see price" prompt instead of the figure. Note the products table
// is public-read and the price is present in the hydration payload, so this is a
// UX/merchandising gate, not a hard security boundary — a documented tradeoff
// while the catalog stays statically generated.
export function WholesalePrice({ price, variant = "card" }: WholesalePriceProps) {
  const { user, loading } = useAuth();
  const detail = variant === "detail";
  const label = detail ? "Wholesale, from" : "From";

  if (loading || !user) {
    return (
      <Link
        href="/login"
        className={`group inline-flex items-center gap-1.5 text-gold-deep transition-colors hover:text-espresso ${
          detail ? "text-base" : "text-sm"
        }`}
      >
        <Lock className={detail ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
        <span className="underline-offset-4 group-hover:underline">
          Sign in for price
        </span>
      </Link>
    );
  }

  return (
    <>
      <span className="text-xs uppercase tracking-widest text-ink-soft">
        {label}
      </span>
      {detail ? (
        <p className="font-display text-4xl text-gold-deep">
          ${price.toFixed(2)}
          <span className="ml-1 text-base text-ink-soft">/ piece</span>
        </p>
      ) : (
        <p className="font-display text-xl text-gold-deep">${price.toFixed(2)}</p>
      )}
    </>
  );
}
