'use client'

import { useState } from 'react'
import { Heart, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import { fmtPace, fmtDuration } from '../../dashboard/utils/format'
import { SectionLabel } from './activityShared'

const TH =
  'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap'

const METRICS = ['Pace', 'Time', 'HR', 'GAP', 'EF']

function computeEf(paceSec, avgHr) {
  if (!paceSec || !avgHr) return null
  return Math.round((1000 / paceSec / avgHr) * 1000) / 1000
}

function computePacingStrategy(fullSplits) {
  if (fullSplits.length < 2) return { label: null, fadePct: null }
  const mid = Math.floor(fullSplits.length / 2)
  const firstHalf = fullSplits.slice(0, mid)
  const secondHalf = fullSplits.slice(mid)
  const avgFirst = firstHalf.reduce((s, x) => s + x.pace_sec_per_km, 0) / firstHalf.length
  const avgSecond = secondHalf.reduce((s, x) => s + x.pace_sec_per_km, 0) / secondHalf.length
  const diffPct = ((avgSecond - avgFirst) / avgFirst) * 100
  let label
  if (diffPct <= -1) label = 'Negative split'
  else if (diffPct >= 3) label = 'Positive split'
  else if (diffPct > 0) label = 'Controlled fade'
  else label = 'Even split'
  const fadePct = diffPct > 0 ? diffPct.toFixed(1) : null
  return { label, fadePct }
}

function chipStyle(label) {
  if (label === 'Negative split') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (label === 'Even split') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (label === 'Controlled fade') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

function metricValue(split, metric) {
  if (metric === 'Pace') return split.pace_sec_per_km
  if (metric === 'Time') return split.duration_sec
  if (metric === 'HR') return split.avg_hr
  if (metric === 'GAP') return split.gap_sec_per_km
  if (metric === 'EF') return computeEf(split.pace_sec_per_km, split.avg_hr)
  return null
}

function formatMetricLabel(val, metric) {
  if (val == null) return '—'
  if (metric === 'Pace' || metric === 'GAP') return `${fmtPace(val)}/km`
  if (metric === 'Time') return fmtDuration(val)
  if (metric === 'HR') return `${val} bpm`
  if (metric === 'EF') return val.toFixed(3)
  return val
}

function barColor(split, bestIdx, worstIdx, idx, isPartial) {
  if (isPartial) return '#8b5cf6'
  if (idx === bestIdx) return '#f59e0b'
  if (idx === worstIdx) return '#ef4444'
  return '#8b5cf6'
}

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-slate-700">Split {label}</p>
      <p className="text-slate-500">
        {metric}: {formatMetricLabel(val, metric)}
      </p>
    </div>
  )
}

export default function SplitsSection({ splits, pagePrefix = 'activityDetailPage' }) {
  const [view, setView] = useState('bar')
  const [metric, setMetric] = useState('Pace')

  if (!splits || splits.length === 0) return null

  const PARTIAL_THRESHOLD = 900
  const fullSplits = splits.filter((s) => (s.distance_m ?? 1000) >= PARTIAL_THRESHOLD)
  const isPartialMap = Object.fromEntries(
    splits.map((s) => [s.split_number, (s.distance_m ?? 1000) < PARTIAL_THRESHOLD])
  )

  const { label: strategyLabel, fadePct } = computePacingStrategy(fullSplits)

  const hasSplitsHr = splits.some((s) => s.avg_hr != null)
  const splitsWithHr = splits.filter((s) => s.avg_hr != null)
  const cardiacDrift =
    hasSplitsHr && splitsWithHr.length >= 2
      ? splitsWithHr[splitsWithHr.length - 1].avg_hr - splitsWithHr[0].avg_hr
      : null

  const chartData = splits.map((s) => {
    const val = metricValue(s, metric)
    const partial = (s.distance_m ?? 1000) < PARTIAL_THRESHOLD
    return {
      name: s.split_number,
      value: val,
      split: s,
      distLabel: partial && s.distance_m ? `${(s.distance_m / 1000).toFixed(2)} km` : null,
    }
  })

  const fullChartVals = chartData
    .filter((d, i) => !isPartialMap[splits[i]?.split_number])
    .map((d) => d.value)
    .filter((v) => v != null)

  const isPaceOrGap = metric === 'Pace' || metric === 'GAP'
  const bestVal = fullChartVals.length
    ? isPaceOrGap
      ? Math.min(...fullChartVals)
      : Math.max(...fullChartVals)
    : null
  const worstVal = fullChartVals.length
    ? isPaceOrGap
      ? Math.max(...fullChartVals)
      : Math.min(...fullChartVals)
    : null

  const bestIdx =
    bestVal != null ? chartData.findIndex((d) => d.value === bestVal && !isPartialMap[d.name]) : -1
  const worstIdx =
    worstVal != null && worstVal !== bestVal
      ? chartData.findIndex((d) => d.value === worstVal && !isPartialMap[d.name])
      : -1

  const allVals = chartData.map((d) => d.value).filter((v) => v != null)
  const minVal = allVals.length ? Math.min(...allVals) : 0
  const maxVal = allVals.length ? Math.max(...allVals) : 1
  const padding = (maxVal - minVal) * 0.15 || 1
  const domain = isPaceOrGap
    ? [Math.max(0, minVal - padding), maxVal + padding]
    : [Math.max(0, minVal - padding), maxVal + padding]

  const showHrTab = hasSplitsHr
  const availableMetrics = METRICS.filter((m) => m !== 'HR' || showHrTab)

  return (
    <div id={`splitsSection_${pagePrefix}`}>
      <div className="flex items-center justify-between mb-2">
        <SectionLabel>Splits (per km)</SectionLabel>
        <div className="flex items-center gap-1">
          <button
            id={`splitsViewBarBtn_${pagePrefix}`}
            type="button"
            aria-pressed={view === 'bar'}
            onClick={() => setView('bar')}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              view === 'bar'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Bar
          </button>
          <button
            id={`splitsViewTableBtn_${pagePrefix}`}
            type="button"
            aria-pressed={view === 'table'}
            onClick={() => setView('table')}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              view === 'table'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {view === 'bar' && (
        <>
          <div className="flex flex-wrap gap-1 mb-3">
            {availableMetrics.map((m) => (
              <button
                key={m}
                id={`splitsMetric${m}_${pagePrefix}`}
                type="button"
                onClick={() => setMetric(m)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  metric === m
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {strategyLabel && (
            <div className="flex items-center gap-2 mb-3">
              <span
                id={`splitsPacingChip_${pagePrefix}`}
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${chipStyle(strategyLabel)}`}
              >
                {strategyLabel}
              </span>
              {fadePct && (
                <span id={`splitsPaceFade_${pagePrefix}`} className="text-xs text-slate-400">
                  +{fadePct}% fade
                </span>
              )}
            </div>
          )}

          <div id={`splitsBarChart_${pagePrefix}`} className="w-full">
            <ResponsiveContainer width="100%" height={Math.max(160, splits.length * 44)}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 56, bottom: 0, left: 16 }}
                barCategoryGap="16%"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  domain={domain}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(v) => {
                    if (metric === 'Pace' || metric === 'GAP') return fmtPace(Math.round(v))
                    if (metric === 'Time') return fmtDuration(Math.round(v))
                    if (metric === 'EF') return Number(v).toFixed(2)
                    return Math.round(v)
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  width={20}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  content={<CustomTooltip metric={metric} />}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={32}>
                  {chartData.map((entry, index) => {
                    const partial = isPartialMap[entry.name]
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={barColor(entry.split, bestIdx, worstIdx, index, partial)}
                        opacity={partial ? 0.5 : 1}
                      />
                    )
                  })}
                  <LabelList
                    dataKey="distLabel"
                    position="right"
                    content={(props) => {
                      const { value, x, y, width, height } = props
                      if (!value) return null
                      const px = Number(x) + Number(width) + 4
                      const py = Number(y) + Number(height) / 2 + 4
                      if (!isFinite(px) || !isFinite(py)) return null
                      return (
                        <text x={px} y={py} fontSize={10} fill="#a78bfa" fontWeight={500}>
                          {value}
                        </text>
                      )
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400" /> Best
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400" /> Worst
            </span>
            {splits.some((s) => isPartialMap[s.split_number]) && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-violet-400 opacity-50" />{' '}
                Partial
              </span>
            )}
          </div>
        </>
      )}

      {view === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm" aria-label="Splits table">
            <thead>
              <tr className="border-b border-slate-100">
                <th className={`${TH} text-left w-10`}>#</th>
                <th className={`${TH} text-right`}>Dist</th>
                <th className={`${TH} text-right`}>Pace</th>
                <th className={`${TH} text-right`}>Time</th>
                {hasSplitsHr && <th className={`${TH} text-right`}>HR</th>}
                <th className={`${TH} text-right`}>Elev</th>
              </tr>
            </thead>
            <tbody>
              {splits.map((s) => (
                <tr
                  key={s.id ?? s.split_number}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                    {s.split_number}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {s.distance_m ? `${(s.distance_m / 1000).toFixed(2)} km` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-mono tabular-nums text-sm text-slate-700">
                      {s.pace_sec_per_km ? `${fmtPace(s.pace_sec_per_km)}/km` : '—'}
                    </span>
                    {s.elevation_gain_m > 0 && s.gap_sec_per_km != null && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        GAP {fmtPace(s.gap_sec_per_km)}/km{' '}
                        {(() => {
                          const diff = s.pace_sec_per_km - s.gap_sec_per_km
                          return (
                            <span className={diff > 15 ? 'text-red-500' : 'text-emerald-500'}>
                              {diff >= 0 ? '+' : ''}
                              {diff}s
                            </span>
                          )
                        })()}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {s.duration_sec ? fmtDuration(s.duration_sec) : '—'}
                  </td>
                  {hasSplitsHr && (
                    <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                      {s.avg_hr ? `${s.avg_hr}` : '—'}
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {s.elevation_gain_m != null
                      ? `${s.elevation_gain_m > 0 ? '+' : ''}${Math.round(s.elevation_gain_m)} m`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cardiacDrift !== null && (
        <div id={`cardiacDrift_${pagePrefix}`} className="flex items-center gap-2 mt-2 px-1">
          <Heart className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-xs text-slate-400">Cardiac drift:</span>
          <span
            className={`text-xs font-semibold ${
              cardiacDrift > 0 ? 'text-red-500' : 'text-blue-500'
            }`}
          >
            {cardiacDrift > 0 ? '+' : ''}
            {cardiacDrift} bpm
          </span>
          <span className="text-xs text-slate-300">(split 1 → last split)</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                  aria-label="Cardiac drift information"
                >
                  <Info className="size-3.5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
                <p className="font-semibold mb-1">What is Cardiac Drift?</p>
                <p>
                  HR increase from your first split to your last split at the same pace — a sign of
                  fatigue or dehydration.
                </p>
                <p className="mt-1.5 text-slate-300">
                  <span className="text-green-400 font-medium">0–5 bpm</span> Good ·{' '}
                  <span className="text-amber-400 font-medium">6–10</span> Moderate ·{' '}
                  <span className="text-red-400 font-medium">&gt;10</span> High
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
