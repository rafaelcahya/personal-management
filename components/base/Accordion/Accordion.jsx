'use client'

import { createContext, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Contexts ─────────────────────────────────────────────────────────────────

const AccordionCtx = createContext(null)
const AccordionVariantCtx = createContext('default')
const AccordionItemCtx = createContext(null)

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({
  type = 'single',
  collapsible = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  variant = 'default',
  className,
  children,
}) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(() => {
    if (defaultValue !== undefined) return defaultValue
    return type === 'multiple' ? [] : null
  })
  const value = isControlled ? valueProp : internalValue

  function toggle(itemValue) {
    let next
    if (type === 'multiple') {
      const arr = Array.isArray(value) ? value : []
      next = arr.includes(itemValue) ? arr.filter((v) => v !== itemValue) : [...arr, itemValue]
    } else {
      next = value === itemValue ? (collapsible ? null : itemValue) : itemValue
    }
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  function isOpen(itemValue) {
    if (type === 'multiple') return Array.isArray(value) && value.includes(itemValue)
    return value === itemValue
  }

  return (
    <AccordionCtx.Provider value={{ toggle, isOpen }}>
      <AccordionVariantCtx.Provider value={variant}>
        <div
          data-slot="accordion"
          className={cn(variant === 'card' && 'flex flex-col gap-2', className)}
        >
          {children}
        </div>
      </AccordionVariantCtx.Provider>
    </AccordionCtx.Provider>
  )
}

// ─── AccordionItem ────────────────────────────────────────────────────────────

function AccordionItem({ value, className, children }) {
  const { isOpen } = useContext(AccordionCtx)
  const variant = useContext(AccordionVariantCtx)
  const open = isOpen(value)

  return (
    <AccordionItemCtx.Provider value={{ value, open }}>
      <div
        data-slot="accordion-item"
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'border-b',
          variant === 'card' &&
            'border-b-0 rounded-xl border shadow-sm overflow-hidden bg-card w-full',
          className
        )}
      >
        {children}
      </div>
    </AccordionItemCtx.Provider>
  )
}

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

function AccordionTrigger({ className, children, ...props }) {
  const { toggle } = useContext(AccordionCtx)
  const { value, open } = useContext(AccordionItemCtx)
  const variant = useContext(AccordionVariantCtx)

  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      onClick={() => toggle(value)}
      className={cn(
        'flex w-full text-left items-center justify-between py-4 font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
        variant === 'card' && 'px-6',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </button>
  )
}

// ─── AccordionContent ─────────────────────────────────────────────────────────

function AccordionContent({ className, children, ...props }) {
  const { open } = useContext(AccordionItemCtx)
  const variant = useContext(AccordionVariantCtx)

  return (
    <div
      data-slot="accordion-content"
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'grid transition-all duration-200 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
    >
      <div className="overflow-hidden">
        <div className={cn('text-sm', variant === 'card' && 'pb-6', className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
