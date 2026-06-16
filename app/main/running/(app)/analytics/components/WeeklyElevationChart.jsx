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
import EmptyState from './EmptyState'

export default function WeeklyElevationChart({ activities }) {
  const now = new Date()
  const weeks = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(new Date(d).setDate(diff))
    weeks.push(monday.toISOString().slice(0, 10))
  }

  const weekMap = {}
  for (const wk of weeks) weekMap[wk] = { week: wk, elevation_gain_m: 0, count: 0 }

  let hasAnyElevation = false
  for (const a of activities) {
    if (!RUN_TYPES.has(a.activity_type)) continue
    const wk = getWeekKey(a.started_at)
    if (weekMap[wk]) {
      const gain = Number(a.elevation_gain_m) || 0
      if (gain > 0) hasAnyElevation = true
      weekMap[wk].elevation_gain_m += gain
      weekMap[wk].count += 1
    }
  }

  if (!hasAnyElevation) {
    return (
      <EmptyState
        message="No elevation data yet"
        details="Log runs with elevation gain to see your weekly climbing trend."
      />
    )
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
      elevation_gain_m: Math.round(weekMap[wk].elevation_gain_m),
      count: weekMap[wk].count,
      isCurrentWeek: wk === getWeekKey(now.toISOString()),
    }
  })

  const maxGain = Math.max(...data.map((d) => d.elevation_gain_m), 1)

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
            domain={[0, Math.ceil(maxGain * 1.15)]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit=" m"
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
                  <p className="text-slate-800 font-semibold">{d?.elevation_gain_m} m gain</p>
                  <p className="text-slate-400">
                    {d?.count} run{d?.count !== 1 ? 's' : ''}
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="elevation_gain_m" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isCurrentWeek ? '#16a34a' : '#bbf7d0'}
                aria-label={`${fmtWeekRange(entry.weekStart, entry.weekEnd)}: ${entry.elevation_gain_m} m`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-green-200 inline-block" />
          Past weeks
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-green-600 inline-block" />
          Current week
        </span>
      </div>
    </div>
  )
}
