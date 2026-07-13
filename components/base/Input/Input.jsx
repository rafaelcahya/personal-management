'use client'

import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from '../Field/FieldContent'
import { useFieldControlContext } from '../Field/FieldControl'

const inputVariants = cva(
  [
    'w-full min-w-0 h-8 px-3 rounded-md border bg-background text-foreground',
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
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Input = forwardRef(function Input({ variant: variantProp, className, ...props }, ref) {
  const {
    id,
    descriptionId,
    errorId,
    hasError,
    required,
    disabled: ctxDisabled,
  } = useFieldContentContext()
  const { hasPrefix, hasSuffix } = useFieldControlContext()

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
          inputVariants({ variant: isDisabled ? 'disabled' : resolvedVariant }),
          hasPrefix && 'pl-9',
          hasSuffix && 'pr-9',
          className
        )
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
