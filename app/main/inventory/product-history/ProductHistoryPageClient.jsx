'use client'

import { useState, useEffect } from 'react'
import { PackageOpen, Search, X, AlertCircle, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ProductHistoryTable from './ProductHistoryTable'
import InventoryTableSkeleton from '@/app/main/components/InventoryTableSkeleton'
import ProductHistoryTableHeader from './component/ProductHistoryTableHeader'
import ProductHistoryFilterDropdown from './component/ProductHistoryFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { fetchProductHistory } from '@/lib/api/productHistory'

const LIMIT = 15

function HistorySearchInput({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search product history..."
        aria-label="Search product history"
        id="searchInput_productHistoryPage"
        className="pl-8 pr-7 text-sm h-9 focus-visible:ring-violet-200 focus-visible:border-violet-500"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          id="clearSearchBtn_productHistoryPage"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

const HISTORY_SKELETON_HEADER = [
  'h-4 w-6 rounded',
  'h-4 w-32 rounded',
  'h-4 w-16 rounded',
  'h-4 w-10 rounded',
  'h-4 w-20 rounded',
  'h-4 w-20 rounded',
  'h-4 w-28 rounded ml-auto',
]
const HISTORY_SKELETON_ROW = [
  'h-4 w-4 rounded',
  'h-4 w-36 rounded',
  'h-5 w-16 rounded-full',
  'h-4 w-8 rounded',
  'h-4 w-20 rounded',
  'h-4 w-20 rounded',
  'h-4 w-28 rounded',
]

export default function ProductHistoryPageClient() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filterStatus, setFilterStatus] = useState('')
  const [sortOption, setSortOption] = useState('date_desc')
  const [searchQuery, setSearchQuery] = useState('')

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, filterStatus, sortOption])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProductHistory({
      page,
      limit: LIMIT,
      search: searchQuery || undefined,
      status: filterStatus || undefined,
      sort: sortOption,
    })
      .then((result) => {
        if (cancelled) return
        setData(result.data ?? [])
        setTotal(result.total ?? 0)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Failed to load product history')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, searchQuery, filterStatus, sortOption])

  const totalPages = Math.ceil(total / LIMIT)
  const hasActiveFilters = !!(filterStatus || searchQuery)

  function handleClearFilters() {
    setSearchQuery('')
    setFilterStatus('')
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <PageHeader
        title="Product History"
        description="Track product usage and restock history"
        breadcrumbs={[
          { label: 'Inventory', href: '/main/inventory' },
          { label: 'Product History' },
        ]}
      />

      <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white flex flex-col">
        {/* Title */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-5">
          <ProductHistoryTableHeader total={total} />
        </div>

        {/* Controls bar */}
        <div
          id="controlsBar_productHistoryPage"
          className="sticky top-0 z-10 bg-white border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-2.5"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
            <HistorySearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex items-center justify-end gap-2 shrink-0">
              <ProductHistoryFilterDropdown
                filter={filterStatus}
                onFilterChange={setFilterStatus}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          {loading ? (
            <InventoryTableSkeleton
              id="loadingSkeleton_productHistoryPage"
              headerCols={HISTORY_SKELETON_HEADER}
              rowCols={HISTORY_SKELETON_ROW}
            />
          ) : error ? (
            <div
              id="errorState_productHistoryPage"
              className="flex flex-col items-center justify-center gap-3 py-12 text-center"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="h-10 w-10 text-red-400" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-600">Failed to load history</p>
                <p className="text-xs text-slate-400">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p)}
                className="gap-1.5"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Retry
              </Button>
            </div>
          ) : !hasActiveFilters && data.length === 0 ? (
            <div
              id="emptyState_productHistoryPage"
              className="flex flex-col items-center justify-center gap-3 py-12 text-center"
            >
              <PackageOpen className="h-10 w-10 text-slate-300" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-600">No usage history yet</p>
                <p className="text-xs text-slate-400">
                  Usage records appear here once you start using a product
                </p>
              </div>
            </div>
          ) : (
            <ProductHistoryTable
              histories={data}
              page={page}
              totalPages={totalPages}
              total={total}
              onPrev={() => setPage((p) => p - 1)}
              onNext={() => setPage((p) => p + 1)}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>
      </div>
    </div>
  )
}
