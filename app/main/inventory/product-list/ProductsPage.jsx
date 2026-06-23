'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchProductList, getProductSummary, getRestockPredictions } from '@/lib/api/product'
import { toast } from 'sonner'
import ProductListSummary from './list/component/ProductListSummary'
import ProductTableHeader from './list/component/ProductTableHeader'
import ProductsTable from './list/ProductsTable'
import AddProductForm from './add-product/AddProductForm'
import ProductFilterDropdown from './list/component/ProductFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Search, X, AlertCircle, Package } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

const FILTER_STORAGE_KEY = 'product-list-filter'

export default function ProductsPageClient() {
  const searchParams = useSearchParams()

  // pagination + server data
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // filter + search + sort
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(null)

  // summary + restock (separate endpoints — unchanged)
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [restockPredictions, setRestockPredictions] = useState({})

  const debouncedSearch = useDebounce(search, 300)

  // initialised ref so URL params + localStorage run only once
  const initialised = useRef(false)

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true

    // URL params take priority over localStorage
    const brandParam = searchParams.get('brand')
    const nameParam = searchParams.get('name')
    if (brandParam) {
      setSearch(decodeURIComponent(brandParam))
      return
    }
    if (nameParam) {
      setSearch(decodeURIComponent(nameParam))
      return
    }

    // restore filter from localStorage
    try {
      const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY)
      if (savedFilter) {
        setFilter(savedFilter === 'null' ? null : savedFilter)
      }
    } catch {
      // ignore
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // persist filter to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, filter === null ? 'null' : filter)
    } catch {
      // ignore
    }
  }, [filter])

  const fetchProducts = useCallback(
    async (overridePage) => {
      const targetPage = overridePage ?? page
      setLoading(true)
      setError(null)
      try {
        const result = await fetchProductList({
          page: targetPage,
          limit: 15,
          search: debouncedSearch || undefined,
          filter: filter || undefined,
          sort: sort || undefined,
        })
        setProducts(result.data || [])
        setTotal(result.total || 0)
        setPage(result.page || targetPage)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message || 'Failed to fetch products')
        toast.error(err.message || 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    },
    [page, debouncedSearch, filter, sort]
  )

  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true)
      const data = await getProductSummary()
      setSummary(data)
    } catch (err) {
      console.error('Summary fetch error:', err)
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  const fetchRestockPredictions = useCallback(async () => {
    try {
      const data = await getRestockPredictions()
      const map = {}
      for (const item of data || []) {
        map[item.product_list_id] = item
      }
      setRestockPredictions(map)
    } catch (err) {
      console.error('Restock predictions fetch error:', err)
    }
  }, [])

  // fetch products whenever page / debouncedSearch / filter / sort changes
  useEffect(() => {
    fetchProducts()
  }, [page, debouncedSearch, filter, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  // summary + restock are independent — fetch once on mount
  useEffect(() => {
    fetchSummary()
    fetchRestockPredictions()
  }, [fetchSummary, fetchRestockPredictions])

  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchProducts(1), fetchSummary(), fetchRestockPredictions()])
    setPage(1)
  }, [fetchProducts, fetchSummary, fetchRestockPredictions])

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setPage(1)

    const messages = {
      null: 'Showing all products',
      active: 'Showing active products',
      inactive: 'Showing inactive products',
      favorite: 'Showing favorite products',
      'low-stock': 'Showing low stock products',
      'out-stock': 'Showing out of stock products',
      'never-used': 'Showing never used products',
    }

    const toastTypes = {
      null: 'success',
      active: 'success',
      inactive: 'success',
      favorite: 'success',
      'low-stock': 'warning',
      'out-stock': 'error',
      'never-used': 'info',
    }

    toast[toastTypes[newFilter] || 'success'](messages[newFilter] || messages[null])
  }

  const handleSortChange = (newSort) => {
    setSort(newSort)
    setPage(1)
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilter(null)
    setSearch('')
    setSort(null)
    setPage(1)
  }

  const totalPages = Math.ceil(total / 15)
  const isFiltering = filter !== null || debouncedSearch !== '' || sort !== null

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <PageHeader
        title="Product List"
        description="Manage and track all your products"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product List' }]}
      />
      <ProductListSummary
        summary={summary}
        loading={summaryLoading}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ProductTableHeader summary={summary} loading={summaryLoading} />

        {/* Controls bar */}
        <div
          id="controlsBar_productListPage"
          className="sticky top-0 z-10 bg-white border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-2.5"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
            <SearchInput search={search} onSearchChange={handleSearchChange} />
            <div className="flex items-center justify-between gap-2 shrink-0">
              <ProductFilterDropdown
                filter={filter}
                onFilterChange={handleFilterChange}
                summary={summary}
                summaryLoading={summaryLoading}
              />
              <AddProductForm onAdded={handleRefresh} />
            </div>
          </div>
        </div>

        {/* Table area */}
        {loading ? (
          <div
            id="loadingSkeleton_productListPage"
            className="animate-pulse"
            aria-label="Loading products"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20 hidden sm:block" />
                <Skeleton className="h-4 w-16 hidden sm:block" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            id="errorState_productListPage"
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Failed to load products</p>
              <p className="text-xs text-slate-500">Check your connection and try again</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProducts()}
              className="min-w-11"
            >
              Try again
            </Button>
          </div>
        ) : products.length === 0 && !isFiltering ? (
          <div
            id="emptyState_productListPage"
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
          >
            <Package className="size-10 text-slate-300" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">No products yet</p>
              <p className="text-xs text-slate-500">Start by adding your first product</p>
            </div>
          </div>
        ) : products.length === 0 && isFiltering ? (
          <div
            id="filteredEmptyState_productListPage"
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
          >
            <Package className="size-10 text-slate-300" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">No products match your filters</p>
              {filter && (
                <p className="text-xs text-slate-500">
                  Active filter: <span className="font-medium">{filter}</span>
                </p>
              )}
              {debouncedSearch && (
                <p className="text-xs text-slate-500">
                  Search: <span className="font-medium">"{debouncedSearch}"</span>
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleClearFilters} className="min-w-11">
              Clear filters
            </Button>
          </div>
        ) : (
          <ProductsTable
            products={products}
            sort={sort}
            onSortChange={handleSortChange}
            onRefresh={handleRefresh}
            restockPredictions={restockPredictions}
            page={page}
            total={total}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        )}
      </div>
    </div>
  )
}

function SearchInput({ search, onSearchChange }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
      <Input
        id="searchInput_productListPage"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by brand or product name..."
        className="pl-8 pr-7 text-sm h-9 focus-visible:ring-violet-200 focus-visible:border-violet-500"
      />
      {search && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
