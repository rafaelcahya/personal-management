'use client'

import { useState, useId } from 'react'
import { cn } from '@/lib/utils'
import { useFieldContentContext } from '../Field/FieldContent'

const Switch = ({
  id: idProp,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled: disabledProp,
  required,
  name,
  value = 'on',
  theme = 'pill',
  className,
}) => {
  const ctx = useFieldContentContext()
  const uid = useId()
  const id = idProp ?? uid
  const disabled = disabledProp ?? ctx.disabled ?? false

  const isControlled = checkedProp !== undefined
  const [internal, setInternal] = useState(defaultChecked)
  const checked = isControlled ? checkedProp : internal

  const toggle = () => {
    if (disabled) return
    const next = !checked
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
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
        'relative shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200',
        theme === 'pill' && [
          'h-5 w-9 rounded-full border-2 border-transparent transition-colors duration-200',
          checked ? 'bg-violet-600' : 'bg-gray-200',
        ],
        theme === 'track' && ['h-6 w-9 flex items-center'],
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )}
    >
      {theme === 'pill' && (
        <span
          className={cn(
            'block size-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      )}

      {theme === 'track' && (
        <>
          <span
            className={cn(
              'absolute inset-x-1 h-2.5 rounded-full transition-colors duration-200',
              checked ? 'bg-violet-400' : 'bg-gray-300'
            )}
          />
          <span
            className={cn(
              'relative size-4 rounded-full shadow-md transition-all duration-200 z-10',
              checked ? 'translate-x-5 bg-violet-600' : 'translate-x-0 bg-gray-400'
            )}
          />
        </>
      )}

      <input
        type="checkbox"
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        value={value}
        checked={checked}
        required={required}
        readOnly
        className="sr-only"
      />
    </button>
  )
}

Switch.displayName = 'Switch'

export default Switch
export { Switch }
