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
      <div className="flex flex-col items-center justify-center h-[180px] gap-1 text-center px-4">
        <p className="text-sm text-slate-400">Not enough VO₂max data yet</p>
        <p id="vo2maxTrendEmptyCount_analyticsPage" className="text-xs text-slate-300">
          Need at least 3 runs with VO₂max estimates. Currently have {pts.length}. Qualifying runs
          require 20+ min with HR data.
        </p>
      </div>
    )
  }

  const data = rolling30DayAvg(pts, 'date', 'vo2max')

  return (
    <div className="outline-none">
      <p id="vo2maxTrendDataCount_analyticsPage" className="text-xs text-slate-400 mb-3">
        Showing {pts.length} data points from last 90 activities · purple line = 30-day rolling
        average
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
