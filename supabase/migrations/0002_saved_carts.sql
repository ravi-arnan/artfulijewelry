-- Persisted inquiry list ("saved cart") so a signed-in buyer's selections follow
-- them across devices. One JSONB row per user; the app merges this with the
-- local (localStorage) list on sign-in. Until this migration is applied the app
-- degrades gracefully to local-only storage.

create table if not exists public.saved_carts (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  items      jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.saved_carts enable row level security;

-- Owner-only: a user can read and write only their own cart. No admin access
-- needed (carts are private working state, not leads).
create policy "saved_carts owner read"
  on public.saved_carts for select
  using (auth.uid() = user_id);

create policy "saved_carts owner write"
  on public.saved_carts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
