'use client'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center border font-medium w-fit whitespace-nowrap shrink-0',
    'gap-1 leading-none [&>svg]:size-3 [&>svg]:pointer-events-none [&>svg]:translate-y-px',
    'transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-white',
        outline: 'text-foreground',
      },
      size: {
        xs: 'px-1.5 py-0 text-[10px]',
        sm: 'px-2 py-px text-xs',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-0.5 text-sm',
        xl: 'px-3 py-1 text-sm',
      },
      radius: {
        none: 'rounded-none',
        xs: 'rounded-sm',
        sm: 'rounded',
        base: 'rounded-md',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      radius: 'full',
    },
  }
)

function Badge({ variant, size = 'md', radius = 'full', className, ...props }) {
  return (
    <span
      className={twMerge(clsx(badgeVariants({ variant, size, radius }), className))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
