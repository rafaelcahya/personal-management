'use client'

import { useState, useEffect } from 'react'
import ProductNamesTable from './list/ProductNamesTable'
import ProductNameTableHeader from './list/component/ProductNameTableHeader'
import AddProductName from './AddProductName'
import { fetchProductName } from '@/lib/api/productName'
import ProductNameFilterDropdown from './list/component/ProductNameFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, X, PackageOpen } from 'lucide-react'

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

function TableSkeleton() {
  return (
    <div id="loadingSkeleton_productNamePage" className="flex-1 overflow-auto">
      <div className="rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-4">
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
            <Skeleton className="h-4 w-32 rounded" />
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

export default function ProductNamesPageClient({ initialNames }) {
  const [names, setNames] = useState(initialNames ?? null)
  const [loading, setLoading] = useState(initialNames == null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('name-asc')

  const fetchProductNames = async () => {
    try {
      const productNames = await fetchProductName()
      setNames(productNames || [])
    } catch (err) {
      console.error('Failed to fetch product names:', err)
      setNames([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialNames == null) {
      fetchProductNames()
    }
  }, [])

  const nameList = names ?? []

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
          <ProductNameTableHeader names={nameList} />
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
              <AddProductName onAdded={fetchProductNames} />
            </div>
          </div>
        </div>

        {/* Table area */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          {loading ? (
            <TableSkeleton />
          ) : nameList.length === 0 ? (
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
              <AddProductName onAdded={fetchProductNames} />
            </div>
          ) : (
            <ProductNamesTable
              productNames={nameList}
              filterStatus={filterStatus}
              searchQuery={searchQuery}
              sortOrder={sortOrder}
              onClearSearch={() => setSearchQuery('')}
              onClearFilter={() => setFilterStatus(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
