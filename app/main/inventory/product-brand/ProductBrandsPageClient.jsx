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
import { Search, X, PackageOpen, AlertCircle, RefreshCw } from 'lucide-react'
import InventoryTableSkeleton from '@/app/main/components/InventoryTableSkeleton'

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

const BRAND_SKELETON_HEADER = [
  'h-4 w-4 rounded',
  'h-4 w-6 rounded',
  'h-4 w-28 rounded',
  'h-4 w-16 rounded ml-auto',
  'h-4 w-16 rounded',
  'h-4 w-24 rounded',
  'h-4 w-10 rounded',
]
const BRAND_SKELETON_ROW = [
  'h-4 w-4 rounded',
  'h-4 w-4 rounded',
  'h-4 w-28 rounded',
  'h-5 w-16 rounded-full ml-auto',
  'h-5 w-8 rounded-full',
  'h-4 w-32 rounded',
  'h-6 w-6 rounded',
]

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

      <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white flex flex-col">
        {/* Title */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-5">
          <ProductBrandTableHeader brands={brands} />
        </div>

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
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          {loading ? (
            <InventoryTableSkeleton
              headerCols={BRAND_SKELETON_HEADER}
              rowCols={BRAND_SKELETON_ROW}
            />
          ) : error ? (
            <div
              id="errorState_productBrandPage"
              className="flex flex-col items-center justify-center gap-3 py-12 text-center"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="h-10 w-10 text-red-400" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-600">Failed to load brands</p>
                <p className="text-xs text-slate-400">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1.5">
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Retry
              </Button>
            </div>
          ) : !hasActiveFilters && brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <PackageOpen className="h-10 w-10 text-slate-300" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-600">No brands yet</p>
                <p className="text-xs text-slate-400">
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
    </div>
  )
}
