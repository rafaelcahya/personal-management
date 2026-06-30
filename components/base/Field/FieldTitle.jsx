'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const FieldTitle = ({ className, children }) => (
  <p
    className={twMerge(
      clsx('col-span-full text-xs font-semibold text-gray-500 uppercase tracking-wide', className)
    )}
  >
    {children}
  </p>
)

FieldTitle.displayName = 'FieldTitle'

export default FieldTitle
