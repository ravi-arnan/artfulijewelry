# Bali Handmade Redesign — Session Handoff

A modern redesign of the old **bali-handmade.com/shop** site (wholesale 925 sterling
silver beads/findings, est. 2004, slogan "High quality with reasonable price").
The original owner's site is a dense legacy catalog; this is a clean rebuild.

## Stack & how to run
- **Next.js 16** (App Router, RSC) + **Tailwind v4** (tokens in `app/globals.css @theme`, no config file).
- Dev: `npm run dev` (script is `next dev --webpack` — DO NOT use Turbopack dev; it crashes the laptop. Turbopack is fine for `npm run build`).
- `lucide-react` for icons (v1 dropped brand icons — X/Facebook use inline SVGs in `Footer.tsx`).
- Build is green: `npm run build` → ~960 static pages. `npx tsc --noEmit`, `npx eslint .`, and
  `npm test` (34 unit tests) are all clean.
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

### FIRST ADMIN done (2026-06-24)
`raviarnankeren@gmail.com` is promoted to `role='admin'` (service-role PATCH on `profiles`;
the on_auth_user_created trigger had already created the row on Google sign-in).
To add more admins: the person signs in once, then
`update public.profiles set role='admin' where email='...'` (Supabase SQL Editor, no DB
password needed). Role is read per request, so sign out/in to pick up a change.

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

### RESOLVED: Supabase MCP was never required
Schema + seed were applied via `psql` / the service-role key, so the MCP pending-approval
issue below is moot. Kept for reference only.

### (historical) BLOCKER: Supabase MCP not connected
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

## Session 2026-06-24 (what shipped)
- **Deploy is LIVE on Vercel.** Public site: `https://bali-handmade-redesign.vercel.app`
  (clean alias is public; hashed deployment URLs are 401 via Vercel Deployment Protection,
  which is expected). GitHub repo `ravi-arnan/bali-handmade-redesign` is now connected to the
  Vercel project, so every push to `main` auto-deploys production (no `vercel --prod` needed).
  Prod env has the `NEXT_PUBLIC_SUPABASE_*` keys (verified: catalog renders, price gate active,
  Supabase URL inlined in the client bundle).
- **First admin enabled** (see FIRST ADMIN above).
- **Unit test coverage 19 -> 34.** Runner: `npm test` =
  `node --conditions=react-server --import ./test/register.mjs --test "lib/**/*.test.ts"`.
  `test/resolve-hook.mjs` is a TS-aware Node resolution hook (`@/` alias + extensionless
  imports) so the whole server data layer is testable without changing production imports;
  `--conditions=react-server` makes `server-only` a no-op under node. New tests cover
  `mapRow` snake->camel + numeric/null coercion, the Supabase->seed fallback, product
  lookups, `getCategory`, and the WhatsApp/mailto inquiry builders.
- **Admin dashboard refined into a dedicated console.**
  - `app/admin/layout.tsx` + `components/admin/AdminShell.tsx`: dark espresso console header
    (logo + Admin badge, View store, signed-in email, Sign out). It does NOT use the public
    `SiteShell` (no announcement bar / shop nav / marketing footer).
  - `components/admin/InquiryBoard.tsx` (client, owns list state): status filter tabs with
    live counts, search (name/email/company), color-coded status pills + accent stripe,
    per-inquiry totals (pieces + estimate), and segmented New/Contacted/Closed quick-actions
    with optimistic updates that re-bucket and re-count instantly (persists via the
    `updateInquiryStatus` server action, RLS + re-verified). Search input opts out of
    password-manager autofill (also silences an extension-caused hydration warning).
  - The old `InquiryStatusControl.tsx` was folded into the board and removed.
  - Stat cards got icons + depth; Products card links to `/shop`; New/unhandled highlights
    in gold when > 0. Timestamps are deterministic UTC (date + time) to avoid hydration drift.

## Admin + account features shipped (2026-06-24, second pass)
- **Buyer inquiry history** on `/account` ("Your inquiries"): the signed-in buyer's own
  submitted quote requests (status, date, item/piece totals, estimate). RLS owner-read already
  supported it; query also filters by `user_id`. Shared `components/inquiry/StatusBadge.tsx`
  now drives status pills in both the account history and the admin board.
- **Admin CSV export**: `GET /admin/export` (admin-gated) streams all inquiries + line items as
  CSV; "Export CSV" button on the dashboard. Pure serializer `lib/csv.ts` + `lib/inquiry-export.ts`
  with formula-injection guarding and RFC 4180 quoting (unit-tested).
- **Admin product editor**: `/admin/products` (search by name/ID via URL state) edits a product's
  `price_from`, `min_order`, `is_new`, `is_sale` via the existing `products write` RLS, using the
  `updateProduct` action and per-row `ProductEditRow` client component. Admin shell gained
  Dashboard/Products nav. Shared `lib/supabase/adminContext.ts#getAdminContext` is the admin gate.
  CAVEAT: the storefront reads a per-process memoized catalog (lib/products.ts), so price/flag
  edits surface on the next deploy/restart, not instantly. Real fix later: drop the module-level
  memo or move to `unstable_cache` + `revalidateTag`.
- **Persisted saved cart**: migration `0002_saved_carts.sql` (owner-only RLS, JSONB items) +
  `lib/cart-merge.ts` (pure, tested) + sync wired into `InquiryContext` (merge local+remote on
  sign-in, debounced upsert after). All DB calls no-op cleanly until the migration is applied.
  ACTION REQUIRED to activate: run `supabase/migrations/0002_saved_carts.sql` in the Supabase SQL
  Editor. Until then the cart is local-only (signed-in users make one harmless failing
  saved_carts request per sign-in; caught and ignored).
- Unit tests now 50 (added csv, inquiry-export, cart-merge).

## Roadmap (remaining)
Done: full backend wiring, auth, deploy + auto-deploy, SEO/OG, e2e smoke + 50 unit tests,
dedicated admin console, buyer inquiry history, admin CSV export, admin product editor,
persisted saved cart (pending migration apply). Still open:
- **Real prices (BLOCKED, 2026-06-24).** `priceFrom` / `minOrder` are synthesized placeholders.
  Real prices on bali-handmade.com are login-gated ("Please login to see price"), AND the source
  site is no longer functioning, so they cannot be retrieved (confirmed this session). The public
  product pages still expose real dimensions (e.g. "9.94 x 11.40 mm, hole 4.69 mm") and finish
  codes (VR vermeil, RG rose-gold, AV antique-vermeil, etc.), keyed by the same base IDs we use.
  Revisit only when the client supplies a price list (CSV/spreadsheet keyed by product ID /
  variant). Fallback if no list ever appears: a dimension-based model (estimate silver weight
  from size x spot price x markup), but that is an estimate, not the shop's real numbers.
- **Hard price-gate (DEFERRED).** v1 is merchandising-only: products are public-read and
  `priceFrom` is in the hydration payload, so the gate hides price in the UI but does not truly
  withhold it. Deferred on purpose: with prices being placeholders indefinitely (source defunct),
  a hard gate adds complexity to protect fake numbers. Revisit together with real prices; it would
  drop SSG for the gated fields (price column readable only to authed users, or a price-on-request
  RPC), so document that tradeoff when it happens.
- **Live stock.** The products table has a real `in_stock` column, but `mapRow` does not select it,
  so `enrich` synthesizes ~6% out-of-stock for demo variety. To make stock real (and admin-editable),
  add `in_stock` to `PRODUCT_COLUMNS`/`mapRow` (then `enrich`'s `?? ` keeps the real value) and add
  the toggle to the product editor. Note: this removes the synthesized OOS demo spread.
- **Admin depth (optional).** Inquiry pagination beyond latest 100 (board filters client-side over
  the latest 100); product create/delete (editor currently edits existing rows only).
