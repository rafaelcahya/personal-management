import { createElement, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const CardContext = createContext({ variant: 'shell' })
const CardHeaderContext = createContext({ layout: 'beside' })

const cardBaseClasses = {
  shell: 'bg-card rounded-xl [box-shadow:var(--shadow-card)] overflow-hidden',
  transparent: '',
  info: 'bg-info/10 rounded-xl [box-shadow:var(--shadow-card)] overflow-hidden',
  success: 'bg-success-subtle rounded-xl [box-shadow:var(--shadow-card)] overflow-hidden',
  warning: 'bg-warning-subtle rounded-xl [box-shadow:var(--shadow-card)] overflow-hidden',
  danger: 'bg-destructive-subtle rounded-xl [box-shadow:var(--shadow-card)] overflow-hidden',
  muted: 'bg-muted/40 rounded-xl [box-shadow:var(--shadow-card)] overflow-hidden',
}

const cardBorderClasses = {
  shell: 'border border-border',
  transparent: 'border border-border',
  info: 'border border-info/20',
  success: 'border border-success/20',
  warning: 'border border-warning/30',
  danger: 'border border-destructive/20',
  muted: 'border border-border',
}

const headerBorderClasses = {
  shell: 'border-b border-border',
  transparent: '',
  info: 'border-b border-info/20',
  success: 'border-b border-success/20',
  warning: 'border-b border-warning/30',
  danger: 'border-b border-destructive/20',
  muted: 'border-b border-border',
}

const footerBorderClasses = {
  shell: 'border-t border-border',
  transparent: '',
  info: 'border-t border-info/20',
  success: 'border-t border-success/20',
  warning: 'border-t border-warning/30',
  danger: 'border-t border-destructive/20',
  muted: 'border-t border-border',
}

const iconVariants = {
  shell: { wrapper: 'bg-secondary', icon: 'text-primary' },
  transparent: { wrapper: 'bg-secondary', icon: 'text-primary' },
  info: { wrapper: 'bg-info/10', icon: 'text-info' },
  success: { wrapper: 'bg-success-subtle', icon: 'text-success' },
  warning: { wrapper: 'bg-warning-subtle', icon: 'text-warning' },
  danger: { wrapper: 'bg-destructive-subtle', icon: 'text-destructive' },
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
