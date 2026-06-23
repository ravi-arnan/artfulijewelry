import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth (and email-confirmation) callback. Supabase redirects here with a
// `code` that we exchange for a session, persisting the auth cookies, then
// send the user on to `next`.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Only allow same-site relative paths to avoid an open-redirect.
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
