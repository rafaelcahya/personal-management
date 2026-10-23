# Supabase Query Patterns

## Filter + sort + paginate (safe against PGRST103)

```js
const MAX_LIMIT = 100

export async function getEvents(supabase, userId, { page = 1, limit = 20, from } = {}) {
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, limit))
  const start = (page - 1) * safeLimit

  const { count, error: countError } = await supabase
    .from('trd_event_list')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (countError) throw new Error(countError.message)

  const total = count ?? 0
  if (start >= total) {
    return { items: [], total, page, limit: safeLimit, totalPages: Math.ceil(total / safeLimit) }
  }

  let query = supabase
    .from('trd_event_list')
    .select('id, title, event_date, impact_direction')
    .eq('user_id', userId)
    .order('event_date', { ascending: false })
    .range(start, start + safeLimit - 1)
  if (from) query = query.gte('event_date', from)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return { items: data, total, page, limit: safeLimit, totalPages: Math.ceil(total / safeLimit) }
}
```

## Insert and return the row

```js
const { data, error } = await supabase
  .from('rt_race_log')
  .insert({ ...payload, user_id: userId })
  .select('id, title, race_date, distance_m, created_at')
  .single()
if (error) throw new Error(error.message)
return data
```

## Upsert (idempotent)

```js
const { data, error } = await supabase
  .from('rt_user_settings')
  .upsert({ user_id: userId, ...settings }, { onConflict: 'user_id' })
  .select('user_id, units, notify_race_reminder')
  .single()
```

## Delete with ownership — return whether anything was deleted

```js
const { data, error } = await supabase
  .from('rt_goals')
  .delete()
  .eq('id', goalId)
  .eq('user_id', userId)
  .select('id')
  .maybeSingle()
if (error) throw new Error(error.message)
return !!data
```

## Soft delete (tables with `deleted_at`, e.g. `trd_event_list`, `trd_currency_investments`)

```js
await supabase
  .from('trd_event_list')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', itemId)
  .eq('user_id', userId)
```

## Bulk operations — check ownership of every ID

```js
const { data, error } = await supabase
  .from('inv_product_name')
  .update({ status })
  .in('id', ids)
  .eq('user_id', userId)
  .select('id')
if (error) throw new Error(error.message)
if (data.length !== ids.length) {
  // some IDs weren't owned or didn't exist — report it, don't silently succeed
}
```
