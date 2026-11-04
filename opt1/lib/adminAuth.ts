import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
  verifyAdminPassword,
  getAdminSecret,
} from "./adminToken";

export {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
  verifyAdminPassword,
  getAdminSecret,
};

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = createAdminToken();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifyAdminToken(token);
  } catch {
    return false;
  }
}
