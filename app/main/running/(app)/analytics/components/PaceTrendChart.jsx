'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fmtPaceTick } from './utils'
import { fmtPace } from '@/app/main/running/(app)/dashboard/utils/format'
import EmptyState from './EmptyState'

export default function PaceTrendChart({ trendData }) {
  const data = trendData
    .filter((a) => a.avg_pace_sec_per_km)
    .map((a) => ({
      date: new Date(a.started_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      pace: a.avg_pace_sec_per_km,
    }))

  if (data.length < 3) {
    return <EmptyState message="Need at least 3 runs to show pace trend" />
  }

  const paces = data.map((d) => d.pace)
  const paceMin = Math.max(0, Math.min(...paces) - 15)
  const paceMax = Math.max(...paces) + 30

  const withAvg = data.map((d, i) => {
    if (i < 2) return { ...d, avg: null }
    const slice = data.slice(i - 2, i + 1).map((x) => x.pace)
    return { ...d, avg: Math.round(slice.reduce((s, v) => s + v, 0) / 3) }
  })

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">
        Last {data.length} runs · lower = faster · purple line = 3-run moving average
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={withAvg} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
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
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  {payload.map((p) => (
                    <div key={p.dataKey} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: p.color }}
                      />
                      <span className="text-slate-500">{p.name}:</span>
                      <span className="font-semibold text-slate-800">
                        {p.value ? fmtPace(p.value) + ' /km' : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#c4b5fd"
            strokeWidth={1.5}
            dot={{ r: 3, fill: '#c4b5fd', strokeWidth: 0 }}
            name="Pace"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={false}
            name="3-run avg"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
