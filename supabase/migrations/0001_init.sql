-- Bali Handmade backend schema: catalog, finishes, inquiries, profiles.
-- Catalog tables are world-readable; writes are admin-only. Inquiries are
-- captured server-side (service role / security-definer), read by owner or admin.

-- ---------- Tables ----------
create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  blurb       text,
  metal       text not null check (metal in ('silver','gold','bronze')),
  image       text,
  item_count  int  not null default 0,
  sort        int  not null default 0
);

create table if not exists public.finishes (
  code        text primary key,
  name        text not null,
  description text,
  swatch      text,
  sort        int  not null default 0
);

create table if not exists public.products (
  id            text primary key,
  name          text not null,
  category_slug text references public.categories(slug),
  metal         text not null check (metal in ('silver','gold','bronze')),
  material      text not null,
  price_from    numeric(10,2) not null default 0,
  min_order     int  not null default 1,
  image         text,
  is_new        boolean not null default false,
  is_sale       boolean not null default false,
  in_stock      boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_slug);
create index if not exists products_metal_idx    on public.products(metal);

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  company    text,
  role       text not null default 'buyer' check (role in ('buyer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id    uuid references auth.users(id) on delete set null,
  name       text not null,
  email      text not null,
  company    text,
  message    text,
  status     text not null default 'new' check (status in ('new','contacted','closed'))
);

create table if not exists public.inquiry_items (
  id          uuid primary key default gen_random_uuid(),
  inquiry_id  uuid not null references public.inquiries(id) on delete cascade,
  product_id  text,
  name        text not null,
  material    text,
  price_from  numeric(10,2),
  min_order   int,
  quantity    int not null default 1
);
create index if not exists inquiry_items_inquiry_idx on public.inquiry_items(inquiry_id);

-- ---------- Helpers ----------
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Submit an inquiry + items atomically (callable by anon via the anon key).
create or replace function public.submit_inquiry(
  p_name text, p_email text, p_company text, p_message text, p_items jsonb
) returns uuid language plpgsql security definer
set search_path = public as $$
declare
  v_id uuid;
  v_item jsonb;
begin
  insert into public.inquiries (user_id, name, email, company, message)
  values (auth.uid(), p_name, p_email, nullif(p_company,''), nullif(p_message,''))
  returning id into v_id;

  for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    insert into public.inquiry_items (inquiry_id, product_id, name, material, price_from, min_order, quantity)
    values (
      v_id,
      v_item->>'productId',
      coalesce(v_item->>'name','Item'),
      v_item->>'material',
      nullif(v_item->>'priceFrom','')::numeric,
      nullif(v_item->>'minOrder','')::int,
      coalesce(nullif(v_item->>'quantity','')::int, 1)
    );
  end loop;

  return v_id;
end; $$;

-- ---------- Row Level Security ----------
alter table public.categories     enable row level security;
alter table public.finishes       enable row level security;
alter table public.products       enable row level security;
alter table public.profiles       enable row level security;
alter table public.inquiries      enable row level security;
alter table public.inquiry_items  enable row level security;

-- Catalog: world-readable, admin-writable.
create policy "categories read"  on public.categories for select using (true);
create policy "categories write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "finishes read"    on public.finishes   for select using (true);
create policy "finishes write"   on public.finishes   for all using (public.is_admin()) with check (public.is_admin());
create policy "products read"    on public.products   for select using (true);
create policy "products write"   on public.products   for all using (public.is_admin()) with check (public.is_admin());

-- Profiles: self read/update, admin read all.
create policy "profiles self read"   on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles self update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Inquiries: read own or admin; admin can update status. Inserts go through submit_inquiry().
create policy "inquiries read"   on public.inquiries for select using (auth.uid() = user_id or public.is_admin());
create policy "inquiries update" on public.inquiries for update using (public.is_admin());
create policy "inquiry_items read" on public.inquiry_items for select using (
  exists (select 1 from public.inquiries i where i.id = inquiry_id and (i.user_id = auth.uid() or public.is_admin()))
);
