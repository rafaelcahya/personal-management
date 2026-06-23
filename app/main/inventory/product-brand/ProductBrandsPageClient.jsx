'use client'

import { useState, useEffect } from 'react'
import ProductBrandsTable from './list/ProductBrandsTable'
import ProductBrandTableHeader from './list/component/ProductBrandTableHeader'
import AddProductBrand from './AddProductBrand'
import { fetchProductBrand } from '@/lib/api/productBrand'
import ProductBrandFilterDropdown from './list/component/ProductBrandFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Tag, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const LIMIT = 15

function BrandSearchInput({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search brands..."
        aria-label="Search brands"
        id="searchInput_productBrandPage"
        className="pl-8 pr-7 text-sm h-9 focus-visible:ring-violet-200 focus-visible:border-violet-500"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          id="clearSearchBtn_productBrandPage"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export default function ProductBrandsPageClient() {
  const [brands, setBrands] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('name_asc')

  const totalPages = Math.ceil(total / LIMIT)

  // Reset to page 1 when filters/sort/search change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, filterStatus, sortOrder])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProductBrand({
      page,
      limit: LIMIT,
      search: searchQuery || undefined,
      status: filterStatus || undefined,
      sort: sortOrder,
    })
      .then((result) => {
        if (cancelled) return
        setBrands(result.data ?? [])
        setTotal(result.total ?? 0)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Failed to load brands')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, searchQuery, filterStatus, sortOrder])

  const handleRefresh = () => setPage((p) => p)

  const hasActiveFilters = !!(filterStatus || searchQuery)

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <PageHeader
        title="Product Brand"
        description="Manage product brands in your inventory"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product Brand' }]}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ProductBrandTableHeader brands={brands} />

        {/* Controls bar */}
        <div
          id="controlsBar_productBrandPage"
          className="sticky top-0 z-10 bg-white border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-2.5"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
            <BrandSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex items-center justify-between gap-2 shrink-0">
              <ProductBrandFilterDropdown
                filter={filterStatus}
                onFilterChange={setFilterStatus}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
              />
              <AddProductBrand onAdded={handleRefresh} />
            </div>
          </div>
        </div>

        {/* Table area */}
        {loading ? (
          <div className="animate-pulse" aria-label="Loading brands">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-10 rounded-full" />
                <Skeleton className="h-4 flex-1 hidden sm:block" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            id="errorState_productBrandPage"
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Failed to load brands</p>
              <p className="text-xs text-slate-500">Check your connection and try again</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="min-w-11">
              Try again
            </Button>
          </div>
        ) : !hasActiveFilters && brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Tag className="size-10 text-slate-300" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">No brands yet</p>
              <p className="text-xs text-slate-500">
                Add your first brand to start organizing your inventory
              </p>
            </div>
            <AddProductBrand onAdded={handleRefresh} />
          </div>
        ) : (
          <ProductBrandsTable
            brands={brands}
            page={page}
            totalPages={totalPages}
            total={total}
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
            onRefresh={handleRefresh}
          />
        )}
      </div>
    </div>
  )
}
