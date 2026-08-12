'use client'

import { useCallback, useEffect, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import Button from '@/components/base/Button/Button'
import State from '@/components/base/State/State'
import { fetchDailyPnl } from '@/lib/api/dashboard'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function formatPnl(pnl) {
  const sign = pnl >= 0 ? '+' : '-'
  return `${sign}Rp ${Math.abs(pnl).toLocaleString('id-ID')}`
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= lastDay; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
}

export default function PnLCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [pnlMap, setPnlMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (y, m) => {
    try {
      setLoading(true)
      setError(null)
      const rows = await fetchDailyPnl(y, m)
      const map = {}
      for (const { date, pnl, count } of rows) map[date] = { pnl, count }
      setPnlMap(map)
    } catch (err) {
      setError(err.message || 'Failed to load PnL data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(year, month)
  }, [year, month, load])

  const prevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1)
      setMonth(12)
    } else setMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1)
      setMonth(1)
    } else setMonth((m) => m + 1)
  }

  const days = buildCalendarDays(year, month)
  const pad = (n) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const hasTrades = Object.keys(pnlMap).length > 0

  return (
    <Card id="pnlCalendarCard_tradingDashboardPage">
      <CardHeader>
        <CardIcon icon={CalendarDays} />
        <CardHeaderContent>
          <CardTitle>Daily PnL Calendar</CardTitle>
          <CardDescription>Realized gain/loss per trading day</CardDescription>
        </CardHeaderContent>
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <Button
            id="pnlCalendarPrevBtn_tradingDashboardPage"
            variant="ghost"
            size="icon-xs"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span
            id="pnlCalendarMonthLabel_tradingDashboardPage"
            className="text-sm font-semibold text-slate-700 w-32 text-center tabular-nums"
          >
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <Button
            id="pnlCalendarNextBtn_tradingDashboardPage"
            variant="ghost"
            size="icon-xs"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wide py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {loading ? (
          <div id="pnlCalendarSkeleton_tradingDashboardPage" className="grid grid-cols-7 gap-1">
            {Array.from({ length: days.length || 35 }).map((_, i) => (
              <Skeleton key={i} className="h-[88px] rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <State
            id="pnlCalendarError_tradingDashboardPage"
            variant="error"
            title="Failed to load calendar"
            description={error}
            action={{ label: 'Retry', onClick: () => load(year, month) }}
          />
        ) : !hasTrades ? (
          <State
            id="pnlCalendarEmpty_tradingDashboardPage"
            variant="empty"
            icon={CalendarDays}
            title="No Trades This Month"
            description={`No trades were closed in ${MONTH_NAMES[month - 1]} ${year}`}
          />
        ) : (
          <div
            id="pnlCalendarGrid_tradingDashboardPage"
            className="grid grid-cols-7 gap-1"
            aria-live="polite"
          >
            {days.map((day, i) => {
              if (!day) return <div key={i} aria-hidden="true" />
              const dateStr = `${year}-${pad(month)}-${pad(day)}`
              const entry = pnlMap[dateStr]
              const hasTrade = !!entry
              const isToday = dateStr === todayStr

              let cellClass = 'bg-slate-50'
              let pnlClass = ''
              if (hasTrade && entry.pnl > 0) {
                cellClass = 'bg-green-50'
                pnlClass = 'text-success-subtle-foreground'
              }
              if (hasTrade && entry.pnl < 0) {
                cellClass = 'bg-red-50'
                pnlClass = 'text-destructive-subtle-foreground'
              }

              return (
                <div
                  key={dateStr}
                  id={`pnlCalendarDay_${dateStr}_tradingDashboardPage`}
                  className={`rounded-lg px-2 py-2 flex flex-col items-start justify-start min-h-[88px] gap-0.5 ${cellClass} ${isToday ? 'ring-2 ring-violet-500 ring-offset-1' : ''}`}
                >
                  <span
                    className={`font-semibold ${hasTrade ? 'text-slate-600' : 'text-slate-400'}`}
                  >
                    {day}
                  </span>
                  {hasTrade && (
                    <>
                      <span className={`font-bold leading-tight ${pnlClass}`}>
                        {formatPnl(entry.pnl)}
                      </span>
                      <span className="text-xs text-slate-400 leading-tight">
                        {entry.count} {entry.count === 1 ? 'trade' : 'trades'}
                      </span>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
