'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/base/Button/Button'
import {
  ChevronLeft,
  ChevronRight,
  Footprints,
  Bike,
  Waves,
  Activity,
  CalendarDays,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { fetchCalendarActivities } from '@/lib/api/running'

const SPORT_COLORS = {
  Run: { dot: 'bg-green-500', label: 'Run' },
  VirtualRun: { dot: 'bg-green-300', label: 'Virtual Run' },
  TrailRun: { dot: 'bg-emerald-600', label: 'Trail Run' },
  Ride: { dot: 'bg-orange-400', label: 'Ride' },
  VirtualRide: { dot: 'bg-orange-300', label: 'Virtual Ride' },
  MountainBikeRide: { dot: 'bg-orange-500', label: 'MTB' },
  GravelRide: { dot: 'bg-stone-500', label: 'Gravel' },
  Swim: { dot: 'bg-blue-400', label: 'Swim' },
  Walk: { dot: 'bg-slate-400', label: 'Walk' },
  Hike: { dot: 'bg-amber-600', label: 'Hike' },
}
const DEFAULT_DOT = 'bg-slate-300'
const DEFAULT_LABEL = 'Activity'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function sportIcon(type) {
  if (['Run', 'TrailRun', 'VirtualRun', 'Walk', 'Hike'].includes(type)) return Footprints
  if (['Ride', 'VirtualRide', 'MountainBikeRide', 'GravelRide'].includes(type)) return Bike
  if (type === 'Swim') return Waves
  return Activity
}

function effortOpacity(effort) {
  if (!effort) return 'opacity-60'
  if (effort < 30) return 'opacity-50'
  if (effort < 60) return 'opacity-70'
  if (effort < 100) return 'opacity-90'
  return 'opacity-100'
}

function formatDistance(m) {
  if (!m) return null
  return `${(m / 1000).toFixed(1)} km`
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

function ActivityDot({ activity }) {
  const sport = SPORT_COLORS[activity.activity_type]
  const dotColor = sport?.dot ?? DEFAULT_DOT
  const label = sport?.label ?? DEFAULT_LABEL
  const Icon = sportIcon(activity.activity_type)
  const opacity = effortOpacity(activity.relative_effort)

  const tooltipContent = (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex items-center gap-1.5 font-medium">
        <Icon className="size-3 shrink-0" aria-hidden="true" />
        <span>{activity.name || label}</span>
      </div>
      {activity.distance_m && (
        <span className="text-slate-400">{formatDistance(activity.distance_m)}</span>
      )}
      {activity.relative_effort && (
        <span className="text-slate-400">Effort: {activity.relative_effort}</span>
      )}
    </div>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor} ${opacity} cursor-default`}
          aria-hidden="true"
        />
      </TooltipTrigger>
      <TooltipContent className="max-w-48">{tooltipContent}</TooltipContent>
    </Tooltip>
  )
}

export default function ActivityCalendar({ activities, activityType }) {
  const now = new Date()
  const [viewMonth, setViewMonth] = useState(now)
  const [calendarActivities, setCalendarActivities] = useState(activities ?? [])
  const [calLoading, setCalLoading] = useState(false)

  const isCurrentMonth =
    viewMonth.getFullYear() === now.getFullYear() && viewMonth.getMonth() === now.getMonth()

  const todayStr = toMonthKey(now) + `-${String(now.getDate()).padStart(2, '0')}`

  async function loadMonth(date, type) {
    setCalLoading(true)
    try {
      const res = await fetchCalendarActivities(toMonthKey(date), type)
      setCalendarActivities(res.data ?? [])
    } catch {
      // keep existing data on error
    } finally {
      setCalLoading(false)
    }
  }

  useEffect(() => {
    if (isCurrentMonth) {
      setCalendarActivities(activities ?? [])
    } else {
      loadMonth(viewMonth, activityType)
    }
  }, [activityType])

  function prevMonth() {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
    setViewMonth(d)
    loadMonth(d, activityType)
  }

  function nextMonth() {
    if (isCurrentMonth) return
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
    setViewMonth(d)
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
      setCalendarActivities(activities ?? [])
    } else {
      loadMonth(d, activityType)
    }
  }

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const activityMap = groupByDate(calendarActivities)

  const presentTypes = [...new Set(calendarActivities.map((a) => a.activity_type).filter(Boolean))]

  return (
    <section id="activityCalendarCard" aria-label="Activity calendar">
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">Activity Calendar</h3>
            </div>
            <p className="text-xs text-slate-400">
              Monthly view of your logged activities by sport type.
            </p>
          </div>
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">{monthLabel}</p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={prevMonth}
                disabled={calLoading}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={nextMonth}
                disabled={isCurrentMonth || calLoading}
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAY_LABELS.map((w) => (
              <div key={w} className="text-center text-xs text-slate-400 py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            className={`grid grid-cols-7 gap-y-1 transition-opacity ${calLoading ? 'opacity-40' : ''}`}
          >
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayActivities = activityMap.get(dateStr) ?? []
              const isToday = dateStr === todayStr
              const isPast = !isToday && dateStr < todayStr
              const visible = dayActivities.slice(0, 3)
              const overflow = dayActivities.length - 3

              return (
                <div
                  key={dateStr}
                  className={`flex flex-col items-center justify-center py-1 rounded-lg ${isToday ? 'ring-2 ring-violet-500 bg-violet-50' : ''}`}
                  aria-label={`${dateStr}${dayActivities.length ? `, ${dayActivities.length} activity` : ''}`}
                >
                  <span
                    className={`text-xs ${
                      isToday
                        ? 'text-violet-600 font-bold'
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

          {/* Dynamic legend */}
          {presentTypes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-3">
              {presentTypes.map((type) => {
                const sport = SPORT_COLORS[type]
                return (
                  <span key={type} className="flex items-center gap-1 text-xs text-slate-500">
                    <span
                      className={`w-2 h-2 rounded-full ${sport?.dot ?? DEFAULT_DOT}`}
                      aria-hidden="true"
                    />
                    {sport?.label ?? type}
                  </span>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
