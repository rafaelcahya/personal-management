'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function FeePagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div
      id="feePagination_feePage"
      className="flex items-center justify-between pt-2 mt-2"
      aria-label="Pagination"
    >
      <button
        id="feePaginationPrevBtn_feePage"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Prev
      </button>

      <span
        id="feePaginationInfo_feePage"
        className="text-xs text-slate-400 text-center"
        aria-live="polite"
      >
        Page {page} of {totalPages}
        {total != null ? ` · ${total} fees` : ''}
      </span>

      <button
        id="feePaginationNextBtn_feePage"
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
