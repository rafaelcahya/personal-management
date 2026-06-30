'use client'

import { clsx } from 'clsx'
import { useSliderContext } from './Slider'

const labelSizeMap = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  base: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-sm',
}

// ─── SliderStartLabel ─────────────────────────────────────────────────────────

export const SliderStartLabel = ({ children, className }) => {
  const { size } = useSliderContext()
  return (
    <span className={clsx('shrink-0 text-muted-foreground', labelSizeMap[size], className)}>
      {children}
    </span>
  )
}
SliderStartLabel.displayName = 'SliderStartLabel'

// ─── SliderEndLabel ───────────────────────────────────────────────────────────

export const SliderEndLabel = ({ children, className }) => {
  const { size } = useSliderContext()
  return (
    <span className={clsx('shrink-0 text-muted-foreground', labelSizeMap[size], className)}>
      {children}
    </span>
  )
}
SliderEndLabel.displayName = 'SliderEndLabel'

// ─── SliderMark ───────────────────────────────────────────────────────────────

export const SliderMark = ({ value, children, className }) => {
  const { size, min, max } = useSliderContext()
  return (
    <span
      className={clsx(
        'absolute -translate-x-1/2 text-muted-foreground',
        labelSizeMap[size],
        className
      )}
      style={{ left: `${((value - min) / (max - min)) * 100}%` }}
    >
      {children}
    </span>
  )
}
SliderMark.displayName = 'SliderMark'
