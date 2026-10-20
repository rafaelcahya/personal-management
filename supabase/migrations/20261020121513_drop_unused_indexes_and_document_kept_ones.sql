-- dropped: no query can use them
drop index if exists public.idx_trade_list_ticker;      -- code uses ilike '%...%'; a btree cannot serve a leading wildcard
drop index if exists public.idx_trade_list_deleted_at;  -- single column; deleted_at IS NULL always comes with user_id
drop index if exists public.idx_event_list_tags;        -- no query filters by tag
drop index if exists public.idx_event_list_is_favorite; -- low-cardinality boolean; read and counted in memory only
drop index if exists public.idx_event_list_deleted_at;  -- covered by idx_event_list_user_deleted

-- kept: unused today only because the tables are tiny
comment on index public.idx_event_list_user_deleted is 'Kept: (user_id, deleted_at) matches the event list query; unused only because the table is small.';
comment on index public.idx_buy_reason_options_user_id is 'Kept: user_id is the RLS filter column; unused only because the table is tiny.';
comment on index public.idx_entry_occasion_options_user_id is 'Kept: user_id is the RLS filter column; unused only because the table is tiny.';
comment on index public.idx_entry_session_options_user_id is 'Kept: user_id is the RLS filter column; unused only because the table is tiny.';
comment on index public.idx_sell_reason_options_user_id is 'Kept: user_id is the RLS filter column; unused only because the table is tiny.';
comment on index public.idx_stock_type_options_user_id is 'Kept: user_id is the RLS filter column; unused only because the table is tiny.';
comment on index public.idx_rt_goals_user_id is 'Kept: user_id is the RLS filter column; unused only because the table is small.';
comment on index public.idx_rt_gear_user_id is 'Kept: user_id is the RLS filter column; unused only because the table is tiny.';
comment on index public.idx_rt_race_log_activity_id is 'Kept: supports the foreign key to rt_activities, so deleting an activity does not scan rt_race_log.';
comment on index public.idx_push_delivery_log_user_status_created is 'Kept: matches the getPushStatus queries (user_id, status, newest first); the table is pruned on a schedule.';
