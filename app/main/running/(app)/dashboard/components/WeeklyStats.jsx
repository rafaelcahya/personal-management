'use client'

import { useState, useEffect } from 'react'
import { Activity, Timer, Footprints, Zap, CalendarRange } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { format, startOfWeek, subWeeks, addDays } from 'date-fns'
import { fmtDistance, fmtDuration, fmtPace } from '../utils/format'
import { fetchWeeklyStatsForWeek } from '@/lib/api/running'

const WEEK_OPTIONS = [
  { value: 0, label: 'This Week' },
  { value: 1, label: 'W-1' },
  { value: 2, label: 'W-2' },
  { value: 3, label: 'W-3' },
  { value: 4, label: 'W-4' },
]

function getWeekTitle(weeksAgo) {
  if (weeksAgo === 0) return 'This Week'
  const start = startOfWeek(subWeeks(new Date(), weeksAgo), { weekStartsOn: 1 })
  const end = addDays(start, 6)
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, 'MMM d')} – ${format(end, 'd')}`
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`
  }
  return `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`
}

export default function WeeklyStats({ data, activityType = null }) {
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [weeklyData, setWeeklyData] = useState(data)
  const [loadingWeek, setLoadingWeek] = useState(false)

  useEffect(() => {
    setWeeklyData(data)
    setSelectedWeek(0)
  }, [data])

  async function handleWeekSelect(weeksAgo) {
    if (weeksAgo === selectedWeek) return
    setSelectedWeek(weeksAgo)
    if (weeksAgo === 0) {
      setWeeklyData(data)
      return
    }
    setLoadingWeek(true)
    try {
      const result = await fetchWeeklyStatsForWeek(activityType, weeksAgo)
      setWeeklyData(result)
    } catch {
      setWeeklyData(data)
    } finally {
      setLoadingWeek(false)
    }
  }

  const { current, prev } = weeklyData
  const weekTitle = getWeekTitle(selectedWeek)
  const vsLabel = selectedWeek === 0 ? 'last week' : 'previous week'

  function distanceDelta() {
    const diff = current.distance_m - prev.distance_m
    if (prev.distance_m === 0 && current.distance_m === 0)
      return { label: '—', color: 'text-slate-400', desc: `no data from ${vsLabel}` }
    if (prev.distance_m === 0)
      return {
        label: `+${fmtDistance(current.distance_m)} km`,
        color: 'text-green-600',
        desc: 'first week tracked',
      }
    if (diff === 0)
      return { label: 'No change', color: 'text-slate-400', desc: `same as ${vsLabel}` }
    const better = diff > 0
    return {
      label: `${better ? '+' : ''}${fmtDistance(Math.abs(diff))} km`,
      color: better ? 'text-green-600' : 'text-red-500',
      desc: better ? `more distance than ${vsLabel}` : `less distance than ${vsLabel}`,
    }
  }

  function durationDelta() {
    const diff = current.duration_sec - prev.duration_sec
    if (prev.duration_sec === 0 && current.duration_sec === 0)
      return { label: '—', color: 'text-slate-400', desc: `no data from ${vsLabel}` }
    if (prev.duration_sec === 0)
      return {
        label: `+${fmtDuration(current.duration_sec)}`,
        color: 'text-green-600',
        desc: 'first week tracked',
      }
    if (diff === 0)
      return { label: 'No change', color: 'text-slate-400', desc: `same as ${vsLabel}` }
    const better = diff > 0
    return {
      label: `${better ? '+' : '-'}${fmtDuration(Math.abs(diff))}`,
      color: better ? 'text-green-600' : 'text-red-500',
      desc: better ? 'more training time' : 'less training time',
    }
  }

  function countDelta() {
    const diff = current.count - prev.count
    if (prev.count === 0 && current.count === 0)
      return { label: '—', color: 'text-slate-400', desc: `no data from ${vsLabel}` }
    if (prev.count === 0)
      return { label: `+${current.count}`, color: 'text-green-600', desc: 'first week tracked' }
    if (diff === 0)
      return { label: 'No change', color: 'text-slate-400', desc: `same as ${vsLabel}` }
    const better = diff > 0
    return {
      label: `${better ? '+' : ''}${diff}`,
      color: better ? 'text-green-600' : 'text-red-500',
      desc: better ? 'more sessions' : 'fewer sessions',
    }
  }

  function singlePaceDelta(c, p) {
    if (c == null || p == null) return { label: '—', color: 'text-slate-400', desc: null }
    const diff = c - p
    if (diff === 0)
      return { label: 'No change', color: 'text-slate-400', desc: `same as ${vsLabel}` }
    const better = diff < 0
    const absDiff = Math.abs(diff)
    const display = `${Math.floor(absDiff / 60)}:${String(absDiff % 60).padStart(2, '0')}`
    return {
      label: `${better ? '-' : '+'}${display}`,
      color: better ? 'text-green-600' : 'text-red-500',
      desc: better ? `faster than ${vsLabel}` : `slower than ${vsLabel}`,
    }
  }

  const distD = distanceDelta()
  const durD = durationDelta()
  const cntD = countDelta()

  const hasMovingPace = current.avg_moving_pace_sec_per_km != null
  const movingPaceD = singlePaceDelta(
    current.avg_moving_pace_sec_per_km,
    prev.avg_moving_pace_sec_per_km
  )
  const elapsedPaceD = singlePaceDelta(current.avg_pace_sec_per_km, prev.avg_pace_sec_per_km)

  const paceDeltaDesc = hasMovingPace
    ? movingPaceD.label !== '—' && movingPaceD.label !== 'No change'
      ? (movingPaceD.color === 'text-green-600' ? 'faster' : 'slower') + ` than ${vsLabel}`
      : `same as ${vsLabel}`
    : elapsedPaceD.label !== '—' && elapsedPaceD.label !== 'No change'
      ? (elapsedPaceD.color === 'text-green-600' ? 'faster' : 'slower') + ` than ${vsLabel}`
      : `same as ${vsLabel}`

  const statTiles = [
    {
      label: 'Distance',
      value: `${fmtDistance(current.distance_m)} km`,
      delta: distD,
      icon: Footprints,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50',
    },
    {
      label: 'Duration',
      value: fmtDuration(current.duration_sec),
      delta: durD,
      icon: Timer,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      label: 'Sessions',
      value: current.count,
      delta: cntD,
      icon: Activity,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
    },
  ]

  return (
    <section id="weeklyStatsCard" aria-label="Weekly stats">
      <Card className="border border-slate-200/70 shadow-sm py-5 gap-4">
        <CardContent className="px-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <CalendarRange className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-700">{weekTitle}</h3>
              </div>
              <div
                id="weeklyStatsWeekFilter_dashboardPage"
                className="flex items-center gap-1 flex-wrap"
                role="group"
                aria-label="Select week"
              >
                {WEEK_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    id={`weeklyStatsWeekBtn_${opt.value === 0 ? 'current' : `W${opt.value}`}_dashboardPage`}
                    onClick={() => handleWeekSelect(opt.value)}
                    disabled={loadingWeek}
                    aria-pressed={selectedWeek === opt.value}
                    className={`px-2 py-0.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                      selectedWeek === opt.value
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Distance, duration, sessions, and pace compared to {vsLabel}.
            </p>
          </div>
        </CardContent>
        <div
          className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 transition-opacity duration-150 ${loadingWeek ? 'opacity-50' : ''}`}
          aria-busy={loadingWeek}
        >
          {statTiles.map((t, i) => {
            const Icon = t.icon
            const border =
              i === 0
                ? 'border-b md:border-b-0 md:border-r border-slate-200'
                : i === 1
                  ? 'border-b md:border-b-0 md:border-r border-slate-200'
                  : 'border-b md:border-b-0 lg:border-r border-slate-200'
            return (
              <div key={t.label} className={`px-4 py-3 ${border}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`p-1 rounded-md ${t.iconBg}`}>
                    <Icon className={`size-3 ${t.iconColor}`} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{t.label}</span>
                </div>
                <p className="text-xl font-semibold text-slate-800 tabular-nums">{t.value}</p>
                <div className="mt-1.5" aria-label={`${t.label} vs ${vsLabel}`}>
                  <span className={`text-xs font-medium ${t.delta.color}`}>{t.delta.label}</span>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{t.delta.desc}</p>
                </div>
              </div>
            )
          })}

          {/* Avg Pace combined — mobile + tablet only (hidden on desktop) */}
          <div
            className="md:col-span-3 lg:hidden md:border-t border-slate-200 px-4 py-3"
            aria-label={`Avg Pace vs ${vsLabel}: ${paceDeltaDesc}`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className="p-1 rounded-md bg-orange-50">
                <Zap className="size-3 text-orange-600" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-slate-500">Avg Pace</span>
            </div>
            {hasMovingPace ? (
              <div className="flex items-start gap-6">
                <div className="min-w-0">
                  <p className="text-xl font-semibold text-slate-800 tabular-nums">
                    {fmtPace(current.avg_moving_pace_sec_per_km)} /km
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">moving</p>
                  <span className={`text-xs font-medium ${movingPaceD.color}`}>
                    {movingPaceD.label}
                  </span>
                  {movingPaceD.desc && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                      {movingPaceD.desc}
                    </p>
                  )}
                </div>
                <div className="border-l border-slate-200 pl-6 min-w-0">
                  <p className="text-xl font-semibold text-slate-800 tabular-nums">
                    {current.avg_pace_sec_per_km != null
                      ? `${fmtPace(current.avg_pace_sec_per_km)} /km`
                      : '—'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">elapsed</p>
                  <span className={`text-xs font-medium ${elapsedPaceD.color}`}>
                    {elapsedPaceD.label}
                  </span>
                  {elapsedPaceD.desc && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                      {elapsedPaceD.desc}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xl font-semibold text-slate-800 tabular-nums">
                  {current.avg_pace_sec_per_km != null
                    ? `${fmtPace(current.avg_pace_sec_per_km)} /km`
                    : '—'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">elapsed</p>
                <div className="mt-1.5">
                  <span className={`text-xs font-medium ${elapsedPaceD.color}`}>
                    {elapsedPaceD.label}
                  </span>
                  {elapsedPaceD.desc && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                      {elapsedPaceD.desc}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Moving Pace — desktop only, 4th col */}
          {hasMovingPace && (
            <div className="hidden lg:block border-r border-slate-200 px-4 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1 rounded-md bg-orange-50">
                  <Zap className="size-3 text-orange-600" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-slate-500">Moving Pace</span>
              </div>
              <p className="text-xl font-semibold text-slate-800 tabular-nums">
                {fmtPace(current.avg_moving_pace_sec_per_km)} /km
              </p>
              <div className="mt-1.5">
                <span className={`text-xs font-medium ${movingPaceD.color}`}>
                  {movingPaceD.label}
                </span>
                {movingPaceD.desc && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{movingPaceD.desc}</p>
                )}
              </div>
            </div>
          )}

          {/* Elapsed Pace — desktop only, 5th col (spans 2 if no moving pace) */}
          <div className={`hidden lg:block px-4 py-3 ${!hasMovingPace ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="p-1 rounded-md bg-orange-50">
                <Zap className="size-3 text-orange-600" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-slate-500">Elapsed Pace</span>
            </div>
            <p className="text-xl font-semibold text-slate-800 tabular-nums">
              {current.avg_pace_sec_per_km != null
                ? `${fmtPace(current.avg_pace_sec_per_km)} /km`
                : '—'}
            </p>
            <div className="mt-1.5">
              <span className={`text-xs font-medium ${elapsedPaceD.color}`}>
                {elapsedPaceD.label}
              </span>
              {elapsedPaceD.desc && (
                <p className="text-xs text-slate-400 mt-0.5 leading-tight">{elapsedPaceD.desc}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
