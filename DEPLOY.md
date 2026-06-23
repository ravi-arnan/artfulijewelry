# Deploying to Vercel

This is a Next.js 16 app. Vercel auto-detects the framework, build command
(`next build`) and output. Everything below needs your Vercel account, so it is
not something the build automation can do for you.

## 1. Link and deploy

From the project root:

```bash
vercel link        # choose or create the project (one time)
vercel             # preview deployment
vercel --prod      # production deployment
```

Or import the Git repository from the Vercel dashboard.

## 2. Environment variables (required)

Set these in Vercel for the Preview and Production environments (Project
Settings, Environment Variables). Values are in your local `.env.local`; the
names are listed in `.env.local.example`:

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only, used by admin actions. Never expose to the client |

Without these the site still builds and renders from the generated catalog
fallback, but auth and the live catalog will be inactive.

## 3. Auth redirect URLs (after the domain is known)

Once you know the production domain (for example `https://bali-handmade.com`
or the `*.vercel.app` URL), add the callback to both providers:

- Supabase, Authentication, URL Configuration, Redirect URLs:
  - `https://YOUR_DOMAIN/auth/callback`
  - Also set the Site URL to `https://YOUR_DOMAIN`.
- Google Cloud, your OAuth client, Authorized redirect URIs:
  - The Supabase callback is already registered:
    `https://dlpehfmzzwqlwbzwikza.supabase.co/auth/v1/callback`. Google does not
    need the app domain, but if you keep app URLs there, add
    `https://YOUR_DOMAIN/auth/callback` for consistency.

Add the Vercel preview URL(s) to the Supabase Redirect URLs too if you want
Google sign-in to work on previews.

## 4. Verify after deploy

- Open the deployment, confirm the homepage and `/shop` render.
- Test "Continue with Google" on `/login`.
- Check `https://YOUR_DOMAIN/sitemap.xml`, `/robots.txt` and `/opengraph-image`.
