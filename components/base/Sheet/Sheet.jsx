'use client'

import { cloneElement, createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

// ─── Context ───────────────────────────────────────────────────────────────────

const SheetCtx = createContext(null)
const useSheet = () => useContext(SheetCtx)

// ─── Focus trap ────────────────────────────────────────────────────────────────

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// ─── Size + side maps ──────────────────────────────────────────────────────────

const widthMap = { sm: '320px', default: '400px', lg: '540px', full: '100vw' }
const heightMap = { sm: '200px', default: '300px', lg: '400px', full: '100vh' }

const innerBorderMap = {
  right: 'border-l',
  left: 'border-r',
  top: 'border-b',
  bottom: 'border-t',
}

function getSideStyle(side, size) {
  const w = widthMap[size] ?? widthMap.default
  const h = heightMap[size] ?? heightMap.default
  const base = { position: 'fixed', zIndex: 10000 }
  if (side === 'right') return { ...base, right: 0, top: 0, bottom: 0, width: w }
  if (side === 'left') return { ...base, left: 0, top: 0, bottom: 0, width: w }
  if (side === 'top') return { ...base, top: 0, left: 0, right: 0, height: h }
  return { ...base, bottom: 0, left: 0, right: 0, height: h }
}

function getHiddenTransform(side) {
  if (side === 'right') return 'translateX(100%)'
  if (side === 'left') return 'translateX(-100%)'
  if (side === 'top') return 'translateY(-100%)'
  return 'translateY(100%)'
}

// ─── Sheet ────────────────────────────────────────────────────────────────────

export function Sheet({ children, open: openProp, onOpenChange, defaultOpen = false }) {
  const isControlled = openProp !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = isControlled ? openProp : internalOpen

  function setOpen(val) {
    if (!isControlled) setInternalOpen(val)
    onOpenChange?.(val)
  }

  return <SheetCtx.Provider value={{ open, setOpen }}>{children}</SheetCtx.Provider>
}

// ─── SheetTrigger ─────────────────────────────────────────────────────────────

export function SheetTrigger({ children, asChild = false }) {
  const { setOpen } = useSheet()
  if (asChild) return cloneElement(children, { onClick: () => setOpen(true) })
  return (
    <span onClick={() => setOpen(true)} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}

// ─── SheetClose ───────────────────────────────────────────────────────────────

export function SheetClose({ children, asChild = false, className, ...props }) {
  const { setOpen } = useSheet()
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

// ─── SheetOverlay ─────────────────────────────────────────────────────────────

export function SheetOverlay({ className, opacity = 50, style, ...props }) {
  return (
    <div
      style={{
        backgroundColor: `rgba(0,0,0,${opacity / 100})`,
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        ...style,
      }}
      className={cn('backdrop-blur-sm', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

// ─── SheetContent ─────────────────────────────────────────────────────────────

export function SheetContent({
  children,
  side = 'right',
  size = 'default',
  animation = 'slide',
  closeOnOverlayClick = true,
  className,
  ...props
}) {
  const { open, setOpen } = useSheet()
  const contentRef = useRef(null)
  const prevFocusRef = useRef(null)
  const [mounted, setMounted] = useState(open)
  const [show, setShow] = useState(open)

  // Scroll lock + save focus (both animation modes)
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      prevFocusRef.current?.focus()
    }
  }, [open])

  // Mount (slide mode only — 'none' renders directly from open)
  useEffect(() => {
    if (animation !== 'slide') return
    if (open) setMounted(true)
  }, [open, animation])

  // Trigger show after element is painted in its off-screen position (slide mode only)
  useEffect(() => {
    if (animation !== 'slide' || !mounted) return
    if (open) {
      const id = setTimeout(() => setShow(true), 0)
      return () => clearTimeout(id)
    } else {
      setShow(false)
    }
  }, [open, mounted, animation])

  // Auto-focus first focusable element
  useEffect(() => {
    const isVisible = animation === 'none' ? open : show
    if (isVisible && contentRef.current) {
      const first = contentRef.current.querySelector(FOCUSABLE)
      first?.focus()
    }
  }, [open, show, animation])

  // Escape key + focus trap (both animation modes)
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key === 'Tab' && contentRef.current) {
        const els = [...contentRef.current.querySelectorAll(FOCUSABLE)]
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  function handleTransitionEnd() {
    if (!open) setMounted(false)
  }

  const panelClass = cn('flex flex-col shadow-xl border-slate-200', innerBorderMap[side], className)
  const panelBaseStyle = {
    ...getSideStyle(side, size),
    overflowY: 'auto',
    backgroundColor: 'white',
  }

  // animation='none': simple instant show/hide
  if (animation === 'none') {
    if (!open) return null
    return createPortal(
      <>
        <SheetOverlay onClick={closeOnOverlayClick ? () => setOpen(false) : undefined} />
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          style={panelBaseStyle}
          className={panelClass}
          {...props}
        >
          {children}
        </div>
      </>,
      document.body
    )
  }

  // animation='slide' (default): mount → paint off-screen → transition to 0
  if (!mounted) return null
  return createPortal(
    <>
      <SheetOverlay
        onClick={() => setOpen(false)}
        style={{ opacity: show ? 1 : 0, transition: 'opacity 300ms ease' }}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        style={{
          ...panelBaseStyle,
          transform: show ? 'translate(0)' : getHiddenTransform(side),
          transition: 'transform 300ms ease',
        }}
        onTransitionEnd={handleTransitionEnd}
        className={panelClass}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

export function SheetHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1.5 px-6 pt-6 pb-4', className)} {...props} />
}

export function SheetTitle({ className, ...props }) {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900 leading-none', className)} {...props} />
  )
}

export function SheetDescription({ className, ...props }) {
  return <p className={cn('text-sm text-gray-500', className)} {...props} />
}

export function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 pb-6 pt-4 mt-auto border-t border-gray-100',
        className
      )}
      {...props}
    />
  )
}
