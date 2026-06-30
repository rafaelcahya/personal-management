'use client'

import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from '../Field/FieldContent'
import { useFieldControlContext } from '../Field/FieldControl'

const inputVariants = cva(
  [
    'w-full min-w-0 rounded-md border bg-background text-foreground',
    'placeholder:text-muted-foreground',
    'transition-[color,box-shadow,border-color] duration-150',
    'outline-none',
    'text-sm font-medium',
    'selection:bg-violet-500 selection:text-white',
    'focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600',
  ],
  {
    variants: {
      variant: {
        default: 'border-input',
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
    defaultVariants: {
      variant: 'default',
      size: 'base',
    },
  }
)

const prefixPaddingMap = {
  xs: 'pl-7',
  sm: 'pl-8',
  base: 'pl-9',
  md: 'pl-10',
  lg: 'pl-11',
}

const suffixPaddingMap = {
  xs: 'pr-7',
  sm: 'pr-8',
  base: 'pr-9',
  md: 'pr-10',
  lg: 'pr-11',
}

const Input = forwardRef(function Input(
  { variant: variantProp, size: sizeProp, className, ...props },
  ref
) {
  const {
    id,
    descriptionId,
    errorId,
    hasError,
    required,
    disabled: ctxDisabled,
    size: ctxSize,
  } = useFieldContentContext()
  const { hasPrefix, hasSuffix } = useFieldControlContext()

  const resolvedSize = sizeProp ?? ctxSize ?? 'base'
  const isDisabled = ctxDisabled || props.disabled || variantProp === 'disabled'
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  return (
    <input
      ref={ref}
      id={id}
      disabled={isDisabled}
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      className={twMerge(
        clsx(
          inputVariants({ variant: isDisabled ? 'disabled' : resolvedVariant, size: resolvedSize }),
          hasPrefix && prefixPaddingMap[resolvedSize],
          hasSuffix && suffixPaddingMap[resolvedSize],
          className
        )
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
