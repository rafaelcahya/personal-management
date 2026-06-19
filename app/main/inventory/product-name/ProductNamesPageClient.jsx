'use client'

import { useState, useEffect } from 'react'
import ProductNamesTable from './list/ProductNamesTable'
import ProductNameTableHeader from './list/component/ProductNameTableHeader'
import AddProductName from './AddProductName'
import { fetchProductName } from '@/lib/api/productName'
import ProductNameFilterDropdown from './list/component/ProductNameFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { Input } from '@/components/ui/input'
import { Search, X, PackageOpen } from 'lucide-react'
import InventoryTableSkeleton from '@/app/main/components/InventoryTableSkeleton'
import { Button } from '@/components/ui/button'

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
        <button
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          id="clearSearchBtn_productNamePage"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

const NAME_SKELETON_HEADER = [
  'h-4 w-6 rounded',
  'h-4 w-28 rounded',
  'h-4 w-16 rounded ml-auto',
  'h-4 w-16 rounded',
  'h-4 w-24 rounded',
  'h-4 w-10 rounded',
]
const NAME_SKELETON_ROW = [
  'h-4 w-4 rounded',
  'h-4 w-32 rounded',
  'h-5 w-16 rounded-full ml-auto',
  'h-5 w-8 rounded-full',
  'h-4 w-32 rounded',
  'h-6 w-6 rounded',
]

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

      <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white flex flex-col">
        {/* Title */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-5">
          <ProductNameTableHeader names={names} />
        </div>

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
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          {error ? (
            <div
              id="errorState_productNamePage"
              className="flex flex-col items-center justify-center gap-3 py-12 text-center"
            >
              <p className="text-sm font-semibold text-red-600">Failed to load product names</p>
              <p className="text-xs text-slate-400">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="text-xs h-8">
                Retry
              </Button>
            </div>
          ) : loading ? (
            <InventoryTableSkeleton
              id="loadingSkeleton_productNamePage"
              headerCols={NAME_SKELETON_HEADER}
              rowCols={NAME_SKELETON_ROW}
            />
          ) : total === 0 && !hasActiveFilters ? (
            <div
              id="emptyState_productNamePage"
              className="flex flex-col items-center justify-center gap-3 py-12 text-center"
            >
              <PackageOpen className="h-10 w-10 text-slate-300" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-600">No product names yet</p>
                <p className="text-xs text-slate-400">
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
    </div>
  )
}
