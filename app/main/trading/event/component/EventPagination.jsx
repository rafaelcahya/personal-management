'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/base/Button/Button'

export default function EventPagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div
      id="eventPagination_eventPage"
      className="flex items-center justify-between px-5 pt-2 mt-2"
      aria-label="Pagination"
    >
      <Button
        id="eventPaginationPrevBtn_eventPage"
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
        id="eventPaginationInfo_eventPage"
        className="text-xs text-slate-400 text-center"
        aria-live="polite"
      >
        Page {page} of {totalPages}
        {total != null ? ` · ${total} events` : ''}
      </span>

      <Button
        id="eventPaginationNextBtn_eventPage"
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
