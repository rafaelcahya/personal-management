'use client'

import { useRef, useEffect } from 'react'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'

// ─── Shared trigger variants ───────────────────────────────────────────────────

export const triggerVariants = cva(
  [
    'flex w-full items-center justify-between gap-2 whitespace-nowrap',
    'rounded-md border bg-background text-foreground',
    'text-sm font-medium cursor-pointer',
    'transition-[color,box-shadow,border-color] duration-150',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600',
  ],
  {
    variants: {
      variant: {
        default: 'border-input hover:border-slate-300',
        error:
          'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
        disabled: 'border-input opacity-50 cursor-not-allowed pointer-events-none bg-muted',
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-7 px-2.5 text-xs rounded-md',
        base: 'h-8 px-3 text-sm rounded-md',
        md: 'h-9 px-3.5 text-sm rounded-md',
        lg: 'h-10 px-4 text-sm rounded-md',
      },
    },
    defaultVariants: { variant: 'default', size: 'base' },
  }
)

// ─── Month constants ───────────────────────────────────────────────────────────

export const MONTH_NAMES = [
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

export const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// ─── MonthGrid ─────────────────────────────────────────────────────────────────
// 3×4 grid of months. selectedMonth = violet-600, highlightMonth = violet-50.

export function MonthGrid({ selectedMonth, highlightMonth, onSelect, isMonthDisabled }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {MONTH_SHORT.map((m, i) => {
        const disabled = isMonthDisabled?.(i) ?? false
        return (
          <button
            key={m}
            onClick={() => !disabled && onSelect(i)}
            disabled={disabled}
            className={clsx(
              'rounded px-3 py-2 text-sm font-medium transition-colors text-center',
              selectedMonth === i
                ? 'bg-violet-600 text-white'
                : highlightMonth === i
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-700 hover:bg-gray-100',
              disabled && 'opacity-30 pointer-events-none'
            )}
          >
            {m}
          </button>
        )
      })}
    </div>
  )
}

// ─── YearList ──────────────────────────────────────────────────────────────────
// Scrollable year list. Auto-scrolls to selectedYear or current year on mount.

export function YearList({ selectedYear, onSelect, fromYear, toYear }) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i)
  const listRef = useRef(null)
  const targetRef = useRef(null)

  useEffect(() => {
    if (!listRef.current || !targetRef.current) return
    const container = listRef.current
    const target = targetRef.current
    container.scrollTop = target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2
  }, [])

  const scrollTarget = selectedYear ?? currentYear

  return (
    <div ref={listRef} className="overflow-y-auto h-60 w-36 py-1">
      {years.map((y) => (
        <button
          key={y}
          ref={y === scrollTarget ? targetRef : null}
          onClick={() => onSelect(y)}
          className={clsx(
            'w-full px-3 py-1.5 text-sm font-medium rounded text-center transition-colors',
            y === selectedYear
              ? 'bg-violet-600 text-white'
              : y === currentYear
                ? 'bg-violet-50 text-violet-700'
                : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {y}
        </button>
      ))}
    </div>
  )
}
