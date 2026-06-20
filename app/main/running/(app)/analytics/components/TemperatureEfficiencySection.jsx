'use client'

import { useState, useEffect } from 'react'
import { Thermometer } from 'lucide-react'
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Cell,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { fetchTemperatureEfficiency } from '@/lib/api/running'

const MORNING_COLOR = '#f59e0b'
const EVENING_COLOR = '#6366f1'

function fmtPace(sec) {
  if (!sec) return '—'
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} /km`
}

// Custom box plot shape rendered per temp group
function BoxShape(props) {
  const { cx, payload, yAxis, xAxis } = props
  if (!payload) return null

  const { q1, q3, min, max, median, n } = payload
  const toY = (v) => yAxis.scale(v)
  const x = cx
  const w = 18
  const thin = n < 3

  return (
    <g>
      {/* whiskers */}
      <line
        x1={x}
        x2={x}
        y1={toY(min)}
        y2={toY(q1)}
        stroke="#94a3b8"
        strokeWidth={1}
        strokeDasharray={thin ? '3 2' : undefined}
      />
      <line
        x1={x}
        x2={x}
        y1={toY(q3)}
        y2={toY(max)}
        stroke="#94a3b8"
        strokeWidth={1}
        strokeDasharray={thin ? '3 2' : undefined}
      />
      {/* whisker caps */}
      <line x1={x - 5} x2={x + 5} y1={toY(min)} y2={toY(min)} stroke="#94a3b8" strokeWidth={1} />
      <line x1={x - 5} x2={x + 5} y1={toY(max)} y2={toY(max)} stroke="#94a3b8" strokeWidth={1} />
      {/* box */}
      <rect
        x={x - w / 2}
        y={toY(q3)}
        width={w}
        height={toY(q1) - toY(q3)}
        fill={thin ? 'none' : '#e2e8f0'}
        stroke="#94a3b8"
        strokeWidth={1}
        rx={2}
      />
      {/* median line */}
      <line
        x1={x - w / 2}
        x2={x + w / 2}
        y1={toY(median)}
        y2={toY(median)}
        stroke="#475569"
        strokeWidth={2}
      />
      {/* median label */}
      <text x={x + w / 2 + 4} y={toY(median) + 4} fontSize={9} fill="#64748b">
        {median.toFixed(2)}
      </text>
      {/* n label for thin boxes */}
      {thin && (
        <text x={x} y={toY(max) - 6} textAnchor="middle" fontSize={8} fill="#94a3b8">
          n={n}
        </text>
      )}
    </g>
  )
}

function CustomDot(props) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null) return null
  const color = payload.time_of_day === 'pagi' ? MORNING_COLOR : EVENING_COLOR
  return (
    <circle cx={cx} cy={cy} r={4} fill={color} fillOpacity={0.85} stroke="#fff" strokeWidth={1} />
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d?.started_at) return null
  const date = new Date(d.started_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-2 text-xs flex flex-col gap-0.5 min-w-[160px]">
      <p className="font-medium text-slate-700 mb-1">{date}</p>
      <p className="text-slate-500">
        Pace: <span className="text-slate-700 font-medium">{fmtPace(d.avg_pace_sec)}</span>
      </p>
      <p className="text-slate-500">
        HR: <span className="text-slate-700 font-medium">{d.avg_hr} bpm</span>
      </p>
      <p className="text-slate-500">
        Temp: <span className="text-slate-700 font-medium">{d.avg_temp_c}°C</span>
      </p>
      <p className="text-slate-500">
        Distance: <span className="text-slate-700 font-medium">{d.distance_km} km</span>
      </p>
      <p className="text-slate-500">
        Ratio: <span className="text-slate-700 font-medium">{d.pace_hr_ratio.toFixed(3)}</span>
      </p>
      <p
        className={`mt-0.5 font-medium ${d.time_of_day === 'pagi' ? 'text-amber-600' : 'text-indigo-500'}`}
      >
        {d.time_of_day === 'pagi' ? 'Morning' : 'Evening'}
      </p>
    </div>
  )
}

function SummaryTable({ summary }) {
  const rows = [
    { label: 'Runs', morning: summary.morning.count, evening: summary.evening.count },
    {
      label: 'Avg Temp',
      morning: summary.morning.avg_temp_c != null ? `${summary.morning.avg_temp_c}°C` : '—',
      evening: summary.evening.avg_temp_c != null ? `${summary.evening.avg_temp_c}°C` : '—',
    },
    {
      label: 'Avg Pace (moving)',
      morning: fmtPace(summary.morning.avg_pace_sec),
      evening: fmtPace(summary.evening.avg_pace_sec),
    },
    {
      label: 'Avg HR',
      morning: summary.morning.avg_hr != null ? `${summary.morning.avg_hr} bpm` : '—',
      evening: summary.evening.avg_hr != null ? `${summary.evening.avg_hr} bpm` : '—',
    },
    {
      label: 'Avg Ratio',
      morning: summary.morning.avg_ratio?.toFixed(3) ?? '—',
      evening: summary.evening.avg_ratio?.toFixed(3) ?? '—',
    },
  ]
  return (
    <div>
      <div className="grid grid-cols-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1.5 mb-1">
        <span />
        <span className="text-center text-amber-600">Morning</span>
        <span className="text-center text-indigo-500">Evening</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid grid-cols-3 py-1.5 border-b border-slate-100 last:border-0 text-xs"
        >
          <span className="text-slate-400">{r.label}</span>
          <span className="text-center text-slate-700 font-medium">{r.morning}</span>
          <span className="text-center text-slate-700 font-medium">{r.evening}</span>
        </div>
      ))}
      <p className="text-[10px] text-slate-400 mt-2">
        Differences not statistically significant (n={summary.hr_run_count})
      </p>
    </div>
  )
}

function buildInsight(summary) {
  const { morning, evening, overall_avg_ratio, hr_run_count } = summary
  const parts = []

  if (morning.count > 0 && evening.count > 0 && morning.avg_ratio && evening.avg_ratio) {
    const betterSlot = morning.avg_ratio < evening.avg_ratio ? 'morning' : 'evening'
    parts.push(`Your ${betterSlot} runs show better cardiac efficiency (lower pace/HR ratio).`)
  } else if (overall_avg_ratio) {
    parts.push(`Overall avg efficiency ratio: ${overall_avg_ratio.toFixed(3)}.`)
  }

  if (hr_run_count < 25) {
    parts.push(
      `More data needed for a reliable conclusion — only ${hr_run_count} runs have HR data.`
    )
  }

  return parts.join(' ')
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="h-10 w-40 bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-52 bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
    </div>
  )
}

export default function TemperatureEfficiencySection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    setError(null)
    fetchTemperatureEfficiency()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load temperature efficiency data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const hrCount = data?.summary?.hr_run_count ?? 0

  // Compute Y domain from runs + ref band with some padding
  const allRatios = data?.runs?.map((r) => r.pace_hr_ratio) ?? []
  const yMin = allRatios.length ? Math.floor(Math.min(...allRatios) * 10) / 10 - 0.1 : 1.5
  const yMax = allRatios.length ? Math.ceil(Math.max(...allRatios) * 10) / 10 + 0.1 : 4.0

  // Scatter data: runs keyed by temp_c for X axis
  const scatterData = data?.runs ?? []

  return (
    <section
      id="temperatureEfficiencySection_analyticsPage"
      aria-label="Temperature vs Cardiac Efficiency"
      className="scroll-mt-20"
    >
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex items-center gap-2">
                <Thermometer className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Temperature vs Cardiac Efficiency
                </h3>
              </div>
              {!loading && !error && (
                <span className="text-[10px] text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 shrink-0">
                  Based on {hrCount} runs with HR data — directional only
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Pace/HR ratio per temperature (lower = more efficient). Color:{' '}
              <span className="text-amber-600 font-medium">orange = morning</span>,{' '}
              <span className="text-indigo-500 font-medium">indigo = evening</span>.
            </p>
          </div>

          {loading && <Skeleton />}

          {!loading && error && (
            <div
              id="temperatureEfficiencyError_analyticsPage"
              role="alert"
              className="flex flex-col items-center gap-2 py-8 text-center"
            >
              <p className="text-xs text-red-500">{error}</p>
              <button
                onClick={load}
                className="text-xs text-violet-600 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && data && (
            <div className="flex flex-col gap-5">
              {/* Headline metric */}
              {data.summary.overall_avg_ratio != null && (
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg w-fit">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Avg efficiency ratio
                    </p>
                    <p className="text-xl font-bold text-slate-700">
                      {data.summary.overall_avg_ratio.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      pace (sec/km) ÷ HR (bpm) — lower is better
                    </p>
                  </div>
                </div>
              )}

              {/* Chart */}
              {scatterData.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">
                  No runs with HR and temperature data yet.
                </p>
              ) : (
                <div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart margin={{ top: 10, right: 16, bottom: 24, left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="avg_temp_c"
                        type="number"
                        domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}°C`}
                        label={{
                          value: 'Temperature (°C)',
                          position: 'insideBottom',
                          offset: -2,
                          fontSize: 10,
                          fill: '#94a3b8',
                        }}
                      />
                      <YAxis
                        dataKey="pace_hr_ratio"
                        type="number"
                        domain={[yMin, yMax]}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        width={52}
                        tickFormatter={(v) => v.toFixed(2)}
                        label={{
                          value: 'Pace/HR ratio',
                          angle: -90,
                          position: 'insideLeft',
                          offset: 14,
                          fontSize: 10,
                          fill: '#94a3b8',
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      {/* Reference band — user's efficiency zone */}
                      {data.ref_band && (
                        <ReferenceArea
                          y1={data.ref_band.low}
                          y2={data.ref_band.high}
                          fill="#8b5cf6"
                          fillOpacity={0.06}
                          stroke="#8b5cf6"
                          strokeOpacity={0.2}
                          strokeDasharray="4 3"
                          label={{
                            value: 'Your zone',
                            position: 'insideTopRight',
                            fontSize: 9,
                            fill: '#8b5cf6',
                          }}
                        />
                      )}

                      {/* Individual run dots */}
                      <Scatter data={scatterData} shape={<CustomDot />} />
                    </ComposedChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="flex items-center gap-4 justify-center mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="text-[10px] text-slate-500">Morning (05–11)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      <span className="text-[10px] text-slate-500">Evening (12–)</span>
                    </div>
                    {data.ref_band && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-6 h-2 rounded bg-violet-200 border border-violet-300" />
                        <span className="text-[10px] text-slate-500">Your efficiency zone</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary table */}
              {(data.summary.morning.count > 0 || data.summary.evening.count > 0) && (
                <SummaryTable summary={data.summary} />
              )}

              {/* Auto insight */}
              <p
                id="temperatureEfficiencyInsight_analyticsPage"
                className="text-xs text-slate-500 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100"
              >
                {buildInsight(data.summary)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
