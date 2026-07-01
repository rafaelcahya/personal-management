'use client'

import { cloneElement, createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

// ─── Context ───────────────────────────────────────────────────────────────────

const PopoverCtx = createContext(null)
const usePopover = () => useContext(PopoverCtx)

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

// ─── Popover ───────────────────────────────────────────────────────────────────

export function Popover({ children, open: openProp, onOpenChange, defaultOpen = false }) {
  const isControlled = openProp !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = isControlled ? openProp : internalOpen
  const triggerRef = useRef(null)

  function setOpen(val) {
    if (!isControlled) setInternalOpen(val)
    onOpenChange?.(val)
  }

  return <PopoverCtx.Provider value={{ open, setOpen, triggerRef }}>{children}</PopoverCtx.Provider>
}

// ─── PopoverTrigger ────────────────────────────────────────────────────────────

export function PopoverTrigger({ children, asChild = false }) {
  const { open, setOpen, triggerRef } = usePopover()

  const props = {
    ref: triggerRef,
    'aria-expanded': open,
    'aria-haspopup': 'dialog',
    onClick: () => setOpen(!open),
  }

  if (asChild) return cloneElement(children, props)

  return (
    <span ref={triggerRef} style={{ display: 'inline-block' }} onClick={() => setOpen(!open)}>
      {children}
    </span>
  )
}

// ─── PopoverContent ────────────────────────────────────────────────────────────

export function PopoverContent({
  children,
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  className,
  ...props
}) {
  const { open, setOpen, triggerRef } = usePopover()
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

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!contentRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      role="dialog"
      style={floatStyle}
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

// ─── PopoverClose ──────────────────────────────────────────────────────────────

export function PopoverClose({ children, asChild = false, className, ...props }) {
  const { setOpen } = usePopover()

  if (asChild) return cloneElement(children, { onClick: () => setOpen(false) })

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={cn(
        'inline-flex items-center justify-center rounded text-gray-400 hover:text-gray-600 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
