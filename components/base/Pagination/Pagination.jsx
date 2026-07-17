'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Button from '@/components/base/Button/Button'

const variantClass = {
  full: 'grid grid-cols-3 items-center',
  center: 'flex items-center justify-center gap-3',
  left: 'flex items-center justify-start gap-3',
  right: 'flex items-center justify-end gap-3',
}

/**
 * @param {object} props
 * @param {number} props.page - Current page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.total - Total record count
 * @param {() => void} props.onPrev - Called when Prev is clicked
 * @param {() => void} props.onNext - Called when Next is clicked
 * @param {'full'|'center'|'left'|'right'} [props.variant='full']
 * @param {boolean} [props.iconOnly=false] - Show icon-only buttons (no Prev/Next text)
 * @param {string} [props.id]
 * @param {string} [props.className]
 */
export default function Pagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
  variant = 'full',
  iconOnly = false,
  id,
  prevId,
  nextId,
  infoId,
  className,
}) {
  if (totalPages <= 1) return null

  const prevBtn = (
    <Button
      id={prevId}
      variant="ghost"
      size={iconOnly ? 'icon-sm' : 'xs'}
      onClick={onPrev}
      disabled={page <= 1}
      className="text-muted-foreground hover:text-primary"
      aria-label="Previous page"
    >
      <ChevronLeft className="size-3.5" aria-hidden="true" />
      {!iconOnly && 'Prev'}
    </Button>
  )

  const pageInfo = (
    <span
      id={infoId}
      className="text-xs text-muted-foreground text-center whitespace-nowrap"
      aria-live="polite"
    >
      Page {page} of {totalPages} · {total} records
    </span>
  )

  const nextBtn = (
    <Button
      id={nextId}
      variant="ghost"
      size={iconOnly ? 'icon-sm' : 'xs'}
      onClick={onNext}
      disabled={page >= totalPages}
      className="text-muted-foreground hover:text-primary"
      aria-label="Next page"
    >
      {!iconOnly && 'Next'}
      <ChevronRight className="size-3.5" aria-hidden="true" />
    </Button>
  )

  if (variant === 'full') {
    return (
      <div
        id={id}
        className={twMerge(clsx('grid grid-cols-3 items-center w-full'), className)}
        aria-label="Pagination"
      >
        <div>{prevBtn}</div>
        <div className="flex justify-center">{pageInfo}</div>
        <div className="flex justify-end">{nextBtn}</div>
      </div>
    )
  }

  return (
    <div
      id={id}
      className={twMerge(clsx(variantClass[variant], 'w-full'), className)}
      aria-label="Pagination"
    >
      {prevBtn}
      {pageInfo}
      {nextBtn}
    </div>
  )
}
