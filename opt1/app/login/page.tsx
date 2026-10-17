import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Bali Handmade wholesale account to see pricing.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <SiteShell>
      <AuthLayout
        eyebrow="Wholesale access"
        title="Welcome back"
        subtitle="Log in to see wholesale pricing and manage your inquiries."
      >
        <Suspense fallback={<div className="min-h-[18rem]" />}>
          <LoginForm />
        </Suspense>
      </AuthLayout>
    </SiteShell>
  );
}
