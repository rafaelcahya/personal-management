'use client'

import { forwardRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from '../Field/FieldContent'

// ─── Trigger variants ─────────────────────────────────────────────────────────

const triggerVariants = cva(
  [
    'flex w-full items-center justify-between gap-2 whitespace-nowrap',
    'rounded-md border bg-background text-foreground',
    'text-sm font-medium',
    'cursor-pointer',
    'transition-[color,box-shadow,border-color] duration-150',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600',
    'data-[placeholder]:text-muted-foreground',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
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

// ─── Select (root) ────────────────────────────────────────────────────────────

function Select({ ...props }) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

const SelectTrigger = forwardRef(function SelectTrigger(
  { variant: variantProp, size: sizeProp, className, children, ...props },
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

  const resolvedSize = sizeProp ?? ctxSize ?? 'base'
  const isDisabled = ctxDisabled || props.disabled || variantProp === 'disabled'
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      id={id}
      disabled={isDisabled}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
      className={twMerge(
        clsx(triggerVariants({ variant: resolvedVariant, size: resolvedSize }), className)
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})

SelectTrigger.displayName = 'SelectTrigger'

// ─── SelectValue ──────────────────────────────────────────────────────────────

function SelectValue({ ...props }) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

// ─── SelectContent ────────────────────────────────────────────────────────────

function SelectContent({ className, children, position = 'popper', ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={twMerge(
          clsx(
            'bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
            className
          )
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={clsx(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// ─── SelectItem ───────────────────────────────────────────────────────────────

function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={twMerge(
        clsx(
          'focus:bg-accent focus:text-accent-foreground',
          'relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2',
          'text-sm outline-none select-none',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

// ─── SelectGroup ──────────────────────────────────────────────────────────────

function SelectGroup({ ...props }) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

// ─── SelectLabel ──────────────────────────────────────────────────────────────

function SelectLabel({ className, ...props }) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={twMerge(clsx('text-muted-foreground px-2 py-1.5 text-xs', className))}
      {...props}
    />
  )
}

// ─── SelectSeparator ─────────────────────────────────────────────────────────

function SelectSeparator({ className, ...props }) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={twMerge(clsx('bg-border pointer-events-none -mx-1 my-1 h-px', className))}
      {...props}
    />
  )
}

// ─── Scroll buttons ───────────────────────────────────────────────────────────

function SelectScrollUpButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={twMerge(clsx('flex cursor-default items-center justify-center py-1', className))}
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={twMerge(clsx('flex cursor-default items-center justify-center py-1', className))}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
}
