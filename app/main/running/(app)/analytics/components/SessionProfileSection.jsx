'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { fetchSessionProfile } from '@/lib/api/running'

const MORNING_COLOR = '#f59e0b'
const EVENING_COLOR = '#8b5cf6'

function fmtPace(sec) {
  if (!sec) return '—'
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} /km`
}

function fmtDuration(min) {
  if (min == null) return '—'
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function StatRow({ label, pagi, sore }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-700 font-medium text-right">{pagi}</span>
      <span className="text-[10px] text-slate-400 uppercase tracking-wide text-center w-24 shrink-0">
        {label}
      </span>
      <span className="text-xs text-slate-700 font-medium text-left">{sore}</span>
    </div>
  )
}

function SlotHeader({ label, count, colorClass }) {
  return (
    <div className={`text-center mb-1 ${colorClass}`}>
      <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      <p className="text-[10px] text-slate-400">{count} runs</p>
    </div>
  )
}

function ThresholdBar({ label, count, threshold }) {
  const pct = Math.min(100, Math.round((count / threshold) * 100))
  const met = count >= threshold
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
        <span className={`text-[10px] font-medium ${met ? 'text-emerald-600' : 'text-slate-500'}`}>
          {count}/{threshold}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${met ? 'bg-emerald-500' : 'bg-violet-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function TrainingLoadChart({ pagi, sore }) {
  const hasRe = pagi.avg_relative_effort != null || sore.avg_relative_effort != null
  const hasHr = pagi.avg_hr != null || sore.avg_hr != null

  if (!hasRe && !hasHr) {
    return (
      <p className="text-xs text-slate-400 text-center py-6">
        No training load data available yet.
      </p>
    )
  }

  const reData = hasRe
    ? [
        {
          name: 'Avg Relative Effort',
          Morning: pagi.avg_relative_effort ?? 0,
          Evening: sore.avg_relative_effort ?? 0,
          morningLabel:
            pagi.avg_relative_effort != null ? String(pagi.avg_relative_effort) : 'no data',
          eveningLabel:
            sore.avg_relative_effort != null ? String(sore.avg_relative_effort) : 'no data',
        },
      ]
    : []

  const hrData = hasHr
    ? [
        {
          name: 'Avg HR (bpm)',
          Morning: pagi.avg_hr ?? 0,
          Evening: sore.avg_hr ?? 0,
          morningLabel: pagi.avg_hr != null ? `${pagi.avg_hr} bpm` : 'no data',
          eveningLabel: sore.avg_hr != null ? `${sore.avg_hr} bpm` : 'no data',
        },
      ]
    : []

  const chartData = [...reData, ...hrData]

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e2e8f0' }}
          formatter={(value, name, props) => {
            const label =
              name === 'Morning' ? props.payload.morningLabel : props.payload.eveningLabel
            return [label, name]
          }}
        />
        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
        <Bar dataKey="Morning" fill={MORNING_COLOR} radius={[3, 3, 0, 0]} maxBarSize={40} />
        <Bar dataKey="Evening" fill={EVENING_COLOR} radius={[3, 3, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function buildInsight(data) {
  const { pagi, sore, threshold } = data
  const parts = []

  if (pagi.count > 0 && sore.count > 0) {
    const longer = pagi.avg_distance_km > sore.avg_distance_km ? 'morning' : 'evening'
    const longerKm = longer === 'morning' ? pagi.avg_distance_km : sore.avg_distance_km
    const shorterKm = longer === 'morning' ? sore.avg_distance_km : pagi.avg_distance_km
    parts.push(
      `${longer === 'morning' ? 'Morning' : 'Evening'} sessions average longer runs (${longerKm} km vs ${shorterKm} km).`
    )
  }

  const pagiNeed = Math.max(0, threshold.value - threshold.pagi_re_count)
  const soreNeed = Math.max(0, threshold.value - threshold.sore_re_count)

  if (!threshold.pagi_met || !threshold.sore_met) {
    const needs = []
    if (pagiNeed > 0) needs.push(`${pagiNeed} more morning runs`)
    if (soreNeed > 0) needs.push(`${soreNeed} more evening runs`)
    parts.push(
      `Training load data is insufficient for an accurate comparison — need ${needs.join(' and ')}.`
    )
  } else {
    parts.push('Training load data is sufficient for a meaningful comparison.')
  }

  return parts.join(' ')
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-40 bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
    </div>
  )
}

export default function SessionProfileSection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    setError(null)
    fetchSessionProfile()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load session profile'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const bothThresholdMet = data?.threshold?.pagi_met && data?.threshold?.sore_met
  const totalRunsWithRe =
    (data?.threshold?.pagi_re_count ?? 0) + (data?.threshold?.sore_re_count ?? 0)
  const totalRuns = data?.total_runs ?? 0

  return (
    <section
      id="sessionProfileSection_analyticsPage"
      aria-label="Session Profile — Morning vs Evening"
      className="scroll-mt-20"
    >
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {bothThresholdMet ? 'Morning vs Evening' : 'Session Profile — Morning vs Evening'}
                </h3>
              </div>
              {!loading && !error && (
                <span className="text-[10px] text-slate-400 bg-slate-100 rounded-full px-2 py-0.5 shrink-0">
                  {totalRunsWithRe} of {totalRuns} runs have training load data
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Volume and training load split by time of day (WIB). Morning = 05–11, Evening = 12–20.
            </p>
          </div>

          {loading && <Skeleton />}

          {!loading && error && (
            <div
              id="sessionProfileError_analyticsPage"
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
              {/* Volume comparison */}
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Volume
                </p>
                <div className="grid grid-cols-[1fr_auto_1fr] mb-1">
                  <SlotHeader label="Morning" count={data.pagi.count} colorClass="text-amber-600" />
                  <div className="w-24" />
                  <SlotHeader
                    label="Evening"
                    count={data.sore.count}
                    colorClass="text-violet-600"
                  />
                </div>
                <StatRow
                  label="Avg distance"
                  pagi={data.pagi.avg_distance_km != null ? `${data.pagi.avg_distance_km} km` : '—'}
                  sore={data.sore.avg_distance_km != null ? `${data.sore.avg_distance_km} km` : '—'}
                />
                <StatRow
                  label="Avg duration"
                  pagi={fmtDuration(data.pagi.avg_duration_min)}
                  sore={fmtDuration(data.sore.avg_duration_min)}
                />
                <StatRow
                  label="Avg pace"
                  pagi={fmtPace(data.pagi.avg_pace_sec)}
                  sore={fmtPace(data.sore.avg_pace_sec)}
                />
                <StatRow
                  label="Avg elevation"
                  pagi={data.pagi.avg_elevation_m != null ? `${data.pagi.avg_elevation_m} m` : '—'}
                  sore={data.sore.avg_elevation_m != null ? `${data.sore.avg_elevation_m} m` : '—'}
                />
              </div>

              {/* Training load */}
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Training Load
                </p>

                <TrainingLoadChart pagi={data.pagi} sore={data.sore} />

                {!bothThresholdMet && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 mt-3">
                    Based on limited data — interpret with caution. Need ≥{data.threshold.value}{' '}
                    runs with relative effort per slot for accurate analysis.
                  </p>
                )}
              </div>

              {/* Auto insight */}
              <p
                id="sessionProfileInsight_analyticsPage"
                className="text-xs text-slate-500 bg-slate-50 rounded-md px-3 py-2.5 border border-slate-100"
              >
                {buildInsight(data)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
