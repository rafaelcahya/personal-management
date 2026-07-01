'use client'
import { createContext, useContext } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
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

// Slide direction based on viewport position
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

const ToastPositionContext = createContext('bottom-right')

function ToastProvider({ children, position = 'bottom-right', ...props }) {
  return (
    <ToastPositionContext.Provider value={position}>
      <ToastPrimitive.Provider {...props}>{children}</ToastPrimitive.Provider>
    </ToastPositionContext.Provider>
  )
}

function ToastViewport({ className, ...props }) {
  const position = useContext(ToastPositionContext)
  return (
    <ToastPrimitive.Viewport
      className={cn(
        'fixed z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)] m-0 list-none outline-none',
        viewportPositionClasses[position] ?? viewportPositionClasses['bottom-right'],
        className
      )}
      {...props}
    />
  )
}

function Toast({
  className,
  variant = 'default',
  animation = 'slide-fade',
  duration = 5000,
  ...props
}) {
  const position = useContext(ToastPositionContext)
  const enter = slideEnter[position] ?? 'slide-in-from-bottom-4'
  const exit = slideExit[position] ?? 'slide-out-to-right-full'

  const animClasses =
    {
      'slide-fade': [
        `data-[state=open]:animate-in data-[state=open]:${enter} data-[state=open]:fade-in-0`,
        `data-[state=closed]:animate-out data-[state=closed]:${exit} data-[state=closed]:fade-out-0`,
      ],
      slide: [
        `data-[state=open]:animate-in data-[state=open]:${enter}`,
        `data-[state=closed]:animate-out data-[state=closed]:${exit}`,
      ],
      fade: [
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      ],
      none: [],
    }[animation] ?? []

  return (
    <ToastPrimitive.Root
      duration={duration}
      className={cn(
        'relative flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-sm text-sm',
        ...animClasses,
        'data-[swipe=move]:translate-x-[--radix-toast-swipe-move-x]',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform',
        'data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full',
        variantClasses[variant] ?? variantClasses.default,
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }) {
  return <ToastPrimitive.Title className={cn('font-semibold leading-snug', className)} {...props} />
}

function ToastDescription({ className, ...props }) {
  return (
    <ToastPrimitive.Description
      className={cn('text-xs opacity-80 leading-relaxed', className)}
      {...props}
    />
  )
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
        <ToastPrimitive.Action altText={altText ?? 'action'} asChild>
          <button type="button" className={buttonClass} {...props}>
            {children}
          </button>
        </ToastPrimitive.Action>
      </div>
    )
  }

  return (
    <ToastPrimitive.Action altText={altText ?? 'action'} asChild>
      <button type="button" className={buttonClass} {...props}>
        {children}
      </button>
    </ToastPrimitive.Action>
  )
}

function ToastClose({ className, ...props }) {
  return (
    <ToastPrimitive.Close
      className={cn(
        'shrink-0 self-start rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity',
        className
      )}
      aria-label="Close"
      {...props}
    >
      <X className="size-3.5" />
    </ToastPrimitive.Close>
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
