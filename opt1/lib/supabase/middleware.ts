import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session cookie on each request. Does NOT redirect -
// the catalog is public; access control for /admin lives in those routes.
export async function updateSession(request: NextRequest) {
  // No-op until Supabase env is configured, so the static site keeps working.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Touch auth to refresh the session if expired. Catch network errors so
    // paused or unreachable Supabase instances never crash the app with HTTP 500.
    await supabase.auth.getUser();
  } catch {
    // Graceful fallback when Supabase backend is unreachable.
  }

  return response;
}
