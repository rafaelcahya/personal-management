'use client'

import { useState, useEffect } from 'react'
import { History, Search, X, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProductHistoryTable from './ProductHistoryTable'
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ProductHistoryTableHeader />

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
        {loading ? (
          <div
            id="loadingSkeleton_productHistoryPage"
            className="animate-pulse"
            aria-label="Loading product history"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 flex-1 hidden sm:block" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            id="errorState_productHistoryPage"
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Failed to load history</p>
              <p className="text-xs text-slate-500">Check your connection and try again</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p)}
              className="min-w-11"
            >
              Try again
            </Button>
          </div>
        ) : !hasActiveFilters && data.length === 0 ? (
          <div
            id="emptyState_productHistoryPage"
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
          >
            <History className="size-10 text-slate-300" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">No usage history yet</p>
              <p className="text-xs text-slate-500">
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
  )
}
