'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts'
import { fetchEnduranceScoreTrend } from '@/lib/api/running'
import { ENDURANCE_TIER_BANDS, getEnduranceTier } from '@/lib/services/running/utils/enduranceScore'

function fmtWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function EnduranceScoreTrendChart() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    let cancelled = false
    fetchEnduranceScoreTrend()
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load endurance score data')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(load, [load])

  if (loading) {
    return (
      <div
        id="enduranceScoreTrendLoading_analyticsPage"
        className="h-[220px] bg-slate-50 rounded-lg animate-pulse"
      />
    )
  }

  if (error) {
    return (
      <div id="enduranceScoreTrendError_analyticsPage" className="flex items-center gap-3 py-4">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={load}
          className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
        >
          Try again
        </button>
      </div>
    )
  }

  const weekly = data?.weekly ?? []

  if (weekly.length === 0) {
    return (
      <div
        id="enduranceScoreTrendEmpty_analyticsPage"
        className="flex flex-col items-center justify-center h-[180px] gap-1 text-center px-4"
      >
        <p className="text-sm text-slate-400">Not enough data yet</p>
        <p className="text-xs text-slate-300">
          Need at least 4 qualifying runs with HR + VO₂max data to show the trend.
        </p>
      </div>
    )
  }

  const chartData = weekly.map((w) => ({ ...w, label: fmtWeek(w.week) }))

  return (
    <div>
      <p id="enduranceScoreTrendDataCount_analyticsPage" className="text-xs text-slate-400 mb-3">
        Showing {weekly.length} week{weekly.length !== 1 ? 's' : ''} · VO₂max (40%) + training load
        (30%) + long run (30%)
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          {ENDURANCE_TIER_BANDS.map((band) => (
            <ReferenceArea
              key={band.label}
              y1={band.y1}
              y2={band.y2}
              fill={band.fill}
              fillOpacity={band.opacity}
              ifOverflow="hidden"
              label={{
                value: band.label,
                position: 'insideRight',
                fontSize: 9,
                fill: '#94a3b8',
              }}
            />
          ))}
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              const tier = getEnduranceTier(d?.endurance_score)
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  <p className="text-slate-800">
                    Score: <span className="font-semibold">{d?.endurance_score}</span>
                    {tier && <span className="text-slate-400 ml-1">({tier})</span>}
                  </p>
                  {d?.avg_vo2max != null && (
                    <p className="text-indigo-600 mt-0.5">
                      VO₂max: <span className="font-semibold">{d.avg_vo2max} mL/kg/min</span>
                    </p>
                  )}
                  {d?.best_long_run_km != null && (
                    <p className="text-slate-500 mt-0.5">
                      Long run: <span className="font-semibold">{d.best_long_run_km} km</span>
                    </p>
                  )}
                  {d?.chronic_load != null && (
                    <p className="text-slate-400 mt-0.5">Load: {d.chronic_load} pts/day</p>
                  )}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="endurance_score"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ fill: '#4f46e5', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            name="Endurance Score"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
