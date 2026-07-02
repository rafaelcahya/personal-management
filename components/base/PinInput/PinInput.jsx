'use client'

import { forwardRef, useRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFieldContentContext } from '../Field/FieldContent'

// ─── Styles ───────────────────────────────────────────────────────────────────

const cellSizeMap = {
  xs: 'h-8 w-8 text-sm',
  sm: 'h-9 w-9 text-sm',
  base: 'h-10 w-10 text-base',
  md: 'h-11 w-11 text-base',
  lg: 'h-12 w-12 text-lg',
}

const cellVariants = cva(
  [
    'rounded-md border bg-background text-foreground text-center font-semibold',
    'transition-[color,box-shadow,border-color] duration-150',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600',
    'selection:bg-violet-500 selection:text-white',
  ],
  {
    variants: {
      variant: {
        default: 'border-input',
        error:
          'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
        disabled: 'border-input opacity-50 cursor-not-allowed pointer-events-none bg-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

// ─── Component ────────────────────────────────────────────────────────────────

const PinInput = forwardRef(function PinInput(
  {
    length = 6,
    value = '',
    onChange,
    disabled: disabledProp,
    variant: variantProp,
    size: sizeProp,
    className,
    ...props
  },
  ref
) {
  const { hasError, disabled: ctxDisabled, size: ctxSize } = useFieldContentContext()

  const resolvedSize = sizeProp ?? ctxSize ?? 'base'
  const isDisabled = ctxDisabled || disabledProp
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  const cells = Array.from({ length }, (_, i) => value[i] ?? '')
  const inputsRef = useRef([])

  function handleChange(index, e) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    const next = cells.slice()
    next[index] = digit
    onChange?.(next.join(''))
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (cells[index]) {
        const next = cells.slice()
        next[index] = ''
        onChange?.(next.join(''))
      } else if (index > 0) {
        const next = cells.slice()
        next[index - 1] = ''
        onChange?.(next.join(''))
        inputsRef.current[index - 1]?.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = cells.slice()
    pasted.split('').forEach((ch, i) => {
      next[i] = ch
    })
    onChange?.(next.join(''))
    const focusIndex = Math.min(pasted.length, length - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  function handleClick(index) {
    inputsRef.current[index]?.select()
  }

  return (
    <div className={cn('flex gap-2', className)} {...props}>
      {cells.map((char, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
            // Forward ref to first cell so react-hook-form can call .focus()
            if (i === 0 && ref) {
              if (typeof ref === 'function') ref(el)
              else ref.current = el
            }
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={char}
          disabled={isDisabled}
          aria-label={`PIN digit ${i + 1} of ${length}`}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onClick={() => handleClick(i)}
          className={cn(
            cellVariants({ variant: isDisabled ? 'disabled' : resolvedVariant }),
            cellSizeMap[resolvedSize] ?? cellSizeMap.base
          )}
        />
      ))}
    </div>
  )
})

PinInput.displayName = 'PinInput'

export default PinInput
