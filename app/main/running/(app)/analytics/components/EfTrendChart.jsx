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
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'

export default function EfTrendChart({ activities }) {
  const basePts = activities
    .filter((a) => RUN_TYPES.has(a.activity_type) && a.efficiency_factor != null)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .slice(-90)
    .map((a) => ({
      date: a.started_at,
      label: new Date(a.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ef: parseFloat(Number(a.efficiency_factor).toFixed(4)),
    }))

  if (basePts.length < 3) {
    return (
      <EmptyState size="sm">
        <EmptyStateTitle>Not enough Efficiency Factor data yet</EmptyStateTitle>
        <EmptyStateDescription id="efTrendEmptyCount_analyticsPage">
          Need at least 3 runs with EF calculated. Currently have {basePts.length}. Qualifying runs
          require 20+ min with HR data.
        </EmptyStateDescription>
      </EmptyState>
    )
  }

  const data = rolling30DayAvg(basePts, 'date', 'ef')

  return (
    <div className="outline-none">
      <p id="efTrendDataCount_analyticsPage" className="text-xs text-slate-400 mb-3">
        Showing {basePts.length} data points from last 90 activities · colored dots vs 30-day
        average
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toFixed(3)}
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
                    EF:{' '}
                    <span className="font-semibold">
                      {d?.ef != null ? Number(d.ef).toFixed(4) : '—'}
                    </span>
                  </p>
                  {d?.rollingAvg != null && (
                    <p className="text-violet-600 mt-0.5">
                      30d avg:{' '}
                      <span className="font-semibold">{Number(d.rollingAvg).toFixed(4)}</span>
                    </p>
                  )}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="ef"
            stroke="var(--color-violet-300)"
            strokeWidth={0}
            dot={(props) => {
              const { cx, cy, index, payload } = props
              const color = payload.ef > payload.rollingAvg ? '#22c55e' : '#ef4444'
              return <circle key={index} cx={cx} cy={cy} r={3} fill={color} stroke="none" />
            }}
            name="EF"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="rollingAvg"
            stroke="var(--color-violet-600)"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={false}
            name="30d avg"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          Above avg
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          Below avg
        </span>
      </div>
    </div>
  )
}
