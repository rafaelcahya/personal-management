'use client'
import { createContext, useContext } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const BannerCtx = createContext({ variant: 'info' })
const useBanner = () => useContext(BannerCtx)

const variantStyles = {
  info: {
    root: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    desc: 'text-blue-700',
    close: 'text-blue-400 hover:text-blue-600 hover:bg-blue-100',
  },
  success: {
    root: 'bg-emerald-50 border-emerald-200',
    icon: 'text-emerald-600',
    title: 'text-emerald-900',
    desc: 'text-emerald-700',
    close: 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100',
  },
  warning: {
    root: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-700',
    title: 'text-amber-900',
    desc: 'text-amber-700',
    close: 'text-amber-400 hover:text-amber-600 hover:bg-amber-100',
  },
  danger: {
    root: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    desc: 'text-red-700',
    close: 'text-red-400 hover:text-red-600 hover:bg-red-100',
  },
}

export function Banner({
  children,
  variant = 'info',
  dismissible,
  onDismiss,
  className,
  ...props
}) {
  return (
    <BannerCtx.Provider value={{ variant }}>
      <div
        role="alert"
        className={cn(
          'flex items-center gap-3 p-4 rounded-lg border',
          variantStyles[variant].root,
          className
        )}
        {...props}
      >
        {children}
        {dismissible && <BannerClose onDismiss={onDismiss} />}
      </div>
    </BannerCtx.Provider>
  )
}

export function BannerIcon({ icon: Icon, position = 'center', className, ...props }) {
  const { variant } = useBanner()
  return (
    <span
      className={cn(
        'shrink-0',
        position === 'top' ? 'self-start' : 'self-center',
        variantStyles[variant].icon,
        className
      )}
      {...props}
    >
      <Icon className="size-5" />
    </span>
  )
}

export function BannerContent({ children, className, ...props }) {
  return (
    <div className={cn('flex-1 flex flex-col gap-1 min-w-0', className)} {...props}>
      {children}
    </div>
  )
}

export function BannerTitle({ children, className, ...props }) {
  const { variant } = useBanner()
  return (
    <p
      className={cn('text-sm font-semibold leading-snug', variantStyles[variant].title, className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function BannerDescription({ children, className, ...props }) {
  const { variant } = useBanner()
  return (
    <p className={cn('text-sm leading-relaxed', variantStyles[variant].desc, className)} {...props}>
      {children}
    </p>
  )
}

export function BannerAction({ children, className, ...props }) {
  return (
    <div className={cn('mt-2 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}

export function BannerClose({ onDismiss, className, ...props }) {
  const { variant } = useBanner()
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss"
      className={cn(
        'shrink-0 -mr-1 p-1 rounded-md transition-colors',
        variantStyles[variant].close,
        className
      )}
      {...props}
    >
      <X className="size-4" />
    </button>
  )
}
