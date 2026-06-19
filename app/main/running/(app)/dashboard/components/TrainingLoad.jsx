'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Heart,
  Flame,
  Activity,
  MapPin,
  Clock,
  Mountain,
  Gauge,
  Flag,
} from 'lucide-react'

const ACWR_STATUS = {
  no_data: {
    label: 'No Data',
    badge: 'bg-slate-100 text-slate-500',
    guidance: null,
    tip: (
      <>
        <p className="font-semibold mb-1">No Training Data</p>
        <p>Not enough activity history to calculate your training load ratio yet.</p>
        <p className="mt-1.5 text-slate-300">
          Log at least a few runs over 2–4 weeks to see your ACWR.
        </p>
      </>
    ),
  },
  resting: {
    label: 'Rest Week',
    badge: 'bg-purple-100 text-purple-700',
    guidance: null,
    tip: (
      <>
        <p className="font-semibold mb-1">Rest Week</p>
        <p>You have training history but no activities recorded this week.</p>
        <p className="mt-1.5 text-slate-300">
          Intentional rest is part of the plan — your chronic load is still building fitness.
        </p>
      </>
    ),
  },
  low: {
    label: 'Low Load',
    badge: 'bg-blue-100 text-blue-700',
    guidance: 'Training load is low — safe to gradually increase volume or intensity.',
    tip: (
      <>
        <p className="font-semibold mb-1">Low Load (ACWR ≤ 0.8)</p>
        <p>Your current week load is well below your 28-day baseline.</p>
        <p className="mt-1.5 text-slate-300">
          Safe to gradually add volume or intensity — aim for 5–10% increase per week.
        </p>
      </>
    ),
  },
  optimal: {
    label: 'Optimal',
    badge: 'bg-green-100 text-green-700',
    guidance: null,
    tip: (
      <>
        <p className="font-semibold mb-1">Optimal Load (ACWR 0.8–1.3)</p>
        <p>
          You&apos;re training in the ideal zone — enough stimulus to improve without overloading.
        </p>
        <p className="mt-1.5 text-slate-300">
          Keep this up. This is where fitness gains happen safely.
        </p>
      </>
    ),
  },
  caution: {
    label: 'Caution',
    badge: 'bg-yellow-100 text-yellow-700',
    guidance: 'Approaching high load — avoid adding intensity this week.',
    tip: (
      <>
        <p className="font-semibold mb-1">Caution Zone (ACWR 1.3–1.5)</p>
        <p>Your load is noticeably above your baseline. Injury risk begins to rise here.</p>
        <p className="mt-1.5 text-slate-300">
          Avoid adding intensity. Stick to easy volume or active recovery this week.
        </p>
      </>
    ),
  },
  danger: {
    label: 'High Risk',
    badge: 'bg-red-100 text-red-700',
    guidance: 'High injury risk — schedule an easy day or rest before your next hard session.',
    tip: (
      <>
        <p className="font-semibold mb-1">High Risk (ACWR &gt; 1.5)</p>
        <p>Load is too high relative to your baseline. Injury risk is significantly elevated.</p>
        <p className="mt-1.5 text-slate-300">
          Prioritize rest or very easy sessions before any hard effort.
        </p>
      </>
    ),
  },
}

const TRAINING_STATUS = {
  productive: {
    label: 'Productive',
    badge: 'bg-green-100 text-green-700',
    tip: (
      <>
        <p className="font-semibold mb-1">Productive</p>
        <p>Your training is working — VO2max is trending upward at a healthy load level.</p>
        <p className="mt-1.5 text-slate-300">Keep the current structure. Fitness is building.</p>
      </>
    ),
  },
  maintaining: {
    label: 'Maintaining',
    badge: 'bg-blue-100 text-blue-700',
    tip: (
      <>
        <p className="font-semibold mb-1">Maintaining</p>
        <p>
          You&apos;re sustaining your current fitness level without significant gains or losses.
        </p>
        <p className="mt-1.5 text-slate-300">
          Add a quality session or increase volume slightly to stimulate improvement.
        </p>
      </>
    ),
  },
  peaking: {
    label: 'Peaking',
    badge: 'bg-violet-100 text-violet-700',
    tip: (
      <>
        <p className="font-semibold mb-1">Peaking</p>
        <p>Load is tapering while VO2max is rising — a sign of a successful taper before a race.</p>
        <p className="mt-1.5 text-slate-300">Stay fresh. Your fitness is at its highest point.</p>
      </>
    ),
  },
  overreaching: {
    label: 'Overreaching',
    badge: 'bg-red-100 text-red-700',
    tip: (
      <>
        <p className="font-semibold mb-1">Overreaching</p>
        <p>
          Training load is too high relative to your baseline. Risk of injury and burnout is
          elevated.
        </p>
        <p className="mt-1.5 text-slate-300">
          Reduce volume or intensity for at least one week before adding load again.
        </p>
      </>
    ),
  },
  unproductive: {
    label: 'Unproductive',
    badge: 'bg-amber-100 text-amber-700',
    tip: (
      <>
        <p className="font-semibold mb-1">Unproductive</p>
        <p>
          You&apos;re training consistently but VO2max is declining — effort is not converting to
          fitness.
        </p>
        <p className="mt-1.5 text-slate-300">
          Review training quality. Consider more structured workouts or additional recovery.
        </p>
      </>
    ),
  },
  detraining: {
    label: 'Detraining',
    badge: 'bg-slate-100 text-slate-500',
    tip: (
      <>
        <p className="font-semibold mb-1">Detraining</p>
        <p>Training load is low and VO2max is not rising — fitness may be slowly declining.</p>
        <p className="mt-1.5 text-slate-300">
          Gradually increase volume to rebuild your aerobic base.
        </p>
      </>
    ),
  },
}

const TSB_TIERS = [
  { min: 10, label: 'Very Fresh', color: 'text-green-600' },
  { min: 1, label: 'Fresh', color: 'text-green-600' },
  { min: -5, label: 'Neutral', color: 'text-amber-600' },
  { min: -20, label: 'Fatigued', color: 'text-red-600' },
  { min: -Infinity, label: 'Very Fatigued', color: 'text-red-600' },
]

function getTsbTier(tsb) {
  return TSB_TIERS.find((tier) => tsb >= tier.min) ?? TSB_TIERS[TSB_TIERS.length - 1]
}

const TIPS = {
  acwr: (
    <>
      <p className="font-semibold mb-1">What is ACWR?</p>
      <p>
        Ratio of your last 7 days of load vs your 28-day average. A value of 1.0 means you&apos;re
        training at your usual baseline.
      </p>
      <p className="mt-1.5 text-slate-300">
        <span className="text-blue-400 font-medium">≤ 0.8</span> Low ·{' '}
        <span className="text-green-400 font-medium">0.8–1.3</span> Optimal ·{' '}
        <span className="text-amber-400 font-medium">1.3–1.5</span> Caution ·{' '}
        <span className="text-red-400 font-medium">&gt; 1.5</span> High Risk
      </p>
    </>
  ),
  totalEffort: (
    <>
      <p className="font-semibold mb-1">Relative Effort</p>
      <p>
        Total effort points this week, based on Strava Relative Effort — a combination of duration
        and heart rate intensity.
      </p>
      <p className="mt-1.5 text-slate-300">
        Harder sessions score higher. An easy 5K scores less than a tempo run of the same distance.
      </p>
    </>
  ),
  acuteLaod: (
    <>
      <p className="font-semibold mb-1">Acute Load (7-day avg)</p>
      <p>
        Your average daily training load over the last 7 days. Reflects how tired or fresh your body
        is right now.
      </p>
      <p className="mt-1.5 text-slate-300">
        High acute load = more fatigue. Low acute load = fresher, but possibly detraining.
      </p>
    </>
  ),
  chronicLoad: (
    <>
      <p className="font-semibold mb-1">Chronic Load (28-day avg)</p>
      <p>
        Your average daily training load over the last 28 days. Reflects the fitness base
        you&apos;ve built up over time.
      </p>
      <p className="mt-1.5 text-slate-300">
        A high chronic load means your body is conditioned to handle more work.
      </p>
    </>
  ),
  tsb: (
    <>
      <p className="font-semibold mb-1">Form</p>
      <p>
        Chronic load minus acute load — how fresh or fatigued you are right now. Same concept as
        TrainingPeaks&apos; &quot;Form&quot; or Garmin&apos;s Training Effect Balance.
      </p>
      <p className="mt-1.5 text-slate-300">
        <span className="text-green-400 font-medium">&gt; 0</span> Fresh ·{' '}
        <span className="text-amber-400 font-medium">-5 to 0</span> Neutral ·{' '}
        <span className="text-red-400 font-medium">&lt; -5</span> Fatigued
      </p>
    </>
  ),
}

function InfoTip({ content }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
            aria-label="More information"
          >
            <Info className="size-3.5" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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

function StatCell({ label, value, sub, tip, valueClassName }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-400">{label}</span>
        {tip && <InfoTip content={tip} />}
      </div>
      <span className={`text-sm font-semibold tabular-nums ${valueClassName ?? 'text-slate-800'}`}>
        {value ?? '—'}
      </span>
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

function computeWeeksElapsed() {
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  return Math.max(1, Math.ceil((now - yearStart) / (7 * 24 * 3600 * 1000)))
}

function formatAvgWeeklyKm(ytdStats) {
  const distM = ytdStats?.distance_m
  if (!distM) return '—'
  const km = distM / 1000 / computeWeeksElapsed()
  return `${km.toFixed(1)} km`
}

export default function TrainingLoad({ data, weeklyStats }) {
  const {
    acwr,
    acute_load_7d,
    chronic_load_28d,
    tsb,
    status,
    current_week_load,
    prev_week_load,
    ramp_pct,
    effort_split,
    training_status,
    ytd_stats,
  } = data

  const current = weeklyStats?.current ?? {}
  const statusMeta = ACWR_STATUS[status] ?? ACWR_STATUS.no_data
  const tsbTier = tsb != null ? getTsbTier(tsb) : null

  return (
    <section id="trainingLoadCard" aria-label="Training load">
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1 mb-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">Training Load</h3>
            </div>
            <p className="text-xs text-slate-400">
              ACWR, acute vs chronic load, and weekly training metrics.
            </p>
          </div>
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
            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta.badge}`}
                >
                  {statusMeta.label}
                </span>
                <InfoTip content={statusMeta.tip} />
              </div>
              {training_status && TRAINING_STATUS[training_status] && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TRAINING_STATUS[training_status].badge}`}
                  >
                    {TRAINING_STATUS[training_status].label}
                  </span>
                  <InfoTip content={TRAINING_STATUS[training_status].tip} />
                </div>
              )}
              <RampIndicator ramp_pct={ramp_pct} />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Stats grid — load metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <StatCell
              label="Form"
              value={tsb != null ? `${tsb > 0 ? '+' : ''}${tsb}` : '—'}
              sub={tsbTier?.label ?? null}
              tip={TIPS.tsb}
              valueClassName={tsbTier?.color}
            />
          </div>

          {/* Easy vs hard effort split */}
          <EffortSplitBar effort_split={effort_split} />

          <div className="border-t border-slate-100" />

          {/* Stats grid — activity metrics */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            <StatCell
              label={
                <span className="flex items-center gap-1">
                  Avg weekly <MapPin className="size-3 text-violet-400" />
                </span>
              }
              value={formatAvgWeeklyKm(ytd_stats)}
              sub="this year"
            />
            <StatCell
              label={
                <span className="flex items-center gap-1">
                  Sessions <Activity className="size-3 text-blue-400" />
                </span>
              }
              value={current.count ?? '—'}
              sub="this week"
            />
            <StatCell
              label={
                <span className="flex items-center gap-1">
                  Distance <MapPin className="size-3 text-blue-400" />
                </span>
              }
              value={formatDistance(current.distance_m)}
              sub="this week"
            />
            <StatCell
              label={
                <span className="flex items-center gap-1">
                  Time <Clock className="size-3 text-indigo-400" />
                </span>
              }
              value={formatDuration(current.duration_sec)}
              sub="this week"
            />
            <StatCell
              label={
                <span className="flex items-center gap-1">
                  Elevation <Mountain className="size-3 text-green-500" />
                </span>
              }
              value={formatElevation(current.elevation_gain_m)}
              sub="this week"
            />
            <StatCell
              label={
                <span className="flex items-center gap-1">
                  Avg pace <Gauge className="size-3 text-purple-400" />
                </span>
              }
              value={formatPace(current.avg_moving_pace_sec_per_km)}
              sub="moving pace"
            />
            <StatCell
              label={
                <span className="flex items-center gap-1">
                  Longest run <Flag className="size-3 text-amber-400" />
                </span>
              }
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
