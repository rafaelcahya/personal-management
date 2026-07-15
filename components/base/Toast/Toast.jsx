'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const variantClasses = {
  default: 'bg-white border-slate-200 text-slate-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  danger: 'bg-red-50 border-red-200 text-red-900',
}

const actionVariantClasses = {
  default: 'border-slate-300 hover:bg-slate-100 text-slate-700',
  info: 'border-blue-300 hover:bg-blue-100 text-blue-700',
  success: 'border-emerald-300 hover:bg-emerald-100 text-emerald-700',
  warning: 'border-amber-300 hover:bg-amber-100 text-amber-700',
  danger: 'border-red-300 hover:bg-red-100 text-red-700',
}

const viewportPositionClasses = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
}

const slideEnter = {
  'top-left': 'slide-in-from-left-4',
  'top-center': 'slide-in-from-top-4',
  'top-right': 'slide-in-from-right-4',
  'bottom-left': 'slide-in-from-left-4',
  'bottom-center': 'slide-in-from-bottom-4',
  'bottom-right': 'slide-in-from-right-4',
}

const slideExit = {
  'top-left': 'slide-out-to-left-full',
  'top-center': 'slide-out-to-top-full',
  'top-right': 'slide-out-to-right-full',
  'bottom-left': 'slide-out-to-left-full',
  'bottom-center': 'slide-out-to-bottom-full',
  'bottom-right': 'slide-out-to-right-full',
}

const ANIM_MS = 300

const ToastPositionContext = createContext('bottom-right')
// holds the <ol> viewport DOM node — Toast portals into it
const ToastViewportContext = createContext({ viewportEl: null, setViewportEl: () => {} })
const ToastCloseContext = createContext(null)

function ToastProvider({ children, position = 'bottom-right' }) {
  const [viewportEl, setViewportEl] = useState(null)
  return (
    <ToastPositionContext.Provider value={position}>
      <ToastViewportContext.Provider value={{ viewportEl, setViewportEl }}>
        {children}
      </ToastViewportContext.Provider>
    </ToastPositionContext.Provider>
  )
}

function ToastViewport({ className, ...props }) {
  const position = useContext(ToastPositionContext)
  const { setViewportEl } = useContext(ToastViewportContext)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <ol
      ref={setViewportEl}
      role="region"
      aria-label="Notifications"
      className={cn(
        'fixed z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)] m-0 p-0 list-none outline-none pointer-events-none',
        viewportPositionClasses[position] ?? viewportPositionClasses['bottom-right'],
        className
      )}
      {...props}
    />,
    document.body
  )
}

function Toast({
  className,
  variant = 'default',
  animation = 'slide-fade',
  duration = 5000,
  onOpenChange,
  children,
  ...props
}) {
  const position = useContext(ToastPositionContext)
  const { viewportEl } = useContext(ToastViewportContext)
  const [phase, setPhase] = useState('open')
  const [alive, setAlive] = useState(true)
  const [swipeX, setSwipeX] = useState(0)
  const swipeStart = useRef(null)
  const closeRef = useRef(null)

  closeRef.current = () => {
    if (phase !== 'open') return
    setPhase('closing')
    setTimeout(() => {
      setAlive(false)
      onOpenChange?.(false)
    }, ANIM_MS)
  }

  useEffect(() => {
    if (duration === Infinity) return
    const t = setTimeout(() => closeRef.current?.(), duration)
    return () => clearTimeout(t)
  }, [duration])

  const onPointerDown = (e) => {
    swipeStart.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (swipeStart.current == null) return
    const dx = e.clientX - swipeStart.current
    if (dx > 0) setSwipeX(dx)
  }

  const onPointerUp = (e) => {
    if (swipeStart.current == null) return
    const dx = e.clientX - swipeStart.current
    swipeStart.current = null
    if (dx > 80) {
      closeRef.current?.()
    } else {
      setSwipeX(0)
    }
  }

  if (!alive || !viewportEl) return null

  const enter = slideEnter[position] ?? 'slide-in-from-bottom-4'
  const exit = slideExit[position] ?? 'slide-out-to-right-full'

  const animClasses =
    {
      'slide-fade':
        phase === 'open'
          ? `animate-in ${enter} fade-in-0 duration-300`
          : `animate-out ${exit} fade-out-0 duration-300`,
      slide:
        phase === 'open' ? `animate-in ${enter} duration-300` : `animate-out ${exit} duration-300`,
      fade:
        phase === 'open'
          ? 'animate-in fade-in-0 duration-300'
          : 'animate-out fade-out-0 duration-300',
      none: '',
    }[animation] ?? ''

  return createPortal(
    <ToastCloseContext.Provider value={() => closeRef.current()}>
      <li
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={swipeX ? { transform: `translateX(${swipeX}px)` } : undefined}
        className={cn(
          'relative flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-sm text-sm pointer-events-auto',
          animClasses,
          variantClasses[variant] ?? variantClasses.default,
          className
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        {...props}
      >
        {children}
      </li>
    </ToastCloseContext.Provider>,
    viewportEl
  )
}

function ToastTitle({ className, ...props }) {
  return <p className={cn('font-semibold leading-snug', className)} {...props} />
}

function ToastDescription({ className, ...props }) {
  return <p className={cn('text-xs opacity-80 leading-relaxed', className)} {...props} />
}

function ToastAction({
  className,
  variant = 'default',
  position = 'inline',
  altText,
  children,
  ...props
}) {
  const buttonClass = cn(
    'inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium transition-colors shrink-0',
    actionVariantClasses[variant] ?? actionVariantClasses.default,
    className
  )

  if (position === 'stacked-left' || position === 'stacked-right') {
    return (
      <div
        className={cn(
          'order-1 basis-full flex',
          position === 'stacked-right' ? 'justify-end' : 'justify-start'
        )}
      >
        <button type="button" aria-label={altText} className={buttonClass} {...props}>
          {children}
        </button>
      </div>
    )
  }

  return (
    <button type="button" aria-label={altText} className={buttonClass} {...props}>
      {children}
    </button>
  )
}

function ToastClose({ className, ...props }) {
  const close = useContext(ToastCloseContext)
  return (
    <button
      type="button"
      onClick={close}
      className={cn(
        'shrink-0 self-start rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity',
        className
      )}
      aria-label="Close"
      {...props}
    >
      <X className="size-3.5" />
    </button>
  )
}

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
}
