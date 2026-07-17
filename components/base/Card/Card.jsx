import { createElement, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const CardContext = createContext({ variant: 'shell' })
const CardHeaderContext = createContext({ layout: 'beside' })

const cardBaseClasses = {
  shell: 'bg-card rounded-xl shadow-sm overflow-hidden',
  transparent: '',
  info: 'bg-blue-50 rounded-xl shadow-sm overflow-hidden dark:bg-blue-950/40',
  success: 'bg-emerald-50 rounded-xl shadow-sm overflow-hidden dark:bg-emerald-950/40',
  warning: 'bg-amber-50 rounded-xl shadow-sm overflow-hidden dark:bg-amber-950/40',
  danger: 'bg-red-50 rounded-xl shadow-sm overflow-hidden dark:bg-red-950/40',
  muted: 'bg-muted/40 rounded-xl shadow-sm overflow-hidden',
}

const cardBorderClasses = {
  shell: 'border border-border',
  transparent: 'border border-border',
  info: 'border border-blue-200 dark:border-blue-900',
  success: 'border border-emerald-200 dark:border-emerald-900',
  warning: 'border border-amber-200 dark:border-amber-900',
  danger: 'border border-red-200 dark:border-red-900',
  muted: 'border border-border',
}

const headerBorderClasses = {
  shell: 'border-b border-border',
  transparent: '',
  info: 'border-b border-blue-100 dark:border-blue-900',
  success: 'border-b border-emerald-100 dark:border-emerald-900',
  warning: 'border-b border-amber-100 dark:border-amber-900',
  danger: 'border-b border-red-100 dark:border-red-900',
  muted: 'border-b border-border',
}

const footerBorderClasses = {
  shell: 'border-t border-border',
  transparent: '',
  info: 'border-t border-blue-100 dark:border-blue-900',
  success: 'border-t border-emerald-100 dark:border-emerald-900',
  warning: 'border-t border-amber-100 dark:border-amber-900',
  danger: 'border-t border-red-100 dark:border-red-900',
  muted: 'border-t border-border',
}

const iconVariants = {
  shell: { wrapper: 'bg-secondary', icon: 'text-primary' },
  transparent: { wrapper: 'bg-secondary', icon: 'text-primary' },
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

export default function Card({
  className,
  id,
  variant = 'shell',
  bordered,
  children,
  as: Tag = 'div',
  ...rest
}) {
  const isBordered = bordered !== undefined ? bordered : variant !== 'transparent'
  const baseClass = cardBaseClasses[variant] ?? cardBaseClasses.shell
  const borderClass = isBordered ? (cardBorderClasses[variant] ?? cardBorderClasses.shell) : ''
  return (
    <CardContext.Provider value={{ variant }}>
      <Tag id={id} className={cn('flex flex-col', baseClass, borderClass, className)} {...rest}>
        {children}
      </Tag>
    </CardContext.Provider>
  )
}

export function CardHeader({
  className,
  layout = 'beside',
  id,
  children,
  as: Tag = 'div',
  ...rest
}) {
  const { variant } = useContext(CardContext)
  const borderClass = headerBorderClasses[variant] ?? headerBorderClasses.shell
  const layoutClass =
    layout === 'below' ? 'flex flex-wrap items-start gap-x-3 gap-y-2' : 'flex items-center gap-3'
  return (
    <CardHeaderContext.Provider value={{ layout }}>
      <Tag id={id} className={cn(layoutClass, 'p-4', borderClass, className)} {...rest}>
        {children}
      </Tag>
    </CardHeaderContext.Provider>
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
    <Tag id={id} className={cn('text-sm font-semibold text-card-foreground', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function CardDescription({ children, className, id, ...rest }) {
  return (
    <p id={id} className={cn('text-xs text-muted-foreground mt-0.5', className)} {...rest}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, id, as: Tag = 'div', ...rest }) {
  return (
    <Tag id={id} className={cn('p-4 flex-1', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function CardHeaderContent({ children, className, id, ...rest }) {
  return (
    <div id={id} className={cn('flex flex-col min-w-0 flex-1', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardAction({ children, className, id, ...rest }) {
  const { layout } = useContext(CardHeaderContext)
  return (
    <div
      id={id}
      className={cn('shrink-0', layout === 'below' && 'basis-full', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

const footerAlign = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
}

export function CardFooter({ children, className, align = 'start', id, as: Tag = 'div', ...rest }) {
  const { variant } = useContext(CardContext)
  const borderClass = footerBorderClasses[variant] ?? footerBorderClasses.shell
  return (
    <Tag
      id={id}
      className={cn(
        'p-4',
        'flex items-center',
        footerAlign[align] ?? footerAlign.start,
        borderClass,
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
