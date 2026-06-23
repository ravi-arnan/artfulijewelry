# Bali Handmade Redesign — Session Handoff

A modern redesign of the old **bali-handmade.com/shop** site (wholesale 925 sterling
silver beads/findings, est. 2004, slogan "High quality with reasonable price").
The original owner's site is a dense legacy catalog; this is a clean rebuild.

## Stack & how to run
- **Next.js 16** (App Router, RSC) + **Tailwind v4** (tokens in `app/globals.css @theme`, no config file).
- Dev: `npm run dev` (script is `next dev --webpack` — DO NOT use Turbopack dev; it crashes the laptop. Turbopack is fine for `npm run build`).
- `lucide-react` for icons (v1 dropped brand icons — X/Facebook use inline SVGs in `Footer.tsx`).
- Build is green: `npm run build` → ~937 static pages. `npx tsc --noEmit` and `npx eslint .` are clean.
- No emojis / no em-dashes in UI copy (use periods/commas/parens).

### Dev-server gotchas (important)
- Stale `next-server` zombies + mixing a Turbopack build and webpack dev in the same `.next`
  corrupts it → phantom 500s / ENOENT. Fix: `pkill -9 -f next; rm -rf .next; npm run dev`.
- Run `npm run build` only when the dev server is stopped (shared `.next`).
- `next dev --webpack` SWC once rejected a nested-ternary-inside-a-JSX-attribute that the
  Turbopack build accepted ("Expected '</', got jsx text") — precompute such props outside JSX.

## Frontend — DONE
Pages: `/` (Hero, ValueProps, CategoryShowcase bento, FeaturedProducts, StorySection,
Testimonials, ServicesSection, ContactBand), `/shop` (server-side filter/sort/paginate +
URL state, 48/page), `/shop/[id]` (SSG, gallery + meta + FinishSelector for silver +
inquiry CTA + related), `/inquiry` (quote list), `/about`, `/shipping`, `/terms`.
Shared chrome via `components/site/SiteShell.tsx` (AnnouncementBar + Header + Footer).
Design language: light-luxury, gold/ivory/espresso, depth (shadows, gold glows, specimen
captions). Hero, ContactBand, Footer, ProductGallery all given the depth treatment.

### Catalog data (current source of truth = generated files)
Real catalog crawled from the live site: **928 products / 13 categories / 6 finishes**.
- `lib/catalog.products.generated.ts` — `PRODUCTS` (server-only; imported via `lib/products.ts`).
- `lib/catalog.categories.generated.ts` — `CATEGORIES` (client-safe; re-exported by `lib/data.ts`).
- `lib/data.ts` — types, BRAND, CONTACT, SERVICES, VALUE_PROPS, FINISHES, TESTIMONIALS, `getCategory`.
- `lib/products.ts` — `PRODUCTS` + `getProductById` / `getProductsByCategory` (SERVER ONLY; keeps
  the 928-item array out of client bundles — this boundary matters, don't import PRODUCTS in client comps).
- Product images in `public/products/` (~889 real images, ~20MB).
- Prices/min-orders are SYNTHESIZED placeholders (live site hides prices behind login).
- Regenerate: scrape scripts were in `/tmp` (gone after reboot). `scripts/gen-seed.mjs` re-derives
  `supabase/seed.sql` from the generated catalog files.

## Backend (Supabase) — LIVE and wired (2026-06-23)
Decision: **Supabase** (Postgres + Auth + RLS). Full scope delivered: DB-backed catalog,
persisted inquiries, accounts + "login to see price" gate, admin dashboard.
Project ref: **dlpehfmzzwqlwbzwikza** → URL `https://dlpehfmzzwqlwbzwikza.supabase.co`.

### Status: schema + seed applied, app reading live data
- Schema `0001_init.sql` + `seed.sql` applied via `psql` over the **direct** connection
  (`db.<ref>.supabase.co:5432`, IPv6-only — intermittent "No route to host"; retry/use pooler).
  DB password lives ONLY in the dashboard; it was passed inline to psql, NOT saved to disk.
- Verified: 13 categories, 6 finishes, **928 products** (846 silver/76 bronze/6 gold), RLS on,
  `submit_inquiry` RPC works for anon, anon CANNOT read inquiries back (RLS confirmed).
- `.env.local` keys all set: anon, service-role, publishable. App reads live catalog via anon RLS.

### App-layer wiring DONE (steps 4-7)
- **Catalog**: `lib/products.ts` async `getAllProducts/getProductById/getProductsByCategory`,
  memoized single fetch from Supabase via `lib/supabase/catalog.ts` (anon, server-only),
  snake→camel map, **falls back to generated files** when env absent or query empty/errors.
  Consumers (`/shop`, `/shop/[id]`, FeaturedProducts, ProductRelated) made async.
  NOTE: the memoized cache is per-process — restart `npm run dev` after seeding so it drops
  the fallback and reads live (the running process caches whatever it got on first call).
- **Inquiries**: `app/actions/inquiry.ts` Server Action → `submit_inquiry` RPC; new
  `InquiryContactForm.tsx` (name/email/company/message) persists the lead IN ADDITION to the
  existing WhatsApp/mailto handoff. No-ops cleanly when env absent.
- **Auth + price gate**: `/login`, `/signup` (browser client), `context/AuthContext.tsx`
  provider in layout, `components/auth/AuthNav.tsx` in Header, `WholesalePrice.tsx` hides
  price behind "Sign in for price" until logged in. v1 tradeoff: products are public-read and
  price is in the hydration payload — merchandising gate, not a hard boundary (keeps SSG).
- **Admin**: `/admin` (force-dynamic) gated by `profiles.role='admin'` (redirects to login,
  rejects non-admins). Lists inquiries+items+stats, inline status control via
  `app/actions/admin.ts` (RLS-enforced + re-verified).
- Build green earlier (939 pages). tsc + eslint clean. Dev server runs on :3000.

### FIRST ADMIN still needed (0 users exist yet)
Sign up at `/signup`, then promote:
`psql "$CONN" -c "update public.profiles set role='admin' where email='you@example.com';"`
(the on_auth_user_created trigger creates the profile row on signup). Then `/admin` unlocks.

### Old scaffolding notes (kept for reference)

### Scaffolded (done, no live creds needed)
- `supabase/migrations/0001_init.sql` — tables (categories, finishes, products, profiles,
  inquiries, inquiry_items), RLS (catalog world-read, admin-write; inquiries owner/admin-read),
  `is_admin()`, `submit_inquiry()` security-definer RPC (anon lead capture), profile-on-signup trigger.
- `supabase/seed.sql` — 13 categories, 6 finishes, 928 products (regenerate via `node scripts/gen-seed.mjs`).
- `lib/supabase/server.ts` (RSC/actions), `client.ts` (browser), `admin.ts` (service-role, server-only).
- `lib/supabase/middleware.ts` + root `middleware.ts` — session refresh, **guarded to no-op until env
  is set** (so the site keeps working now) and never redirects (catalog is public).
- `.env.local` (URL set, keys blank) + `.env.local.example`.
- Deps installed: `@supabase/supabase-js`, `@supabase/ssr`, `server-only`.

### BLOCKER: Supabase MCP not connected
`.mcp.json` now has the supabase server, but `claude mcp list` shows **"⏸ Pending approval"**.
To activate (the OAuth step kept getting dismissed):
1. Restart Claude Code (`claude`) → **approve** the project MCP server when prompted.
2. `/mcp` → select **supabase** → **complete the browser OAuth login** (don't dismiss).
3. Confirm it shows **✔ Connected**.
Fallback if OAuth keeps failing: paste the **anon key** + **service-role key** (Supabase
dashboard → Settings → API) and apply schema/seed via service role instead of the MCP.

### Next steps once Supabase is reachable (in order)
1. Apply `supabase/migrations/0001_init.sql` (schema + RLS + RPC + trigger).
2. Apply `supabase/seed.sql` (catalog). 928 rows — chunk if the SQL runner has size limits.
3. Get the **anon key** → write into `.env.local` (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Rewire `lib/products.ts` + `getCategory`/`getProductsByCategory` to read from Supabase
   (keep generated files as a fallback). `/shop` and `/shop/[id]` consume these — keep their shapes.
5. Inquiry flow: `/inquiry` submit → a Server Action calling the `submit_inquiry` RPC (persist
   lead) in addition to the existing WhatsApp/email handoff (`lib/inquiry.ts`).
6. Auth: `/login` + `/signup` (browser client), and the **price gate** — hide `priceFrom` in
   `ProductCard` / `ProductMeta` / catalog when no session (gate in the data layer / Server Components).
7. `/admin` dashboard (gated by `profiles.role='admin'`): list inquiries + manage products.
8. First admin: user signs up, then `update public.profiles set role='admin' where email='...'`.

Notes: app runtime only needs the **anon key** (catalog read via RLS public-read; inquiry via the
security-definer RPC; admin via the admin's own session). Service-role key is only for seeding/scripts.
Price gating is app-level for v1 (products table is public-read); document this as a known tradeoff.

## Memory
Project memory file: `~/.claude/projects/-home-ravi-Projects/memory/project_bali_handmade_redesign.md`
(has the full history, gotchas, and decisions). Read it at the start of the new session.

## Not yet done
- Backend wiring (steps above). - Deploy (Netlify/Vercel) once backend is in.
- Account features beyond price-gate (saved cart, order history, live stock) — future.
