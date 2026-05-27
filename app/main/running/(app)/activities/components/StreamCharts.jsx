'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
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
      <div className="h-[180px] sm:h-[210px]" id="streamChartPace_activityDetailPage">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            syncId="streamCharts"
            margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradPace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis reversed tickFormatter={fmtPaceSec} width={36} {...AXIS_PROPS} />
            <Tooltip content={<StreamTooltip formatter={(sec) => `${fmtPaceSec(sec)} /km`} />} />
            <Area
              type="monotone"
              dataKey="pace"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              fill="url(#gradPace)"
              baseValue="dataMax"
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const ZONE_COLORS = ['#6b7280', '#3b82f6', '#f59e0b', '#f97316', '#ef4444']

function HrStreamChart({ data, zones }) {
  const hrZones = zones?.heart_rate?.zones ?? []

  return (
    <div>
      <SubLabel>Heart Rate</SubLabel>
      <div className="h-[170px] sm:h-[200px]" id="streamChartHr_activityDetailPage">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            syncId="streamCharts"
            margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis width={36} {...AXIS_PROPS} />
            <Tooltip content={<StreamTooltip formatter={(v) => `${v} bpm`} />} />
            {hrZones.map((z, i) => (
              <ReferenceArea
                key={i}
                y1={z.min}
                y2={z.max}
                fill={ZONE_COLORS[i] ?? '#94a3b8'}
                fillOpacity={0.12}
                ifOverflow="hidden"
              />
            ))}
            <Area
              type="monotone"
              dataKey="hr"
              stroke="#ef4444"
              strokeWidth={1.5}
              fill="url(#gradHr)"
              baseValue="dataMin"
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ElevationChart({ data }) {
  return (
    <div>
      <SubLabel>Elevation</SubLabel>
      <div className="h-[150px] sm:h-[180px]" id="streamChartElevation_activityDetailPage">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            syncId="streamCharts"
            margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradElevation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis width={36} {...AXIS_PROPS} />
            <Tooltip content={<StreamTooltip formatter={(v) => `${Math.round(v)} m`} />} />
            <Area
              type="monotone"
              dataKey="alt"
              stroke="#94a3b8"
              strokeWidth={1.5}
              fill="url(#gradElevation)"
              baseValue="dataMin"
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CadenceChart({ data }) {
  return (
    <div>
      <SubLabel>Cadence</SubLabel>
      <div className="h-[150px] sm:h-[180px]" id="streamChartCadence_activityDetailPage">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            syncId="streamCharts"
            margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradCadence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis width={36} {...AXIS_PROPS} />
            <Tooltip content={<StreamTooltip formatter={(v) => `${v} spm`} />} />
            <Area
              type="monotone"
              dataKey="cadence_spm"
              stroke="#10b981"
              strokeWidth={1.5}
              fill="url(#gradCadence)"
              baseValue="dataMin"
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function StreamCharts({ activityId, zones }) {
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
        .map((d) => ({
          ...d,
          dist_km: d.dist_m != null ? d.dist_m / 1000 : null,
          cadence_spm: d.cadence != null ? d.cadence * 2 : null,
        }))
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
        id="streamChartsLoading_activityDetailPage"
        className="flex flex-col gap-4 animate-pulse"
        aria-label="Loading performance charts"
      >
        <div className="h-3 bg-slate-100 rounded w-24" />
        <div className="h-[180px] sm:h-[210px] bg-slate-100 rounded-lg" />
        <div className="h-[170px] sm:h-[200px] bg-slate-100 rounded-lg" />
        <div className="h-[150px] sm:h-[180px] bg-slate-100 rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        id="streamChartsError_activityDetailPage"
        role="alert"
        aria-live="polite"
        className="flex items-center gap-2 py-4 text-sm text-slate-400"
      >
        <AlertCircle className="size-4 text-red-400 shrink-0" aria-hidden="true" />
        <span>Could not load stream data.</span>
        <button
          id="streamChartsRetry_activityDetailPage"
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
  const hasCadence = thinned.some((d) => d.cadence_spm != null && d.cadence_spm > 0)

  if (!hasPace && !hasHr && !hasAlt && !hasCadence) {
    return (
      <div
        id="streamChartsEmpty_activityDetailPage"
        className="flex items-center gap-2 py-6 justify-center text-sm text-slate-400"
      >
        <Activity className="size-4 text-slate-300" aria-hidden="true" />
        No stream data available for this activity.
      </div>
    )
  }

  return (
    <div id="streamChartsSection_activityDetailPage">
      <SectionLabel>Performance</SectionLabel>
      <p className="sr-only">
        Performance stream chart showing pace, heart rate, and elevation over distance for this
        activity.
      </p>
      <div className="flex flex-col gap-4">
        {hasPace && <PaceChart data={thinned} />}
        {hasHr && <HrStreamChart data={thinned} zones={zones} />}
        {hasAlt && <ElevationChart data={thinned} />}
        {hasCadence && <CadenceChart data={thinned} />}
      </div>
    </div>
  )
}
