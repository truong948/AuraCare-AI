-- AuraCare AI initial Supabase schema.
-- Covers auth profiles, commerce, skin diary, AI consultations, storage, RLS, and pgvector search.

create extension if not exists pgcrypto;
create extension if not exists vector;

create schema if not exists app_private;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('user', 'admin');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.app_role not null default 'user',
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists profiles_email_key on public.profiles (lower(email));
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_status_idx on public.profiles(status);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace function app_private.get_user_role(target_user_id uuid default null)
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select p.role
      from public.profiles p
      where p.id = coalesce(target_user_id, auth.uid())
      limit 1
    ),
    'user'::public.app_role
  );
$$;

grant usage on schema app_private to authenticated;
grant execute on function app_private.get_user_role(uuid) to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select app_private.get_user_role() = 'admin'::public.app_role;
$$;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'user'::public.app_role,
    'active'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure app_private.handle_new_user();

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  label text not null,
  price integer not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('AC-' || upper(substr(gen_random_uuid()::text, 1, 8))),
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_slug text not null,
  product_name text not null,
  product_image text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.skin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  skin_type text not null,
  concerns text[] not null default '{}',
  allergies text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.skin_diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  notes text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  skin_concern text not null,
  description text not null,
  ai_summary jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_concern_tags_idx on public.products using gin(concern_tags);
create index if not exists products_symptom_tags_idx on public.products using gin(symptom_tags);
create index if not exists products_benefit_tags_idx on public.products using gin(benefit_tags);
create index if not exists products_embedding_vector_idx on public.products using ivfflat (embedding_vector vector_cosine_ops) with (lists = 100);
create index if not exists product_variants_product_id_idx on public.product_variants(product_id);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists skin_diaries_user_created_idx on public.skin_diaries(user_id, created_at desc);
create index if not exists consultations_user_created_idx on public.consultations(user_id, created_at desc);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute procedure public.set_updated_at();

drop trigger if exists set_product_variants_updated_at on public.product_variants;
create trigger set_product_variants_updated_at before update on public.product_variants for each row execute procedure public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders for each row execute procedure public.set_updated_at();

drop trigger if exists set_skin_profiles_updated_at on public.skin_profiles;
create trigger set_skin_profiles_updated_at before update on public.skin_profiles for each row execute procedure public.set_updated_at();

drop trigger if exists set_skin_diaries_updated_at on public.skin_diaries;
create trigger set_skin_diaries_updated_at before update on public.skin_diaries for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.skin_profiles enable row level security;
alter table public.skin_diaries enable row level security;
alter table public.consultations enable row level security;

drop policy if exists "Profiles are readable by owner or admin" on public.profiles;
create policy "Profiles are readable by owner or admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid() and role = 'user'::public.app_role and status = 'active');

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
to anon, authenticated
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
to anon, authenticated
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
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  )
);

drop policy if exists "Users can create own order items" on public.order_items;
create policy "Users can create own order items"
on public.order_items for insert
to authenticated
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  )
);

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items"
on public.order_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own skin profile" on public.skin_profiles;
create policy "Users can read own skin profile"
on public.skin_profiles for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create own skin profile" on public.skin_profiles;
create policy "Users can create own skin profile"
on public.skin_profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own skin profile" on public.skin_profiles;
create policy "Users can update own skin profile"
on public.skin_profiles for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can read own diary entries" on public.skin_diaries;
create policy "Users can read own diary entries"
on public.skin_diaries for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create own diary entries" on public.skin_diaries;
create policy "Users can create own diary entries"
on public.skin_diaries for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own diary entries" on public.skin_diaries;
create policy "Users can update own diary entries"
on public.skin_diaries for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can delete own diary entries" on public.skin_diaries;
create policy "Users can delete own diary entries"
on public.skin_diaries for delete
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can read own consultations" on public.consultations;
create policy "Users can read own consultations"
on public.consultations for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create consultations" on public.consultations;
create policy "Users can create consultations"
on public.consultations for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Admins can manage consultations" on public.consultations;
create policy "Admins can manage consultations"
on public.consultations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.match_products_by_embedding(
  query_embedding vector(768),
  match_limit integer default 8,
  match_category text default null
)
returns table (
  slug text,
  similarity double precision,
  reason text
)
language sql
stable
as $$
  select
    p.slug,
    1 - (p.embedding_vector <=> query_embedding) as similarity,
    case
      when match_category is not null then 'Khớp embedding trong cùng danh mục ' || match_category
      else 'Khớp embedding toàn catalog'
    end as reason
  from public.products p
  where p.embedding_vector is not null
    and (match_category is null or p.category = match_category)
  order by p.embedding_vector <=> query_embedding
  limit greatest(match_limit, 1);
$$;

create or replace function public.match_products_by_symptoms(
  symptom_keywords text,
  match_limit integer default 5
)
returns table (
  id uuid,
  slug text,
  name text,
  short_description text,
  price integer,
  score double precision
)
language sql
stable
as $$
  with terms as (
    select regexp_split_to_array(lower(coalesce(symptom_keywords, '')), '\s+') as words
  )
  select
    p.id,
    p.slug,
    p.name,
    p.short_description,
    p.price,
    (
      case when lower(p.name) like '%' || lower(symptom_keywords) || '%' then 3 else 0 end
      + cardinality(array(select unnest(p.concern_tags) intersect select unnest(terms.words))) * 2
      + cardinality(array(select unnest(p.symptom_tags) intersect select unnest(terms.words))) * 2
      + cardinality(array(select unnest(p.benefit_tags) intersect select unnest(terms.words)))
    )::double precision as score
  from public.products p, terms
  order by score desc, p.rating desc, p.review_count desc
  limit greatest(match_limit, 1);
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'diary_images',
  'diary_images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Diary images are publicly readable" on storage.objects;
create policy "Diary images are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'diary_images');

drop policy if exists "Users can upload own diary images" on storage.objects;
create policy "Users can upload own diary images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'diary_images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own diary images" on storage.objects;
create policy "Users can update own diary images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'diary_images'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
)
with check (
  bucket_id = 'diary_images'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

drop policy if exists "Users can delete own diary images" on storage.objects;
create policy "Users can delete own diary images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'diary_images'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

grant usage on schema public to anon, authenticated;
grant select on public.products, public.product_variants to anon;
grant select, insert, update, delete on public.products, public.product_variants to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.orders, public.order_items to authenticated;
grant select, insert, update, delete on public.skin_profiles, public.skin_diaries to authenticated;
grant select, insert, update, delete on public.consultations to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.match_products_by_embedding(vector, integer, text) to anon, authenticated;
grant execute on function public.match_products_by_symptoms(text, integer) to anon, authenticated;

-- Promote the first admin manually after signup:
-- update public.profiles set role = 'admin' where email = 'admin@example.com';
