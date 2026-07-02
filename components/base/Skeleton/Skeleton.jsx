import { cn } from '@/lib/utils'

// ─── Size maps ────────────────────────────────────────────────────────────────

const avatarSizeMap = {
  sm: 'size-6',
  default: 'size-8',
  lg: 'size-10',
  xl: 'size-14',
}

const buttonSizeMap = {
  sm: 'h-8 w-20',
  default: 'h-9 w-28',
  lg: 'h-10 w-36',
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ animation = 'pulse', className, style, ...props }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        'rounded bg-gray-200',
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'skeleton-wave',
        className
      )}
      {...props}
    />
  )
}

// ─── SkeletonText ─────────────────────────────────────────────────────────────

export function SkeletonText({ lines = 3, width = '100%', animation = 'pulse', className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          animation={animation}
          className="h-3.5 rounded"
          style={{ width: i === lines - 1 && lines > 1 ? `calc(${width} * 0.6)` : width }}
        />
      ))}
    </div>
  )
}

// ─── SkeletonAvatar ───────────────────────────────────────────────────────────

export function SkeletonAvatar({ size = 'default', animation = 'pulse', className }) {
  return (
    <Skeleton
      animation={animation}
      className={cn(
        'rounded-full shrink-0',
        avatarSizeMap[size] ?? avatarSizeMap.default,
        className
      )}
    />
  )
}

// ─── SkeletonBadge ────────────────────────────────────────────────────────────

export function SkeletonBadge({ animation = 'pulse', className }) {
  return <Skeleton animation={animation} className={cn('h-5 w-14 rounded-full', className)} />
}

// ─── SkeletonButton ───────────────────────────────────────────────────────────

export function SkeletonButton({ size = 'default', animation = 'pulse', className }) {
  return (
    <Skeleton
      animation={animation}
      className={cn('rounded-lg', buttonSizeMap[size] ?? buttonSizeMap.default, className)}
    />
  )
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────

export function SkeletonCard({ lines = 3, animation = 'pulse', className }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="default" animation={animation} />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton animation={animation} className="h-3.5 w-32 rounded" />
          <Skeleton animation={animation} className="h-3 w-24 rounded" />
        </div>
      </div>
      <SkeletonText lines={lines} animation={animation} />
    </div>
  )
}
