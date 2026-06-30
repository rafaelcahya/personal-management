'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFieldContentContext } from '../../Field/FieldContent'
import { triggerVariants, MonthGrid, MONTH_NAMES } from '../calendarParts'

// ─── MonthPicker ───────────────────────────────────────────────────────────────

export default function MonthPicker({
  value = null,
  onChange,
  valueFormat = 'number', // 'number' → 1–12 | 'name' → 'January'–'December'
  placeholder = 'Pick a month',
  variant: variantProp,
  size: sizeProp,
  disabled: disabledProp = false,
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

  // Convert value → 0-based month index for internal use
  const selectedMonth = (() => {
    if (value === null || value === undefined) return null
    if (valueFormat === 'number') return value - 1 // 1–12 → 0–11
    const idx = MONTH_NAMES.indexOf(value)
    return idx === -1 ? null : idx
  })()

  const displayLabel = selectedMonth !== null ? MONTH_NAMES[selectedMonth] : null

  const handleSelect = (monthIndex) => {
    const out = valueFormat === 'number' ? monthIndex + 1 : MONTH_NAMES[monthIndex]
    onChange?.(out)
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
          <span className={displayLabel ? 'text-foreground' : 'text-muted-foreground'}>
            {displayLabel ?? placeholder}
          </span>
          {icon !== undefined ? icon : <CalendarIcon className="size-4 shrink-0 opacity-50" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="p-4 select-none">
          <MonthGrid selectedMonth={selectedMonth} onSelect={handleSelect} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

MonthPicker.displayName = 'MonthPicker'
