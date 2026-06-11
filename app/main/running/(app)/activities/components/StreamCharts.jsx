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
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import { AlertCircle, Activity, Info } from 'lucide-react'
import {
  Tooltip as UITooltip,
  TooltipContent as UITooltipContent,
  TooltipProvider as UITooltipProvider,
  TooltipTrigger as UITooltipTrigger,
} from '@/components/ui/tooltip'
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
      <div className="h-[180px] sm:h-[210px] outline-none" id="streamChartPace_activityDetailPage">
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

// ─── Cadence benchmark bands ────────────────────────────────────────────────

const CADENCE_BANDS = [
  { label: 'Beginner', min: 140, max: 165, color: '#ef4444', opacity: 0.07 },
  { label: 'Recreational', min: 165, max: 175, color: '#f97316', opacity: 0.07 },
  { label: 'Semi-athlete', min: 175, max: 185, color: '#eab308', opacity: 0.07 },
  { label: 'Elite', min: 185, max: 210, color: '#10b981', opacity: 0.07 },
]

const CADENCE_INFO =
  'The widely cited 180 spm target comes from Jack Daniels’ observation of elite Olympic runners at race pace — not a controlled study. Optimal cadence is individual and depends on leg length and speed. A cadence below 170 spm is associated with higher ground reaction forces and injury risk.'

function computeCadenceStats(data) {
  const validPts = data.filter(
    (d) => d.cadence_spm != null && d.cadence_spm >= 130 && d.cadence_spm <= 220
  )

  if (validPts.length < 8) return { stabilityScore: null, fatigueDrop: null, fatigueStart: null }

  const values = validPts.map((d) => d.cadence_spm)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
  const stddev = Math.sqrt(variance)
  const stabilityScore = Math.max(0, Math.min(100, Math.round(100 - (stddev / mean) * 100)))

  const q1End = Math.floor(validPts.length * 0.25)
  const q3Start = Math.floor(validPts.length * 0.75)
  const first25 = validPts.slice(0, q1End)
  const last25 = validPts.slice(q3Start)
  const avg1 = first25.reduce((s, d) => s + d.cadence_spm, 0) / first25.length
  const avg4 = last25.reduce((s, d) => s + d.cadence_spm, 0) / last25.length
  const fatigueDrop = Math.round(avg1 - avg4)

  const fatigueStart = fatigueDrop > 5 ? (validPts[q3Start]?.dist_km ?? null) : null

  return { stabilityScore, fatigueDrop, fatigueStart }
}

const ZONE_COLORS = ['#3b82f6', '#10b981', '#eab308', '#f97316', '#ef4444']
const ZONE_LABELS = ['Z1 Recovery', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 VO₂max']
const ZONE_SHORT_LABELS = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5']
const ZONE_OPACITIES = [0.15, 0.15, 0.18, 0.22, 0.25]
const ZONE_PERCENTS = [
  [0, 0.6],
  [0.6, 0.7],
  [0.7, 0.8],
  [0.8, 0.9],
  [0.9, 1.1],
]

function computeZoneRanges(maxHr) {
  if (!maxHr || maxHr <= 0) return null
  return ZONE_PERCENTS.map(([lo, hi]) => ({
    min: Math.round(lo * maxHr),
    max: Math.round(hi * maxHr),
    time: 0,
  }))
}

function formatZoneDuration(seconds) {
  if (!seconds || seconds <= 0) return '0s'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}

function HrStreamChart({ data, zones, avgHr, historicalAvgHr, maxHr, userMaxHr, pagePrefix }) {
  const stravaZones = zones?.heart_rate?.zones ?? null
  const fallbackMaxHr = userMaxHr ?? maxHr ?? null
  const bandZones = stravaZones ?? computeZoneRanges(fallbackMaxHr) ?? []
  const timeZones = stravaZones ?? []

  const zoneBandSource = stravaZones
    ? 'strava'
    : userMaxHr
      ? { type: 'profile', hr: userMaxHr }
      : maxHr
        ? { type: 'activity', hr: maxHr }
        : null

  const peakPoint = data.reduce(
    (best, d) => (d.hr != null && (best === null || d.hr > best.hr) ? d : best),
    null
  )

  const totalZoneTime = timeZones.reduce((sum, z) => sum + (z.time ?? 0), 0)

  const hrValues = data.map((d) => d.hr).filter((v) => v != null)
  const dataMinHr = hrValues.length ? Math.min(...hrValues) : 0
  const showHistoricalLine = historicalAvgHr != null && historicalAvgHr >= dataMinHr - 15

  return (
    <div>
      <SubLabel>Heart Rate</SubLabel>
      <div className="h-[170px] sm:h-[200px] outline-none" id={`streamChartHr_${pagePrefix}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            syncId="streamCharts"
            margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
          >
            <CartesianGrid {...GRID_PROPS} />
            {XAXIS}
            <YAxis width={36} {...AXIS_PROPS} />
            <Tooltip content={<StreamTooltip formatter={(v) => `${v} bpm`} />} />
            {bandZones.map((z, i) => (
              <ReferenceArea
                key={i}
                y1={z.min}
                y2={z.max}
                fill={ZONE_COLORS[i] ?? '#94a3b8'}
                fillOpacity={ZONE_OPACITIES[i] ?? 0.15}
                ifOverflow="hidden"
                label={{
                  value: ZONE_SHORT_LABELS[i] ?? `Z${i + 1}`,
                  position: 'insideRight',
                  fontSize: 8,
                  fill: ZONE_COLORS[i] ?? '#94a3b8',
                  opacity: 0.7,
                }}
              />
            ))}
            {showHistoricalLine && (
              <ReferenceLine
                y={historicalAvgHr}
                stroke="#94a3b8"
                strokeDasharray="2 4"
                strokeWidth={1.5}
                id={`hrHistoricalAvgLine_${pagePrefix}`}
                ifOverflow="hidden"
                label={{
                  value: `All-time ${historicalAvgHr}`,
                  position: 'insideBottomRight',
                  fontSize: 9,
                  fill: '#94a3b8',
                }}
              />
            )}
            {avgHr != null && (
              <ReferenceLine
                y={avgHr}
                stroke="#ef4444"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                id={`hrAvgLine_${pagePrefix}`}
                label={{
                  value: `Avg ${avgHr}`,
                  position: 'insideTopRight',
                  fontSize: 9,
                  fill: '#ef4444',
                }}
              />
            )}
            {peakPoint != null && (
              <ReferenceDot
                x={peakPoint.dist_km}
                y={peakPoint.hr}
                r={5}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={2}
                id={`hrPeakMarker_${pagePrefix}`}
                label={{
                  value: `${peakPoint.hr}`,
                  position: 'top',
                  fontSize: 9,
                  fill: '#ef4444',
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="hr"
              stroke="#ef4444"
              strokeWidth={2}
              fill="none"
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!showHistoricalLine && historicalAvgHr != null && (
        <p
          id={`hrHistoricalAvgLine_${pagePrefix}`}
          className="mt-1 text-[10px] text-slate-400 tabular-nums text-right"
        >
          All-time avg: {historicalAvgHr} bpm
        </p>
      )}

      {bandZones.length > 0 && (
        <p className="mt-1 text-[10px] text-slate-300 tabular-nums">
          {zoneBandSource === 'strava'
            ? 'Zone bands from Strava'
            : zoneBandSource?.type === 'profile'
              ? `Zones estimated · Max HR ${zoneBandSource.hr} bpm (profile)`
              : zoneBandSource?.type === 'activity'
                ? `Zones estimated · Max HR ${zoneBandSource.hr} bpm (this run)`
                : null}
        </p>
      )}

      {timeZones.length > 0 && totalZoneTime > 0 && (
        <div className="mt-3" id={`hrZonesSection_${pagePrefix}`}>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Time in Zone
          </p>
          <div className="flex flex-col gap-1.5" id={`hrTimeInZoneSection_${pagePrefix}`}>
            {timeZones.map((zone, i) => {
              const pct = Math.round(((zone.time ?? 0) / totalZoneTime) * 100)
              const color = ZONE_COLORS[i] ?? '#94a3b8'
              const label = ZONE_LABELS[i] ?? `Z${i + 1}`
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-24 shrink-0">
                    <p className="text-[10px] font-medium text-slate-600">{label}</p>
                  </div>
                  <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {pct}% · {formatZoneDuration(zone.time)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ElevationChart({ data }) {
  return (
    <div>
      <SubLabel>Elevation</SubLabel>
      <div
        className="h-[150px] sm:h-[180px] outline-none"
        id="streamChartElevation_activityDetailPage"
      >
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

function CadenceChart({ data, historicalAvgCadence, pagePrefix }) {
  const { stabilityScore, fatigueDrop, fatigueStart } = computeCadenceStats(data)
  const hasFatigue = fatigueDrop != null && fatigueDrop > 5 && fatigueStart != null

  const cadenceValues = data.map((d) => d.cadence_spm).filter((v) => v != null && v > 0)
  const dataMax = cadenceValues.length ? Math.max(...cadenceValues) : 0
  const fatigueEnd = data[data.length - 1]?.dist_km ?? null

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Cadence</p>
        {stabilityScore != null && (
          <span
            id={`cadenceStabilityScore_${pagePrefix}`}
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500"
            title="Cadence stability score: 100 = perfectly consistent form"
          >
            Stability: {stabilityScore}
          </span>
        )}
        <UITooltipProvider delayDuration={200}>
          <UITooltip>
            <UITooltipTrigger asChild>
              <button
                id={`cadenceInfoTrigger_${pagePrefix}`}
                className="ml-auto text-slate-300 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                aria-label="Cadence info: about the 180 spm target"
              >
                <Info className="size-3.5" aria-hidden="true" />
              </button>
            </UITooltipTrigger>
            <UITooltipContent
              side="top"
              className="max-w-72 text-xs leading-relaxed"
              id={`cadenceInfoTooltip_${pagePrefix}`}
            >
              {CADENCE_INFO}
            </UITooltipContent>
          </UITooltip>
        </UITooltipProvider>
      </div>
      <div className="h-[150px] sm:h-[180px] outline-none" id={`streamChartCadence_${pagePrefix}`}>
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

            {CADENCE_BANDS.map((band, i) => (
              <ReferenceArea
                key={i}
                y1={band.min}
                y2={band.max}
                fill={band.color}
                fillOpacity={band.opacity}
                ifOverflow="hidden"
                label={{
                  value: band.label,
                  position: 'insideLeft',
                  fontSize: 8,
                  fill: band.color,
                  opacity: 0.6,
                }}
                id={`cadenceBand_${band.label.replace(/[^a-z]/gi, '').toLowerCase()}_${pagePrefix}`}
              />
            ))}

            {hasFatigue && (
              <ReferenceArea
                x1={fatigueStart}
                x2={fatigueEnd}
                y1={0}
                y2={dataMax + 10}
                fill="#f97316"
                fillOpacity={0.08}
                ifOverflow="hidden"
                id={`cadenceFatigueRegion_${pagePrefix}`}
                label={{
                  value: `Fatigue drop −${fatigueDrop} spm`,
                  position: 'insideTopRight',
                  fontSize: 8,
                  fill: '#f97316',
                }}
              />
            )}

            {historicalAvgCadence != null && (
              <ReferenceLine
                y={historicalAvgCadence}
                stroke="#6366f1"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                id={`cadenceHistoricalAvgLine_${pagePrefix}`}
                label={{
                  value: `Your avg: ${historicalAvgCadence} spm`,
                  position: 'insideTopRight',
                  fontSize: 9,
                  fill: '#6366f1',
                }}
              />
            )}

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

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {CADENCE_BANDS.map((band) => (
          <div key={band.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: band.color, opacity: 0.7 }}
            />
            <span className="text-[10px] text-slate-400">
              {band.label}{' '}
              <span className="tabular-nums text-slate-300">
                {band.min}–{band.max} spm
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StreamCharts({
  activityId,
  zones,
  avgHr,
  historicalAvgHr,
  maxHr,
  userMaxHr,
  historicalAvgCadence,
  maxPaceSecPerKm = null,
  pagePrefix = 'activityDetailPage',
}) {
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
      const maxSpeedMs = maxPaceSecPerKm > 0 ? 1000 / maxPaceSecPerKm : null
      const processed = raw
        .filter((_, i) => i % step === 0 || i === raw.length - 1)
        .map((d) => {
          const v = d.velocity
          const paceValid = v != null && v >= 0.5 && (maxSpeedMs == null || v <= maxSpeedMs * 1.05)
          return {
            ...d,
            dist_km: d.dist_m != null ? d.dist_m / 1000 : null,
            cadence_spm: d.cadence,
            pace: paceValid ? d.pace : null,
          }
        })
      setMeta(res.meta)
      setThinned(processed)
    } catch (err) {
      setError(err.message || 'Failed to load stream data')
    } finally {
      setLoading(false)
    }
  }, [activityId, maxPaceSecPerKm])

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
          className="ml-auto text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
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
        className="flex flex-col items-center gap-1.5 py-6 text-center text-sm text-slate-400"
      >
        <Activity className="size-4 text-slate-300" aria-hidden="true" />
        <span>No performance stream data for this activity.</span>
        <span className="text-xs text-slate-300">
          Stream data requires GPS and sensor recordings over time. This is common for manually
          entered activities or certain activity types.
        </span>
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
        {hasHr && (
          <HrStreamChart
            data={thinned}
            zones={zones}
            avgHr={avgHr}
            historicalAvgHr={historicalAvgHr}
            maxHr={maxHr}
            userMaxHr={userMaxHr}
            pagePrefix={pagePrefix}
          />
        )}
        {hasAlt && <ElevationChart data={thinned} />}
        {hasCadence && (
          <CadenceChart
            data={thinned}
            historicalAvgCadence={historicalAvgCadence ?? null}
            pagePrefix={pagePrefix}
          />
        )}
      </div>
    </div>
  )
}
