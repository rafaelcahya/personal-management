'use client'
import {
  createElement,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
  cloneElement,
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Contexts ─────────────────────────────────────────────────────────────────

const ModalContext = createContext(null)
const ModalVariantContext = createContext({ variant: 'default', borderColor: undefined })

// ─── Class maps ───────────────────────────────────────────────────────────────

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
}

const radiusClasses = {
  none: 'rounded-none',
  xs: 'rounded-sm',
  sm: 'rounded',
  base: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-3xl',
}

const durationPresets = { fast: 100, default: 200, slow: 400, slower: 700 }

function resolveDuration(duration) {
  if (typeof duration === 'string') return durationPresets[duration] ?? 200
  return duration
}

const animationClasses = {
  none: [],
  zoom: [
    'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
  fade: ['data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0'],
  'slide-up': [
    'data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
  'slide-down': [
    'data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
}

const footerLayoutClasses = {
  left: 'flex flex-row flex-wrap gap-2 justify-start',
  right: 'flex flex-row flex-wrap gap-2 justify-end',
  center: 'flex flex-row flex-wrap gap-2 justify-center',
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// ─── Modal (Root) ─────────────────────────────────────────────────────────────

function Modal({ open: controlledOpen, onOpenChange, defaultOpen = false, children }) {
  const isControlled = controlledOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const triggerRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  const setOpen = useCallback(
    (value) => {
      if (!isControlled) setUncontrolledOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  return (
    <ModalContext.Provider value={{ open, setOpen, triggerRef, titleId, descriptionId }}>
      {children}
    </ModalContext.Provider>
  )
}

// ─── ModalTrigger ─────────────────────────────────────────────────────────────

function ModalTrigger({ asChild, children, ...props }) {
  const { setOpen, triggerRef } = useContext(ModalContext)

  if (asChild) {
    return cloneElement(children, {
      ...props,
      ref: triggerRef,
      onClick: (e) => {
        children.props.onClick?.(e)
        props.onClick?.(e)
        setOpen(true)
      },
    })
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      {...props}
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(true)
      }}
    >
      {children}
    </button>
  )
}

// ─── ModalClose ───────────────────────────────────────────────────────────────

function ModalClose({ asChild, children, ...props }) {
  const { setOpen } = useContext(ModalContext)

  if (asChild) {
    return cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e)
        props.onClick?.(e)
        setOpen(false)
      },
    })
  }

  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
}

// ─── ModalOverlay ─────────────────────────────────────────────────────────────

function ModalOverlay({ className, opacity = 50, dataState, onClick }) {
  return (
    <div
      data-state={dataState}
      onClick={onClick}
      style={{ backgroundColor: `rgba(0,0,0,${opacity / 100})` }}
      className={cn(
        'fixed inset-0 z-50 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'duration-200',
        className
      )}
    />
  )
}

// ─── ModalContent ─────────────────────────────────────────────────────────────

function ModalContent({
  className,
  children,
  size = 'md',
  radius = 'lg',
  animation = 'zoom',
  duration = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  overlayOpacity = 50,
  variant = 'default',
  borderColor,
  ...props
}) {
  const { open, setOpen, triggerRef, titleId, descriptionId } = useContext(ModalContext)
  const [isMounted, setIsMounted] = useState(false)
  const [dataState, setDataState] = useState('closed')
  const panelRef = useRef(null)
  const resolvedDuration = resolveDuration(duration)

  // Mount/unmount with animation timing
  useEffect(() => {
    if (open) {
      setIsMounted(true)
      // Double rAF ensures element is in DOM before open animation starts
      requestAnimationFrame(() => requestAnimationFrame(() => setDataState('open')))
    } else {
      setDataState('closed')
      const delay = animation === 'none' ? 0 : resolvedDuration
      const t = setTimeout(() => setIsMounted(false), delay)
      return () => clearTimeout(t)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isMounted ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMounted])

  // Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  // Focus trap
  useEffect(() => {
    if (!open || !isMounted || !panelRef.current) return
    const panel = panelRef.current
    const getFocusable = () => [...panel.querySelectorAll(FOCUSABLE)]

    panel.focus()

    const onTab = (e) => {
      if (e.key !== 'Tab') return
      const els = getFocusable()
      if (!els.length) return
      if (e.shiftKey) {
        if (document.activeElement === els[0]) {
          e.preventDefault()
          els[els.length - 1].focus()
        }
      } else {
        if (document.activeElement === els[els.length - 1]) {
          e.preventDefault()
          els[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onTab)
    return () => document.removeEventListener('keydown', onTab)
  }, [open, isMounted])

  // Restore focus to trigger on close
  useEffect(() => {
    if (!open) triggerRef?.current?.focus()
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isMounted || typeof document === 'undefined') return null

  return createPortal(
    <ModalVariantContext.Provider value={{ variant, borderColor }}>
      <ModalOverlay
        dataState={dataState}
        opacity={overlayOpacity}
        onClick={closeOnOverlayClick ? () => setOpen(false) : undefined}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          data-state={dataState}
          style={animation !== 'none' ? { animationDuration: `${resolvedDuration}ms` } : undefined}
          className={cn(
            'pointer-events-auto relative',
            'w-full bg-background border border-slate-100 shadow-xl',
            'flex flex-col',
            variant === 'default' && 'gap-3 p-4 overflow-y-auto',
            variant === 'bordered' && 'gap-0 p-0 overflow-hidden',
            animation !== 'none' && 'data-[state=open]:animate-in data-[state=closed]:animate-out',
            ...animationClasses[animation],
            sizeClasses[size],
            radiusClasses[radius],
            className
          )}
          {...props}
        >
          {showCloseButton && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-7 h-7 rounded-md opacity-60 hover:opacity-100 hover:bg-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X size={15} />
              <span className="sr-only">Close</span>
            </button>
          )}
          {children}
        </div>
      </div>
    </ModalVariantContext.Provider>,
    document.body
  )
}

// ─── ModalIcon ────────────────────────────────────────────────────────────────

function ModalIcon({ icon, className, iconClassName }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-9 rounded-lg shrink-0 bg-violet-50',
        className
      )}
    >
      {createElement(icon, {
        className: cn('size-4 text-violet-600', iconClassName),
        'aria-hidden': 'true',
      })}
    </div>
  )
}

// ─── ModalHeader ──────────────────────────────────────────────────────────────

function ModalHeader({ className, layout = 'default', ...props }) {
  const { variant, borderColor } = useContext(ModalVariantContext)
  return (
    <div
      className={cn(
        layout === 'beside' ? 'flex flex-row items-center gap-3' : 'flex flex-col gap-1.5',
        variant === 'bordered' && 'p-4 border-b shrink-0',
        variant === 'bordered' && borderColor,
        className
      )}
      {...props}
    />
  )
}

// ─── ModalHeaderContent ───────────────────────────────────────────────────────

function ModalHeaderContent({ className, ...props }) {
  return <div className={cn('flex flex-col min-w-0 max-w-[75%] flex-1', className)} {...props} />
}

// ─── ModalBody ────────────────────────────────────────────────────────────────

function ModalBody({ className, ...props }) {
  const { variant } = useContext(ModalVariantContext)
  return (
    <div
      className={cn(variant === 'bordered' && 'flex-1 min-h-0 overflow-y-auto p-4', className)}
      {...props}
    />
  )
}

// ─── ModalTitle ───────────────────────────────────────────────────────────────

function ModalTitle({ className, ...props }) {
  const ctx = useContext(ModalContext)
  return (
    <h2
      id={ctx?.titleId}
      className={cn('text-base font-semibold text-slate-800', className)}
      {...props}
    />
  )
}

// ─── ModalDescription ─────────────────────────────────────────────────────────

function ModalDescription({ className, ...props }) {
  const ctx = useContext(ModalContext)
  return (
    <p id={ctx?.descriptionId} className={cn('text-xs text-slate-500', className)} {...props} />
  )
}

// ─── ModalFooter ──────────────────────────────────────────────────────────────

function ModalFooter({ className, layout = 'right', buttonFullWidth = false, ...props }) {
  const { variant, borderColor } = useContext(ModalVariantContext)
  return (
    <div
      className={cn(
        layout === 'center' && buttonFullWidth
          ? 'flex flex-row gap-2 [&>*]:flex-1'
          : footerLayoutClasses[layout],
        variant === 'bordered' && 'border-t px-4 py-2 sm:py-4',
        variant === 'bordered' && borderColor,
        className
      )}
      {...props}
    />
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalBody,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
}
