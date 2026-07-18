import { AlertCircle, Inbox } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { cn } from '@/lib/utils'

const DEFAULT_ICONS = {
  error: AlertCircle,
  empty: Inbox,
}

const ICON_COLORS = {
  error: 'text-muted-foreground',
  empty: 'text-muted-foreground/60',
}

const ARIA_ATTRS = {
  error: { role: 'alert', 'aria-live': 'assertive' },
  empty: { role: 'status' },
  loading: { 'aria-busy': 'true', 'aria-label': 'Loading…' },
}

export default function State({
  variant = 'empty',
  icon,
  title,
  description,
  action,
  skeletonRows = 3,
  className,
}) {
  const ariaAttrs = ARIA_ATTRS[variant] ?? {}

  if (variant === 'loading') {
    return (
      <div className={cn('flex flex-col gap-2 py-10 px-4 w-full', className)} {...ariaAttrs}>
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  const Icon = icon ?? DEFAULT_ICONS[variant]

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}
      {...ariaAttrs}
    >
      {Icon && (
        <Icon
          className={cn('size-10', ICON_COLORS[variant] ?? 'text-muted-foreground/60')}
          aria-hidden="true"
        />
      )}
      {(title || description) && (
        <div className="space-y-1">
          {title && <p className="text-sm font-medium text-foreground">{title}</p>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      {action && (
        <Button variant="outline" onClick={action.onClick} className="min-w-11">
          {action.label}
        </Button>
      )}
    </div>
  )
}
