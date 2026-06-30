'use client'

import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  addDays,
  addMonths,
  subMonths,
  setMonth,
  setYear,
  getYear,
  getMonth,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
} from 'date-fns'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFieldContentContext } from '../../Field/FieldContent'
import { triggerVariants, MonthGrid } from '../calendarParts'

// ─── Calendar constants ────────────────────────────────────────────────────────

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDayGrid(viewDate) {
  const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 0 })
  return Array.from({ length: 35 }, (_, i) => addDays(start, i))
}

function getYearRange(year) {
  const base = Math.floor(year / 10) * 10
  return Array.from({ length: 12 }, (_, i) => base + i)
}

// ─── CalendarPopup ─────────────────────────────────────────────────────────────

function CalendarPopup({ selected, onSelect, fromDate, toDate, disabledDates }) {
  const [viewDate, setViewDate] = useState(selected ?? new Date())
  const [view, setView] = useState('day') // 'day' | 'month' | 'year'

  const fromDay = fromDate ? startOfDay(fromDate) : null
  const toDay = toDate ? startOfDay(toDate) : null

  const isDateDisabled = (date) => {
    const d = startOfDay(date)
    if (fromDay && isBefore(d, fromDay)) return true
    if (toDay && isAfter(d, toDay)) return true
    if (disabledDates) return disabledDates(date)
    return false
  }

  const currentYear = getYear(viewDate)

  // ── Day view ──────────────────────────────────────────────────────────────

  const days = useMemo(() => getDayGrid(viewDate), [viewDate])

  const canPrevMonth = !fromDay || isAfter(startOfMonth(viewDate), startOfMonth(fromDay))
  const canNextMonth = !toDay || isBefore(startOfMonth(viewDate), startOfMonth(toDay))

  if (view === 'day') {
    return (
      <div className="p-3 w-[280px] select-none">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => canPrevMonth && setViewDate(subMonths(viewDate, 1))}
            className={clsx(
              'size-7 rounded flex items-center justify-center transition-colors',
              canPrevMonth ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-default'
            )}
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setView('month')}
              className="hover:bg-gray-100 cursor-pointer rounded px-1.5 py-0.5 text-sm font-semibold transition-colors"
            >
              {format(viewDate, 'MMMM')}
            </button>
            <button
              onClick={() => setView('year')}
              className="hover:bg-gray-100 cursor-pointer rounded px-1.5 py-0.5 text-sm font-semibold transition-colors"
            >
              {currentYear}
            </button>
          </div>

          <button
            onClick={() => canNextMonth && setViewDate(addMonths(viewDate, 1))}
            className={clsx(
              'size-7 rounded flex items-center justify-center transition-colors',
              canNextMonth ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-default'
            )}
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="size-8 flex items-center justify-center text-[11px] font-medium text-gray-400"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, i) => {
            const inMonth = isSameMonth(day, viewDate)
            const isSelected = selected && isSameDay(day, selected)
            const isTodayDate = isToday(day)
            const disabled = isDateDisabled(day)

            return (
              <button
                key={i}
                onClick={() => !disabled && onSelect(day)}
                disabled={disabled}
                className={clsx(
                  'size-8 rounded flex items-center justify-center text-xs font-medium transition-colors',
                  isSelected
                    ? 'bg-violet-600 text-white'
                    : isTodayDate && inMonth
                      ? 'bg-violet-50 text-violet-700 font-semibold hover:bg-violet-100'
                      : inMonth
                        ? 'text-gray-800 hover:bg-gray-100'
                        : 'text-gray-300',
                  disabled && 'opacity-40 pointer-events-none'
                )}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Month view ────────────────────────────────────────────────────────────

  const canPrevYear = !fromDay || currentYear > getYear(fromDay)
  const canNextYear = !toDay || currentYear < getYear(toDay)

  if (view === 'month') {
    return (
      <div className="p-3 w-[280px] select-none">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => canPrevYear && setViewDate(setYear(viewDate, currentYear - 1))}
            className={clsx(
              'size-7 rounded flex items-center justify-center transition-colors',
              canPrevYear ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-default'
            )}
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          <button
            onClick={() => setView('year')}
            className="hover:bg-gray-100 cursor-pointer rounded px-2 py-0.5 text-sm font-semibold transition-colors"
          >
            {currentYear}
          </button>

          <button
            onClick={() => canNextYear && setViewDate(setYear(viewDate, currentYear + 1))}
            className={clsx(
              'size-7 rounded flex items-center justify-center transition-colors',
              canNextYear ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-default'
            )}
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>

        <MonthGrid
          selectedMonth={selected && getYear(selected) === currentYear ? getMonth(selected) : null}
          highlightMonth={getMonth(viewDate)}
          onSelect={(i) => {
            setViewDate(setMonth(setYear(viewDate, currentYear), i))
            setView('day')
          }}
          isMonthDisabled={(i) => {
            const monthDate = new Date(currentYear, i, 1)
            return Boolean(
              (fromDay && isBefore(endOfMonth(monthDate), fromDay)) ||
              (toDay && isAfter(monthDate, toDay))
            )
          }}
        />
      </div>
    )
  }

  // ── Year view ─────────────────────────────────────────────────────────────

  const years = getYearRange(currentYear)
  const rangeStart = years[0]
  const rangeEnd = years[years.length - 1]
  const canPrevDecade = !fromDay || rangeStart > getYear(fromDay)
  const canNextDecade = !toDay || rangeEnd < getYear(toDay)

  return (
    <div className="p-3 w-[280px] select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => canPrevDecade && setViewDate(setYear(viewDate, rangeStart - 1))}
          className={clsx(
            'size-7 rounded flex items-center justify-center transition-colors',
            canPrevDecade ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-default'
          )}
        >
          <ChevronLeftIcon className="size-4" />
        </button>

        <span className="text-sm font-semibold text-gray-700">
          {rangeStart} – {rangeEnd}
        </span>

        <button
          onClick={() => canNextDecade && setViewDate(setYear(viewDate, rangeEnd + 1))}
          className={clsx(
            'size-7 rounded flex items-center justify-center transition-colors',
            canNextDecade ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-30 cursor-default'
          )}
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {years.map((y) => {
          const isSelectedYear = selected && getYear(selected) === y
          const isCurrentYear = getYear(viewDate) === y
          const isYearDisabled = (fromDay && y < getYear(fromDay)) || (toDay && y > getYear(toDay))

          return (
            <button
              key={y}
              onClick={() => {
                if (!isYearDisabled) {
                  setViewDate(setYear(viewDate, y))
                  setView('month')
                }
              }}
              disabled={isYearDisabled}
              className={clsx(
                'rounded py-2 text-sm font-medium transition-colors text-center',
                isSelectedYear
                  ? 'bg-violet-600 text-white'
                  : isCurrentYear
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-700 hover:bg-gray-100',
                isYearDisabled && 'opacity-30 pointer-events-none'
              )}
            >
              {y}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

export default function DatePicker({
  value = null,
  onChange,
  placeholder = 'Pick a date',
  displayFormat = 'd MMM yyyy',
  variant: variantProp,
  size: sizeProp,
  disabled: disabledProp = false,
  fromDate,
  toDate,
  disabledDates,
  align = 'start',
  icon,
  className,
  ...props
}) {
  const [open, setOpen] = useState(false)
  const {
    id,
    descriptionId,
    errorId,
    hasError,
    required,
    disabled: ctxDisabled,
    size: ctxSize,
  } = useFieldContentContext()

  const resolvedSize = sizeProp ?? ctxSize ?? 'base'
  const isDisabled = ctxDisabled || disabledProp || variantProp === 'disabled'
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  const handleSelect = (date) => {
    onChange?.(date ?? null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={isDisabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
          className={twMerge(
            clsx(triggerVariants({ variant: resolvedVariant, size: resolvedSize }), className)
          )}
          {...props}
        >
          <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
            {value ? format(value, displayFormat) : placeholder}
          </span>
          {icon !== undefined ? icon : <CalendarIcon className="size-4 shrink-0 opacity-50" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <CalendarPopup
          selected={value ?? undefined}
          onSelect={handleSelect}
          fromDate={fromDate}
          toDate={toDate}
          disabledDates={disabledDates}
        />
      </PopoverContent>
    </Popover>
  )
}

DatePicker.displayName = 'DatePicker'
