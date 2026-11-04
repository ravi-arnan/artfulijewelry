import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login · Bali Handmade",
  description: "Administrator login portal for Bali Handmade atelier backoffice.",
  robots: { index: false, follow: false },
};

function sanitizeNext(raw: string | null | undefined): string {
  if (
    !raw ||
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.includes("\\") ||
    raw.startsWith("/\\")
  ) {
    return "/admin";
  }
  return raw;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const rawNext = (await searchParams).next;
  const next = sanitizeNext(rawNext);

  const isAuthenticated = await isAdminAuthenticated();
  if (isAuthenticated) {
    redirect(next);
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-paper animate-pulse" />
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
