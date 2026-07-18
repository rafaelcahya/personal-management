'use client'
import { createContext, useContext } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const BannerCtx = createContext({ variant: 'info' })
const useBanner = () => useContext(BannerCtx)

const variantStyles = {
  info: {
    root: 'bg-info/10 border-info/20',
    icon: 'text-info',
    title: 'text-foreground',
    desc: 'text-muted-foreground',
    close: 'text-muted-foreground hover:text-info hover:bg-info/10',
  },
  success: {
    root: 'bg-success-subtle border-success/20',
    icon: 'text-success',
    title: 'text-foreground',
    desc: 'text-muted-foreground',
    close: 'text-muted-foreground hover:text-success hover:bg-success-subtle',
  },
  warning: {
    root: 'bg-warning-subtle border-warning/30',
    icon: 'text-warning',
    title: 'text-foreground',
    desc: 'text-muted-foreground',
    close: 'text-muted-foreground hover:text-warning hover:bg-warning-subtle',
  },
  danger: {
    root: 'bg-destructive-subtle border-destructive/20',
    icon: 'text-destructive',
    title: 'text-foreground',
    desc: 'text-muted-foreground',
    close: 'text-muted-foreground hover:text-destructive hover:bg-destructive-subtle',
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
