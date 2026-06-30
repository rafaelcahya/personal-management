'use client'
import { Badge as BadgeUI, badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const sizeClasses = {
  xs: 'px-1.5 py-0 text-[10px]',
  sm: 'px-2 py-px text-xs',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-0.5 text-sm',
  xl: 'px-3 py-1 text-sm',
}

const radiusClasses = {
  none: 'rounded-none',
  xs: 'rounded-sm',
  sm: 'rounded',
  base: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

function Badge({ size = 'md', radius = 'full', className, ...props }) {
  return (
    <BadgeUI
      className={cn(
        'leading-none [&>svg]:translate-y-px',
        sizeClasses[size],
        radiusClasses[radius],
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
