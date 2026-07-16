-- Issue #672: Valuation page for IDX stocks
-- Adds user watchlist table + shared fundamentals/valuation cache table.

create table if not exists trading_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  long_name text,
  created_at timestamptz not null default now(),
  unique(user_id, ticker)
);

alter table trading_watchlist enable row level security;

create policy "Users can manage their own watchlist"
  on trading_watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists trading_watchlist_fundamentals (
  ticker text primary key,
  data jsonb not null,
  fetched_at timestamptz not null default now()
);

alter table trading_watchlist_fundamentals enable row level security;

create policy "Authenticated users can read fundamentals cache"
  on trading_watchlist_fundamentals for select
  using (auth.role() = 'authenticated');

create policy "Service role can upsert fundamentals cache"
  on trading_watchlist_fundamentals for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
