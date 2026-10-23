-- notifications: the service role bypasses RLS, so its policy only adds work for every other role
drop policy if exists "Service role can manage notifications" on public.notifications;
drop policy if exists "Users can view own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;

create policy "Users can view own notifications" on public.notifications
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can update own notifications" on public.notifications
  for update to authenticated using ((select auth.uid()) = user_id);

-- shared caches: written only with the admin client (bypasses RLS), read by any signed-in user
drop policy if exists "Service role can upsert research cache" on public.trading_research_cache;
drop policy if exists "Authenticated users can read research cache" on public.trading_research_cache;
create policy "Authenticated users can read research cache" on public.trading_research_cache
  for select to authenticated using (true);

drop policy if exists "Service role can upsert fundamentals cache" on public.trading_watchlist_fundamentals;
drop policy if exists "Authenticated users can read fundamentals cache" on public.trading_watchlist_fundamentals;
create policy "Authenticated users can read fundamentals cache" on public.trading_watchlist_fundamentals
  for select to authenticated using (true);
