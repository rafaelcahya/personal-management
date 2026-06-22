'use client'

import { Target, Trophy, AlertTriangle, Clock, TrendingUp, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const STATUS_META = {
  On_Track: {
    label: 'On Track',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: TrendingUp,
  },
  Behind_Schedule: {
    label: 'Behind Schedule',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: AlertTriangle,
  },
  Goal_Reached: {
    label: 'Goal Reached',
    cls: 'bg-violet-50 text-violet-700 border-violet-200',
    icon: Trophy,
  },
  Goal_Expired: {
    label: 'Goal Expired',
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: Clock,
  },
  Insufficient_Data: {
    label: 'Insufficient Data',
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: Info,
  },
  No_Goal_Set: {
    label: 'No Goal Set',
    cls: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: Target,
  },
}

function getStatusKey(badge) {
  if (!badge) return 'No_Goal_Set'
  return badge.replace(/\s+/g, '_')
}

function WeeksBar({ label, weeks, maxWeeks, colorClass }) {
  const pct = maxWeeks > 0 ? Math.min((weeks / maxWeeks) * 100, 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs font-medium text-slate-700 w-14 text-right shrink-0">
        {weeks != null ? `${weeks}w` : '—'}
      </span>
    </div>
  )
}

export default function Vo2maxGapCard({ data }) {
  if (!data || data.status === 'no_goal') {
    return (
      <div
        id="vo2maxGapCard_analyticsPage"
        className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4"
        aria-label="VO2max target effort status"
      >
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">VO2max Target Effort</p>
        </div>

        <div
          id="vo2maxGapNoGoal_analyticsPage"
          className="flex flex-col items-center gap-3 py-6 text-center"
        >
          <Target className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <p className="text-sm text-slate-500">No active race goal set.</p>
          <p className="text-xs text-slate-400">
            Set a goal with a target distance and time to see your VO2max gap analysis.
          </p>
          <Button
            id="setGoalBtn_analyticsPage"
            size="sm"
            asChild
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Link href="/main/running/race-log">Set a race goal</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (data.status === 'no_target_time') {
    return (
      <div
        id="vo2maxGapCard_analyticsPage"
        className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4 w-full"
        aria-label="VO2max target effort status"
      >
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">VO2max Target Effort</p>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-xs text-amber-700">
            Your upcoming race doesn&apos;t have a target time yet. Add one to see your VO2max
            projection.
          </p>
        </div>
        {data.goal && (
          <p className="text-sm text-slate-600">
            <span className="font-medium">{data.goal.title}</span>
            {data.goal.targetDate && (
              <span className="text-slate-400 ml-2">
                &middot;{' '}
                {new Date(data.goal.targetDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </p>
        )}
        <Button
          id="setGoalBtn_analyticsPage"
          size="sm"
          asChild
          className="bg-violet-600 hover:bg-violet-700 text-white self-start"
        >
          <Link href="/main/running/race-log">Add target time</Link>
        </Button>
      </div>
    )
  }

  if (data.status === 'insufficient_data') {
    return (
      <div
        id="vo2maxGapCard_analyticsPage"
        className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4"
        aria-label="VO2max target effort status"
      >
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-500" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">VO2max Target Effort</p>
        </div>

        <div
          id="vo2maxGapInsufficientData_analyticsPage"
          className="flex flex-col gap-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-4"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-600">Need more data</p>
          </div>
          <p className="text-xs text-slate-400">
            Need at least 4 runs with HR data in the last 30 days to estimate your VO2max. Currently
            have {data.sampleSize ?? 0} qualifying run
            {data.sampleSize !== 1 ? 's' : ''}.
          </p>
          {data.requiredVo2max != null && (
            <p className="text-xs text-slate-500 mt-1">
              Required VO2max for your goal:{' '}
              <span className="font-semibold">{data.requiredVo2max} ml/kg/min</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  if (data.status === 'ok' && data.statusBadge === 'Goal Expired') {
    return (
      <div
        id="vo2maxGapCard_analyticsPage"
        className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4"
        aria-label="VO2max target effort status"
      >
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">VO2max Target Effort</p>
          <span
            id="vo2maxGapStatusBadge_analyticsPage"
            className="inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium bg-slate-100 text-slate-500 border-slate-200"
          >
            Goal Expired
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <Clock className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <p className="text-sm text-slate-500">Your race goal date has passed.</p>
          <Button
            id="setNewGoalBtn_analyticsPage"
            size="sm"
            asChild
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Link href="/main/running/race-log">Set a new goal</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (data.status === 'ok' && data.statusBadge === 'Goal Reached') {
    return (
      <div
        id="vo2maxGapCard_analyticsPage"
        className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5 flex flex-col gap-4"
        aria-label="VO2max target effort status"
      >
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-500" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">VO2max Target Effort</p>
          <span
            id="vo2maxGapStatusBadge_analyticsPage"
            className="inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium bg-violet-50 text-violet-700 border-violet-200"
          >
            Goal Reached
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <Trophy className="h-10 w-10 text-violet-400" aria-hidden="true" />
          <p className="text-base font-semibold text-slate-700">You&apos;re there!</p>
          <p className="text-sm text-slate-500">
            Your current VO2max ({data.currentVo2max} ml/kg/min) meets or exceeds the required{' '}
            {data.requiredVo2max} ml/kg/min for your goal.
          </p>
        </div>

        <div id="vo2maxGapNumbers_analyticsPage" className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/70 border border-violet-100 p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Current</p>
            <p className="text-xl font-bold text-violet-600">{data.currentVo2max}</p>
            <p className="text-xs text-slate-400">ml/kg/min</p>
          </div>
          <div className="rounded-lg bg-white/70 border border-violet-100 p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Required</p>
            <p className="text-xl font-bold text-slate-600">{data.requiredVo2max}</p>
            <p className="text-xs text-slate-400">ml/kg/min</p>
          </div>
        </div>
      </div>
    )
  }

  // Standard "ok" state — On Track or Behind Schedule
  const statusKey = getStatusKey(data.statusBadge)
  const statusMeta = STATUS_META[statusKey] ?? STATUS_META.On_Track
  const StatusIcon = statusMeta.icon

  const maxWeeks = data.weeksToGoal
    ? Math.max(
        data.weeksToGoal.pessimistic ?? 0,
        data.weeksToGoal.realistic ?? 0,
        data.weeksToGoal.optimistic ?? 0,
        1
      )
    : 1

  const gapAbs = Math.abs(data.gapMlKgMin ?? 0)
  const isAhead = (data.gapMlKgMin ?? 0) >= 0

  return (
    <div
      id="vo2maxGapCard_analyticsPage"
      className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4"
      aria-label="VO2max target effort status"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-500 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">VO2max Target Effort</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            id="vo2maxGapStatusBadge_analyticsPage"
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${statusMeta.cls}`}
          >
            <StatusIcon className="h-3 w-3" aria-hidden="true" />
            {statusMeta.label}
          </span>
          {data.categoryBadge && (
            <span
              id="vo2maxCategoryBadge_analyticsPage"
              className="inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
            >
              {data.categoryBadge}
            </span>
          )}
        </div>
      </div>

      {data.physiologicalWarning && (
        <div
          id="vo2maxPhysiologicalWarning_analyticsPage"
          className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2"
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-700">{data.physiologicalWarning}</p>
        </div>
      )}

      <div id="vo2maxGapNumbers_analyticsPage" className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Current</p>
          <p className="text-xl font-bold text-violet-600">{data.currentVo2max}</p>
          <p className="text-xs text-slate-400">ml/kg/min</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Required</p>
          <p className="text-xl font-bold text-slate-700">{data.requiredVo2max}</p>
          <p className="text-xs text-slate-400">ml/kg/min</p>
        </div>
        <div
          className={`rounded-lg border p-3 text-center ${
            isAhead ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <p className="text-xs text-slate-500 mb-1">Gap</p>
          <p className={`text-xl font-bold ${isAhead ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isAhead ? '+' : '-'}
            {gapAbs}
          </p>
          <p className="text-xs text-slate-400">ml/kg/min</p>
        </div>
      </div>

      {data.weeksToGoal && (
        <div id="vo2maxWeeksToGoal_analyticsPage" className="flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Weeks to goal
          </p>
          <WeeksBar
            label="Optimistic"
            weeks={data.weeksToGoal.optimistic}
            maxWeeks={maxWeeks}
            colorClass="bg-emerald-400"
          />
          <WeeksBar
            label="Realistic"
            weeks={data.weeksToGoal.realistic}
            maxWeeks={maxWeeks}
            colorClass="bg-violet-400"
          />
          <WeeksBar
            label="Pessimistic"
            weeks={data.weeksToGoal.pessimistic}
            maxWeeks={maxWeeks}
            colorClass="bg-amber-400"
          />
        </div>
      )}

      {!data.categoryBadge && (
        <p id="vo2maxSexMissingHint_analyticsPage" className="text-xs text-slate-400">
          Add your sex in{' '}
          <Link
            href="/main/running/settings"
            className="text-violet-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            Settings
          </Link>{' '}
          to see your fitness category.
        </p>
      )}
    </div>
  )
}
