'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { TrendingUp, TrendingDown, Minus, Info, Heart, Flame } from 'lucide-react'

const ACWR_STATUS = {
  no_data: {
    label: 'No Data',
    badge: 'bg-slate-100 text-slate-500',
    guidance: null,
    tip: 'Not enough activity data to calculate training load yet.',
  },
  resting: {
    label: 'Rest Week',
    badge: 'bg-purple-100 text-purple-700',
    guidance: null,
    tip: 'You have training history but no activities this week. This counts as a rest week.',
  },
  low: {
    label: 'Low Load',
    badge: 'bg-blue-100 text-blue-700',
    guidance: 'Training load is low — safe to gradually increase volume or intensity.',
    tip: 'Your load this week is well below your baseline (ACWR ≤ 0.8). Safe to gradually add more volume or intensity.',
  },
  optimal: {
    label: 'Optimal',
    badge: 'bg-green-100 text-green-700',
    guidance: null,
    tip: 'Load is in the ideal zone (ACWR 0.8–1.3). Your body is getting enough stimulus without overloading.',
  },
  caution: {
    label: 'Caution',
    badge: 'bg-yellow-100 text-yellow-700',
    guidance: 'Approaching high load — avoid adding intensity this week.',
    tip: 'Load is getting high (ACWR 1.3–1.5). Avoid adding intensity — stick to easy volume or active recovery.',
  },
  danger: {
    label: 'High Risk',
    badge: 'bg-red-100 text-red-700',
    guidance: 'High injury risk — schedule an easy day or rest before your next hard session.',
    tip: 'Load is too high relative to your baseline (ACWR > 1.5). Injury risk is significantly elevated. Prioritize rest or very easy sessions.',
  },
}

const TIPS = {
  acwr: "Ratio of your last 7 days of training load vs your 28-day average. 1.0 means you're training at your usual level. Above 1.5 significantly raises injury risk.",
  totalEffort:
    'Total effort points this week, based on Strava Relative Effort — a combination of duration and intensity using heart rate. Harder sessions score higher.',
  acuteLaod:
    'Your average daily training load over the last 7 days. Reflects how tired or fresh your body is right now.',
  chronicLoad:
    "Your average daily training load over the last 28 days. Reflects the fitness base you've built up over time.",
}

function InfoTip({ content }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
          aria-label="More information"
        >
          <Info className="size-3.5" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 text-center leading-snug">{content}</TooltipContent>
    </Tooltip>
  )
}

function formatDuration(sec) {
  if (!sec) return '—'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatDistance(m) {
  if (!m) return '—'
  return `${(m / 1000).toFixed(2)} km`
}

function formatPace(secPerKm) {
  if (!secPerKm) return '—'
  const m = Math.floor(secPerKm / 60)
  const s = secPerKm % 60
  return `${m}:${String(s).padStart(2, '0')} /km`
}

function formatElevation(m) {
  if (!m) return '—'
  return `${Math.round(m)} m`
}

function RampIndicator({ ramp_pct }) {
  if (ramp_pct === null || ramp_pct === undefined) return null
  const abs = Math.abs(ramp_pct)
  if (abs <= 10)
    return (
      <span className="flex items-center gap-1 text-xs text-slate-400">
        <Minus className="size-3" aria-hidden="true" /> Stable vs last week
      </span>
    )
  if (ramp_pct > 0)
    return (
      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
        <TrendingUp className="size-3" aria-hidden="true" /> ↑{abs}% vs last week
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-xs text-blue-500 font-medium">
      <TrendingDown className="size-3" aria-hidden="true" /> ↓{abs}% vs last week
    </span>
  )
}

function StatCell({ label, value, sub, tip }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-400">{label}</span>
        {tip && <InfoTip content={tip} />}
      </div>
      <span className="text-sm font-semibold text-slate-800 tabular-nums">{value ?? '—'}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  )
}

function EffortSplitBar({ effort_split }) {
  if (!effort_split || effort_split.easy_pct === null) return null
  const { easy_pct, hard_pct, easy_load, hard_load } = effort_split
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Easy <span className="font-medium text-slate-600">{easy_pct}%</span> · {easy_load} pts
        </span>
        <span>
          Hard <span className="font-medium text-slate-600">{hard_pct}%</span> · {hard_load} pts
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100">
        <div className="bg-green-400 transition-all" style={{ width: `${easy_pct}%` }} />
        <div className="bg-red-400 transition-all" style={{ width: `${hard_pct}%` }} />
      </div>
      <p className="text-xs text-slate-400">Recommended: 80% easy · 20% hard</p>
    </div>
  )
}

export default function TrainingLoad({ data, weeklyStats }) {
  const {
    acwr,
    acute_load_7d,
    chronic_load_28d,
    status,
    current_week_load,
    prev_week_load,
    ramp_pct,
    effort_split,
  } = data

  const current = weeklyStats?.current ?? {}
  const statusMeta = ACWR_STATUS[status] ?? ACWR_STATUS.no_data

  return (
    <section id="trainingLoadCard" aria-label="Training load">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Training Load
      </h2>
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-4 flex flex-col gap-3">
          {/* Hero row — ACWR + status + ramp */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">
                  Load Balance (ACWR) · Target 0.8 – 1.3
                </span>
                <InfoTip content={TIPS.acwr} />
              </div>
              <span
                className="text-4xl font-semibold text-slate-800 tabular-nums leading-none"
                aria-label={`ACWR ${acwr ?? 'unavailable'}`}
              >
                {acwr ?? '—'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta.badge}`}
                >
                  {statusMeta.label}
                </span>
                <InfoTip content={statusMeta.tip} />
              </div>
              <RampIndicator ramp_pct={ramp_pct} />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Stats grid — load metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCell
              label="This week"
              value={current_week_load ?? '—'}
              sub="relative effort"
              tip={TIPS.totalEffort}
            />
            <StatCell
              label="7d avg / day"
              value={acute_load_7d ?? '—'}
              sub="acute load"
              tip={TIPS.acuteLaod}
            />
            <StatCell
              label="28d avg / day"
              value={chronic_load_28d ?? '—'}
              sub="chronic load"
              tip={TIPS.chronicLoad}
            />
          </div>

          {/* Easy vs hard effort split */}
          <EffortSplitBar effort_split={effort_split} />

          <div className="border-t border-slate-100" />

          {/* Stats grid — activity metrics */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            <StatCell label="Sessions" value={current.count ?? '—'} sub="this week" />
            <StatCell label="Distance" value={formatDistance(current.distance_m)} sub="this week" />
            <StatCell label="Time" value={formatDuration(current.duration_sec)} sub="this week" />
            <StatCell
              label="Elevation"
              value={formatElevation(current.elevation_gain_m)}
              sub="this week"
            />
            <StatCell
              label="Avg pace"
              value={formatPace(current.avg_moving_pace_sec_per_km)}
              sub="moving pace"
            />
            <StatCell
              label="Longest run"
              value={current.longest_run_m ? formatDistance(current.longest_run_m) : '—'}
              sub="this week"
            />
            {current.avg_hr != null && (
              <StatCell
                label={
                  <span className="flex items-center gap-1">
                    Avg HR <Heart className="size-3 text-red-400" />
                  </span>
                }
                value={`${current.avg_hr} bpm`}
                sub="this week"
              />
            )}
            {current.total_calories > 0 && (
              <StatCell
                label={
                  <span className="flex items-center gap-1">
                    Calories <Flame className="size-3 text-orange-400" />
                  </span>
                }
                value={`${Math.round(current.total_calories)} kcal`}
                sub="this week"
              />
            )}
          </div>

          {/* Prev week comparison */}
          {prev_week_load != null && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 border-t border-slate-100 pt-3">
              <span>Last week:</span>
              <span className="font-medium text-slate-500">{prev_week_load} effort</span>
              <span>·</span>
              <span>{formatDistance(weeklyStats?.prev?.distance_m)}</span>
              <span>·</span>
              <span>{weeklyStats?.prev?.count ?? 0} sessions</span>
            </div>
          )}

          {/* Contextual guidance */}
          {statusMeta.guidance && (
            <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
              {statusMeta.guidance}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
