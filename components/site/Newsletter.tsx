"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="border-b border-paper/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl text-paper">
            New arrivals, straight to your inbox
          </p>
          <p className="mt-1 text-sm text-paper/60">
            Restocks, new designs and wholesale offers. No spam.
          </p>
        </div>

        {submitted ? (
          <p className="inline-flex items-center gap-2 text-sm text-gold">
            <Check className="h-4 w-4" />
            Thanks — you are on the list.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSubmitted(true);
            }}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-full border border-paper/20 bg-transparent px-4 py-2.5 text-sm text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-espresso-deep transition-colors hover:bg-gold-deep hover:text-paper"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
