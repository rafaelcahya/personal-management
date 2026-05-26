'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { AlertCircle, Activity } from 'lucide-react'
import { fetchActivityStreams } from '@/lib/api/running'

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{children}</p>
  )
}

function SubLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
      {children}
    </p>
  )
}

function fmtPaceSec(sec) {
  if (!sec || sec <= 0) return ''
  const m = Math.floor(sec / 60)
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

function StreamTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">
        {Number.isFinite(Number(label)) ? `${Number(label).toFixed(2)} km` : ''}
      </p>
      <p className="font-medium text-slate-700">{val != null ? formatter(val) : '—'}</p>
    </div>
  )
}

const AXIS_PROPS = {
  tick: { fontSize: 10, fill: '#94a3b8' },
  tickLine: false,
  axisLine: false,
}

const GRID_PROPS = {
  strokeDasharray: '3 3',
  stroke: '#f1f5f9',
  vertical: false,
}

const XAXIS = (
  <XAxis
    dataKey="dist_km"
    type="number"
    domain={['dataMin', 'dataMax']}
    tickFormatter={(v) => v.toFixed(0)}
    {...AXIS_PROPS}
    unit=" km"
  />
)

function PaceChart({ data }) {
  return (
    <div>
      <SubLabel>Pace</SubLabel>
      <div className="h-[100px] sm:h-[120px]" data-testid="streamChartPace">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} syncId="streamCharts" margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis
              reversed
              tickFormatter={fmtPaceSec}
              width={36}
              {...AXIS_PROPS}
            />
            <Tooltip
              content={
                <StreamTooltip
                  formatter={(sec) => `${fmtPaceSec(sec)} /km`}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="pace"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function HrStreamChart({ data }) {
  return (
    <div>
      <SubLabel>Heart Rate</SubLabel>
      <div className="h-[90px] sm:h-[110px]" data-testid="streamChartHr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} syncId="streamCharts" margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis width={36} {...AXIS_PROPS} />
            <Tooltip
              content={<StreamTooltip formatter={(v) => `${v} bpm`} />}
            />
            <Line
              type="monotone"
              dataKey="hr"
              stroke="#ef4444"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ElevationChart({ data }) {
  return (
    <div>
      <SubLabel>Elevation</SubLabel>
      <div className="h-[75px] sm:h-[90px]" data-testid="streamChartElevation">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} syncId="streamCharts" margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis width={36} {...AXIS_PROPS} />
            <Tooltip
              content={<StreamTooltip formatter={(v) => `${Math.round(v)} m`} />}
            />
            <Area
              type="monotone"
              dataKey="alt"
              stroke="#94a3b8"
              strokeWidth={1}
              fill="#f1f5f9"
              fillOpacity={0.8}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function StreamCharts({ activityId }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const [thinned, setThinned] = useState([])

  const load = useCallback(async () => {
    if (!activityId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchActivityStreams(activityId, '10s')
      const raw = res.data ?? []
      const step = Math.max(1, Math.ceil(raw.length / 500))
      const processed = raw
        .filter((_, i) => i % step === 0 || i === raw.length - 1)
        .map((d) => ({ ...d, dist_km: d.dist_m != null ? d.dist_m / 1000 : null }))
      setMeta(res.meta)
      setThinned(processed)
    } catch (err) {
      setError(err.message || 'Failed to load stream data')
    } finally {
      setLoading(false)
    }
  }, [activityId])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div
        data-testid="streamChartsLoading"
        className="flex flex-col gap-4 animate-pulse"
        aria-label="Loading performance charts"
      >
        <div className="h-3 bg-slate-100 rounded w-24" />
        <div className="h-[100px] sm:h-[120px] bg-slate-100 rounded-lg" />
        <div className="h-[90px] sm:h-[110px] bg-slate-100 rounded-lg" />
        <div className="h-[75px] sm:h-[90px] bg-slate-100 rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        data-testid="streamChartsError"
        role="alert"
        aria-live="polite"
        className="flex items-center gap-2 py-4 text-sm text-slate-400"
      >
        <AlertCircle className="size-4 text-red-400 shrink-0" aria-hidden="true" />
        <span>Could not load stream data.</span>
        <button
          data-testid="streamChartsRetry"
          onClick={load}
          className="ml-auto text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
        >
          Try again
        </button>
      </div>
    )
  }

  const hasPace = thinned.some((d) => d.pace != null && d.pace > 0)
  const hasHr = meta?.has_hr && thinned.some((d) => d.hr != null)
  const hasAlt = meta?.has_altitude && thinned.some((d) => d.alt != null)

  if (!hasPace && !hasHr && !hasAlt) {
    return (
      <div
        data-testid="streamChartsEmpty"
        className="flex items-center gap-2 py-6 justify-center text-sm text-slate-400"
      >
        <Activity className="size-4 text-slate-300" aria-hidden="true" />
        No stream data available for this activity.
      </div>
    )
  }

  return (
    <div data-testid="streamChartsSection">
      <SectionLabel>Performance</SectionLabel>
      <p className="sr-only">
        Performance stream chart showing pace, heart rate, and elevation over distance for this
        activity.
      </p>
      <div className="flex flex-col gap-4">
        {hasPace && <PaceChart data={thinned} />}
        {hasHr && <HrStreamChart data={thinned} />}
        {hasAlt && <ElevationChart data={thinned} />}
      </div>
    </div>
  )
}
