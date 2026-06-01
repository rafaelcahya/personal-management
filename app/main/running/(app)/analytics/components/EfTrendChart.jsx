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
      <EmptyState
        message="Not enough Efficiency Factor data yet"
        details="Needs 3+ runs with an Efficiency Factor — record with HR for 20+ min to generate one"
      />
    )
  }

  const data = rolling30DayAvg(basePts, 'date', 'ef')

  return (
    <div className="outline-none">
      <p className="text-xs text-slate-400 mb-3">
        Last {basePts.length} runs · colored dots vs 30-day average
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
            stroke="#c4b5fd"
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
            stroke="#7c3aed"
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
