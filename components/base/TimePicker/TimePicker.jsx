'use client'

import { useState } from 'react'
import { ClockIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFieldContentContext } from '../Field/FieldContent'
import { triggerVariants } from '../DatePicker/calendarParts'
import {
  FIELD_LABELS,
  FIELD_MAX,
  generateOptions,
  parseTimeValue,
  formatTimeValue,
  TimeScrollColumn,
} from './timePickerParts'

// ─── TimePicker ────────────────────────────────────────────────────────────────

const DEFAULT_FIELDS = ['hour', 'minute', 'second']

export default function TimePicker({
  value = null,
  onChange,
  fields = DEFAULT_FIELDS,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  placeholder = 'Pick a time',
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

  const steps = { hour: hourStep, minute: minuteStep, second: secondStep }
  const parsed = parseTimeValue(value, fields)

  const handleChange = (field, val) => {
    const next = { ...parsed, [field]: val }
    fields.forEach((f) => {
      if (next[f] === null) next[f] = 0
    })
    onChange?.(formatTimeValue(next, fields))
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
          {icon !== undefined ? icon : <ClockIcon className="size-4 shrink-0 opacity-50" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex divide-x divide-slate-100 p-3">
          {fields.map((field) => (
            <TimeScrollColumn
              key={field}
              label={FIELD_LABELS[field]}
              options={generateOptions(FIELD_MAX[field], steps[field])}
              value={parsed[field]}
              onChange={(val) => handleChange(field, val)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

TimePicker.displayName = 'TimePicker'
