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
import { RUN_TYPES, DISTANCE_BRACKETS, getBracket, fmtPaceTick } from './utils'
import { fmtPace } from '@/app/main/running/(app)/dashboard/utils/format'
import EmptyState from './EmptyState'

export default function BestPaceChart({ activities }) {
  const bracketMap = {}
  for (const a of activities) {
    if (!RUN_TYPES.has(a.activity_type) || !a.avg_pace_sec_per_km || !a.distance_m) continue
    const b = getBracket(a.distance_m)
    if (!b) continue
    if (!bracketMap[b.key] || a.avg_pace_sec_per_km < bracketMap[b.key].best_pace) {
      bracketMap[b.key] = {
        label: b.label,
        color: b.color,
        best_pace: a.avg_pace_sec_per_km,
        date: a.started_at,
      }
    }
  }

  const data = DISTANCE_BRACKETS.filter((b) => bracketMap[b.key]).map((b) => ({
    label: b.label,
    pace: bracketMap[b.key].best_pace,
    color: b.color,
    dateLabel: new Date(bracketMap[b.key].date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  if (data.length === 0) {
    return <EmptyState message="Not enough data across distance categories yet" />
  }

  const paceMin = Math.max(0, Math.min(...data.map((d) => d.pace)) - 20)
  const paceMax = Math.max(...data.map((d) => d.pace)) + 30

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">Best average pace per distance range</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[paceMin, paceMax]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtPaceTick}
            width={44}
            reversed
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{d?.label}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: d?.color }}
                    />
                    <span className="text-slate-500">Best pace:</span>
                    <span className="font-semibold text-slate-800">{fmtPace(d?.pace)} /km</span>
                  </div>
                  <p className="text-slate-400 mt-0.5">{d?.dateLabel}</p>
                </div>
              )
            }}
          />
          <Bar dataKey="pace" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2 text-right">lower bar = faster pace</p>
    </div>
  )
}
