'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from '../Field/FieldContent'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractText(node) {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (React.isValidElement(node)) return extractText(node.props?.children)
  return ''
}

function buildLabelMap(children) {
  const map = {}
  function scan(nodes) {
    React.Children.forEach(nodes, (child) => {
      if (!React.isValidElement(child)) return
      if (child.type?.displayName === 'SelectItem' && child.props.value != null) {
        map[child.props.value] = extractText(child.props.children)
      } else {
        scan(child.props?.children)
      }
    })
  }
  scan(children)
  return map
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SelectCtx = createContext(null)
const useSelectCtx = () => useContext(SelectCtx)

// ─── Trigger variants ─────────────────────────────────────────────────────────

const triggerVariants = cva(
  [
    'flex w-full items-center justify-between gap-2 whitespace-nowrap',
    'h-8 px-3 rounded-md border bg-background text-foreground',
    'text-sm font-medium',
    'cursor-pointer',
    'transition-[color,box-shadow,border-color] duration-150',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600',
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
    },
    defaultVariants: { variant: 'default' },
  }
)

// ─── Select (root) ────────────────────────────────────────────────────────────

function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  open: openProp,
  onOpenChange,
  children,
}) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [internalOpen, setInternalOpen] = useState(false)
  const triggerRef = useRef(null)

  const value = isControlled ? valueProp : internalValue
  const open = openProp !== undefined ? openProp : internalOpen

  const setOpen = useCallback(
    (next) => {
      setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  const handleValueChange = useCallback(
    (newVal) => {
      if (!isControlled) setInternalValue(newVal)
      onValueChange?.(newVal)
      setInternalOpen(false)
      onOpenChange?.(false)
    },
    [isControlled, onValueChange, onOpenChange]
  )

  const labelMap = buildLabelMap(children)

  return (
    <SelectCtx.Provider
      value={{ value, open, setOpen, handleValueChange, disabled, triggerRef, labelMap }}
    >
      {children}
    </SelectCtx.Provider>
  )
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

const SelectTrigger = forwardRef(function SelectTrigger(
  { variant: variantProp, className, children, ...props },
  ref
) {
  const {
    id,
    descriptionId,
    errorId,
    hasError,
    required,
    disabled: ctxDisabled,
  } = useFieldContentContext()

  const { open, setOpen, disabled: selectDisabled, triggerRef } = useSelectCtx()

  const isDisabled = ctxDisabled || selectDisabled || props.disabled || variantProp === 'disabled'
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  const setRefs = useCallback(
    (node) => {
      triggerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref, triggerRef]
  )

  return (
    <button
      ref={setRefs}
      type="button"
      data-slot="select-trigger"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
      disabled={isDisabled}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen(true)
        }
        if (e.key === 'Escape') setOpen(false)
      }}
      className={twMerge(clsx(triggerVariants({ variant: resolvedVariant }), className))}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 opacity-50" aria-hidden="true" />
    </button>
  )
})

SelectTrigger.displayName = 'SelectTrigger'

// ─── SelectValue ──────────────────────────────────────────────────────────────

function SelectValue({ placeholder, children }) {
  const { value, labelMap } = useSelectCtx()

  const label = children ?? labelMap[value] ?? ''

  if (!label) {
    return (
      <span className="text-muted-foreground pointer-events-none select-none">
        {placeholder ?? ''}
      </span>
    )
  }

  return <span>{label}</span>
}

SelectValue.displayName = 'SelectValue'

// ─── SelectContent ────────────────────────────────────────────────────────────

function SelectContent({ className, children, position = 'popper' }) {
  const { open, setOpen, triggerRef } = useSelectCtx()
  const [mounted, setMounted] = useState(false)
  const [triggerRect, setTriggerRect] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
  }, [open, triggerRef])

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, setOpen, triggerRef])

  // Close on scroll or resize (but not when scrolling inside the content itself)
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (contentRef.current?.contains(e.target)) return
      setOpen(false)
    }
    window.addEventListener('scroll', handler, true)
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler, true)
      window.removeEventListener('resize', handler)
    }
  }, [open, setOpen])

  if (!mounted || !open || !triggerRect) return null

  return createPortal(
    <div
      ref={contentRef}
      role="listbox"
      data-slot="select-content"
      style={{
        position: 'fixed',
        top: triggerRect.bottom + 4,
        left: triggerRect.left,
        minWidth: triggerRect.width,
        zIndex: 9999,
      }}
      className={twMerge(
        clsx(
          'bg-popover text-popover-foreground',
          'min-w-[8rem] overflow-hidden rounded-md border shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          className
        )
      )}
    >
      <div className="p-1 max-h-[264px] overflow-y-auto">{children}</div>
    </div>,
    document.body
  )
}

SelectContent.displayName = 'SelectContent'

// ─── SelectItem ───────────────────────────────────────────────────────────────

function SelectItem({ className, children, value, disabled, ...props }) {
  const { value: selectedValue, handleValueChange } = useSelectCtx()
  const isSelected = selectedValue === value

  return (
    <div
      role="option"
      data-slot="select-item"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      onClick={() => !disabled && handleValueChange(value)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault()
          handleValueChange(value)
        }
      }}
      tabIndex={disabled ? -1 : 0}
      className={twMerge(
        clsx(
          'relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2',
          'text-sm outline-none select-none',
          'focus:bg-accent focus:text-accent-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          className
        )
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <Check className="size-4" />}
      </span>
      {children}
    </div>
  )
}

SelectItem.displayName = 'SelectItem'

// ─── SelectGroup ──────────────────────────────────────────────────────────────

function SelectGroup({ children, ...props }) {
  return (
    <div role="group" data-slot="select-group" {...props}>
      {children}
    </div>
  )
}

SelectGroup.displayName = 'SelectGroup'

// ─── SelectLabel ──────────────────────────────────────────────────────────────

function SelectLabel({ className, ...props }) {
  return (
    <div
      data-slot="select-label"
      className={twMerge(clsx('text-muted-foreground px-2 py-1.5 text-xs', className))}
      {...props}
    />
  )
}

SelectLabel.displayName = 'SelectLabel'

// ─── SelectSeparator ─────────────────────────────────────────────────────────

function SelectSeparator({ className, ...props }) {
  return (
    <div
      data-slot="select-separator"
      className={twMerge(clsx('bg-border pointer-events-none -mx-1 my-1 h-px', className))}
      {...props}
    />
  )
}

SelectSeparator.displayName = 'SelectSeparator'

// ─── Exports ──────────────────────────────────────────────────────────────────

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
