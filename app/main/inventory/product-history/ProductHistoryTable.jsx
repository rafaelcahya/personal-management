'use client'

import Link from 'next/link'
import { SearchX, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Badge } from '@/components/base/Badge/Badge'
import { cn } from '@/lib/utils'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

function getStatusClasses(status) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'inactive':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ProductHistoryTable({
  histories = [],
  page,
  totalPages,
  total,
  onPrev,
  onNext,
  onClearFilters,
  hasActiveFilters,
}) {
  if (histories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <SearchX className="h-10 w-10 text-slate-400" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-700">No results found</p>
          <p className="text-sm text-slate-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filter.'
              : 'No history records match your criteria.'}
          </p>
        </div>
        {hasActiveFilters && onClearFilters && (
          <Button variant="outline" size="base" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-x-auto">
      <Table
        id="productHistoryTable_productHistoryPage"
        className="min-w-full"
        aria-label="Product history"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">#</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[80px]" align="right">
              Qty
            </TableHead>
            <TableHead className="w-[130px]">Start Date</TableHead>
            <TableHead className="w-[130px]">End Date</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {histories.map((history, index) => (
            <TableRow key={history.id} clickable>
              <TableCell className="font-mono text-slate-700 w-[40px]" align="right">
                {(page - 1) * 15 + index + 1}
              </TableCell>
              <TableCell className="w-[250px]">
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 truncate leading-tight">
                    {history.brand || '—'}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {history.product_list_id &&
                    Number.isInteger(Number(history.product_list_id)) ? (
                      <Link
                        href={`/main/inventory/product-list/${history.product_list_id}`}
                        className="font-semibold text-slate-900 text-sm truncate hover:text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-1 rounded"
                      >
                        {history.product}
                      </Link>
                    ) : (
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {history.product}
                      </p>
                    )}
                    {history.type && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                        {history.type}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[100px]">
                <Badge className={cn('capitalize', getStatusClasses(history.status))}>
                  {history.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-slate-700 w-[80px]" align="right">
                {history.quantity}
              </TableCell>
              <TableCell className="text-slate-700 w-[130px]">
                {formatDate(history.start_usage_date)}
              </TableCell>
              <TableCell className="text-slate-700 w-[130px]">
                {formatDate(history.end_usage_date)}
              </TableCell>
              <TableCell className="text-slate-500 max-w-xs truncate">
                {history.note || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 mt-2" aria-label="Pagination">
          <Button
            variant="ghost"
            onClick={onPrev}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 min-h-[44px]"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Prev
          </Button>
          <span className="text-xs text-slate-400 text-center" aria-live="polite">
            Page {page} of {totalPages} · {total} records
          </span>
          <Button
            variant="ghost"
            onClick={onNext}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 min-h-[44px]"
            aria-label="Next page"
          >
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}
