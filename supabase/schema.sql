-- Create profile table
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
on public.profiles for select
using (auth.uid() = id);

create policy "Profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id);

create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

-- Documents table (resume/cv/cover letter drafts)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  type text not null,
  title text,
  data jsonb not null default '{}'::jsonb,
  template jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists documents_user_id_idx on public.documents (user_id);

alter table public.documents enable row level security;

create policy "Documents are viewable by owner"
on public.documents for select
using (auth.uid() = user_id);

create policy "Documents are insertable by owner"
on public.documents for insert
with check (auth.uid() = user_id);

create policy "Documents are updatable by owner"
on public.documents for update
using (auth.uid() = user_id);

create policy "Documents are deletable by owner"
on public.documents for delete
using (auth.uid() = user_id);

-- AI usage tracking (2 per day for free users)
create table if not exists public.ai_usage (
  user_id uuid primary key references auth.users on delete cascade,
  count int not null default 0,
  reset_at timestamptz not null default (now() + interval '1 day'),
  updated_at timestamptz not null default now()
);

alter table public.ai_usage enable row level security;

create policy "AI usage are viewable by owner"
on public.ai_usage for select
using (auth.uid() = user_id);

create policy "AI usage are insertable by owner"
on public.ai_usage for insert
with check (auth.uid() = user_id);

create policy "AI usage are updatable by owner"
on public.ai_usage for update
using (auth.uid() = user_id);

-- Simple rate limiting table (server-side enforcement)
create table if not exists public.rate_limits (
  key text primary key,
  count int not null default 0,
  reset_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.rate_limits enable row level security;
