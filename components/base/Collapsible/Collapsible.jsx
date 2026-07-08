'use client'

import { cloneElement, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const CollapsibleCtx = createContext(null)

function Collapsible({ open, onOpenChange, className, id, children }) {
  return (
    <CollapsibleCtx.Provider value={{ open, onOpenChange }}>
      <div data-slot="collapsible" id={id} className={className}>
        {children}
      </div>
    </CollapsibleCtx.Provider>
  )
}

function CollapsibleTrigger({ asChild, className, children, ...props }) {
  const { open, onOpenChange } = useContext(CollapsibleCtx)
  const handleClick = () => onOpenChange?.(!open)

  if (asChild) {
    return cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e)
        handleClick()
      },
    })
  }

  return (
    <button
      data-slot="collapsible-trigger"
      type="button"
      aria-expanded={open}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

function CollapsibleContent({ className, id, children }) {
  const { open } = useContext(CollapsibleCtx)
  return (
    <div
      data-slot="collapsible-content"
      id={id}
      className={cn(
        'grid transition-all duration-200 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        className
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
