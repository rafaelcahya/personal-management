import { createElement, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const CardContext = createContext({ variant: 'shell' })

const cardVariants = {
  shell: 'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden',
  transparent: '',
  info: 'bg-blue-50 border border-blue-200 rounded-xl shadow-sm overflow-hidden dark:bg-blue-950/40 dark:border-blue-900',
  success:
    'bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm overflow-hidden dark:bg-emerald-950/40 dark:border-emerald-900',
  warning:
    'bg-amber-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden dark:bg-amber-950/40 dark:border-amber-900',
  danger:
    'bg-red-50 border border-red-200 rounded-xl shadow-sm overflow-hidden dark:bg-red-950/40 dark:border-red-900',
  muted: 'bg-muted/40 border border-border rounded-xl shadow-sm overflow-hidden',
}

const headerVariants = {
  shell: 'px-5 py-4 border-b border-slate-100',
  transparent: 'pb-3',
  info: 'px-5 py-4 border-b border-blue-100 dark:border-blue-900',
  success: 'px-5 py-4 border-b border-emerald-100 dark:border-emerald-900',
  warning: 'px-5 py-4 border-b border-amber-100 dark:border-amber-900',
  danger: 'px-5 py-4 border-b border-red-100 dark:border-red-900',
  muted: 'px-5 py-4 border-b border-border',
}

const contentVariants = {
  shell: 'px-5 py-4',
  transparent: 'px-5 pt-3',
  info: 'px-5 py-4',
  success: 'px-5 py-4',
  warning: 'px-5 py-4',
  danger: 'px-5 py-4',
  muted: 'px-5 py-4',
}

const footerVariants = {
  shell: 'px-5 py-4 border-t border-slate-100',
  transparent: 'px-5 pt-3',
  info: 'px-5 py-4 border-t border-blue-100 dark:border-blue-900',
  success: 'px-5 py-4 border-t border-emerald-100 dark:border-emerald-900',
  warning: 'px-5 py-4 border-t border-amber-100 dark:border-amber-900',
  danger: 'px-5 py-4 border-t border-red-100 dark:border-red-900',
  muted: 'px-5 py-4 border-t border-border',
}

const iconVariants = {
  shell: { wrapper: 'bg-violet-50', icon: 'text-violet-600' },
  transparent: { wrapper: 'bg-violet-50', icon: 'text-violet-600' },
  info: { wrapper: 'bg-blue-100 dark:bg-blue-900', icon: 'text-blue-600 dark:text-blue-400' },
  success: {
    wrapper: 'bg-emerald-100 dark:bg-emerald-900',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    wrapper: 'bg-amber-100 dark:bg-amber-900',
    icon: 'text-amber-700 dark:text-amber-400',
  },
  danger: { wrapper: 'bg-red-100 dark:bg-red-900', icon: 'text-red-600 dark:text-red-400' },
  muted: { wrapper: 'bg-muted/60', icon: 'text-muted-foreground' },
}

const paddingSizes = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  base: 'p-4',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
}

export default function Card({ className, id, variant = 'shell', children, ...rest }) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        id={id}
        className={cn('flex flex-col', cardVariants[variant] ?? cardVariants.shell, className)}
        {...rest}
      >
        {children}
      </div>
    </CardContext.Provider>
  )
}

export function CardHeader({ className, padding, id, children, ...rest }) {
  const { variant } = useContext(CardContext)
  const paddingClass = padding
    ? paddingSizes[padding]
    : (headerVariants[variant] ?? headerVariants.shell)
  return (
    <div id={id} className={cn('flex items-start gap-3', paddingClass, className)} {...rest}>
      {children}
    </div>
  )
}

export function CardIcon({ icon, className, iconClassName }) {
  const { variant } = useContext(CardContext)
  const iv = iconVariants[variant] ?? iconVariants.shell
  return (
    <div
      className={cn(
        'flex items-center justify-center size-9 rounded-lg shrink-0',
        iv.wrapper,
        className
      )}
    >
      {createElement(icon, {
        className: cn('size-4', iv.icon, iconClassName),
        'aria-hidden': 'true',
      })}
    </div>
  )
}

export function CardTitle({ children, className, as: Tag = 'h3', id, ...rest }) {
  return (
    <Tag id={id} className={cn('text-sm font-semibold text-slate-900', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function CardDescription({ children, className, id, ...rest }) {
  return (
    <p id={id} className={cn('text-xs text-slate-500 mt-0.5', className)} {...rest}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, padding, id, ...rest }) {
  const { variant } = useContext(CardContext)
  const paddingClass = padding
    ? paddingSizes[padding]
    : (contentVariants[variant] ?? contentVariants.shell)
  return (
    <div id={id} className={cn(paddingClass, 'flex-1', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardAction({ children, className, id, ...rest }) {
  return (
    <div id={id} className={cn('shrink-0', className)} {...rest}>
      {children}
    </div>
  )
}

const footerAlign = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
}

export function CardFooter({ children, className, padding, align = 'start', id, ...rest }) {
  const { variant } = useContext(CardContext)
  const paddingClass = padding
    ? paddingSizes[padding]
    : (footerVariants[variant] ?? footerVariants.shell)
  return (
    <div
      id={id}
      className={cn(
        paddingClass,
        'flex items-center',
        footerAlign[align] ?? footerAlign.start,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
