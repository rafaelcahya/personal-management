'use client'

import { useState, useEffect } from 'react'
import ProductBrandsTable from './list/ProductBrandsTable'
import ProductBrandTableHeader from './list/component/ProductBrandTableHeader'
import AddProductBrand from './AddProductBrand'
import { fetchProductBrand } from '@/lib/api/productBrand'
import ProductBrandFilterDropdown from './list/component/ProductBrandFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, X, PackageOpen } from 'lucide-react'

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

function TableSkeleton() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-6 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-16 rounded ml-auto" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-4 border-b border-slate-100">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-5 w-16 rounded-full ml-auto" />
            <Skeleton className="h-5 w-8 rounded-full" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductBrandsPageClient({ initialBrands }) {
  const [brands, setBrands] = useState(initialBrands ?? null)
  const [loading, setLoading] = useState(initialBrands == null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('name-asc')

  const fetchProductBrands = async () => {
    try {
      const data = await fetchProductBrand()
      setBrands(data || [])
    } catch (err) {
      console.error('Failed to fetch product brands:', err)
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialBrands == null) {
      fetchProductBrands()
    }
  }, [])

  const brandList = brands ?? []

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
          <ProductBrandTableHeader brands={brandList} />
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
              <AddProductBrand onAdded={fetchProductBrands} />
            </div>
          </div>
        </div>

        {/* Table area */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          {loading ? (
            <TableSkeleton />
          ) : brandList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <PackageOpen className="h-10 w-10 text-slate-300" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-600">No brands yet</p>
                <p className="text-xs text-slate-400">
                  Add your first brand to start organizing your inventory
                </p>
              </div>
              <AddProductBrand onAdded={fetchProductBrands} />
            </div>
          ) : (
            <ProductBrandsTable
              productBrands={brandList}
              filterStatus={filterStatus}
              searchQuery={searchQuery}
              sortOrder={sortOrder}
            />
          )}
        </div>
      </div>
    </div>
  )
}
