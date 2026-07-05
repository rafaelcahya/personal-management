'use client'

import { PrevButton, NextButton } from '@/components/base/Table/DataTable'

export default function TradePagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div
      id="tradePagination_tradePage"
      className="grid grid-cols-3 items-center px-4 py-4"
      aria-label="Pagination"
    >
      <div>
        <PrevButton
          id="tradePaginationPrevBtn_tradePage"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
      </div>
      <div className="flex justify-center">
        <span
          id="tradePaginationInfo_tradePage"
          className="text-xs text-gray-600 min-w-[80px] text-center"
          aria-live="polite"
        >
          Page {page} of {totalPages}
          {total != null ? ` · ${total} trades` : ''}
        </span>
      </div>
      <div className="flex justify-end">
        <NextButton
          id="tradePaginationNextBtn_tradePage"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  )
}
