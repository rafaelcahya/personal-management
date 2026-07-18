'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const FieldTitle = ({ className, children }) => (
  <p
    className={twMerge(
      clsx(
        'col-span-full text-xs font-semibold text-muted-foreground uppercase tracking-wide',
        className
      )
    )}
  >
    {children}
  </p>
)

FieldTitle.displayName = 'FieldTitle'

export default FieldTitle
