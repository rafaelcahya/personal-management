import { cn } from '@/lib/utils'

const variantH = {
  solid: 'border-t border-current',
  dashed: 'border-t border-dashed border-current',
  dotted: 'border-t border-dotted border-current',
}

const variantV = {
  solid: 'border-l border-current',
  dashed: 'border-l border-dashed border-current',
  dotted: 'border-l border-dotted border-current',
}

export function Separator({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  className,
  ...props
}) {
  const isVertical = orientation === 'vertical'

  if (label && !isVertical) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center gap-3 text-gray-200', className)}
        {...props}
      >
        <div className={cn('flex-1', variantH[variant])} />
        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{label}</span>
        <div className={cn('flex-1', variantH[variant])} />
      </div>
    )
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'text-gray-200',
        isVertical ? variantV[variant] : cn('w-full', variantH[variant]),
        className
      )}
      {...props}
    />
  )
}
