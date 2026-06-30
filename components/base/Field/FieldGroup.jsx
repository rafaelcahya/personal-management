'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const colsMap = {
  xs: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' },
  sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' },
  md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' },
  lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' },
  xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' },
  xxl: { 1: '2xl:grid-cols-1', 2: '2xl:grid-cols-2', 3: '2xl:grid-cols-3', 4: '2xl:grid-cols-4' },
}

const gapMap = {
  sm: 'gap-3',
  base: 'gap-4',
  lg: 'gap-6',
}

const resolveCols = (cols) => {
  if (typeof cols === 'number') return colsMap.xs[cols] ?? 'grid-cols-1'
  return Object.entries(cols)
    .map(([bp, n]) => colsMap[bp]?.[n])
    .filter(Boolean)
    .join(' ')
}

/**
 * @param {object} props
 * @param {number | { xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number }} [props.cols=1]
 * @param {'sm'|'base'|'lg'} [props.gap='base']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
const FieldGroup = ({ cols = 1, gap = 'base', className, children }) => (
  <div className={twMerge(clsx('grid', resolveCols(cols), gapMap[gap] ?? gapMap.base, className))}>
    {children}
  </div>
)

FieldGroup.displayName = 'FieldGroup'

export default FieldGroup
