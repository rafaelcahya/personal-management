import { stringToNumber } from '@/lib/utils/common'
import { LOW_STOCK_THRESHOLD, PRODUCT_STATUS } from '@/lib/constants/inventory'
import { daysAgoIso, wibDate, wibDaysUntil } from '@/lib/utils/wib'

const WINDOW_DAYS = 7
const RACE_LOOKAHEAD_DAYS = 14

const idr = (value) => `Rp. ${Math.round(Math.abs(value)).toLocaleString('id-ID')}`
const signedIdr = (value) => `${value < 0 ? '-' : '+'}${idr(value)}`
// One summary line: `full` for the in-app message, `safe` (no money amounts) for the push, because
// a push body shows on the lock screen.
const line = (label, full, safe) =>
  full.length
    ? {
        text: `${label}: ${full.join(', ')}`,
        push: safe.length ? `${label}: ${safe.join(', ')}` : null,
      }
    : null
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

async function inventoryLine(admin, userId, now) {
  const [productsRes, budgetRes, spendRes] = await Promise.all([
    admin
      .from('product_list')
      .select('quantity')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .eq('product_status', PRODUCT_STATUS.ACTIVE),
    admin.from('inventory_budget').select('monthly_budget').eq('user_id', userId),
    admin
      .from('product_quantity')
      .select('price')
      .eq('user_id', userId)
      // purchase_date is a timestamp without time zone holding WIB wall-clock time, so compare a plain date
      .gte('purchase_date', `${wibDate(now).slice(0, 7)}-01`),
  ])
  for (const res of [productsRes, budgetRes, spendRes])
    if (res.error) throw new Error(res.error.message)

  const products = productsRes.data ?? []
  const out = products.filter((p) => p.quantity === 0).length
  const low = products.filter((p) => p.quantity > 0 && p.quantity < LOW_STOCK_THRESHOLD).length
  const budget = (budgetRes.data ?? []).reduce((sum, b) => sum + Number(b.monthly_budget || 0), 0)
  const spent = (spendRes.data ?? []).reduce((sum, r) => sum + Number(r.price || 0), 0)

  const stock = []
  if (low > 0) stock.push(`${low} low`)
  if (out > 0) stock.push(`${out} out of stock`)
  const budgetPart = budget > 0 ? [`${idr(spent)} of ${idr(budget)} budget used`] : []
  // A budget alone isn't news; only mention it when there's stock trouble or spending.
  if (low + out === 0 && spent === 0) return null
  return line('Inventory', [...stock, ...budgetPart], stock)
}

async function tradingLine(admin, userId, now) {
  const today = wibDate(now)
  const weekAgo = wibDate(new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000))
  const [tradesRes, eventsRes] = await Promise.all([
    admin
      .from('trade_list')
      .select('realized_gain')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .gt('sell_date', weekAgo)
      .lte('sell_date', today),
    admin
      .from('event_list')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('deleted_at', null)
      .gte('event_date', now.toISOString())
      .lt('event_date', new Date(now.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()),
  ])
  for (const res of [tradesRes, eventsRes]) if (res.error) throw new Error(res.error.message)

  const trades = tradesRes.data ?? []
  const events = eventsRes.count ?? 0
  const full = []
  const safe = []
  if (trades.length > 0) {
    const pnl = trades.reduce((sum, t) => sum + stringToNumber(t.realized_gain), 0)
    full.push(`${plural(trades.length, 'trade')} closed, ${signedIdr(pnl)}`)
    safe.push(`${plural(trades.length, 'trade')} closed`)
  }
  if (events > 0) {
    full.push(`${plural(events, 'event')} ahead`)
    safe.push(`${plural(events, 'event')} ahead`)
  }
  return line('Trading', full, safe)
}

async function runningLine(admin, userId, now) {
  const today = wibDate(now)
  const [runsRes, raceRes] = await Promise.all([
    admin
      .from('rt_activities')
      .select('distance_m')
      .eq('user_id', userId)
      .gte('started_at', daysAgoIso(WINDOW_DAYS, now))
      .lte('started_at', now.toISOString()),
    admin
      .from('rt_goals')
      .select('title, target_date')
      .eq('user_id', userId)
      .eq('goal_type', 'race')
      .eq('status', 'active')
      .gte('target_date', today)
      .order('target_date', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])
  for (const res of [runsRes, raceRes]) if (res.error) throw new Error(res.error.message)

  const runs = runsRes.data ?? []
  const parts = []
  if (runs.length > 0) {
    const km = runs.reduce((sum, a) => sum + (Number(a.distance_m) || 0), 0) / 1000
    parts.push(`${plural(runs.length, 'run')}, ${km.toFixed(1)} km`)
  }
  if (raceRes.data) {
    const days = wibDaysUntil(raceRes.data.target_date, now)
    if (days <= RACE_LOOKAHEAD_DAYS) {
      parts.push(`${raceRes.data.title ?? 'race'} in ${plural(days, 'day')}`)
    }
  }
  return line('Running', parts, parts)
}

/**
 * The weekly cross-module snapshot. Modules with nothing to say are left out; returns null when
 * every module is empty so the job sends nothing. Uses the admin client (jobs have no session);
 * every query filters by user_id. Windows are rolling 7 days; "today" and the month follow WIB.
 * @param {import('@supabase/supabase-js').SupabaseClient} admin
 * @param {string} userId
 * @param {Date} [now]
 * @returns {Promise<{ lines: string[], message: string, pushMessage: string } | null>}
 */
export async function getWeeklySummary(admin, userId, now = new Date()) {
  const lines = (
    await Promise.all([
      runningLine(admin, userId, now),
      tradingLine(admin, userId, now),
      inventoryLine(admin, userId, now),
    ])
  ).filter(Boolean)

  if (lines.length === 0) return null
  const pushLines = lines.map((l) => l.push).filter(Boolean)
  return {
    lines: lines.map((l) => l.text),
    message: lines.map((l) => l.text).join(' · '),
    pushMessage: pushLines.length ? pushLines.join(' · ') : 'Your week at a glance is ready.',
  }
}
