import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create a wholesale account",
  description:
    "Create a Bali Handmade account to unlock wholesale pricing on 925 sterling silver beads and findings.",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
          Wholesale access
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Wholesale pricing is open to everyone. No reseller licence required.
        </p>
        <div className="mt-8 rounded-2xl bg-paper-deep p-6 ring-1 ring-line sm:p-8">
          <SignupForm />
        </div>
      </div>
    </SiteShell>
  );
}
