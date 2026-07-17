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
          'focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-1',
          isHorizontal ? 'flex items-center gap-4' : 'flex flex-col gap-2.5',
          hasBadge && isHorizontal && 'pr-12',
          hasBadge && !isHorizontal && 'pr-8',
          selected
            ? 'border-primary ring-2 ring-ring/20 bg-secondary/40 p-4'
            : 'border-border p-4 hover:border-input hover:shadow-sm',
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
              selected ? 'bg-primary' : 'border-2 border-input bg-background'
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
        selected ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground',
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
        selected ? 'text-foreground' : 'text-foreground',
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
