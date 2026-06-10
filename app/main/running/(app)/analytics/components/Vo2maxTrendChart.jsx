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
import { RUN_TYPES, rolling30DayAvg } from './utils'
import EmptyState from './EmptyState'

export default function Vo2maxTrendChart({ activities }) {
  const pts = activities
    .filter((a) => RUN_TYPES.has(a.activity_type) && a.estimated_vo2max != null)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .slice(-90)
    .map((a) => ({
      date: a.started_at,
      label: new Date(a.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      vo2max: parseFloat(Number(a.estimated_vo2max).toFixed(2)),
    }))

  if (pts.length < 3) {
    return (
      <EmptyState
        message="Not enough VO₂max data yet"
        details="Needs 3+ runs with a VO₂max estimate — record with HR for 20+ min to generate one"
      />
    )
  }

  const data = rolling30DayAvg(pts, 'date', 'vo2max')

  return (
    <div className="outline-none">
      <p className="text-xs text-slate-400 mb-3">
        Last {pts.length} runs with HR data · purple line = 30-day rolling average
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toFixed(1)}
            unit=" ml"
            width={52}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  <p className="text-slate-800">
                    VO₂max:{' '}
                    <span className="font-semibold">
                      {d?.vo2max != null ? Number(d.vo2max).toFixed(1) : '—'} mL/kg/min
                    </span>
                  </p>
                  {d?.rollingAvg != null && (
                    <p className="text-violet-600 mt-0.5">
                      30d avg:{' '}
                      <span className="font-semibold">{Number(d.rollingAvg).toFixed(1)}</span>
                    </p>
                  )}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="vo2max"
            stroke="#c4b5fd"
            strokeWidth={0}
            dot={{ fill: '#c4b5fd', r: 3, strokeWidth: 0 }}
            name="VO₂max"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="rollingAvg"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            name="30d avg"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
