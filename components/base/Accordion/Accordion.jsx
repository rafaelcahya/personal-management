'use client'

import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import {
  Accordion as AccordionUI,
  AccordionItem as AccordionItemUI,
  AccordionTrigger as AccordionTriggerUI,
  AccordionContent as AccordionContentUI,
} from '@/components/ui/accordion'

const AccordionVariantContext = createContext('default')

function Accordion({ variant = 'default', className, ...props }) {
  return (
    <AccordionVariantContext.Provider value={variant}>
      <AccordionUI
        className={cn(variant === 'card' && 'flex flex-col gap-2', className)}
        {...props}
      />
    </AccordionVariantContext.Provider>
  )
}

function AccordionItem({ className, ...props }) {
  const variant = useContext(AccordionVariantContext)
  return (
    <AccordionItemUI
      className={cn(
        variant === 'card' && 'border-b-0 rounded-xl border shadow-sm overflow-hidden bg-card',
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({ className, ...props }) {
  const variant = useContext(AccordionVariantContext)
  return <AccordionTriggerUI className={cn(variant === 'card' && 'px-6', className)} {...props} />
}

function AccordionContent({ className, ...props }) {
  const variant = useContext(AccordionVariantContext)
  return (
    <AccordionContentUI className={cn(variant === 'card' && 'px-6 pb-6', className)} {...props} />
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
