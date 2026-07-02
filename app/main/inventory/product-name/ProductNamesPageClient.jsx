'use client'

import { useState, useEffect } from 'react'
import ProductNamesTable from './list/ProductNamesTable'
import ProductNameTableHeader from './list/component/ProductNameTableHeader'
import AddProductName from './AddProductName'
import { fetchProductName } from '@/lib/api/productName'
import ProductNameFilterDropdown from './list/component/ProductNameFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { Input } from '@/components/ui/input'
import { Search, X, FileText, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Button from '@/components/base/Button/Button'

const LIMIT = 15

function NameSearchInput({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search product names..."
        aria-label="Search product names"
        id="searchInput_productNamePage"
        className="pl-8 pr-7 text-sm h-9 focus-visible:ring-violet-200 focus-visible:border-violet-500"
      />
      {searchQuery && (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          id="clearSearchBtn_productNamePage"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

export default function ProductNamesPageClient() {
  const [names, setNames] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('name_asc')

  const totalPages = Math.ceil(total / LIMIT)
  const hasActiveFilters = !!searchQuery || !!filterStatus

  useEffect(() => {
    setPage(1)
  }, [searchQuery, filterStatus, sortOrder])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchProductName({
          page,
          limit: LIMIT,
          search: searchQuery || undefined,
          status: filterStatus || undefined,
          sort: sortOrder,
        })
        if (!cancelled) {
          setNames(result.data ?? [])
          setTotal(result.total ?? 0)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load product names')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page, searchQuery, filterStatus, sortOrder])

  function handleRefresh() {
    setPage((p) => p)
  }

  const showTable = !error && (loading || total > 0 || hasActiveFilters)

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <PageHeader
        title="Product Name"
        description="Manage product names and categories"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product Name' }]}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ProductNameTableHeader names={names} />

        {/* Controls bar */}
        <div
          id="controlsBar_productNamePage"
          className="sticky top-0 z-10 bg-white border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-2.5"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
            <NameSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex items-center justify-between gap-2 shrink-0">
              <ProductNameFilterDropdown
                filter={filterStatus}
                onFilterChange={setFilterStatus}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
              />
              <AddProductName onAdded={handleRefresh} />
            </div>
          </div>
        </div>

        {/* Table area */}
        {error ? (
          <div
            id="errorState_productNamePage"
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Failed to load product names</p>
              <p className="text-xs text-slate-500">Check your connection and try again</p>
            </div>
            <Button variant="outline" size="base" onClick={handleRefresh} className="min-w-11">
              Try again
            </Button>
          </div>
        ) : loading ? (
          <div
            id="loadingSkeleton_productNamePage"
            className="animate-pulse"
            aria-label="Loading product names"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-10 rounded-full" />
                <Skeleton className="h-4 flex-1 hidden sm:block" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            ))}
          </div>
        ) : total === 0 && !hasActiveFilters ? (
          <div
            id="emptyState_productNamePage"
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
          >
            <FileText className="size-10 text-slate-300" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">No product names yet</p>
              <p className="text-xs text-slate-500">
                Add your first product name to start organizing your inventory
              </p>
            </div>
            <AddProductName onAdded={handleRefresh} />
          </div>
        ) : showTable ? (
          <ProductNamesTable
            names={names}
            page={page}
            totalPages={totalPages}
            total={total}
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onRefresh={handleRefresh}
            onClearSearch={() => setSearchQuery('')}
            onClearFilter={() => setFilterStatus(null)}
          />
        ) : null}
      </div>
    </div>
  )
}
