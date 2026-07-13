'use client'

import { cn } from '@/lib/utils'
import { useSliderContext } from './Slider'

// ─── SliderStartLabel ─────────────────────────────────────────────────────────

export const SliderStartLabel = ({ children, className }) => (
  <span className={cn('shrink-0 text-muted-foreground text-xs', className)}>{children}</span>
)
SliderStartLabel.displayName = 'SliderStartLabel'

// ─── SliderEndLabel ───────────────────────────────────────────────────────────

export const SliderEndLabel = ({ children, className }) => (
  <span className={cn('shrink-0 text-muted-foreground text-xs', className)}>{children}</span>
)
SliderEndLabel.displayName = 'SliderEndLabel'

// ─── SliderMark ───────────────────────────────────────────────────────────────

export const SliderMark = ({ value, children, className }) => {
  const { min, max } = useSliderContext()
  return (
    <span
      className={cn('absolute -translate-x-1/2 text-muted-foreground text-xs', className)}
      style={{ left: `${((value - min) / (max - min)) * 100}%` }}
    >
      {children}
    </span>
  )
}
SliderMark.displayName = 'SliderMark'
