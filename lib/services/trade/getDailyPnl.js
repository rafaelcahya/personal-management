export async function getDailyPnl(supabase, userId, year, month) {
  const pad = (n) => String(n).padStart(2, '0')
  const startDate = `${year}-${pad(month)}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${pad(month)}-${pad(lastDay)}`

  const { data, error } = await supabase
    .from('trade_list')
    .select('sell_date, realized_gain')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gte('sell_date', startDate)
    .lte('sell_date', endDate)

  if (error) {
    console.error('[trade/getDailyPnl]', error)
    throw new Error('Failed to load daily PnL')
  }

  const grouped = {}
  for (const row of data ?? []) {
    const d = row.sell_date
    if (!d) continue
    if (!grouped[d]) grouped[d] = { pnl: 0, count: 0 }
    grouped[d].pnl += parseFloat(row.realized_gain) || 0
    grouped[d].count += 1
  }

  return Object.entries(grouped).map(([date, { pnl, count }]) => ({ date, pnl, count }))
}
