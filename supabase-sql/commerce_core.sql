-- AuraCare AI commerce core schema
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  brand text not null default 'AuraCare Lab',
  category text not null check (category in ('supplement', 'skincare')),
  short_description text not null,
  long_description text not null,
  price integer not null check (price >= 0),
  compare_at_price integer not null default 0 check (compare_at_price >= 0),
  stock_status text not null default 'in_stock' check (stock_status in ('in_stock', 'low_stock', 'out_of_stock')),
  package_size text,
  ingredients_text text,
  usage_instructions text,
  warnings text,
  concern_tags text[] not null default '{}',
  symptom_tags text[] not null default '{}',
  benefit_tags text[] not null default '{}',
  searchable_text text not null default '',
  rating numeric(2, 1) not null default 4.5,
  review_count integer not null default 0,
  origin_country text not null default 'Vietnam',
  badge text,
  image text,
  embedding_vector vector(768),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  label text not null,
  price integer not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique default ('AC-' || upper(substr(uuid_generate_v4()::text, 1, 8))),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  payment_status text not null default 'mock_unpaid' check (payment_status in ('mock_unpaid', 'paid', 'failed', 'refunded')),
  subtotal integer not null default 0 check (subtotal >= 0),
  shipping_fee integer not null default 0 check (shipping_fee >= 0),
  total integer generated always as (subtotal + shipping_fee) stored,
  shipping_name text not null,
  shipping_email text not null,
  shipping_phone text not null,
  shipping_address text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_slug text not null,
  product_name text not null,
  product_image text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_embedding_vector_idx on public.products using ivfflat (embedding_vector vector_cosine_ops) with (lists = 100);
create index if not exists product_variants_product_id_idx on public.product_variants(product_id);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read product variants" on public.product_variants;
create policy "Public can read product variants"
on public.product_variants for select
using (true);

drop policy if exists "Admins can manage product variants" on public.product_variants;
create policy "Admins can manage product variants"
on public.product_variants for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
on public.orders for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders"
on public.orders for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items"
on public.order_items for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "Users can create own order items" on public.order_items;
create policy "Users can create own order items"
on public.order_items for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items"
on public.order_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.match_products_by_embedding(
  query_embedding vector(768),
  match_limit int default 8,
  match_threshold float default 0.15
)
returns table (
  id uuid,
  slug text,
  name text,
  brand text,
  category text,
  short_description text,
  price integer,
  image text,
  similarity float
)
language sql
stable
as $$
  select
    p.id,
    p.slug,
    p.name,
    p.brand,
    p.category,
    p.short_description,
    p.price,
    p.image,
    1 - (p.embedding_vector <=> query_embedding) as similarity
  from public.products p
  where p.embedding_vector is not null
    and 1 - (p.embedding_vector <=> query_embedding) >= match_threshold
  order by p.embedding_vector <=> query_embedding
  limit greatest(match_limit, 1);
$$;
