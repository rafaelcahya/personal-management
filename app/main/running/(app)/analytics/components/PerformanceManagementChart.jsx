'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { fetchPmcSeries } from '@/lib/api/running'
import EmptyState from './EmptyState'

const RANGE_OPTIONS = [30, 60, 90]

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function tsbDot(props) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null) return null
  const fill = payload.tsb >= 0 ? '#10b981' : '#ef4444'
  return <circle cx={cx} cy={cy} r={3} fill={fill} stroke="none" />
}

export default function PerformanceManagementChart() {
  const [range, setRange] = useState(90)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback((days) => {
    setLoading(true)
    setError(null)
    let cancelled = false
    fetchPmcSeries(days)
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load PMC data')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => load(range), [range, load])

  return (
    <div>
      <p id="pmcGuide_analyticsPage" className="text-xs text-slate-400 leading-relaxed mb-3">
        Fitness is your long-term training load (28-day average) — it builds slowly and reflects
        your aerobic base. Fatigue is your short-term load (7-day average) — it rises and falls
        quickly with recent training. Form is the gap between the two: positive means you&apos;re
        fresh and ready to perform, negative means you&apos;re carrying fatigue.
      </p>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400">
          {data?.series?.length
            ? `Showing ${data.series.length} days`
            : 'Fitness (CTL) · Fatigue (ATL) · Form'}
        </p>
        <div className="flex items-center gap-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              id={`pmcRange${opt}Btn_analyticsPage`}
              type="button"
              aria-pressed={range === opt}
              onClick={() => setRange(opt)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                range === opt
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt}d
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div
          id="pmcChartLoading_analyticsPage"
          className="h-[240px] bg-slate-50 rounded-lg animate-pulse"
        />
      )}

      {!loading && error && (
        <div id="pmcChartError_analyticsPage" className="flex items-center gap-3 py-4">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => load(range)}
            className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && !data?.meets_min_history && (
        <EmptyState
          message="Not enough training history to show the chart (need 7+ days)"
          details="Log activities consistently for at least a week to see your Fitness/Fatigue/Form trend."
        />
      )}

      {!loading && !error && data?.meets_min_history && (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={data.series.map((d) => ({ ...d, label: fmtDate(d.date) }))}
            margin={{ top: 4, right: 8, left: -4, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                    <p className="font-medium text-slate-600 mb-1">{label}</p>
                    <p className="text-violet-600">
                      Fitness (CTL): <span className="font-semibold">{d?.chronic_load_28d}</span>
                    </p>
                    <p className="text-red-500 mt-0.5">
                      Fatigue (ATL): <span className="font-semibold">{d?.acute_load_7d}</span>
                    </p>
                    <p className={`mt-0.5 ${d?.tsb >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      Form: <span className="font-semibold">{d?.tsb}</span>
                    </p>
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
              dataKey="chronic_load_28d"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Fitness (CTL)"
            />
            <Line
              type="monotone"
              dataKey="acute_load_7d"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="Fatigue (ATL)"
            />
            <Line
              type="monotone"
              dataKey="tsb"
              stroke="#10b981"
              strokeWidth={2}
              dot={tsbDot}
              activeDot={{ r: 5 }}
              name="Form"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
