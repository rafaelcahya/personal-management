'use client'

import { cloneElement, createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

// ─── Context ───────────────────────────────────────────────────────────────────

const HoverCardCtx = createContext(null)
const useHoverCard = () => useContext(HoverCardCtx)

// ─── Floating position hook ────────────────────────────────────────────────────

function useFloating(triggerRef, contentRef, open, side, align, sideOffset, posKey) {
  const [style, setStyle] = useState({
    position: 'fixed',
    visibility: 'hidden',
    top: 0,
    left: 0,
    zIndex: 9999,
  })

  useEffect(() => {
    if (!open || !triggerRef?.current || !contentRef?.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const cr = contentRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const GAP = sideOffset
    const EDGE = 4

    let top, left

    if (side === 'bottom' || side === 'top') {
      let resolvedSide = side
      if (side === 'bottom' && tr.bottom + GAP + cr.height > vh - EDGE) resolvedSide = 'top'
      if (side === 'top' && tr.top - GAP - cr.height < EDGE) resolvedSide = 'bottom'

      top = resolvedSide === 'bottom' ? tr.bottom + GAP : tr.top - GAP - cr.height

      if (align === 'start') left = tr.left
      else if (align === 'center') left = tr.left + tr.width / 2 - cr.width / 2
      else left = tr.right - cr.width

      left = Math.max(EDGE, Math.min(left, vw - cr.width - EDGE))
    } else {
      let resolvedSide = side
      if (side === 'right' && tr.right + GAP + cr.width > vw - EDGE) resolvedSide = 'left'
      if (side === 'left' && tr.left - GAP - cr.width < EDGE) resolvedSide = 'right'

      left = resolvedSide === 'right' ? tr.right + GAP : tr.left - GAP - cr.width

      if (align === 'start') top = tr.top
      else if (align === 'center') top = tr.top + tr.height / 2 - cr.height / 2
      else top = tr.bottom - cr.height

      top = Math.max(EDGE, Math.min(top, vh - cr.height - EDGE))
    }

    setStyle({
      position: 'fixed',
      top: Math.max(EDGE, top),
      left: Math.max(EDGE, left),
      visibility: 'visible',
      zIndex: 9999,
    })
  }, [open, posKey, side, align, sideOffset])

  return style
}

// ─── HoverCard ────────────────────────────────────────────────────────────────

export function HoverCard({
  children,
  open: openProp,
  onOpenChange,
  openDelay = 300,
  closeDelay = 150,
}) {
  const isControlled = openProp !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? openProp : internalOpen
  const triggerRef = useRef(null)
  const openTimerRef = useRef(null)
  const closeTimerRef = useRef(null)

  function setOpen(val) {
    if (!isControlled) setInternalOpen(val)
    onOpenChange?.(val)
  }

  function scheduleOpen() {
    clearTimeout(closeTimerRef.current)
    openTimerRef.current = setTimeout(() => setOpen(true), openDelay)
  }

  function scheduleClose() {
    clearTimeout(openTimerRef.current)
    closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay)
  }

  function cancelClose() {
    clearTimeout(closeTimerRef.current)
  }

  return (
    <HoverCardCtx.Provider
      value={{ open, setOpen, triggerRef, scheduleOpen, scheduleClose, cancelClose }}
    >
      {children}
    </HoverCardCtx.Provider>
  )
}

// ─── HoverCardTrigger ─────────────────────────────────────────────────────────

export function HoverCardTrigger({ children, asChild = false }) {
  const { triggerRef, scheduleOpen, scheduleClose } = useHoverCard()

  const hoverProps = {
    ref: triggerRef,
    onMouseEnter: scheduleOpen,
    onMouseLeave: scheduleClose,
  }

  if (asChild) return cloneElement(children, hoverProps)

  return (
    <span
      ref={triggerRef}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      style={{ display: 'inline-block' }}
    >
      {children}
    </span>
  )
}

// ─── HoverCardContent ─────────────────────────────────────────────────────────

export function HoverCardContent({
  children,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  className,
  ...props
}) {
  const { open, triggerRef, cancelClose, scheduleClose } = useHoverCard()
  const contentRef = useRef(null)
  const [posKey, setPosKey] = useState(0)
  const floatStyle = useFloating(triggerRef, contentRef, open, side, align, sideOffset, posKey)

  useEffect(() => {
    if (!open) return
    const reposition = () => setPosKey((k) => k + 1)
    window.addEventListener('scroll', reposition, { passive: true, capture: true })
    window.addEventListener('resize', reposition, { passive: true })
    return () => {
      window.removeEventListener('scroll', reposition, { capture: true })
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      style={floatStyle}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm outline-none',
        'animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
  )
}
