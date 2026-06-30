'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFieldContentContext } from '../../Field/FieldContent'
import { triggerVariants, YearList } from '../calendarParts'

const CURRENT_YEAR = new Date().getFullYear()

// ─── YearPicker ────────────────────────────────────────────────────────────────

export default function YearPicker({
  value = null,
  onChange,
  fromYear = 1970,
  toYear = CURRENT_YEAR + 20,
  placeholder = 'Pick a year',
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

  const handleSelect = (year) => {
    onChange?.(year)
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
            {value ?? placeholder}
          </span>
          {icon !== undefined ? icon : <CalendarIcon className="size-4 shrink-0 opacity-50" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <YearList
          selectedYear={value}
          onSelect={handleSelect}
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  )
}

YearPicker.displayName = 'YearPicker'
