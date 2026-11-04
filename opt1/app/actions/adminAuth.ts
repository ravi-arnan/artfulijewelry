"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminPassword,
  setAdminSession,
  clearAdminSession,
} from "@/lib/adminAuth";

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginAdminAction(password: string): Promise<AdminLoginResult> {
  if (typeof password !== "string" || !password.trim()) {
    return { ok: false, error: "Password wajib diisi." };
  }

  const isValid = verifyAdminPassword(password.trim());
  if (!isValid) {
    return { ok: false, error: "Password administrator salah." };
  }

  await setAdminSession();
  return { ok: true };
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
