import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setAdminSession } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  if (errorParam || !code || !state) {
    return NextResponse.redirect(
      new URL("/admin/login?error=oauth_failed", origin)
    );
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid_state", origin)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/admin/login?error=google_not_configured", origin)
    );
  }

  const redirectUri = `${origin}/api/auth/callback/google`;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange error:", await tokenRes.text());
      return NextResponse.redirect(
        new URL("/admin/login?error=token_exchange_failed", origin)
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(
        new URL("/admin/login?error=userinfo_failed", origin)
      );
    }

    const userData = await userRes.json();
    const userEmail = (userData.email || "").toLowerCase().trim();

    const envEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const allowedEmails = new Set([
      "raviarnankeren@gmail.com",
      "admin@bali-handmade.com",
      ...envEmails,
    ]);

    const isDomainAllowed = userEmail.endsWith("@bali-handmade.com");
    const isEmailAllowed = allowedEmails.has(userEmail);

    if (!isDomainAllowed && !isEmailAllowed) {
      console.warn(`Unauthorized Google login attempt from: ${userEmail}`);
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=unauthorized_email&email=${encodeURIComponent(userEmail)}`,
          origin
        )
      );
    }

    await setAdminSession();
    return NextResponse.redirect(new URL("/admin", origin));
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(
      new URL("/admin/login?error=oauth_exception", origin)
    );
  }
}
