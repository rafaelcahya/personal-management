'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { RUN_TYPES } from './utils'
import EmptyState from './EmptyState'
import Button from '@/components/base/Button/Button'

const RANGE_OPTIONS = [30, 60, 90]
const ROLLING_WINDOW = 30

export default function RunningPowerChart({ activities }) {
  const [range, setRange] = useState(90)

  const pts = activities
    .filter((a) => RUN_TYPES.has(a.activity_type) && a.device_watts === true && a.avg_watts != null)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))

  if (pts.length === 0) {
    return (
      <EmptyState
        message="No running power data yet"
        details="Power data requires a compatible device (e.g. Garmin running power) synced via Strava."
      />
    )
  }

  const withRolling = pts.map((a, i) => {
    const windowStart = Math.max(0, i - ROLLING_WINDOW + 1)
    const window = pts.slice(windowStart, i + 1)
    const rollingAvg = Math.round(
      window.reduce((s, x) => s + Number(x.avg_watts), 0) / window.length
    )
    return { ...a, rollingAvg }
  })

  const sliced = withRolling.slice(-range)

  const data = sliced.map((a) => ({
    label: new Date(a.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    avg_watts: Math.round(Number(a.avg_watts)),
    weighted_avg_watts:
      a.weighted_avg_watts != null ? Math.round(Number(a.weighted_avg_watts)) : null,
    rollingAvg: a.rollingAvg,
  }))

  return (
    <div>
      <p id="powerGuide_analyticsPage" className="text-xs text-slate-400 leading-relaxed mb-3">
        Power is your average running power per activity — higher generally means more effort.
        Weighted power smooths out spikes from hills and surges, reflecting your true effort on
        variable terrain better than a simple average. The rolling average shows your power trend
        over your last {ROLLING_WINDOW} activities.
      </p>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400">
          Showing {sliced.length} activities · violet line = {ROLLING_WINDOW}-activity rolling avg
        </p>
        <div className="flex items-center gap-1">
          {RANGE_OPTIONS.map((opt) => (
            <Button
              key={opt}
              id={`powerRange${opt}Btn_analyticsPage`}
              type="button"
              size="xs"
              aria-pressed={range === opt}
              onClick={() => setRange(opt)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                range === opt
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
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
            unit=" W"
            width={48}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  <p className="text-slate-800">
                    Power: <span className="font-semibold">{d?.avg_watts} W</span>
                  </p>
                  {d?.weighted_avg_watts != null && (
                    <p className="text-amber-600 mt-0.5">
                      Weighted: <span className="font-semibold">{d.weighted_avg_watts} W</span>
                    </p>
                  )}
                  {d?.rollingAvg != null && (
                    <p className="text-violet-600 mt-0.5">
                      {ROLLING_WINDOW}-activity avg:{' '}
                      <span className="font-semibold">{d.rollingAvg} W</span>
                    </p>
                  )}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="avg_watts"
            stroke="#c4b5fd"
            strokeWidth={0}
            dot={{ fill: '#c4b5fd', r: 3, strokeWidth: 0 }}
            name="Power"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="weighted_avg_watts"
            stroke="#f59e0b"
            strokeWidth={1.5}
            dot={false}
            name="Weighted Power"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="rollingAvg"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            name={`${ROLLING_WINDOW}-activity avg`}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
