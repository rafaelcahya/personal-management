'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const FieldSeparator = ({ className }) => (
  <hr className={twMerge(clsx('border-border', className))} />
)

FieldSeparator.displayName = 'FieldSeparator'

export default FieldSeparator
