'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { RUN_TYPES, getWeekKey, fmtWeekLabel, fmtWeekRange } from './utils'

export default function WeeklyDistanceChart({ activities }) {
  const now = new Date()
  const weeks = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(new Date(d).setDate(diff))
    const yyyy = monday.getFullYear()
    const mm = String(monday.getMonth() + 1).padStart(2, '0')
    const dd = String(monday.getDate()).padStart(2, '0')
    weeks.push(`${yyyy}-${mm}-${dd}`)
  }

  const weekMap = {}
  for (const wk of weeks) weekMap[wk] = { week: wk, distance_km: 0, count: 0 }

  for (const a of activities) {
    if (!RUN_TYPES.has(a.activity_type)) continue
    const wk = getWeekKey(a.started_at)
    if (weekMap[wk]) {
      weekMap[wk].distance_km += (a.distance_m ?? 0) / 1000
      weekMap[wk].count += 1
    }
  }

  const data = weeks.map((wk) => {
    const weekEndDate = new Date(wk + 'T00:00:00')
    weekEndDate.setDate(weekEndDate.getDate() + 6)
    const pad = (n) => String(n).padStart(2, '0')
    const weekEnd = `${weekEndDate.getFullYear()}-${pad(weekEndDate.getMonth() + 1)}-${pad(weekEndDate.getDate())}`
    return {
      label: fmtWeekLabel(wk),
      weekStart: wk,
      weekEnd,
      distance_km: parseFloat(weekMap[wk].distance_km.toFixed(2)),
      count: weekMap[wk].count,
      isCurrentWeek: wk === getWeekKey(now),
    }
  })

  const maxKm = Math.max(...data.map((d) => d.distance_km), 1)

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">Last 12 weeks — running activities only</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            domain={[0, Math.ceil(maxKm * 1.15)]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit=" km"
            width={48}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">
                    {fmtWeekRange(d?.weekStart, d?.weekEnd)}
                  </p>
                  <p className="text-slate-800 font-semibold">{d?.distance_km} km</p>
                  <p className="text-slate-400">
                    {d?.count} run{d?.count !== 1 ? 's' : ''}
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="distance_km" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isCurrentWeek ? '#7c3aed' : '#c4b5fd'}
                aria-label={`${fmtWeekRange(entry.weekStart, entry.weekEnd)}: ${entry.distance_km} km`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-violet-300 inline-block" />
          Past weeks
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-violet-600 inline-block" />
          Current week
        </span>
      </div>
    </div>
  )
}
