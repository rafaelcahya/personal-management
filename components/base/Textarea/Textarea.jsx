'use client'

import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from '../Field/FieldContent'

const textareaVariants = cva(
  [
    'w-full min-w-0 rounded-md border bg-background text-foreground',
    'placeholder:text-muted-foreground',
    'transition-[color,box-shadow,border-color] duration-150',
    'outline-none resize-y',
    'text-sm font-medium px-3 py-2',
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

const Textarea = forwardRef(function Textarea({ variant: variantProp, className, ...props }, ref) {
  const {
    id,
    descriptionId,
    errorId,
    hasError,
    required,
    disabled: ctxDisabled,
  } = useFieldContentContext()

  const isDisabled = ctxDisabled || props.disabled || variantProp === 'disabled'
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  return (
    <textarea
      ref={ref}
      id={id}
      disabled={isDisabled}
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      className={twMerge(
        clsx(textareaVariants({ variant: isDisabled ? 'disabled' : resolvedVariant }), className)
      )}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
