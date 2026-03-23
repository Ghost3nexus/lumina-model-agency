-- User credits (plan + remaining credits)
create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',
  credits_remaining int not null default 5,
  credits_monthly int not null default 5,
  stripe_customer_id text,
  stripe_subscription_id text,
  resets_at timestamptz default (now() + interval '30 days'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Model contracts (per-model licensing)
create table if not exists public.model_contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model_id text not null,
  license_type text not null default 'standard',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Index for fast lookups
create index if not exists idx_model_contracts_user on public.model_contracts(user_id);
create index if not exists idx_model_contracts_user_model on public.model_contracts(user_id, model_id);

-- RLS policies
alter table public.user_credits enable row level security;
alter table public.model_contracts enable row level security;

-- Users can read their own data
create policy "Users can read own credits" on public.user_credits
  for select using (auth.uid() = user_id);

create policy "Users can read own contracts" on public.model_contracts
  for select using (auth.uid() = user_id);

-- Auto-create user_credits on signup (via trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_credits (user_id, plan, credits_remaining, credits_monthly)
  values (new.id, 'free', 5, 5);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
