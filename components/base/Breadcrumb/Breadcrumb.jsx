import { forwardRef } from 'react'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function Breadcrumb({ className, ...props }) {
  return <nav aria-label="breadcrumb" className={twMerge(clsx(className))} {...props} />
}

function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      className={twMerge(
        clsx('flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground', className)
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }) {
  return <li className={twMerge(clsx('inline-flex items-center gap-1.5', className))} {...props} />
}

const BreadcrumbLink = forwardRef(function BreadcrumbLink({ className, ...props }, ref) {
  return (
    <a
      ref={ref}
      className={twMerge(clsx('transition-colors hover:text-foreground', className))}
      {...props}
    />
  )
})

BreadcrumbLink.displayName = 'BreadcrumbLink'

function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      role="link"
      aria-current="page"
      aria-disabled="true"
      className={twMerge(clsx('font-medium text-foreground', className))}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={twMerge(clsx('[&>svg]:size-3.5', className))}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={twMerge(clsx('flex size-9 items-center justify-center', className))}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
