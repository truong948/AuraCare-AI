-- AuraCare AI admin roles and user profile access.
-- Run this in Supabase SQL Editor after the base tables are created.

create schema if not exists app_private;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('user', 'admin');
  end if;
end $$;

alter table public.profiles
  add column if not exists role public.app_role not null default 'user',
  add column if not exists status text not null default 'active'
    check (status in ('active', 'suspended')),
  add column if not exists updated_at timestamptz not null default now();

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
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'user'::public.app_role,
    'active'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure app_private.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or app_private.get_user_role() = 'admin'::public.app_role
);

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile"
on public.profiles for insert
to authenticated
with check (
  id = auth.uid()
  and role = 'user'::public.app_role
  and status = 'active'
);

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update
to authenticated
using (app_private.get_user_role() = 'admin'::public.app_role)
with check (app_private.get_user_role() = 'admin'::public.app_role);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_status_idx on public.profiles(status);

-- Promote your first admin after creating the account:
-- update public.profiles set role = 'admin' where email = 'admin@example.com';
