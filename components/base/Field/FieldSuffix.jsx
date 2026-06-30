'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from './FieldContent'

const affixSizeClass = {
  xs: 'px-1.5 text-xs',
  sm: 'px-2 text-xs',
  base: 'px-2.5 text-xs',
  md: 'px-3 text-sm',
  lg: 'px-3 text-sm',
}

const FieldSuffix = ({ className, children, ...props }) => {
  const { size } = useFieldContentContext()

  return (
    <span
      className={twMerge(
        clsx(
          'absolute right-0 flex items-center justify-center h-full text-muted-foreground pointer-events-none [&_svg]:size-3.5',
          affixSizeClass[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  )
}

FieldSuffix.displayName = 'FieldSuffix'

export default FieldSuffix
