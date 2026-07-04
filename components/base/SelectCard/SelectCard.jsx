import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const SelectCardCtx = createContext({ selected: false, layout: 'vertical' })

export function SelectCard({
  children,
  value,
  selected = false,
  onSelect,
  layout = 'vertical',
  indicator = 'badge',
  disabled = false,
  className,
  ...props
}) {
  const isHorizontal = layout === 'horizontal'
  const hasBadge = indicator === 'badge'

  return (
    <SelectCardCtx.Provider value={{ selected, layout }}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={selected}
        aria-disabled={disabled}
        onClick={!disabled ? () => onSelect?.(value) : undefined}
        onKeyDown={
          !disabled
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect?.(value)
                }
              }
            : undefined
        }
        className={cn(
          'relative rounded-lg border transition-all select-none outline-none',
          'focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-1',
          isHorizontal ? 'flex items-center gap-4' : 'flex flex-col gap-2.5',
          hasBadge && isHorizontal && 'pr-12',
          hasBadge && !isHorizontal && 'pr-8',
          selected
            ? 'border-violet-600 ring-2 ring-violet-200 bg-violet-50/40 p-4'
            : 'border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className
        )}
        {...props}
      >
        {hasBadge && (
          <div
            className={cn(
              'absolute size-5 rounded-full flex items-center justify-center transition-all',
              isHorizontal ? 'right-4 top-1/2 -translate-y-1/2' : 'top-3 right-3',
              selected ? 'bg-violet-600' : 'border-2 border-gray-300 bg-white'
            )}
            aria-hidden="true"
          >
            {selected && <span className="size-2 rounded-full bg-white block" />}
          </div>
        )}
        {children}
      </div>
    </SelectCardCtx.Provider>
  )
}

export function SelectCardIcon({ children, className }) {
  const { selected } = useContext(SelectCardCtx)
  return (
    <div
      className={cn(
        'flex items-center justify-center size-9 rounded-md shrink-0',
        selected ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500',
        className
      )}
    >
      {children}
    </div>
  )
}

export function SelectCardTitle({ children, className }) {
  const { selected } = useContext(SelectCardCtx)
  return (
    <p
      className={cn(
        'text-sm font-medium leading-snug',
        selected ? 'text-gray-900' : 'text-gray-800',
        className
      )}
    >
      {children}
    </p>
  )
}

export function SelectCardDescription({ children, className }) {
  return <p className={cn('text-xs text-muted-foreground leading-snug', className)}>{children}</p>
}
