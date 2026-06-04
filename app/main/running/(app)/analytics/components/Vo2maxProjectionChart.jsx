'use client'

import {
  ComposedChart,
  Line,
  Area,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { RUN_TYPES, rolling30DayAvg } from './utils'

const PROJECTION_WEEKS = 24

function buildProjectionPoints(currentVo2max, requiredVo2max, weeksToGoal) {
  if (!weeksToGoal || currentVo2max == null) return []

  const { optimistic, realistic, pessimistic } = weeksToGoal
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const maxWeeks = Math.min(
    Math.max(optimistic ?? PROJECTION_WEEKS, pessimistic ?? PROJECTION_WEEKS, 4),
    PROJECTION_WEEKS
  )

  const points = []
  for (let w = 0; w <= maxWeeks; w++) {
    const date = new Date(today)
    date.setDate(date.getDate() + w * 7)
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    const calcProjVo2max = (weeks) => {
      if (!weeks || weeks === 0) return currentVo2max
      const rate = Math.log(requiredVo2max / currentVo2max) / weeks
      return Math.round(currentVo2max * Math.exp(rate * w) * 10) / 10
    }

    const opt = calcProjVo2max(optimistic)
    const real = calcProjVo2max(realistic)
    const pess = calcProjVo2max(pessimistic)

    points.push({
      label,
      week: w,
      projected: real,
      band: [pess, opt],
    })
  }
  return points
}

function buildHistoricalPoints(activities) {
  const pts = activities
    .filter((a) => RUN_TYPES.has(a.activity_type) && a.estimated_vo2max != null)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .slice(-30)
    .map((a) => ({
      date: a.started_at,
      label: new Date(a.started_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      vo2max: parseFloat(Number(a.estimated_vo2max).toFixed(2)),
    }))

  if (pts.length < 2) return []
  return rolling30DayAvg(pts, 'date', 'vo2max').map((p) => ({
    label: p.label,
    historical: p.rollingAvg,
  }))
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((entry) => {
        if (entry.name === 'band' || entry.value == null) return null
        return (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name === 'historical' ? 'Historical avg' : 'Projected'}:{' '}
            <span className="font-semibold">{entry.value}</span>
          </p>
        )
      })}
    </div>
  )
}

export default function Vo2maxProjectionChart({ data, activities }) {
  if (!data || data.status !== 'ok' || data.statusBadge === 'Goal Expired') {
    return null
  }

  const historicalPts = buildHistoricalPoints(activities ?? [])
  const projectionPts = buildProjectionPoints(
    data.currentVo2max,
    data.requiredVo2max,
    data.weeksToGoal
  )

  if (projectionPts.length === 0) return null

  // Merge historical (trailing on left) with projection (forward on right)
  // Historical uses negative week indices for ordering
  const histWithWeeks = historicalPts.map((p, i) => ({
    ...p,
    week: -(historicalPts.length - i),
  }))

  const allPoints = [...histWithWeeks, ...projectionPts].sort((a, b) => a.week - b.week)

  const allValues = allPoints
    .flatMap((p) => [
      p.historical,
      p.projected,
      p.band ? p.band[0] : null,
      p.band ? p.band[1] : null,
      data.requiredVo2max,
    ])
    .filter((v) => v != null)

  const minY = Math.floor(Math.min(...allValues) - 2)
  const maxY = Math.ceil(Math.max(...allValues) + 2)

  return (
    <div id="vo2maxProjectionChart_analyticsPage" className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-violet-500 rounded" aria-hidden="true" />
          Historical avg
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-0.5 border-t-2 border-dashed border-violet-400"
            aria-hidden="true"
          />
          Projected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-2 bg-violet-100 rounded" aria-hidden="true" />
          Confidence band
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 bg-amber-400 rounded" aria-hidden="true" />
          Target VO2max
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={allPoints} margin={{ top: 4, right: 8, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minY, maxY]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toFixed(0)}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Confidence band: pessimistic → optimistic */}
          <Area
            dataKey="band"
            fill="#ede9fe"
            stroke="none"
            fillOpacity={0.5}
            isAnimationActive={false}
            connectNulls
          />

          {/* Historical rolling avg — solid violet */}
          <Line
            dataKey="historical"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />

          {/* Projected line — dashed violet */}
          <Line
            dataKey="projected"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            isAnimationActive={false}
            connectNulls
          />

          {/* Required VO2max reference line — amber */}
          <ReferenceLine
            y={data.requiredVo2max}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            label={{
              value: `Target: ${data.requiredVo2max}`,
              position: 'insideTopRight',
              fontSize: 10,
              fill: '#b45309',
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
