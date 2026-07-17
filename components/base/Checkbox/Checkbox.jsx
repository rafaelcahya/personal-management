'use client'

import { useState, useId } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFieldContentContext } from '../Field/FieldContent'

const Checkbox = ({
  id: idProp,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled: disabledProp,
  required,
  name,
  value = 'on',
  'aria-invalid': ariaInvalid,
  className,
}) => {
  const ctx = useFieldContentContext()
  const uid = useId()
  const id = idProp ?? uid
  const disabled = disabledProp ?? ctx.disabled ?? false

  const isControlled = checkedProp !== undefined
  const [internal, setInternal] = useState(defaultChecked)
  const checked = isControlled ? checkedProp : internal

  const isChecked = checked === true
  const isIndeterminate = checked === 'indeterminate'
  const hasError = ariaInvalid || ctx.hasError

  const toggle = () => {
    if (disabled) return
    const next = isIndeterminate ? true : !isChecked
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={isIndeterminate ? 'mixed' : isChecked}
      aria-disabled={disabled || undefined}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
      className={cn(
        'size-4 shrink-0 rounded-sm border border-input bg-background inline-flex items-center justify-center',
        'transition-colors duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring',
        (isChecked || isIndeterminate) && 'bg-primary border-primary',
        hasError && !isChecked && !isIndeterminate && 'border-destructive',
        hasError && (isChecked || isIndeterminate) && 'bg-destructive border-destructive',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-primary/70',
        className
      )}
    >
      {isChecked && !isIndeterminate && <Check className="size-2.5 text-white" strokeWidth={3} />}
      {isIndeterminate && <Minus className="size-2.5 text-white" strokeWidth={3} />}
      <input
        type="checkbox"
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        value={value}
        checked={isChecked || isIndeterminate}
        required={required}
        readOnly
        className="sr-only"
      />
    </button>
  )
}

export default Checkbox
export { Checkbox }
