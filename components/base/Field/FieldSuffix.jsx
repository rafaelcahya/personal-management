'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const FieldSuffix = ({ className, children, ...props }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'absolute right-0 flex items-center justify-center h-full px-2.5 text-xs text-muted-foreground pointer-events-none [&_svg]:size-3.5',
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
