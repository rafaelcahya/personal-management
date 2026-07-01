import { cn } from '@/lib/utils'

const sizeClasses = {
  xs: {
    root: 'gap-1 py-3',
    icon: 'size-5',
    title: 'text-xs font-medium',
    description: 'text-[11px]',
    actions: 'gap-1.5 mt-1',
  },
  sm: {
    root: 'gap-2 py-6',
    icon: 'size-8',
    title: 'text-sm font-semibold',
    description: 'text-xs',
    actions: 'gap-2 mt-1',
  },
  default: {
    root: 'gap-3 py-10',
    icon: 'size-12',
    title: 'text-base font-semibold',
    description: 'text-sm',
    actions: 'gap-2 mt-1',
  },
  lg: {
    root: 'gap-4 py-16',
    icon: 'size-16',
    title: 'text-xl font-semibold',
    description: 'text-base',
    actions: 'gap-3 mt-2',
  },
}

const variantClasses = {
  empty: {
    icon: 'text-gray-300',
    title: 'text-gray-700',
    description: 'text-gray-400',
  },
  search: {
    icon: 'text-gray-300',
    title: 'text-gray-700',
    description: 'text-gray-400',
  },
  error: {
    icon: 'text-red-300',
    title: 'text-red-700',
    description: 'text-red-400',
  },
}

const EmptyStateContext = {
  size: 'default',
  variant: 'empty',
}

import { createContext, useContext } from 'react'

const Ctx = createContext(EmptyStateContext)

function EmptyState({ size = 'default', variant = 'empty', className, children, ...props }) {
  return (
    <Ctx.Provider value={{ size, variant }}>
      <div
        className={cn(
          'flex flex-col items-center justify-center text-center w-full',
          sizeClasses[size]?.root,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
}

function EmptyStateIcon({ icon: Icon, className, ...props }) {
  const { size, variant } = useContext(Ctx)
  const sz = sizeClasses[size] ?? sizeClasses.default
  const v = variantClasses[variant] ?? variantClasses.empty
  return (
    <span
      className={cn('flex items-center justify-center shrink-0', sz.icon, v.icon, className)}
      {...props}
    >
      {Icon && <Icon className="w-full h-full" />}
    </span>
  )
}

function EmptyStateTitle({ className, children, ...props }) {
  const { size, variant } = useContext(Ctx)
  const sz = sizeClasses[size] ?? sizeClasses.default
  const v = variantClasses[variant] ?? variantClasses.empty
  return (
    <h3 className={cn(sz.title, v.title, className)} {...props}>
      {children}
    </h3>
  )
}

function EmptyStateDescription({ className, children, ...props }) {
  const { size, variant } = useContext(Ctx)
  const sz = sizeClasses[size] ?? sizeClasses.default
  const v = variantClasses[variant] ?? variantClasses.empty
  return (
    <p
      className={cn('max-w-xs leading-relaxed', sz.description, v.description, className)}
      {...props}
    >
      {children}
    </p>
  )
}

function EmptyStateActions({ className, children, ...props }) {
  const { size } = useContext(Ctx)
  const sz = sizeClasses[size] ?? sizeClasses.default
  return (
    <div
      className={cn('flex items-center flex-wrap justify-center', sz.actions, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription, EmptyStateActions }
