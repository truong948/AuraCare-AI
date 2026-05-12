-- Create skin_diaries table with public URL references to diary_images storage
create table if not exists public.skin_diaries (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id),
  image_url text not null,
  notes text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.skin_diaries enable row level security;

create policy "Select own diary entries"
  on public.skin_diaries
  for select
  using (auth.uid() = user_id);

create policy "Insert own diary entries"
  on public.skin_diaries
  for insert
  with check (auth.uid() = user_id);

create policy "Update own diary entries"
  on public.skin_diaries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
