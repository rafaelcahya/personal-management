'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TradePagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div
      id="tradePagination_tradePage"
      className="flex items-center justify-between px-5 pt-2 mt-2"
      aria-label="Pagination"
    >
      <button
        id="tradePaginationPrevBtn_tradePage"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Prev
      </button>

      <span
        id="tradePaginationInfo_tradePage"
        className="text-xs text-slate-400 text-center"
        aria-live="polite"
      >
        Page {page} of {totalPages}
        {total != null ? ` · ${total} trades` : ''}
      </span>

      <button
        id="tradePaginationNextBtn_tradePage"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
