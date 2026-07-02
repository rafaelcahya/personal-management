'use client'

import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────

const TabsCtx = createContext(null)
const useTabs = () => useContext(TabsCtx)

const ListCtx = createContext(null)
const useList = () => useContext(ListCtx)

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export function Tabs({
  children,
  value: valueProp,
  onValueChange,
  defaultValue = '',
  orientation = 'horizontal',
  className,
  ...props
}) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const activeValue = isControlled ? valueProp : internalValue

  function setActiveValue(val) {
    if (!isControlled) setInternalValue(val)
    onValueChange?.(val)
  }

  return (
    <TabsCtx.Provider value={{ activeValue, setActiveValue, orientation }}>
      <div
        data-orientation={orientation}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-row items-start' : 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsCtx.Provider>
  )
}

// ─── TabsList ─────────────────────────────────────────────────────────────────

export function TabsList({ children, variant = 'underline', className, ...props }) {
  const { activeValue, setActiveValue, orientation } = useTabs()
  const listRef = useRef(null)
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const isVertical = orientation === 'vertical'

  // Animate underline indicator to the active tab's position
  useLayoutEffect(() => {
    if (variant !== 'underline' || !listRef.current) return
    const activeEl = listRef.current.querySelector('[data-active="true"]')
    if (!activeEl) return
    if (isVertical) {
      setIndicatorStyle({
        top: 0,
        right: 0,
        width: 2,
        height: activeEl.offsetHeight,
        transform: `translateY(${activeEl.offsetTop}px)`,
      })
    } else {
      setIndicatorStyle({
        bottom: 0,
        left: 0,
        height: 2,
        width: activeEl.offsetWidth,
        transform: `translateX(${activeEl.offsetLeft}px)`,
      })
    }
  }, [activeValue, variant, isVertical])

  function handleKeyDown(e) {
    if (!listRef.current) return
    const tabs = [...listRef.current.querySelectorAll('[role="tab"]:not([disabled])')]
    if (!tabs.length) return
    const currentIndex = tabs.indexOf(document.activeElement)

    let nextIndex = currentIndex

    if ((!isVertical && e.key === 'ArrowRight') || (isVertical && e.key === 'ArrowDown')) {
      e.preventDefault()
      nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
    } else if ((!isVertical && e.key === 'ArrowLeft') || (isVertical && e.key === 'ArrowUp')) {
      e.preventDefault()
      nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = tabs.length - 1
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (currentIndex >= 0) {
        const val = tabs[currentIndex].getAttribute('data-value')
        if (val) setActiveValue(val)
      }
      return
    } else {
      return
    }

    tabs[nextIndex]?.focus()
    const val = tabs[nextIndex]?.getAttribute('data-value')
    if (val) setActiveValue(val)
  }

  return (
    <ListCtx.Provider value={{ variant }}>
      <div
        ref={listRef}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex shrink-0',
          isVertical ? 'flex-col' : 'flex-row',
          variant === 'underline' && !isVertical && 'border-b border-gray-200',
          variant === 'underline' && isVertical && 'border-r border-gray-200 pr-0',
          variant === 'pill' && 'gap-1 p-1 bg-gray-100 rounded-xl',
          className
        )}
        {...props}
      >
        {children}
        {variant === 'underline' && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              backgroundColor: 'rgb(109, 40, 217)',
              borderRadius: 2,
              transition: 'transform 200ms ease, width 200ms ease, height 200ms ease',
              ...indicatorStyle,
            }}
          />
        )}
      </div>
    </ListCtx.Provider>
  )
}

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

export function TabsTrigger({
  children,
  value,
  disabled = false,
  icon: Icon,
  className,
  ...props
}) {
  const { activeValue, setActiveValue } = useTabs()
  const { variant } = useList()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      data-value={value}
      data-active={isActive ? 'true' : undefined}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveValue(value)}
      className={cn(
        'relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-1 rounded-md',
        // underline
        variant === 'underline' && isActive && 'text-violet-700',
        variant === 'underline' && !isActive && !disabled && 'text-gray-500 hover:text-gray-800',
        // pill
        variant === 'pill' && isActive && 'bg-white text-gray-900 shadow-sm',
        variant === 'pill' && !isActive && !disabled && 'text-gray-500 hover:text-gray-700',
        // disabled
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {children}
    </button>
  )
}

// ─── TabsContent ──────────────────────────────────────────────────────────────

export function TabsContent({ children, value, className, ...props }) {
  const { activeValue } = useTabs()
  if (activeValue !== value) return null
  return (
    <div role="tabpanel" className={cn('flex-1 outline-none', className)} {...props}>
      {children}
    </div>
  )
}
