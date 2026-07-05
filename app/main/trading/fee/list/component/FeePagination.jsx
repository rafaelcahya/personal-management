'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/base/Button/Button'

export default function FeePagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div
      id="feePagination_feePage"
      className="flex items-center justify-between px-5 pt-2 mt-2"
      aria-label="Pagination"
    >
      <Button
        id="feePaginationPrevBtn_feePage"
        variant="ghost"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 min-h-[44px]"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Prev
      </Button>

      <span
        id="feePaginationInfo_feePage"
        className="text-xs text-slate-400 text-center"
        aria-live="polite"
      >
        Page {page} of {totalPages}
        {total != null ? ` · ${total} fees` : ''}
      </span>

      <Button
        id="feePaginationNextBtn_feePage"
        variant="ghost"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 min-h-[44px]"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
