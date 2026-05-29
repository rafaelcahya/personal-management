'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart2, TrendingUp, Zap, Activity, Minus } from 'lucide-react'
import { fetchActivities, fetchPerformanceTrends, getDashboard } from '@/lib/api/running'
import { fmtPace } from '../dashboard/utils/format'
import PageHeader from '@/app/main/components/PageHeader'

// ─── constants ────────────────────────────────────────────────────────────────

const RUN_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun'])

const DISTANCE_BRACKETS = [
  { key: '5K', label: '5K', min: 4000, max: 6000, color: '#22c55e' },
  { key: '8K', label: '8K', min: 7000, max: 9000, color: '#84cc16' },
  { key: '10K', label: '10K', min: 9000, max: 11500, color: '#eab308' },
  { key: '15K', label: '15K', min: 11500, max: 17000, color: '#f97316' },
  { key: 'HM', label: 'Half (21K)', min: 17000, max: 23000, color: '#ef4444' },
  { key: 'FM', label: 'Marathon', min: 38000, max: 45000, color: '#a855f7' },
]

const RIEGEL_TARGETS = [
  { label: '1K', distance_m: 1000 },
  { label: '5K', distance_m: 5000 },
  { label: '10K', distance_m: 10000 },
  { label: 'Half', distance_m: 21097.5 },
  { label: 'Marathon', distance_m: 42195 },
]

const ACWR_COLORS = {
  no_data: '#94a3b8',
  low: '#60a5fa',
  optimal: '#22c55e',
  caution: '#eab308',
  danger: '#ef4444',
  resting: '#a78bfa',
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function riegelPredict(bestTimeSec, bestDistanceM, targetDistanceM) {
  return bestTimeSec * Math.pow(targetDistanceM / bestDistanceM, 1.06)
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}

function fmtWeekLabel(weekKey) {
  const d = new Date(weekKey + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtPaceTick(sec) {
  if (!sec) return ''
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
}

function fmtDurationShort(sec) {
  if (!sec) return '—'
  const h = Math.floor(sec / 3600)
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return h > 0 ? `${h}h ${parseInt(m, 10)}m ${s}s` : `${parseInt(m, 10)}m ${s}s`
}

function getBracket(distance_m) {
  return DISTANCE_BRACKETS.find((b) => distance_m >= b.min && distance_m < b.max) ?? null
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }) {
  return (
    <div className="flex items-center justify-center h-[180px] text-sm text-slate-400">
      {message}
    </div>
  )
}

// ─── section wrapper ──────────────────────────────────────────────────────────

function Section({ id, title, icon: Icon, children }) {
  return (
    <section id={id} aria-label={title}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</h2>
      </div>
      <Card className="border border-slate-200/70 shadow-sm">
        <CardContent className="px-5 py-5">{children}</CardContent>
      </Card>
    </section>
  )
}

// ─── weekly distance chart ────────────────────────────────────────────────────

function WeeklyDistanceChart({ activities }) {
  const now = new Date()
  const weeks = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(new Date(d).setDate(diff))
    weeks.push(monday.toISOString().slice(0, 10))
  }

  const weekMap = {}
  for (const wk of weeks) weekMap[wk] = { week: wk, distance_km: 0, count: 0 }

  for (const a of activities) {
    if (!RUN_TYPES.has(a.activity_type)) continue
    const wk = getWeekKey(a.started_at)
    if (weekMap[wk]) {
      weekMap[wk].distance_km += (a.distance_m ?? 0) / 1000
      weekMap[wk].count += 1
    }
  }

  const data = weeks.map((wk) => ({
    label: fmtWeekLabel(wk),
    distance_km: parseFloat(weekMap[wk].distance_km.toFixed(2)),
    count: weekMap[wk].count,
    isCurrentWeek: wk === getWeekKey(now.toISOString()),
  }))

  const maxKm = Math.max(...data.map((d) => d.distance_km), 1)

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">Last 12 weeks — running activities only</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            domain={[0, Math.ceil(maxKm * 1.15)]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            unit=" km"
            width={48}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  <p className="text-slate-800 font-semibold">{d?.distance_km} km</p>
                  <p className="text-slate-400">
                    {d?.count} run{d?.count !== 1 ? 's' : ''}
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="distance_km" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isCurrentWeek ? '#7c3aed' : '#c4b5fd'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-violet-300 inline-block" />
          Past weeks
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-sm bg-violet-600 inline-block" />
          Current week
        </span>
      </div>
    </div>
  )
}

// ─── best pace per distance chart ─────────────────────────────────────────────

function BestPaceChart({ activities }) {
  const bracketMap = {}
  for (const a of activities) {
    if (!RUN_TYPES.has(a.activity_type) || !a.avg_pace_sec_per_km || !a.distance_m) continue
    const b = getBracket(a.distance_m)
    if (!b) continue
    if (!bracketMap[b.key] || a.avg_pace_sec_per_km < bracketMap[b.key].best_pace) {
      bracketMap[b.key] = {
        label: b.label,
        color: b.color,
        best_pace: a.avg_pace_sec_per_km,
        date: a.started_at,
      }
    }
  }

  const data = DISTANCE_BRACKETS.filter((b) => bracketMap[b.key]).map((b) => ({
    label: b.label,
    pace: bracketMap[b.key].best_pace,
    color: b.color,
    dateLabel: new Date(bracketMap[b.key].date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  if (data.length === 0) {
    return <EmptyState message="Not enough data across distance categories yet" />
  }

  const paceMin = Math.max(0, Math.min(...data.map((d) => d.pace)) - 20)
  const paceMax = Math.max(...data.map((d) => d.pace)) + 30

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">Best average pace per distance range</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[paceMin, paceMax]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtPaceTick}
            width={44}
            reversed
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{d?.label}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: d?.color }}
                    />
                    <span className="text-slate-500">Best pace:</span>
                    <span className="font-semibold text-slate-800">{fmtPace(d?.pace)} /km</span>
                  </div>
                  <p className="text-slate-400 mt-0.5">{d?.dateLabel}</p>
                </div>
              )
            }}
          />
          <Bar dataKey="pace" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2 text-right">lower bar = faster pace</p>
    </div>
  )
}

// ─── training load history ─────────────────────────────────────────────────────

function TrainingLoadHistoryChart({ trainingLoad }) {
  if (!trainingLoad || trainingLoad.status === 'no_data') {
    return <EmptyState message="Not enough training history to show load trends (need 28+ days)" />
  }

  const { acwr, acute_load_7d, chronic_load_28d, status } = trainingLoad

  const statusColor = ACWR_COLORS[status] ?? '#94a3b8'

  const barData = [
    { label: 'Acute (7d)', value: parseFloat(acute_load_7d?.toFixed(1) ?? 0), fill: '#8b5cf6' },
    {
      label: 'Chronic (28d)',
      value: parseFloat(chronic_load_28d?.toFixed(1) ?? 0),
      fill: '#c4b5fd',
    },
  ]

  const STATUS_LABELS = {
    no_data: 'No Data',
    low: 'Low Load',
    optimal: 'Optimal',
    caution: 'Caution',
    danger: 'High Risk',
    resting: 'Rest Week',
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ACWR gauge row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold tabular-nums" style={{ color: statusColor }}>
            {acwr != null ? acwr.toFixed(2) : '—'}
          </div>
          <div>
            <p className="text-xs text-slate-400">ACWR</p>
            <span
              className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
              style={{ background: statusColor + '22', color: statusColor }}
            >
              {STATUS_LABELS[status] ?? status}
            </span>
          </div>
        </div>
        <div className="sm:ml-4 text-xs text-slate-400 max-w-xs">
          Ratio of your last 7-day load vs 28-day average.{' '}
          <span className="text-slate-500">0.8–1.3 is optimal.</span>
        </div>
      </div>

      {/* Acute vs Chronic bars */}
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={barData}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            width={88}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="text-slate-600 font-medium">{payload[0]?.payload?.label}</p>
                  <p className="text-slate-800 font-semibold">{payload[0]?.value} pts</p>
                </div>
              )
            }}
          />
          <Bar dataKey="value" radius={[0, 3, 3, 0]}>
            {barData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* ACWR zone reference */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
        {[
          { range: '< 0.8', label: 'Low Load', color: '#60a5fa' },
          { range: '0.8–1.3', label: 'Optimal', color: '#22c55e' },
          { range: '1.3–1.5', label: 'Caution', color: '#eab308' },
          { range: '> 1.5', label: 'High Risk', color: '#ef4444' },
        ].map((z) => (
          <div key={z.range} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: z.color }} />
            <span>
              {z.range} — {z.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── pace trend over time ─────────────────────────────────────────────────────

function PaceTrendChart({ trendData }) {
  const data = trendData
    .filter((a) => a.avg_pace_sec_per_km)
    .map((a) => ({
      date: new Date(a.started_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      pace: a.avg_pace_sec_per_km,
    }))

  if (data.length < 3) {
    return <EmptyState message="Need at least 3 runs to show pace trend" />
  }

  const paces = data.map((d) => d.pace)
  const paceMin = Math.max(0, Math.min(...paces) - 15)
  const paceMax = Math.max(...paces) + 30

  // Simple 3-run moving average
  const withAvg = data.map((d, i) => {
    if (i < 2) return { ...d, avg: null }
    const slice = data.slice(i - 2, i + 1).map((x) => x.pace)
    return { ...d, avg: Math.round(slice.reduce((s, v) => s + v, 0) / 3) }
  })

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">
        Last {data.length} runs · lower = faster · purple line = 3-run moving average
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={withAvg} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[paceMin, paceMax]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtPaceTick}
            width={44}
            reversed
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
                  <p className="font-medium text-slate-600 mb-1">{label}</p>
                  {payload.map((p) => (
                    <div key={p.dataKey} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: p.color }}
                      />
                      <span className="text-slate-500">{p.name}:</span>
                      <span className="font-semibold text-slate-800">
                        {p.value ? fmtPace(p.value) + ' /km' : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#c4b5fd"
            strokeWidth={1.5}
            dot={{ r: 3, fill: '#c4b5fd', strokeWidth: 0 }}
            name="Pace"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={false}
            name="3-run avg"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── race predictor ──────────────────────────────────────────────────────────

function RacePredictor({ activities }) {
  const [sourceBracket, setSourceBracket] = useState('5K')

  const bracketBests = useMemo(() => {
    const bests = {}
    for (const a of activities) {
      if (!RUN_TYPES.has(a.activity_type) || !a.avg_pace_sec_per_km || !a.distance_m) continue
      const b = getBracket(a.distance_m)
      if (!b) continue
      const timeSec = (a.avg_pace_sec_per_km / 1000) * a.distance_m
      if (!bests[b.key] || timeSec < bests[b.key].timeSec) {
        bests[b.key] = {
          timeSec,
          distance_m: a.distance_m,
          pace: a.avg_pace_sec_per_km,
          label: b.label,
        }
      }
    }
    return bests
  }, [activities])

  const availableBrackets = DISTANCE_BRACKETS.filter((b) => bracketBests[b.key])

  if (availableBrackets.length === 0) {
    return (
      <EmptyState message="Need at least one run in a recognized distance bracket (5K–Marathon)" />
    )
  }

  const activeBracket =
    availableBrackets.find((b) => b.key === sourceBracket) ?? availableBrackets[0]
  const source = bracketBests[activeBracket.key]

  const predictions = RIEGEL_TARGETS.map((t) => {
    const predicted = riegelPredict(source.timeSec, source.distance_m, t.distance_m)
    const paceSec = predicted / (t.distance_m / 1000)
    return {
      label: t.label,
      distance_m: t.distance_m,
      predicted_sec: Math.round(predicted),
      pace_sec: Math.round(paceSec),
    }
  })

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-slate-500">Based on your best</span>
        {availableBrackets.map((b) => (
          <button
            key={b.key}
            onClick={() => setSourceBracket(b.key)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeBracket.key === b.key
                ? 'text-white border-transparent'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
            style={activeBracket.key === b.key ? { background: b.color, borderColor: b.color } : {}}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="bg-violet-50 rounded-lg px-4 py-2.5 mb-4 text-xs text-violet-700">
        <span className="font-semibold">Source:</span> Best {activeBracket.label} pace —{' '}
        <span className="font-semibold">{fmtPace(source.pace)} /km</span> (
        {fmtDurationShort(Math.round(source.timeSec))} total)
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Race predictor results">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">
                Distance
              </th>
              <th className="text-left py-2 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">
                Predicted Time
              </th>
              <th className="text-left py-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                Predicted Pace
              </th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => (
              <tr key={p.label} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-slate-700">{p.label}</td>
                <td className="py-2.5 pr-4 text-slate-800 font-semibold tabular-nums">
                  {fmtDurationShort(p.predicted_sec)}
                </td>
                <td className="py-2.5 text-slate-600 tabular-nums">{fmtPace(p.pace_sec)} /km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3">
        Predicted using the Riegel formula. Accuracy improves the closer your source distance is to
        the target.
      </p>
    </div>
  )
}

// ─── rolling 30-day average helper ───────────────────────────────────────────

function rolling30DayAvg(pts, dateKey, valueKey) {
  return pts.map((pt, i) => {
    const cutoff = new Date(pt[dateKey])
    cutoff.setDate(cutoff.getDate() - 30)
    const window = pts.slice(0, i + 1).filter((p) => new Date(p[dateKey]) >= cutoff)
    const sum = window.reduce((s, p) => s + p[valueKey], 0)
    return { ...pt, rollingAvg: parseFloat((sum / window.length).toFixed(4)) }
  })
}

// ─── vo2max trend chart ───────────────────────────────────────────────────────

function Vo2maxTrendChart({ activities }) {
  const pts = activities
    .filter((a) => RUN_TYPES.has(a.activity_type) && a.estimated_vo2max != null)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .slice(-90)
    .map((a) => ({
      date: a.started_at,
      label: new Date(a.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      vo2max: parseFloat(Number(a.estimated_vo2max).toFixed(2)),
    }))

  if (pts.length < 3) {
    return <EmptyState message="Connect a HR monitor to unlock VO2max estimates" />
  }

  const data = rolling30DayAvg(pts, 'date', 'vo2max')

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">
        Last {pts.length} runs with HR data · purple line = 30-day rolling average
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
            tickFormatter={(v) => v.toFixed(1)}
            unit=" ml"
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
                    VO₂max:{' '}
                    <span className="font-semibold">
                      {d?.vo2max != null ? Number(d.vo2max).toFixed(1) : '—'} mL/kg/min
                    </span>
                  </p>
                  {d?.rollingAvg != null && (
                    <p className="text-violet-600 mt-0.5">
                      30d avg:{' '}
                      <span className="font-semibold">{Number(d.rollingAvg).toFixed(1)}</span>
                    </p>
                  )}
                </div>
              )
            }}
          />
          <Line
            type="monotone"
            dataKey="vo2max"
            stroke="#c4b5fd"
            strokeWidth={0}
            dot={{ fill: '#c4b5fd', r: 3, strokeWidth: 0 }}
            name="VO₂max"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="rollingAvg"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            name="30d avg"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── efficiency factor trend chart ────────────────────────────────────────────

function EfTrendChart({ activities }) {
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
    return <EmptyState message="Efficiency Factor requires HR and pace data" />
  }

  const data = rolling30DayAvg(basePts, 'date', 'ef')

  return (
    <div>
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

// ─── summary stats row ────────────────────────────────────────────────────────

function SummaryStats({ activities, trendData }) {
  const runActivities = activities.filter((a) => RUN_TYPES.has(a.activity_type))

  const totalDistKm = runActivities.reduce((s, a) => s + (a.distance_m ?? 0) / 1000, 0)
  const totalRuns = runActivities.length

  // Best pace across all activities
  const bestPace = runActivities
    .filter((a) => a.avg_pace_sec_per_km)
    .reduce((best, a) => (a.avg_pace_sec_per_km < best ? a.avg_pace_sec_per_km : best), Infinity)

  // Avg weekly distance (last 8 weeks with data)
  const weekMap = {}
  for (const a of runActivities) {
    const wk = getWeekKey(a.started_at)
    weekMap[wk] = (weekMap[wk] ?? 0) + (a.distance_m ?? 0) / 1000
  }
  const weekValues = Object.values(weekMap)
  const avgWeeklyKm =
    weekValues.length > 0 ? weekValues.reduce((s, v) => s + v, 0) / weekValues.length : 0

  const stats = [
    { label: 'Total Runs', value: String(totalRuns), unit: null },
    { label: 'Total Distance', value: totalDistKm.toFixed(0), unit: 'km' },
    { label: 'Avg Weekly', value: avgWeeklyKm.toFixed(1), unit: 'km/wk' },
    {
      label: 'Best Pace',
      value: bestPace < Infinity ? fmtPace(bestPace) : '—',
      unit: bestPace < Infinity ? '/km' : null,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-slate-200/70 rounded-lg px-4 py-3 shadow-sm"
        >
          <p className="text-xs text-slate-400">{s.label}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold text-slate-800 tabular-nums">{s.value}</span>
            {s.unit && <span className="text-xs text-slate-400">{s.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [activities, setActivities] = useState([])
  const [trendData, setTrendData] = useState([])
  const [trainingLoad, setTrainingLoad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [activitiesRes, trendsRes, dashboardRes] = await Promise.allSettled([
          fetchActivities({ page: 1, limit: 200 }),
          fetchPerformanceTrends(50),
          getDashboard(),
        ])

        if (cancelled) return

        if (activitiesRes.status === 'fulfilled') {
          setActivities(activitiesRes.value?.data ?? [])
        }
        if (trendsRes.status === 'fulfilled') {
          setTrendData(trendsRes.value?.data ?? [])
        }
        if (dashboardRes.status === 'fulfilled') {
          setTrainingLoad(dashboardRes.value?.training_load ?? null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load analytics data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const runTrendData = useMemo(
    () => trendData.filter((a) => RUN_TYPES.has(a.activity_type)),
    [trendData]
  )

  return (
    <div id="analyticsPage" className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Training trends, load analysis, and race predictions"
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Analytics' },
        ]}
      />

      {loading && (
        <div
          id="analyticsLoadingSkeleton"
          className="flex flex-col gap-6"
          aria-label="Loading analytics"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-slate-100 rounded-lg animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-slate-100 rounded-xl animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          id="analyticsError"
          role="alert"
          className="flex flex-col items-center justify-center py-16 gap-3 text-center"
        >
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-violet-600 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <SummaryStats activities={activities} trendData={runTrendData} />

          <Section id="weeklyDistanceSection" title="Weekly Distance" icon={BarChart2}>
            <WeeklyDistanceChart activities={activities} />
          </Section>

          <Section id="paceTrendSection" title="Pace Trend" icon={TrendingUp}>
            <PaceTrendChart trendData={runTrendData} />
          </Section>

          <Section id="bestPaceSection" title="Best Pace by Distance" icon={Zap}>
            <BestPaceChart activities={activities} />
          </Section>

          <Section id="trainingLoadSection" title="Training Load (ACWR)" icon={Activity}>
            <TrainingLoadHistoryChart trainingLoad={trainingLoad} />
          </Section>

          <Section id="vo2maxTrendSection" title="VO2max Trend" icon={Activity}>
            <Vo2maxTrendChart activities={activities} />
          </Section>

          <Section id="efTrendSection" title="Efficiency Factor Trend" icon={TrendingUp}>
            <EfTrendChart activities={activities} />
          </Section>

          <Section id="racePredictorSection" title="Race Predictor" icon={TrendingUp}>
            <RacePredictor activities={activities} />
          </Section>
        </>
      )}
    </div>
  )
}
