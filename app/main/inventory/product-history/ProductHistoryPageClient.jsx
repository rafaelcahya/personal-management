'use client'

import { useState, useEffect } from 'react'
import { PackageOpen, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ProductHistoryTable from './ProductHistoryTable'
import InventoryTableSkeleton from '@/app/main/components/InventoryTableSkeleton'
import ProductHistoryTableHeader from './component/ProductHistoryTableHeader'
import ProductHistoryFilterDropdown from './component/ProductHistoryFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { fetchProductHistory } from '@/lib/api/productHistory'

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

export default function ProductHistoryPageClient({ initialHistory }) {
  const [history, setHistory] = useState(initialHistory ?? null)
  const [loading, setLoading] = useState(initialHistory == null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [sortOption, setSortOption] = useState('date_desc')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (initialHistory == null) {
      fetchProductHistory()
        .then((data) => setHistory(data || []))
        .catch(() => setHistory([]))
        .finally(() => setLoading(false))
    }
  }, [])

  const historyList = history ?? []

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
          <ProductHistoryTableHeader histories={historyList} />
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
                productHistories={historyList}
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
          ) : historyList.length === 0 ? (
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
              productHistories={historyList}
              filterStatus={filterStatus}
              searchQuery={searchQuery}
              sortOption={sortOption}
              onClearFilters={() => {
                setSearchQuery('')
                setFilterStatus(null)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
