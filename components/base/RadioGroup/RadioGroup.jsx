'use client'

import { createContext, useContext, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useFieldContentContext } from '../Field/FieldContent'

const RadioGroupCtx = createContext({
  value: '',
  onChange: () => {},
  disabled: false,
  name: undefined,
})

const RadioGroup = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  disabled: disabledProp,
  required,
  name,
  orientation = 'vertical',
  className,
  children,
}) => {
  const ctx = useFieldContentContext()
  const disabled = disabledProp ?? ctx.disabled ?? false

  const isControlled = valueProp !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const value = isControlled ? valueProp : internal

  const onChange = (v) => {
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
  }

  const groupRef = useRef(null)

  const handleKeyDown = (e) => {
    const items = Array.from(
      groupRef.current?.querySelectorAll('[role="radio"]:not([disabled])') ?? []
    )
    if (!items.length) return

    const idx = items.indexOf(document.activeElement)
    const isVertical = orientation === 'vertical'
    const prev = isVertical ? 'ArrowUp' : 'ArrowLeft'
    const next = isVertical ? 'ArrowDown' : 'ArrowRight'

    if (e.key === prev || e.key === next) {
      e.preventDefault()
      const dir = e.key === next ? 1 : -1
      const nextIdx = (idx + dir + items.length) % items.length
      items[nextIdx].focus()
      items[nextIdx].click()
    }
  }

  return (
    <RadioGroupCtx.Provider value={{ value, onChange, disabled, name }}>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-required={required || undefined}
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn('flex flex-col gap-2', className)}
      >
        {children}
      </div>
    </RadioGroupCtx.Provider>
  )
}

const RadioGroupItem = ({
  id: idProp,
  value,
  disabled: disabledProp,
  'aria-invalid': ariaInvalid,
  className,
}) => {
  const { value: groupValue, onChange, disabled: groupDisabled, name } = useContext(RadioGroupCtx)
  const ctx = useFieldContentContext()
  const uid = useId()
  const id = idProp ?? uid

  const disabled = disabledProp || groupDisabled || ctx.disabled
  const checked = groupValue === value
  const hasError = ariaInvalid || ctx.hasError

  return (
    <button
      type="button"
      role="radio"
      id={id}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-invalid={hasError || undefined}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      className={cn(
        'size-4 shrink-0 rounded-full border border-gray-300 bg-white inline-flex items-center justify-center',
        'transition-colors duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600',
        checked && 'border-violet-600',
        hasError && !checked && 'border-red-500',
        hasError && checked && 'border-red-500',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-violet-400',
        className
      )}
    >
      {checked && (
        <span className={cn('size-2 rounded-full', hasError ? 'bg-red-500' : 'bg-violet-600')} />
      )}
      <input
        type="radio"
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        value={value}
        checked={checked}
        readOnly
        disabled={disabled}
        className="sr-only"
      />
    </button>
  )
}

RadioGroup.displayName = 'RadioGroup'
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
export default RadioGroup
