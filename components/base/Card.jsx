import { createElement, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const CardContext = createContext({ variant: 'shell' })

const cardVariants = {
  shell: 'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden',
  transparent: '',
}

const headerVariants = {
  shell: 'px-5 py-4 border-b border-slate-100',
  transparent: 'pb-3',
}

const contentVariants = {
  shell: 'px-5 py-4',
  transparent: 'px-5 pt-3',
}

const footerVariants = {
  shell: 'px-5 py-4 border-t border-slate-100',
  transparent: 'px-5 pt-3',
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
  return (
    <div
      className={cn(
        'flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0',
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
