-- Create skin_profiles table with array storage for concerns and allergies
create table if not exists public.skin_profiles (
  user_id uuid not null primary key references auth.users(id),
  skin_type text not null,
  concerns text[] not null,
  allergies text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Enable Row Level Security
alter table public.skin_profiles enable row level security;

-- Allow authenticated users to read only their own profile
create policy "Allow authenticated users to select own profile"
  on public.skin_profiles
  for select
  using (auth.uid() = user_id);

-- Allow authenticated users to insert only their own profile
create policy "Allow authenticated users to insert own profile"
  on public.skin_profiles
  for insert
  with check (auth.uid() = user_id);

-- Allow authenticated users to update only their own profile
create policy "Allow authenticated users to update own profile"
  on public.skin_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
