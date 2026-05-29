import { RUN_TYPES, getWeekKey } from './utils'
import { fmtPace } from '@/app/main/running/(app)/dashboard/utils/format'

export default function SummaryStats({ activities }) {
  const runActivities = activities.filter((a) => RUN_TYPES.has(a.activity_type))

  const totalDistKm = runActivities.reduce((s, a) => s + (a.distance_m ?? 0) / 1000, 0)
  const totalRuns = runActivities.length

  const bestPace = runActivities
    .filter((a) => a.avg_pace_sec_per_km)
    .reduce((best, a) => (a.avg_pace_sec_per_km < best ? a.avg_pace_sec_per_km : best), Infinity)

  const weekMap = {}
  for (const a of runActivities) {
    const wk = getWeekKey(a.started_at)
    weekMap[wk] = (weekMap[wk] ?? 0) + (a.distance_m ?? 0) / 1000
  }
  const weekValues = Object.values(weekMap)
  const avgWeeklyKm =
    weekValues.length > 0 ? weekValues.reduce((s, v) => s + v, 0) / weekValues.length : 0

  const stats = [
    { label: 'Total Runs', value: String(totalRuns), unit: null },
    { label: 'Total Distance', value: totalDistKm.toFixed(0), unit: 'km' },
    { label: 'Avg Weekly', value: avgWeeklyKm.toFixed(1), unit: 'km/wk' },
    {
      label: 'Best Pace',
      value: bestPace < Infinity ? fmtPace(bestPace) : '—',
      unit: bestPace < Infinity ? '/km' : null,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-slate-200/70 rounded-lg px-4 py-3 shadow-sm"
        >
          <p className="text-xs text-slate-400">{s.label}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold text-slate-800 tabular-nums">{s.value}</span>
            {s.unit && <span className="text-xs text-slate-400">{s.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
