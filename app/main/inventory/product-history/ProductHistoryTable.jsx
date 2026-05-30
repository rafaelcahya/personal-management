'use client'

import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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

function applySort(records, sortOption) {
  const sorted = [...records]
  switch (sortOption) {
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.start_usage_date) - new Date(b.start_usage_date))
    case 'name_asc':
      return sorted.sort((a, b) =>
        (a.product || '').localeCompare(b.product || '', undefined, { sensitivity: 'base' })
      )
    case 'name_desc':
      return sorted.sort((a, b) =>
        (b.product || '').localeCompare(a.product || '', undefined, { sensitivity: 'base' })
      )
    case 'date_desc':
    default:
      return sorted.sort((a, b) => new Date(b.start_usage_date) - new Date(a.start_usage_date))
  }
}

export default function ProductHistoryTable({
  productHistories = [],
  filterStatus,
  searchQuery = '',
  sortOption = 'date_desc',
  onClearFilters,
}) {
  const hasActiveFilters = filterStatus || searchQuery

  const filtered = productHistories.filter((history) => {
    const matchesStatus = !filterStatus || history.status === filterStatus
    const matchesSearch =
      !searchQuery || (history.product || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const sorted = applySort(filtered, sortOption)

  if (sorted.length === 0) {
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
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <Table id="productHistoryTable_productHistoryPage" className="w-full table-auto">
        <TableHeader className="bg-slate-100">
          <TableRow className="border-none">
            <TableHead className="py-2 text-slate-foreground rounded-l-lg text-center w-[40px]">
              #
            </TableHead>
            <TableHead className="py-2 text-slate-foreground w-[250px]">Product</TableHead>
            <TableHead className="py-2 text-slate-foreground text-center w-[100px]">
              Status
            </TableHead>
            <TableHead className="py-2 text-slate-foreground text-center w-[80px]">
              Quantity
            </TableHead>
            <TableHead className="py-2 text-slate-foreground text-center w-[130px]">
              Start Date
            </TableHead>
            <TableHead className="py-2 text-slate-foreground text-center w-[130px]">
              End Date
            </TableHead>
            <TableHead className="py-2 text-slate-foreground rounded-r-lg">Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((history, index) => (
            <TableRow key={history.id} className="hover:bg-slate-100">
              <TableCell className="text-center text-sm font-mono w-[40px]">{index + 1}</TableCell>
              <TableCell className="w-[250px]">
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 truncate leading-tight">
                    {history.brand || '—'}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {history.product_list_id ? (
                      <Link
                        href={`/main/inventory/product-list/${history.product_list_id}`}
                        className="font-medium text-violet-700 text-sm truncate hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-1 rounded"
                      >
                        {history.product}
                      </Link>
                    ) : (
                      <p className="font-medium text-slate-700 text-sm truncate">
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
              <TableCell className="text-center w-[100px]">
                <Badge className={cn('capitalize', getStatusClasses(history.status))}>
                  {history.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-mono font-medium w-[80px]">
                {history.quantity}
              </TableCell>
              <TableCell className="text-center text-sm w-[130px]">
                {formatDate(history.start_usage_date)}
              </TableCell>
              <TableCell className="text-center text-sm w-[130px]">
                {formatDate(history.end_usage_date)}
              </TableCell>
              <TableCell>
                <p className="line-clamp-2 text-sm text-slate-600">{history.note || '-'}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
