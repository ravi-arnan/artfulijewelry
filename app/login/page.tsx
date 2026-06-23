import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Bali Handmade wholesale account to see pricing.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-deep">
          Wholesale access
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Log in to see wholesale pricing and manage your inquiries.
        </p>
        <div className="mt-8 rounded-2xl bg-paper-deep p-6 ring-1 ring-line sm:p-8">
          <Suspense fallback={<div className="min-h-[18rem]" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </SiteShell>
  );
}
