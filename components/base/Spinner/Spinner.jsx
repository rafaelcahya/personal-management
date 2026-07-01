import { cn } from '@/lib/utils'

const sizeClasses = {
  xs: 'size-3 border-[1.5px]',
  sm: 'size-4 border-2',
  default: 'size-5 border-2',
  lg: 'size-7 border-[3px]',
  xl: 'size-10 border-4',
}

const variantClasses = {
  default: 'text-violet-600',
  muted: 'text-gray-400',
  white: 'text-white',
}

export function Spinner({ size = 'default', variant = 'default', className, ...props }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
