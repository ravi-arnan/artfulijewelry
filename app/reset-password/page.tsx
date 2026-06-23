import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <SiteShell>
      <AuthLayout
        eyebrow="Wholesale access"
        title="Set a new password"
        subtitle="Choose a new password for your account. You will be signed in afterwards."
      >
        <ResetPasswordForm />
      </AuthLayout>
    </SiteShell>
  );
}
