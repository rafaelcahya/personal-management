'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const gapMap = {
  sm: 'gap-3',
  base: 'gap-4',
  md: 'gap-5',
  lg: 'gap-6',
}

/**
 * Outer wrapper that stacks all form fields vertically with consistent spacing.
 *
 * @param {object} props
 * @param {'sm'|'base'|'md'|'lg'} [props.gap='base']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
const FieldContainer = ({ gap = 'base', className, children }) => (
  <div className={twMerge(clsx('flex flex-col', gapMap[gap], className))}>{children}</div>
)

FieldContainer.displayName = 'FieldContainer'

export default FieldContainer
