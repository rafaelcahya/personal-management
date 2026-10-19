'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { fetchCalendarActivities } from '@/lib/api/running'
import {
  getCfg,
  toLocalDateStr,
  toMonthKey,
  groupByDate,
  effortOpacity,
} from '../utils/activityDisplay'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dayAriaLabel(year, month, day, count, isSelected) {
  const label = new Date(year, month, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return `${label}, ${count} ${count === 1 ? 'activity' : 'activities'}${isSelected ? ', selected' : ''}`
}

function DayActivities({ activities }) {
  return (
    <div className="flex flex-col gap-2">
      {activities.map((a) => {
        const cfg = getCfg(a.activity_type)
        const Icon = cfg.icon
        return (
          <div key={a.id} className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-medium">
              <Icon className="size-3 shrink-0" aria-hidden="true" />
              <span>{a.name || cfg.label || 'Activity'}</span>
            </div>
            {a.distance_m > 0 && (
              <span className="text-slate-400">{(a.distance_m / 1000).toFixed(1)} km</span>
            )}
            {a.relative_effort > 0 && (
              <span className="text-slate-400">Effort: {a.relative_effort}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CalendarColumn({ initialActivities, activityType, selectedDate }) {
  const now = new Date()
  const [viewMonth, setViewMonth] = useState(now)
  const [calActivities, setCalActivities] = useState(initialActivities ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const requestIdRef = useRef(0)

  const isCurrentMonth =
    viewMonth.getFullYear() === now.getFullYear() && viewMonth.getMonth() === now.getMonth()

  const todayStr = toLocalDateStr(now.toISOString())

  async function loadMonth(date, type) {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)
    try {
      const res = await fetchCalendarActivities(toMonthKey(date), type)
      if (requestId !== requestIdRef.current) return
      setCalActivities(res.data ?? [])
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      // The previous month's dots under a new month header would be wrong data
      setCalActivities([])
      setError(err.message || 'Failed to load calendar')
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }

  function showInitial() {
    // Drops any in-flight month request so it cannot overwrite the current month
    requestIdRef.current++
    setLoading(false)
    setError(null)
    setCalActivities(initialActivities ?? [])
  }

  useEffect(() => {
    if (isCurrentMonth) {
      showInitial()
    } else {
      loadMonth(viewMonth, activityType)
    }
  }, [activityType, initialActivities])

  useEffect(() => {
    if (!selectedDate) return
    const selYear = parseInt(selectedDate.slice(0, 4), 10)
    const selMonth = parseInt(selectedDate.slice(5, 7), 10) - 1
    if (selYear !== viewMonth.getFullYear() || selMonth !== viewMonth.getMonth()) {
      const d = new Date(selYear, selMonth, 1)
      setViewMonth(d)
      const isCurrent = selYear === now.getFullYear() && selMonth === now.getMonth()
      if (isCurrent) showInitial()
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
    if (goingToCurrent) showInitial()
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

  const monthTotalKm = calActivities.reduce((s, a) => s + (Number(a.distance_m) || 0), 0) / 1000
  const monthRunCount = calActivities.length

  return (
    <div className="flex flex-col gap-3 min-w-0">
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
            id="calendarPrevMonthBtn_dashboardPage"
            variant="ghost"
            size="icon-xs"
            className="max-sm:size-11"
            onClick={prevMonth}
            disabled={loading}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            id="calendarNextMonthBtn_dashboardPage"
            variant="ghost"
            size="icon-xs"
            className="max-sm:size-11"
            onClick={nextMonth}
            disabled={isCurrentMonth || loading}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="text-center text-xs text-slate-400 py-1">
            {w}
          </div>
        ))}
      </div>

      <div
        id="calendarGrid_dashboardPage"
        className={`grid grid-cols-7 gap-y-1 transition-opacity ${loading ? 'opacity-60' : ''}`}
        aria-busy={loading}
      >
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayActivities = activityMap.get(dateStr) ?? []
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate && dateStr !== todayStr
          const isPast = !isToday && dateStr < todayStr
          const visible = dayActivities.slice(0, 3)
          const overflow = dayActivities.length - 3
          const hasActivities = dayActivities.length > 0

          const cellClass = `flex min-h-11 sm:min-h-10 w-full flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            isToday
              ? 'ring-2 ring-violet-500 bg-violet-50'
              : isSelected
                ? 'ring-2 ring-blue-400 bg-blue-50'
                : ''
          }`

          const content = (
            <>
              <span
                className={`text-xs ${
                  isToday
                    ? 'text-violet-600 font-bold'
                    : isSelected
                      ? 'text-blue-600 font-semibold'
                      : isPast && !hasActivities
                        ? 'text-slate-300'
                        : 'text-slate-600'
                }`}
              >
                {day}
              </span>
              {hasActivities ? (
                <span
                  className="flex items-center gap-0.5 mt-0.5 flex-wrap justify-center"
                  aria-hidden="true"
                >
                  {visible.map((a) => (
                    <span
                      key={a.id}
                      className={`inline-block w-1.5 h-1.5 rounded-full ${getCfg(a.activity_type).dot} ${effortOpacity(a.relative_effort)}`}
                    />
                  ))}
                  {overflow > 0 && (
                    <span className="text-xs text-slate-400 leading-none">+{overflow}</span>
                  )}
                </span>
              ) : (
                <span className="w-1.5 h-1.5 mt-0.5" aria-hidden="true" />
              )}
            </>
          )

          // Empty days stay inert so keyboard users only stop on days that have something to show
          if (!hasActivities) {
            return (
              <div key={dateStr} className={cellClass}>
                {content}
              </div>
            )
          }

          const dayLabel = dayAriaLabel(year, month, day, dayActivities.length, isSelected)

          return (
            <Popover key={dateStr}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id={`calendarDay_${dateStr}_dashboardPage`}
                  aria-label={dayLabel}
                  aria-current={isToday ? 'date' : undefined}
                  className={`${cellClass} cursor-pointer hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700`}
                >
                  {content}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                aria-label={dayLabel}
                className="w-auto max-w-56 p-3 text-xs leading-relaxed"
              >
                <DayActivities activities={dayActivities} />
              </PopoverContent>
            </Popover>
          )
        })}
      </div>

      {error && (
        <div
          id="calendarError_dashboardPage"
          role="alert"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2"
        >
          <p className="text-sm text-red-600">{error}</p>
          <Button
            id="calendarRetryBtn_dashboardPage"
            variant="link"
            size="sm"
            className="max-sm:h-11"
            onClick={() => loadMonth(viewMonth, activityType)}
            disabled={loading}
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && monthRunCount === 0 && (
        <p id="calendarEmpty_dashboardPage" className="text-center text-xs text-slate-400 py-2">
          No activities this month
        </p>
      )}

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
