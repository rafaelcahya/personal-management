'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/base/Button/Button'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  Trophy,
  Footprints,
  Bike,
  Waves,
  Mountain,
  Dumbbell,
  Zap,
  Timer,
  Map as MapIcon,
  Heart,
  Activity,
  PersonStanding,
  Wind,
  MapPin,
  Gauge,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { fetchCalendarActivities } from '@/lib/api/running'
import { fmtDistance, fmtDuration, fmtPace, fmtDate } from '../utils/format'

// ─── shared config ────────────────────────────────────────────────────────────

const ACTIVITY_CONFIG = {
  Run: {
    icon: Footprints,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    dot: 'bg-green-500',
    label: 'Run',
  },
  TrailRun: {
    icon: Mountain,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    dot: 'bg-emerald-600',
    label: 'Trail Run',
  },
  VirtualRun: {
    icon: Footprints,
    color: 'text-violet-400',
    bg: 'bg-violet-50',
    dot: 'bg-green-300',
    label: 'Virtual Run',
  },
  Walk: {
    icon: PersonStanding,
    color: 'text-green-600',
    bg: 'bg-green-50',
    dot: 'bg-slate-400',
    label: 'Walk',
  },
  Hike: {
    icon: Mountain,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    dot: 'bg-amber-600',
    label: 'Hike',
  },
  Ride: {
    icon: Bike,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    dot: 'bg-orange-400',
    label: 'Ride',
  },
  VirtualRide: {
    icon: Bike,
    color: 'text-blue-400',
    bg: 'bg-blue-50',
    dot: 'bg-orange-300',
    label: 'Virtual Ride',
  },
  MountainBikeRide: {
    icon: Bike,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    dot: 'bg-orange-500',
    label: 'MTB',
  },
  GravelRide: {
    icon: Bike,
    color: 'text-stone-600',
    bg: 'bg-stone-50',
    dot: 'bg-stone-500',
    label: 'Gravel',
  },
  Swim: {
    icon: Waves,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    dot: 'bg-blue-400',
    label: 'Swim',
  },
  WeightTraining: {
    icon: Dumbbell,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
    label: 'Weights',
  },
  Yoga: { icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50', dot: 'bg-teal-400', label: 'Yoga' },
  easy: {
    icon: Footprints,
    color: 'text-green-600',
    bg: 'bg-green-50',
    dot: 'bg-green-400',
    label: 'Easy',
  },
  tempo: {
    icon: Zap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    label: 'Tempo',
  },
  interval: {
    icon: Timer,
    color: 'text-red-600',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    label: 'Interval',
  },
  long: {
    icon: MapIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    label: 'Long Run',
  },
  race: {
    icon: Trophy,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    dot: 'bg-purple-400',
    label: 'Race',
  },
  recovery: {
    icon: Heart,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    dot: 'bg-slate-300',
    label: 'Recovery',
  },
}
const DEFAULT_CONFIG = {
  icon: Activity,
  color: 'text-slate-500',
  bg: 'bg-slate-100',
  dot: 'bg-slate-300',
  label: null,
}
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Map Strava workout_type int → config key
const WORKOUT_TYPE_KEY = { 1: 'race', 2: 'long', 3: 'interval' }

function getCfg(type) {
  return ACTIVITY_CONFIG[type] ?? DEFAULT_CONFIG
}

function getActivityCfg(activity) {
  const wtKey = activity.workout_type != null ? WORKOUT_TYPE_KEY[activity.workout_type] : null
  if (wtKey) return ACTIVITY_CONFIG[wtKey] ?? getCfg(activity.activity_type)
  return getCfg(activity.activity_type)
}

function toLocalDateStr(isoString) {
  const d = new Date(isoString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function groupByDate(activities) {
  const map = new Map()
  for (const a of activities) {
    if (!map.has(a.date)) map.set(a.date, [])
    map.get(a.date).push(a)
  }
  return map
}

function effortOpacity(effort) {
  if (!effort) return 'opacity-60'
  if (effort < 30) return 'opacity-50'
  if (effort < 60) return 'opacity-70'
  if (effort < 100) return 'opacity-90'
  return 'opacity-100'
}

function fmtElevation(m) {
  if (!m || m <= 0) return null
  return `↑${Math.round(m)}m`
}

// ─── activity dot with tooltip ─────────────��──────────────────────────────────

function ActivityDot({ activity }) {
  const cfg = getCfg(activity.activity_type)
  const Icon = cfg.icon
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${effortOpacity(activity.relative_effort)} cursor-default`}
          aria-hidden="true"
        />
      </TooltipTrigger>
      <TooltipContent className="max-w-48">
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Icon className="size-3 shrink-0" aria-hidden="true" />
            <span>{activity.name || cfg.label || 'Activity'}</span>
          </div>
          {activity.distance_m && (
            <span className="text-slate-400">{(activity.distance_m / 1000).toFixed(1)} km</span>
          )}
          {activity.relative_effort && (
            <span className="text-slate-400">Effort: {activity.relative_effort}</span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

// ─── calendar column ────────────────────────���─────────────────────────────────

function CalendarColumn({ initialActivities, activityType, selectedDate }) {
  const now = new Date()
  const [viewMonth, setViewMonth] = useState(now)
  const [calActivities, setCalActivities] = useState(initialActivities ?? [])
  const [loading, setLoading] = useState(false)

  const isCurrentMonth =
    viewMonth.getFullYear() === now.getFullYear() && viewMonth.getMonth() === now.getMonth()

  const todayStr = toLocalDateStr(now.toISOString())

  async function loadMonth(date, type) {
    setLoading(true)
    try {
      const res = await fetchCalendarActivities(toMonthKey(date), type)
      setCalActivities(res.data ?? [])
    } catch {
      // keep existing on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isCurrentMonth) {
      setCalActivities(initialActivities ?? [])
    } else {
      loadMonth(viewMonth, activityType)
    }
  }, [activityType])

  useEffect(() => {
    if (!selectedDate) return
    const selYear = parseInt(selectedDate.slice(0, 4), 10)
    const selMonth = parseInt(selectedDate.slice(5, 7), 10) - 1
    if (selYear !== viewMonth.getFullYear() || selMonth !== viewMonth.getMonth()) {
      const d = new Date(selYear, selMonth, 1)
      setViewMonth(d)
      const isCurrent = selYear === now.getFullYear() && selMonth === now.getMonth()
      if (isCurrent) setCalActivities(initialActivities ?? [])
      else loadMonth(d, activityType)
    }
  }, [selectedDate])

  function prevMonth() {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
    setViewMonth(d)
    loadMonth(d, activityType)
  }

  function nextMonth() {
    if (isCurrentMonth) return
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
    const goingToCurrent = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    setViewMonth(d)
    if (goingToCurrent) setCalActivities(initialActivities ?? [])
    else loadMonth(d, activityType)
  }

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const activityMap = groupByDate(calActivities)
  const presentTypes = [...new Set(calActivities.map((a) => a.activity_type).filter(Boolean))]

  // Monthly summary stats
  const monthTotalKm = calActivities.reduce((s, a) => s + (Number(a.distance_m) || 0), 0) / 1000
  const monthRunCount = calActivities.length

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 leading-tight">{monthLabel}</p>
          {monthRunCount > 0 && (
            <p className="text-xs text-slate-400 mt-0.5">
              {monthTotalKm.toFixed(1)} km · {monthRunCount}{' '}
              {monthRunCount === 1 ? 'activity' : 'activities'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {loading && (
            <Loader2 className="size-3.5 text-slate-400 animate-spin" aria-hidden="true" />
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={prevMonth}
            disabled={loading}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={nextMonth}
            disabled={isCurrentMonth || loading}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="text-center text-xs text-slate-400 py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayActivities = activityMap.get(dateStr) ?? []
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate && dateStr !== todayStr
          const isPast = !isToday && dateStr < todayStr
          const visible = dayActivities.slice(0, 3)
          const overflow = dayActivities.length - 3

          return (
            <div
              key={dateStr}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
                isToday
                  ? 'ring-2 ring-violet-500 bg-violet-50'
                  : isSelected
                    ? 'ring-2 ring-blue-400 bg-blue-50'
                    : ''
              }`}
            >
              <span
                className={`text-xs ${
                  isToday
                    ? 'text-violet-600 font-bold'
                    : isSelected
                      ? 'text-blue-600 font-semibold'
                      : isPast && dayActivities.length === 0
                        ? 'text-slate-300'
                        : 'text-slate-600'
                }`}
              >
                {day}
              </span>
              {dayActivities.length > 0 ? (
                <div className="flex items-center gap-0.5 mt-0.5 flex-wrap justify-center">
                  {visible.map((a) => (
                    <ActivityDot key={a.id} activity={a} />
                  ))}
                  {overflow > 0 && (
                    <span className="text-[9px] text-slate-400 leading-none">+{overflow}</span>
                  )}
                </div>
              ) : (
                <span className="w-1.5 h-1.5 mt-0.5" aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {!loading && monthRunCount === 0 && (
        <p className="text-center text-xs text-slate-400 py-2">No activities this month</p>
      )}

      {/* Dynamic legend */}
      {presentTypes.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-3">
          {presentTypes.map((type) => {
            const cfg = getCfg(type)
            return (
              <span key={type} className="flex items-center gap-1 text-xs text-slate-500">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
                {cfg.label ?? type}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── recent column ──────────────────��───────────────────────────────���─────────

function RecentColumn({ activities, activityType, selectedDate, onSelectDate }) {
  const shown = (activities ?? []).slice(0, 5)
  const seeAllHref = activityType
    ? `/main/running/activities?type=${encodeURIComponent(activityType)}`
    : '/main/running/activities'

  return (
    <div className="flex flex-col min-w-0 h-full">
      <p className="text-sm font-semibold text-slate-700 mb-3">Recent</p>

      {shown.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400 flex-1">
          {activityType
            ? `No ${getCfg(activityType).label ?? activityType} activities`
            : 'No activities yet'}
        </p>
      ) : (
        <ul className="flex-1 -mx-5 divide-y divide-slate-100">
          {shown.map((a) => {
            const cfg = getActivityCfg(a)
            const Icon = cfg.icon
            const dateStr = toLocalDateStr(a.started_at)
            const isActive = dateStr === selectedDate
            const elevation = fmtElevation(a.elevation_gain_m)
            const hasPR = a.pr_count > 0

            return (
              <li key={a.id}>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => onSelectDate(isActive ? null : dateStr)}
                  className={`items-center gap-3 px-5 py-3 h-auto text-left ${isActive ? 'bg-blue-50' : ''}`}
                  aria-pressed={isActive}
                >
                  <div className={`p-1.5 rounded-md shrink-0 ${cfg.bg}`}>
                    <Icon className={`size-3.5 ${cfg.color}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Line 1: name + PR badge */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {a.name || cfg.label || a.activity_type}
                      </span>
                      {hasPR && (
                        <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold shrink-0">
                          <Trophy className="size-2.5" aria-hidden="true" />
                          PR
                        </span>
                      )}
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {fmtDate(a.started_at)}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                      >
                        {cfg.label ?? a.activity_type}
                      </span>
                    </div>
                    {/* Line 2: date + type chip */}
                    <div className="flex items-center gap-1.5 mb-1"></div>
                    {/* Line 3: stats */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                        {fmtDistance(a.distance_m)} km
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <Gauge className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                        {fmtPace(a.avg_pace_sec_per_km)} /km
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                        {fmtDuration(a.duration_sec)}
                      </span>
                      {a.avg_hr != null && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1">
                            <Heart className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                            {a.avg_hr} bpm
                          </span>
                        </>
                      )}
                      {elevation && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span>{elevation}</span>
                        </>
                      )}
                      {a.device_watts === true &&
                        (a.weighted_avg_watts != null || a.avg_watts != null) && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span>{a.weighted_avg_watts ?? a.avg_watts} W</span>
                          </>
                        )}
                      {a.avg_temp_c != null && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span
                            className={
                              a.avg_temp_c < 10
                                ? 'text-blue-500'
                                : a.avg_temp_c < 20
                                  ? 'text-green-500'
                                  : a.avg_temp_c < 28
                                    ? 'text-amber-500'
                                    : 'text-red-500'
                            }
                          >
                            {a.avg_temp_c}°C
                          </span>
                        </>
                      )}
                    </div>
                    {/* Line 4: gear */}
                    {a.gear_name && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Footprints
                          className="size-2.5 text-slate-400 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-[10px] text-slate-400">{a.gear_name}</span>
                      </div>
                    )}
                  </div>
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-auto pt-3 border-t border-slate-100">
        <Link
          href={seeAllHref}
          className="flex items-center justify-between w-full px-1 py-1 text-xs text-slate-500 hover:text-violet-600 transition-colors group"
        >
          <span>See all activities</span>
          <ArrowRight
            className="size-3.5 group-hover:translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  )
}

// ─── main export ────────────────────────���───────────────────────────��─────────

export default function ActivitySection({ calendarActivities, recentActivities, activityType }) {
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <section id="activitySection" aria-label="Activity">
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">Activity</h3>
            </div>
            <p className="text-xs text-slate-400">
              Monthly calendar and your most recent activities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-slate-100">
            <CalendarColumn
              initialActivities={calendarActivities}
              activityType={activityType}
              selectedDate={selectedDate}
            />
            <div className="md:pl-6">
              <RecentColumn
                activities={recentActivities}
                activityType={activityType}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
