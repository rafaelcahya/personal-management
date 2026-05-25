'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { fetchPerformanceTrends } from '@/lib/api/running'

// ─── distance bracket classification ─────────────────────────────────────────

const DISTANCE_BRACKETS = [
  { key: '5K', label: '5K', min: 4000, max: 6000, color: '#22c55e' },
  { key: '8K', label: '8K', min: 7000, max: 9000, color: '#84cc16' },
  { key: '10K', label: '10K', min: 9000, max: 11500, color: '#eab308' },
  { key: '15K', label: '15K', min: 11500, max: 17000, color: '#f97316' },
  { key: 'HM', label: '21K', min: 17000, max: 23000, color: '#ef4444' },
  { key: 'FM', label: '42K', min: 38000, max: 45000, color: '#a855f7' },
]

function getBracket(distance_m) {
  return DISTANCE_BRACKETS.find((b) => distance_m >= b.min && distance_m < b.max) ?? null
}

// ─── HR zone config (% of max HR) ────────────────────────────────────────────

const HR_ZONES = [
  { key: 'Z1', label: 'Z1 Easy', min: 0, max: 0.6, color: '#94a3b8', fill: '#f1f5f9' },
  { key: 'Z2', label: 'Z2 Aerobic', min: 0.6, max: 0.7, color: '#22c55e', fill: '#f0fdf4' },
  { key: 'Z3', label: 'Z3 Tempo', min: 0.7, max: 0.8, color: '#eab308', fill: '#fefce8' },
  { key: 'Z4', label: 'Z4 Hard', min: 0.8, max: 0.9, color: '#f97316', fill: '#fff7ed' },
  { key: 'Z5', label: 'Z5 Max', min: 0.9, max: 1.0, color: '#ef4444', fill: '#fef2f2' },
]

function getHrZone(hr, maxHr) {
  if (!hr || !maxHr) return null
  const pct = hr / maxHr
  return HR_ZONES.find((z) => pct >= z.min && pct < z.max) ?? HR_ZONES[HR_ZONES.length - 1]
}

// ─── formatting helpers ───────────────────────────────────────────────────────

function fmtPaceAxis(sec) {
  if (!sec) return ''
  const m = Math.floor(sec / 60)
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

function fmtPaceFull(sec) {
  if (!sec) return '—'
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} /km`
}

function fmtDateShort(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── shared tooltip styles ───���────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-medium text-slate-600 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-800">
            {valueFormatter ? valueFormatter(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ──�� tab button ───────────────────────────────────────────────────────────────

// ─── HR chart ─────────────────────────────────────────────────────────────────

function HrChart({ data }) {
  const maxHr = Math.max(...data.map((d) => d.max_hr ?? 0).filter(Boolean))
  const estimatedMax = maxHr > 0 ? maxHr : null

  const chartData = data
    .filter((a) => a.avg_hr)
    .map((a) => ({
      date: fmtDateShort(a.started_at),
      'Avg HR': a.avg_hr,
      'Max HR': a.max_hr ?? null,
      zone: estimatedMax ? getHrZone(a.avg_hr, estimatedMax)?.label : null,
    }))

  if (chartData.length === 0) {
    return <EmptyState message="No heart rate data in the last 25 activities" />
  }

  const hrMin = Math.max(0, Math.min(...chartData.map((d) => d['Avg HR'])) - 10)
  const hrMax = Math.min(220, Math.max(...chartData.map((d) => d['Max HR'] ?? d['Avg HR'])) + 10)

  return (
    <div>
      {estimatedMax && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          {HR_ZONES.map((z) => (
            <span key={z.key} className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full" style={{ background: z.color }} />
              {z.label} ({Math.round(z.min * estimatedMax)}–{Math.round(z.max * estimatedMax)} bpm)
            </span>
          ))}
        </div>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[hrMin, hrMax]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit=" bpm"
            width={58}
          />
          {estimatedMax &&
            HR_ZONES.map((z) => (
              <ReferenceLine
                key={z.key}
                y={Math.round(z.min * estimatedMax)}
                stroke={z.color}
                strokeDasharray="4 3"
                strokeOpacity={0.4}
              />
            ))}
          <Tooltip content={<ChartTooltip valueFormatter={(v) => (v ? `${v} bpm` : '—')} />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="Avg HR"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="Max HR"
            stroke="#fca5a5"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── pace chart — single bracket (Recharts, real dates) ──────────────────────

function SinglePaceChart({ bracket, runs }) {
  if (!bracket || runs.length === 0) {
    return <EmptyState message="No pace data for this distance" />
  }

  const chartData = runs.map((r) => ({ date: r.dateLabel, pace: r.pace }))
  const paces = runs.map((r) => r.pace)
  const paceMin = Math.max(0, Math.min(...paces) - 15)
  const paceMax = Math.max(...paces) + 30

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[paceMin, paceMax]}
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtPaceAxis}
          width={44}
          reversed
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                <p className="font-medium text-slate-500 mb-1">{payload[0]?.payload?.date}</p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: bracket.color }}
                  />
                  <span className="text-slate-500">{bracket.label}:</span>
                  <span className="font-semibold text-slate-800">
                    {fmtPaceFull(payload[0]?.value)}
                  </span>
                </div>
              </div>
            )
          }}
          cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 3' }}
        />
        <Line
          type="linear"
          dataKey="pace"
          stroke={bracket.color}
          strokeWidth={2}
          dot={{ r: 4, fill: bracket.color, stroke: 'white', strokeWidth: 1.5 }}
          activeDot={{ r: 5, fill: bracket.color, stroke: 'white', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── pace chart — compare mode (custom SVG, independent per-bracket x-axis) ──

function ComparePaceChart({ selectedBrackets, bracketMap }) {
  const [tooltip, setTooltip] = useState(null)

  const CW = 580
  const CH = 210
  const PAD = { top: 10, right: 16, bottom: 28, left: 46 }
  const plotW = CW - PAD.left - PAD.right
  const plotH = CH - PAD.top - PAD.bottom

  const allPaces = selectedBrackets.flatMap((b) => bracketMap[b.key].map((r) => r.pace))
  const paceMin = Math.min(...allPaces) - 15
  const paceMax = Math.max(...allPaces) + 30

  function yScale(pace) {
    return PAD.top + ((pace - paceMin) / (paceMax - paceMin)) * plotH
  }

  function xScale(idx, total) {
    if (total <= 1) return PAD.left + plotW / 2
    return PAD.left + (idx / (total - 1)) * plotW
  }

  const yTickStep = 30
  const yTicks = []
  for (let t = Math.ceil(paceMin / yTickStep) * yTickStep; t <= paceMax; t += yTickStep) {
    yTicks.push(t)
  }

  return (
    <svg
      viewBox={`0 0 ${CW} ${CH}`}
      className="w-full"
      style={{ height: 250 }}
      onMouseLeave={() => setTooltip(null)}
    >
      {/* Grid lines */}
      {yTicks.map((t) => (
        <line
          key={t}
          x1={PAD.left}
          y1={yScale(t)}
          x2={PAD.left + plotW}
          y2={yScale(t)}
          stroke="#f1f5f9"
          strokeWidth="1"
        />
      ))}

      {/* Y axis labels */}
      {yTicks.map((t) => (
        <text
          key={t}
          x={PAD.left - 5}
          y={yScale(t) + 3}
          textAnchor="end"
          fontSize={9}
          fill="#94a3b8"
        >
          {fmtPaceAxis(t)}
        </text>
      ))}

      {/* X axis: Oldest / Latest */}
      <text x={PAD.left} y={CH - 5} textAnchor="middle" fontSize={9} fill="#94a3b8">
        Oldest
      </text>
      <text x={PAD.left + plotW} y={CH - 5} textAnchor="middle" fontSize={9} fill="#94a3b8">
        Latest
      </text>

      {/* Lines + dots per bracket */}
      {selectedBrackets.map((b) => {
        const runs = bracketMap[b.key]
        const n = runs.length
        const pts = runs.map((r, i) => ({ x: xScale(i, n), y: yScale(r.pace), ...r }))
        const pathD = pts
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(' ')
        return (
          <g key={b.key}>
            <path d={pathD} fill="none" stroke={b.color} strokeWidth="2" strokeLinejoin="round" />
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill={b.color}
                stroke="white"
                strokeWidth="1.5"
                style={{ cursor: 'default' }}
                onMouseEnter={() =>
                  setTooltip({
                    x: p.x,
                    y: p.y,
                    date: p.dateLabel,
                    pace: p.pace,
                    color: b.color,
                    label: b.label,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </g>
        )
      })}

      {/* Tooltip bubble */}
      {tooltip &&
        (() => {
          const TW = 114
          const TH = 46
          const tx = Math.min(tooltip.x + 10, CW - TW - 4)
          const ty = Math.max(PAD.top, tooltip.y - TH - 6)
          return (
            <g pointerEvents="none">
              <rect
                x={tx}
                y={ty}
                width={TW}
                height={TH}
                rx="4"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={tx + TW / 2}
                y={ty + 14}
                textAnchor="middle"
                fontSize={10}
                fill="#64748b"
                fontWeight="600"
              >
                {tooltip.date}
              </text>
              <circle cx={tx + 11} cy={ty + 31} r={3} fill={tooltip.color} />
              <text x={tx + 18} y={ty + 35} fontSize={10} fill="#1e293b" fontWeight="700">
                {fmtPaceFull(tooltip.pace)}
              </text>
            </g>
          )
        })()}
    </svg>
  )
}

// ─── pace chart — main wrapper ────────────────────────────────────────────────

function PaceChart({ data }) {
  const filtered = data.filter((a) => a.avg_pace_sec_per_km && a.distance_m)

  const bracketMap = {}
  for (const a of filtered) {
    const b = getBracket(a.distance_m)
    if (!b) continue
    if (!bracketMap[b.key]) bracketMap[b.key] = []
    bracketMap[b.key].push({ dateLabel: fmtDateShort(a.started_at), pace: a.avg_pace_sec_per_km })
  }

  const activeBrackets = DISTANCE_BRACKETS.filter((b) => bracketMap[b.key]?.length > 0)

  const defaultKey = (activeBrackets.find((b) => b.key === '5K') ?? activeBrackets[0])?.key
  const [selected, setSelected] = useState(() => new Set(defaultKey ? [defaultKey] : []))

  if (activeBrackets.length === 0) {
    return <EmptyState message="Not enough pace data across distance categories" />
  }

  function toggleBracket(key) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectedBrackets = DISTANCE_BRACKETS.filter((b) => selected.has(b.key) && bracketMap[b.key])
  const isCompare = selectedBrackets.length > 1

  return (
    <div>
      {/* Distance toggle buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {activeBrackets.map((b) => {
          const isOn = selected.has(b.key)
          return (
            <button
              key={b.key}
              onClick={() => toggleBracket(b.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isOn
                  ? 'text-white border-transparent'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
              style={isOn ? { background: b.color, borderColor: b.color } : {}}
            >
              {b.label}
            </button>
          )
        })}
        <span className="text-xs text-slate-400 ml-auto">lower = faster</span>
      </div>

      {selectedBrackets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[220px] gap-2 text-center">
          <p className="text-sm text-slate-400">No distance selected</p>
          <p className="text-xs text-slate-300">
            Pick one or more distances above to see your pace trend
          </p>
        </div>
      ) : isCompare ? (
        <ComparePaceChart selectedBrackets={selectedBrackets} bracketMap={bracketMap} />
      ) : (
        <SinglePaceChart
          bracket={selectedBrackets[0]}
          runs={bracketMap[selectedBrackets[0]?.key] ?? []}
        />
      )}
    </div>
  )
}

// ─── effort / power chart ─────────────────────────────────────────────────────

const EFFORT_ZONES = [
  { label: 'Light', min: 0, max: 50, color: '#94a3b8' },
  { label: 'Moderate', min: 50, max: 150, color: '#22c55e' },
  { label: 'Hard', min: 150, max: 300, color: '#f97316' },
  { label: 'Extreme', min: 300, max: Infinity, color: '#ef4444' },
]

function getEffortZone(val) {
  return EFFORT_ZONES.find((z) => val >= z.min && val < z.max) ?? EFFORT_ZONES[0]
}

function EffortChart({ data }) {
  const chartData = data
    .filter((a) => a.relative_effort)
    .map((a) => ({
      date: fmtDateShort(a.started_at),
      Effort: a.relative_effort,
      zone: getEffortZone(a.relative_effort).label,
    }))

  if (chartData.length === 0) {
    return (
      <EmptyState message="No effort data (Strava Relative Effort) in the last 25 activities" />
    )
  }

  const effortMax = Math.max(...chartData.map((d) => d.Effort)) + 20

  return (
    <div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        {EFFORT_ZONES.filter((z) => z.max !== Infinity).map((z) => (
          <span key={z.label} className="flex items-center gap-1 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ background: z.color }} />
            {z.label} ({z.min}–{z.max})
          </span>
        ))}
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Extreme (300+)
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, effortMax]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          {EFFORT_ZONES.filter((z) => z.min > 0 && z.max !== Infinity).map((z) => (
            <ReferenceLine
              key={z.label}
              y={z.min}
              stroke={z.color}
              strokeDasharray="4 3"
              strokeOpacity={0.5}
            />
          ))}
          <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="4 3" strokeOpacity={0.5} />
          <Tooltip
            content={
              <ChartTooltip valueFormatter={(v) => `${v} pts (${getEffortZone(v).label})`} />
            }
          />
          <Line
            type="monotone"
            dataKey="Effort"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props
              const zone = getEffortZone(payload.Effort)
              return (
                <circle
                  key={`dot-${props.index}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={zone.color}
                  stroke="white"
                  strokeWidth={1.5}
                />
              )
            }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── power chart ──────────────────────────────────────────────────────────────

function PowerChart({ data }) {
  const chartData = data
    .filter((a) => a.device_watts === true && a.weighted_avg_watts != null)
    .map((a) => ({
      date: fmtDateShort(a.started_at),
      'Norm W': a.weighted_avg_watts,
      'Avg W': a.avg_watts ?? null,
    }))

  if (chartData.length === 0) {
    return (
      <EmptyState message="No power data yet — requires a Garmin or compatible device with running power" />
    )
  }

  const allWatts = chartData.flatMap((d) => [d['Norm W'], d['Avg W']].filter(Boolean))
  const wMin = Math.max(0, Math.min(...allWatts) - 10)
  const wMax = Math.max(...allWatts) + 15

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[wMin, wMax]}
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          unit=" W"
          width={50}
        />
        <Tooltip content={<ChartTooltip valueFormatter={(v) => (v != null ? `${v} W` : '—')} />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="Norm W"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="Avg W"
          stroke="#c4b5fd"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          dot={false}
          activeDot={{ r: 4 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }) {
  return (
    <div className="flex items-center justify-center h-[220px] text-sm text-slate-400">
      {message}
    </div>
  )
}

const RUN_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun'])

function ChartSection({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
      {children}
    </div>
  )
}

export default function PerformanceTrends({ activityType }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchPerformanceTrends(20, activityType)
        const runs = (res.data ?? []).filter((a) => RUN_TYPES.has(a.activity_type))
        if (!cancelled) setData(runs)
      } catch {
        if (!cancelled) setError('Failed to load trend data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [activityType])

  return (
    <section id="performanceTrendsCard" aria-label="Performance trends">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Performance Trends
      </h2>
      <Card className="border border-slate-200/70 shadow-sm">
        <CardContent className="px-5 flex flex-col gap-8">
          <p className="text-xs text-slate-400 -mb-4">
            Last {data.length} runs · Running activities only
          </p>

          {loading && (
            <div className="flex items-center justify-center h-[220px] text-sm text-slate-400">
              Loading...
            </div>
          )}
          {!loading && error && (
            <div className="flex items-center justify-center h-[220px] text-sm text-red-400">
              {error}
            </div>
          )}
          {!loading && !error && (
            <>
              <ChartSection title="Heart Rate">
                <HrChart data={data} />
              </ChartSection>
              <div className="border-t border-slate-100" />
              <ChartSection title="Pace">
                <PaceChart data={data} />
              </ChartSection>
              <div className="border-t border-slate-100" />
              <ChartSection title="Effort">
                <EffortChart data={data} />
              </ChartSection>
              <div className="border-t border-slate-100" />
              <ChartSection title="Power">
                <PowerChart data={data} />
              </ChartSection>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
