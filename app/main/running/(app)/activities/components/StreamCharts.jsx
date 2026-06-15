'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  LabelList,
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
  const s = String(Math.round(sec % 60)).padStart(2, '0')
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

const PACE_CAP_SEC = 720
const SPEED_FLOOR_KMH = 5
const CADENCE_FLOOR_SPM = 100

const AXIS_PROPS = {
  tick: { fontSize: 10, fill: '#94a3b8' },
  tickLine: false,
  axisLine: false,
}

function PaceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const raw = payload[0]?.payload
  const pace = raw?.pace
  const distKm = Number(label)
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">
        {Number.isFinite(distKm) ? `${distKm.toFixed(2)} km` : ''}
      </p>
      <p className="font-medium text-slate-700">
        {typeof pace === 'number'
          ? pace > PACE_CAP_SEC
            ? `> ${fmtPaceSec(PACE_CAP_SEC)} /km`
            : `${fmtPaceSec(pace)} /km`
          : '—'}
      </p>
    </div>
  )
}

function SpeedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const raw = payload[0]?.payload
  const speed = raw?.speed_kmh
  const distKm = Number(label)
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">
        {Number.isFinite(distKm) ? `${distKm.toFixed(2)} km` : ''}
      </p>
      <p className="font-medium text-slate-700">
        {typeof speed === 'number'
          ? speed < SPEED_FLOOR_KMH
            ? `< ${SPEED_FLOOR_KMH.toFixed(1)} km/h`
            : `${speed.toFixed(1)} km/h`
          : '—'}
      </p>
    </div>
  )
}

function CadenceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const raw = payload[0]?.payload
  const cadence = raw?.cadence_spm
  const distKm = Number(label)
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">
        {Number.isFinite(distKm) ? `${distKm.toFixed(2)} km` : ''}
      </p>
      <p className="font-medium text-slate-700">
        {typeof cadence === 'number'
          ? cadence < CADENCE_FLOOR_SPM
            ? `< ${CADENCE_FLOOR_SPM} spm`
            : `${Math.round(cadence)} spm`
          : '—'}
      </p>
    </div>
  )
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

// Pace zone boundaries as multipliers of threshold pace.
// Slower pace = larger sec/km value. Z1 is slowest, Z5 is fastest.
const PACE_ZONE_DEFS = [
  { name: 'Z1', label: 'Recovery', loMult: 1.29, hiMult: null, color: '#bfdbfe' },
  { name: 'Z2', label: 'Endurance', loMult: 1.14, hiMult: 1.29, color: '#93c5fd' },
  { name: 'Z3', label: 'Tempo', loMult: 1.06, hiMult: 1.14, color: '#60a5fa' },
  { name: 'Z4', label: 'Threshold', loMult: 0.99, hiMult: 1.06, color: '#818cf8' },
  { name: 'Z5', label: 'VO₂max', loMult: null, hiMult: 0.99, color: '#7c3aed' },
]

function computePaceZones(thresholdPaceSec) {
  if (!thresholdPaceSec || thresholdPaceSec <= 0) return null
  return PACE_ZONE_DEFS.map((z) => ({
    ...z,
    // y1 = faster boundary (lower sec/km), y2 = slower boundary (higher sec/km)
    y1: z.hiMult != null ? Math.round(z.hiMult * thresholdPaceSec) : 9999,
    y2: z.loMult != null ? Math.round(z.loMult * thresholdPaceSec) : 0,
  }))
}

function PaceChart({ data, thresholdPaceSec = null, paceZoneTimes = null }) {
  const [mode, setMode] = useState('pace')
  const isSpeed = mode === 'speed'

  const mergedPaceZones = useMemo(() => {
    if (isSpeed || !thresholdPaceSec || !paceZoneTimes) return null
    const zones = computePaceZones(thresholdPaceSec)
    if (!zones) return null
    const total = paceZoneTimes.reduce((s, t) => s + t, 0)
    return zones.map((z, i) => {
      const t = paceZoneTimes[i] ?? 0
      const pct = total > 0 ? Math.round((t / total) * 100) : 0
      return {
        name: z.name,
        label: z.label,
        color: z.color,
        time: t,
        pct,
        duration: t > 0 ? formatZoneDuration(t) : null,
      }
    })
  }, [isSpeed, thresholdPaceSec, paceZoneTimes])

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            {isSpeed ? 'Speed' : 'Pace'}
          </p>
          <UITooltipProvider delayDuration={0}>
            <UITooltip>
              <UITooltipTrigger asChild>
                <button
                  type="button"
                  id="paceSpeedInfo_activityDetailPage"
                  className="text-slate-300 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                  aria-label="Pace and speed chart info"
                >
                  <Info className="size-3.5" aria-hidden="true" />
                </button>
              </UITooltipTrigger>
              <UITooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
                <p className="font-semibold mb-1">Pace vs Speed</p>
                <p>
                  <span className="text-violet-300 font-medium">Pace (min/km)</span> — standard
                  runner metric. Y-axis is inverted: lower = faster. Best for reading effort in
                  familiar terms.
                </p>
                <p className="mt-1">
                  <span className="text-violet-300 font-medium">Speed (km/h)</span> — normal Y-axis:
                  higher = faster. Better for spotting acceleration and deceleration patterns at a
                  glance.
                </p>
              </UITooltipContent>
            </UITooltip>
          </UITooltipProvider>
        </div>
        <div
          id="paceSpeedToggle_activityDetailPage"
          className="flex rounded-lg overflow-hidden border border-slate-200 text-[10px] font-semibold"
        >
          <button
            type="button"
            id="paceTab_activityDetailPage"
            onClick={() => setMode('pace')}
            className={`px-2.5 py-1 transition-colors ${!isSpeed ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
          >
            Pace
          </button>
          <button
            type="button"
            id="speedTab_activityDetailPage"
            onClick={() => setMode('speed')}
            className={`px-2.5 py-1 transition-colors ${isSpeed ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
          >
            Speed
          </button>
        </div>
      </div>
      <div className="h-[180px] sm:h-[225px] outline-none" id="streamChartPace_activityDetailPage">
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
            <YAxis
              reversed={!isSpeed}
              tickFormatter={isSpeed ? (v) => v.toFixed(1) : fmtPaceSec}
              width={isSpeed ? 42 : 36}
              {...AXIS_PROPS}
            />
            <Tooltip content={isSpeed ? <SpeedTooltip /> : <PaceTooltip />} />
            <Area
              type="monotone"
              dataKey={isSpeed ? 'speed_display' : 'pace_display'}
              stroke="#8b5cf6"
              strokeWidth={1.5}
              fill="url(#gradPace)"
              baseValue={isSpeed ? 'dataMin' : 'dataMax'}
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!isSpeed && mergedPaceZones && (
        <div className="mt-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Pace Zone
          </p>
          <ZoneBarChart
            mergedZones={mergedPaceZones}
            pagePrefix="pace_activityDetailPage"
            yAxisWidth={64}
          />
        </div>
      )}
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

const ZONE_COLORS = ['#fecdd3', '#fca5a5', '#f87171', '#ef4444', '#b91c1c']
const ZONE_LABELS = ['Z1 Recovery', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 VO₂max']
const ZONE_SHORT_LABELS = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5']

const MAXHR_PERCENTS = [
  [0, 0.6],
  [0.6, 0.7],
  [0.7, 0.8],
  [0.8, 0.9],
  [0.9, 0.95],
]
// Karvonen: Z1 floor is 50% HRR (more physiologically accurate than 0%)
const KARVONEN_PERCENTS = [
  [0.5, 0.6],
  [0.6, 0.7],
  [0.7, 0.8],
  [0.8, 0.9],
  [0.9, 1.0],
]
// Coggan 5-zone anchored to lactate threshold HR
const THRESHOLD_PERCENTS = [
  [0, 0.68],
  [0.68, 0.83],
  [0.83, 0.94],
  [0.94, 1.05],
  [1.05, Infinity],
]

function computeZoneRanges(maxHr) {
  if (!maxHr || maxHr <= 0) return null
  return MAXHR_PERCENTS.map(([lo, hi]) => ({
    min: Math.round(lo * maxHr),
    max: Math.round(hi * maxHr),
    time: 0,
  }))
}

function computeKarvonenZones(maxHr, restingHr) {
  if (!maxHr || !restingHr || maxHr <= restingHr) return null
  const hrr = maxHr - restingHr
  return KARVONEN_PERCENTS.map(([lo, hi]) => ({
    min: Math.round(restingHr + lo * hrr),
    max: Math.round(restingHr + hi * hrr),
    time: 0,
  }))
}

function computeThresholdZones(thresholdHr) {
  if (!thresholdHr || thresholdHr <= 0) return null
  return THRESHOLD_PERCENTS.map(([lo, hi]) => ({
    min: Math.round(lo * thresholdHr),
    max: hi === Infinity ? 9999 : Math.round(hi * thresholdHr),
    time: 0,
  }))
}

function resolveZoneBoundaries(method, maxHr, restingHr, thresholdHr) {
  if (method === 'karvonen' && restingHr) {
    const zones = computeKarvonenZones(maxHr, restingHr)
    if (zones) return { zones, usedMethod: 'karvonen', fallback: false }
    // maxHr absent — fall through to max_hr with fallback flag
  }
  if (method === 'threshold' && thresholdHr) {
    const zones = computeThresholdZones(thresholdHr)
    if (zones) return { zones, usedMethod: 'threshold', fallback: false }
  }
  return { zones: computeZoneRanges(maxHr), usedMethod: 'max_hr', fallback: method !== 'max_hr' }
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

function ZoneTick({ x, y, payload, zones }) {
  const zone = zones?.find((z) => z.name === payload?.value)
  if (!zone) return null
  const hasRange = zone.min != null && zone.max != null
  const hasLabel = !hasRange && zone.label != null
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-6}
        textAnchor="end"
        fontSize={11}
        fontWeight={600}
        fill="#475569"
        dy={hasRange || hasLabel ? -5 : 4}
      >
        {zone.name}
      </text>
      {hasRange && (
        <text x={-6} textAnchor="end" fontSize={10} fill="#94a3b8" dy={7}>
          {zone.min}–{zone.max}
        </text>
      )}
      {hasLabel && (
        <text x={-6} textAnchor="end" fontSize={10} fill="#94a3b8" dy={7}>
          {zone.label}
        </text>
      )}
    </g>
  )
}

function ZoneTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const z = payload[0]?.payload
  if (!z) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700">{z.label}</p>
      {z.min != null && z.max != null && (
        <p className="text-slate-400 tabular-nums">
          {z.min}–{z.max} bpm
        </p>
      )}
      <p className="text-slate-600 tabular-nums">{z.pct}%</p>
      {z.duration && <p className="text-slate-400">{z.duration}</p>}
    </div>
  )
}

function ZoneBarChart({
  mergedZones,
  pagePrefix,
  height = 180,
  barCategoryGap = '16%',
  yAxisWidth = 76,
}) {
  const tickWithZones = (props) => <ZoneTick {...props} zones={mergedZones} />
  const chartData = [...mergedZones].reverse().map((z) => ({
    ...z,
    pctLabel: z.pct > 0 ? `${z.pct}%${z.duration ? ` · ${z.duration}` : ''}` : '',
  }))
  return (
    <div id={`hrTimeInZoneSection_${pagePrefix}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 4, right: 96, bottom: 4, left: 0 }}
          barCategoryGap={barCategoryGap}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={tickWithZones}
            tickLine={false}
            axisLine={false}
            width={yAxisWidth}
          />
          <Tooltip cursor={false} content={<ZoneTooltip />} />
          <Bar dataKey="pct" radius={[0, 3, 3, 0]} minPointSize={2} isAnimationActive={false}>
            {chartData.map((z, i) => (
              <Cell key={i} fill={z.color} fillOpacity={z.pct > 0 ? 0.8 : 0.18} />
            ))}
            <LabelList
              dataKey="pctLabel"
              position="right"
              style={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function HrStreamChart({
  data,
  zones,
  avgHr,
  historicalAvgHr,
  maxHr,
  userMaxHr,
  hrZoneTimes,
  hrZonesMethod = 'max_hr',
  restingHr = null,
  thresholdHr = null,
  pagePrefix,
}) {
  const stravaZones = zones?.heart_rate?.zones ?? null
  const fallbackMaxHr = userMaxHr ?? maxHr ?? null

  // Strava zones always take priority; otherwise dispatch to the user's chosen method
  const {
    zones: computedBandZones,
    usedMethod,
    fallback: usedFallback,
  } = stravaZones
    ? { zones: null, usedMethod: null, fallback: false }
    : resolveZoneBoundaries(hrZonesMethod, fallbackMaxHr, restingHr, thresholdHr)

  const bandZones = stravaZones ?? computedBandZones ?? []
  const stravaHasTime = stravaZones?.some((z) => z.time != null && z.time > 0) ?? false
  const timeZones =
    stravaZones && stravaHasTime
      ? stravaZones
      : hrZoneTimes
        ? bandZones.map((bz, i) => ({ ...bz, time: hrZoneTimes[i] ?? 0 }))
        : []

  function getZoneSourceLabel() {
    if (stravaZones) return 'Zone bands from Strava'
    if (!fallbackMaxHr && !thresholdHr) return null
    const hrSource = userMaxHr ? 'profile' : 'this run'
    if (usedFallback) {
      if (!fallbackMaxHr) return null
      const missing = hrZonesMethod === 'karvonen' ? 'resting HR not set' : 'threshold HR not set'
      const methodLabel = hrZonesMethod === 'karvonen' ? 'Karvonen' : 'Lactate Threshold'
      return `${methodLabel} selected but ${missing} — using Max HR ${fallbackMaxHr} bpm (${hrSource})`
    }
    if (usedMethod === 'karvonen')
      return `Karvonen · Max HR ${fallbackMaxHr} bpm · Resting ${restingHr} bpm`
    if (usedMethod === 'threshold') return `Lactate Threshold · Threshold HR ${thresholdHr} bpm`
    return `Zones estimated · Max HR ${fallbackMaxHr} bpm (${hrSource})`
  }

  const zoneSourceLabel = getZoneSourceLabel()

  const peakPoint = data.reduce(
    (best, d) => (d.hr != null && (best === null || d.hr > best.hr) ? d : best),
    null
  )

  const totalZoneTime = timeZones.reduce((sum, z) => sum + (z.time ?? 0), 0)

  const mergedZones = bandZones.map((bz, i) => {
    const t = timeZones[i]?.time ?? 0
    const pct = totalZoneTime > 0 ? Math.round((t / totalZoneTime) * 100) : 0
    return {
      name: ZONE_SHORT_LABELS[i] ?? `Z${i + 1}`,
      label: ZONE_LABELS[i] ?? `Z${i + 1}`,
      color: ZONE_COLORS[i] ?? '#94a3b8',
      min: bz.min ?? null,
      max: bz.max ?? null,
      time: t,
      pct,
      duration: t > 0 ? formatZoneDuration(t) : null,
    }
  })

  const hrValues = data.map((d) => d.hr).filter((v) => v != null)
  const dataMinHr = hrValues.length ? Math.min(...hrValues) : 0
  const showHistoricalLine = historicalAvgHr != null && historicalAvgHr >= dataMinHr - 15

  return (
    <div>
      <SubLabel>Heart Rate</SubLabel>
      <div className="h-[240px] sm:h-[300px] outline-none" id={`streamChartHr_${pagePrefix}`}>
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
            <YAxis width={24} {...AXIS_PROPS} />
            <Tooltip content={<StreamTooltip formatter={(v) => `${v} bpm`} />} />
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
              fill="url(#gradHr)"
              baseValue="dataMin"
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!showHistoricalLine && historicalAvgHr != null && (
        <p
          id={`hrHistoricalAvgFallback_${pagePrefix}`}
          className="mt-1 text-[10px] text-slate-400 tabular-nums text-right"
        >
          All-time avg: {historicalAvgHr} bpm
        </p>
      )}

      {bandZones.length > 0 && zoneSourceLabel && (
        <p className="mt-1 text-[10px] text-slate-300 tabular-nums">{zoneSourceLabel}</p>
      )}

      {bandZones.length > 0 && (
        <div className="mt-3" id={`hrZonesSection_${pagePrefix}`}>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Heart Rate Zone
          </p>
          <ZoneBarChart
            mergedZones={mergedZones}
            pagePrefix={pagePrefix}
            height={200}
            barCategoryGap="10%"
          />
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
        className="h-[150px] sm:h-[195px] outline-none"
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
            <YAxis width={24} {...AXIS_PROPS} />
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

function CadenceChart({ data, historicalAvgCadence, pagePrefix, rawCadenceBandTimes }) {
  const { stabilityScore, fatigueDrop, fatigueStart } = computeCadenceStats(data)
  const hasFatigue = fatigueDrop != null && fatigueDrop > 5 && fatigueStart != null

  const cadenceValues = data.map((d) => d.cadence_spm).filter((v) => v != null && v > 0)
  const dataMax = cadenceValues.length ? Math.max(...cadenceValues) : 0
  const fatigueEnd = data[data.length - 1]?.dist_km ?? null

  // Use raw-derived band times (passed from parent) for accurate duration;
  // fall back to thinned data only if raw times are unavailable.
  const cadenceBandTimes =
    rawCadenceBandTimes ??
    (() => {
      const times = CADENCE_BANDS.map(() => 0)
      for (const d of data) {
        const spm = d.cadence_spm
        if (spm == null || spm <= 0) continue
        for (let i = 0; i < CADENCE_BANDS.length; i++) {
          const isLast = i === CADENCE_BANDS.length - 1
          if (spm >= CADENCE_BANDS[i].min && (isLast || spm < CADENCE_BANDS[i].max)) {
            times[i] += 10
            break
          }
        }
      }
      return times
    })()
  const totalCadenceTime = cadenceBandTimes.reduce((s, t) => s + t, 0)
  const cadenceBandZones =
    totalCadenceTime > 0
      ? CADENCE_BANDS.map((band, i) => {
          const isLast = i === CADENCE_BANDS.length - 1
          const t = cadenceBandTimes[i]
          const pct = Math.round((t / totalCadenceTime) * 100)
          return {
            name: band.label,
            label: band.label,
            color: band.color,
            min: band.min,
            max: isLast ? band.max : band.max - 1,
            time: t,
            pct,
            duration: t > 0 ? formatZoneDuration(t) : null,
          }
        })
      : []

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Cadence</p>
        <UITooltipProvider delayDuration={200}>
          <UITooltip>
            <UITooltipTrigger asChild>
              <button
                id={`cadenceInfoTrigger_${pagePrefix}`}
                className="text-slate-300 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
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
        {stabilityScore != null && (
          <span
            id={`cadenceStabilityScore_${pagePrefix}`}
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500"
            title="Cadence stability score: 100 = perfectly consistent form"
          >
            Stability: {stabilityScore}
          </span>
        )}
      </div>
      <p className="text-[10px] text-slate-300 leading-snug mb-1.5">
        Stability score: how consistent your cadence was throughout the run. 100 = perfectly even.
        Below 80 = noticeable variation.
      </p>
      <div className="h-[240px] sm:h-[300px] outline-none" id={`streamChartCadence_${pagePrefix}`}>
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
            <YAxis width={24} {...AXIS_PROPS} />
            <Tooltip content={<CadenceTooltip />} />

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
              dataKey="cadence_display"
              stroke="#10b981"
              strokeWidth={1.5}
              fill="url(#gradCadence)"
              baseValue="dataMin"
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {cadenceBandZones.length > 0 && (
        <div className="mt-3" id={`cadenceZonesSection_${pagePrefix}`}>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Time in Cadence Band
          </p>
          <ZoneBarChart mergedZones={cadenceBandZones} pagePrefix={`${pagePrefix}_cadence`} />
        </div>
      )}
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
  restingHr = null,
  hrZonesMethod = 'max_hr',
  thresholdHr = null,
  thresholdPaceSec = null,
  historicalAvgCadence,
  maxPaceSecPerKm = null,
  pagePrefix = 'activityDetailPage',
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const [thinned, setThinned] = useState([])
  const [rawHrValues, setRawHrValues] = useState([])
  const [rawCadenceValues, setRawCadenceValues] = useState([])
  const [rawPaceValues, setRawPaceValues] = useState([])

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
          const speedKmh = paceValid ? parseFloat((v * 3.6).toFixed(2)) : null
          return {
            ...d,
            dist_km: d.dist_m != null ? d.dist_m / 1000 : null,
            cadence_spm: d.cadence,
            pace: paceValid ? d.pace : null,
            speed_kmh: speedKmh,
            // _display fields cap/floor the chart axis only — originals above are used by zone/band calcs
            pace_display: paceValid && d.pace != null ? Math.min(d.pace, PACE_CAP_SEC) : null,
            speed_display: speedKmh != null ? Math.max(speedKmh, SPEED_FLOOR_KMH) : null,
            // below CADENCE_FLOOR_SPM = sensor dropout → null so connectNulls=false creates a gap
            cadence_display: d.cadence != null && d.cadence >= CADENCE_FLOOR_SPM ? d.cadence : null,
          }
        })
      setMeta(res.meta)
      setThinned(processed)
      setRawHrValues(raw.map((d) => d.hr).filter((v) => v != null))
      setRawCadenceValues(raw.map((d) => d.cadence).filter((v) => v != null && v > 0))
      setRawPaceValues(raw.map((d) => d.pace).filter((v) => v != null && v > 0))
    } catch (err) {
      setError('Failed to load stream data')
    } finally {
      setLoading(false)
    }
  }, [activityId, maxPaceSecPerKm])

  useEffect(() => {
    load()
  }, [load])

  const hrZoneTimes = useMemo(() => {
    if (zones?.heart_rate?.zones || !rawHrValues.length) return null
    const { zones: bz } = resolveZoneBoundaries(
      hrZonesMethod,
      userMaxHr ?? maxHr ?? null,
      restingHr,
      thresholdHr
    )
    if (!bz) return null
    const times = bz.map(() => 0)
    for (const hr of rawHrValues) {
      for (let i = 0; i < bz.length; i++) {
        if (hr >= bz[i].min && hr <= bz[i].max) {
          times[i] += 10
          break
        }
      }
    }
    return times
  }, [rawHrValues, zones, maxHr, userMaxHr, hrZonesMethod, restingHr, thresholdHr])

  const paceZoneTimes = useMemo(() => {
    if (!thresholdPaceSec || !rawPaceValues.length) return null
    const zones = computePaceZones(thresholdPaceSec)
    if (!zones) return null
    const times = zones.map(() => 0)
    for (const pace of rawPaceValues) {
      for (let i = 0; i < zones.length; i++) {
        // y1 = upper (slower) boundary, y2 = lower (faster) boundary
        if (pace >= zones[i].y2 && pace <= zones[i].y1) {
          times[i] += 10
          break
        }
      }
    }
    return times
  }, [rawPaceValues, thresholdPaceSec])

  const cadenceBandTimesRaw = useMemo(() => {
    if (!rawCadenceValues.length) return null
    const times = CADENCE_BANDS.map(() => 0)
    for (const spm of rawCadenceValues) {
      for (let i = 0; i < CADENCE_BANDS.length; i++) {
        const isLast = i === CADENCE_BANDS.length - 1
        if (spm >= CADENCE_BANDS[i].min && (isLast || spm < CADENCE_BANDS[i].max)) {
          times[i] += 10
          break
        }
      }
    }
    return times
  }, [rawCadenceValues])

  if (loading) {
    return (
      <div
        id="streamChartsLoading_activityDetailPage"
        className="flex flex-col gap-4 animate-pulse"
        aria-label="Loading performance charts"
      >
        <div className="h-3 bg-slate-100 rounded w-24" />
        <div className="h-[180px] sm:h-[225px] bg-slate-100 rounded-lg" />
        <div className="h-[240px] sm:h-[300px] bg-slate-100 rounded-lg" />
        <div className="h-[150px] sm:h-[195px] bg-slate-100 rounded-lg" />
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

  const hasPaceOrSpeed = thinned.some((d) => d.pace != null && d.pace > 0)
  const hasHr = meta?.has_hr && thinned.some((d) => d.hr != null)
  const hasAlt = meta?.has_altitude && thinned.some((d) => d.alt != null)
  const hasCadence = thinned.some((d) => d.cadence_spm != null && d.cadence_spm > 0)

  if (!hasPaceOrSpeed && !hasHr && !hasAlt && !hasCadence) {
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
        {hasPaceOrSpeed && (
          <PaceChart
            data={thinned}
            thresholdPaceSec={thresholdPaceSec}
            paceZoneTimes={paceZoneTimes}
          />
        )}
        {hasHr && (
          <HrStreamChart
            data={thinned}
            zones={zones}
            avgHr={avgHr}
            historicalAvgHr={historicalAvgHr}
            maxHr={maxHr}
            userMaxHr={userMaxHr}
            hrZoneTimes={hrZoneTimes}
            hrZonesMethod={hrZonesMethod}
            restingHr={restingHr}
            thresholdHr={thresholdHr}
            pagePrefix={pagePrefix}
          />
        )}
        {hasAlt && <ElevationChart data={thinned} />}
        {hasCadence && (
          <CadenceChart
            data={thinned}
            historicalAvgCadence={historicalAvgCadence ?? null}
            pagePrefix={pagePrefix}
            rawCadenceBandTimes={cadenceBandTimesRaw}
          />
        )}
      </div>
    </div>
  )
}
