import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a link to reset your Bali Handmade wholesale account password.",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <SiteShell>
      <AuthLayout
        eyebrow="Wholesale access"
        title="Reset your password"
        subtitle="Enter your email and we will send you a link to set a new password."
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </SiteShell>
  );
}
