import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { AuthLayout } from "@/components/auth/AuthLayout";
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
      <AuthLayout
        eyebrow="Wholesale access"
        title="Create your account"
        subtitle="Wholesale pricing is open to everyone. No reseller licence required."
      >
        <SignupForm />
      </AuthLayout>
    </SiteShell>
  );
}
