import { Children, cloneElement, createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

// ─── Size + shape maps ────────────────────────────────────────────────────────

const sizeMap = {
  xs: 'size-6',
  sm: 'size-8',
  default: 'size-10',
  lg: 'size-12',
  xl: 'size-16',
  '2xl': 'size-20',
}

const shapeMap = {
  circle: 'rounded-full',
  square: 'rounded-lg',
}

const fallbackTextSizeMap = {
  xs: 'text-[9px]',
  sm: 'text-[11px]',
  default: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
  '2xl': 'text-xl',
}

const statusDotSizeMap = {
  xs: 'size-1.5',
  sm: 'size-2',
  default: 'size-2.5',
  lg: 'size-3',
  xl: 'size-3.5',
  '2xl': 'size-4',
}

const statusColorMap = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-amber-400',
}

const overlapMap = {
  xs: '-ml-1.5',
  sm: '-ml-2',
  default: '-ml-2.5',
  lg: '-ml-3',
  xl: '-ml-4',
  '2xl': '-ml-5',
}

const overflowTextSizeMap = {
  xs: 'text-[8px]',
  sm: 'text-[10px]',
  default: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
  '2xl': 'text-lg',
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AvatarCtx = createContext(null)
const useAvatar = () => useContext(AvatarCtx)

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({
  size = 'default',
  shape = 'circle',
  onClick,
  className,
  children,
  ...props
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <AvatarCtx.Provider value={{ size, shape, imageError, setImageError }}>
      <span
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick(e)
                }
              }
            : undefined
        }
        className={cn(
          'relative inline-flex shrink-0 transition-transform duration-150 hover:scale-110',
          sizeMap[size] ?? sizeMap.default,
          onClick ? 'cursor-pointer' : 'cursor-default',
          className
        )}
        {...props}
      >
        {children}
      </span>
    </AvatarCtx.Provider>
  )
}

// ─── AvatarImage ──────────────────────────────────────────────────────────────

export function AvatarImage({ src, alt = '', className, ...props }) {
  const { shape, imageError, setImageError } = useAvatar()
  if (imageError) return null
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      className={cn(
        'absolute inset-0 size-full object-cover z-10',
        shapeMap[shape] ?? shapeMap.circle,
        className
      )}
      {...props}
    />
  )
}

// ─── AvatarFallback ───────────────────────────────────────────────────────────

export function AvatarFallback({ children, className, ...props }) {
  const { size, shape } = useAvatar()
  return (
    <span
      className={cn(
        'absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none font-medium',
        shapeMap[shape] ?? shapeMap.circle,
        fallbackTextSizeMap[size] ?? fallbackTextSizeMap.default,
        'bg-gray-200 text-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── AvatarStatus ─────────────────────────────────────────────────────────────

export function AvatarStatus({ status = 'online', className, ...props }) {
  const { size } = useAvatar()
  return (
    <span
      className={cn(
        'absolute bottom-0 right-0 z-20 block rounded-full ring-2 ring-white',
        statusDotSizeMap[size] ?? statusDotSizeMap.default,
        statusColorMap[status] ?? statusColorMap.online,
        className
      )}
      {...props}
    />
  )
}

// ─── AvatarGroup ─────────────────────────────────────────────────────────────

export function AvatarGroup({
  children,
  max = 4,
  size = 'default',
  shape = 'circle',
  className,
  ...props
}) {
  const items = Children.toArray(children)
  const visible = items.slice(0, max)
  const overflow = items.length - max
  const overlap = overlapMap[size] ?? overlapMap.default
  const overflowTextSize = overflowTextSizeMap[size] ?? overflowTextSizeMap.default
  const sizeDim = sizeMap[size] ?? sizeMap.default
  const shapeClass = shapeMap[shape] ?? shapeMap.circle

  return (
    <div className={cn('flex items-center', className)} {...props}>
      {visible.map((child, i) =>
        cloneElement(child, {
          key: i,
          size,
          shape,
          className: cn(i > 0 && overlap, 'ring-2 ring-white', shapeClass),
          style: { zIndex: max - i },
        })
      )}
      {overflow > 0 && (
        <span
          className={cn(
            '-ml-2 relative inline-flex shrink-0',
            sizeDim,
            'ring-2 ring-white',
            shapeClass
          )}
          style={{ zIndex: 0 }}
        >
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center font-medium',
              shapeClass,
              'bg-gray-200 text-gray-600',
              overflowTextSize
            )}
          >
            +{overflow}
          </span>
        </span>
      )}
    </div>
  )
}
