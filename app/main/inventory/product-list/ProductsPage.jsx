'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchProductList, getProductSummary, getRestockPredictions } from '@/lib/api/product'
import { toast } from 'sonner'
import ProductListSummary from './list/component/ProductListSummary'
import ProductTableHeader from './list/component/ProductTableHeader'
import ProductsTable from './list/ProductsTable'
import AddProductForm from './add-product/AddProductForm'
import ProductFilterDropdown from './list/component/ProductFilterDropdown'
import PageHeader from '../../components/PageHeader'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

const FILTER_STORAGE_KEY = 'product-list-filter'
const LOW_STOCK_THRESHOLD = 5

export default function ProductsPageClient() {
  const [listProduct, setListProduct] = useState([])
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [restockPredictions, setRestockPredictions] = useState({})

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    try {
      const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY)
      if (savedFilter) {
        setFilter(savedFilter === 'null' ? null : savedFilter)
      }
    } catch (error) {
      console.error('Failed to load filter from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, filter === null ? 'null' : filter)
    } catch (error) {
      console.error('Failed to save filter to localStorage:', error)
    }
  }, [filter])

  const fetchProducts = useCallback(async () => {
    try {
      const products = await fetchProductList()
      setListProduct(products || [])
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error(err.message || 'Failed to fetch products')
    }
  }, [])

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

  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchSummary(), fetchRestockPredictions()])
  }, [fetchProducts, fetchSummary, fetchRestockPredictions])

  useEffect(() => {
    fetchProducts()
    fetchSummary()
    fetchRestockPredictions()
  }, [fetchProducts, fetchSummary, fetchRestockPredictions])

  const filteredProducts = listProduct.filter((product) => {
    const matchesFilter = (() => {
      if (!filter) return true
      if (filter?.startsWith('type:')) return product.type === filter.slice(5)
      switch (filter) {
        case 'low-stock':
          return product.quantity > 0 && product.quantity < LOW_STOCK_THRESHOLD
        case 'out-stock':
          return product.quantity === 0
        case 'active':
          return product.product_status === 'active'
        case 'inactive':
          return product.product_status === 'inactive'
        case 'favorite':
          return product.is_favorite
        case 'never-used':
          return !product.usage_date
        default:
          return true
      }
    })()

    const matchesSearch = (() => {
      if (!debouncedSearch) return true
      const q = debouncedSearch.toLowerCase()
      return (
        product.brand?.toLowerCase().includes(q) ||
        product.product?.toLowerCase().includes(q) ||
        product.type?.toLowerCase().includes(q)
      )
    })()

    return matchesFilter && matchesSearch
  })

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)

    if (newFilter?.startsWith('type:')) {
      toast.success(`Showing ${newFilter.slice(5)} products`)
      return
    }

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

  const handleClearFilters = () => {
    setFilter(null)
    setSearch('')
  }

  const isFiltering = filter !== null || debouncedSearch !== ''

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

      <div className="border border-slate-200/50 shadow-slate-100 rounded-xl bg-white flex flex-col">
        {/* Title */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-5">
          <ProductTableHeader summary={summary} loading={summaryLoading} />
        </div>

        {/* Controls bar — sticky to viewport top while page scrolls */}
        <div
          data-testid="product-list-controls-bar"
          className="sticky top-0 z-10 bg-white border-b border-slate-100 px-3 sm:px-5 py-2 sm:py-2.5"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
            <SearchInput search={search} setSearch={setSearch} />
            <div className="flex items-center gap-2 shrink-0">
              <ProductFilterDropdown
                filter={filter}
                onFilterChange={handleFilterChange}
                summary={summary}
                summaryLoading={summaryLoading}
                products={listProduct}
              />
              <AddProductForm onAdded={handleRefresh} />
            </div>
          </div>
        </div>

        {/* Table area */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          {listProduct.length === 0 ? (
            <p className="text-center font-medium text-slate-foreground py-8 sm:py-10 text-sm sm:text-base">
              No products yet. Start by adding a new product 🚀
            </p>
          ) : filteredProducts.length === 0 && isFiltering ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-5xl text-slate-300">📦</span>
              <p className="font-semibold text-slate-600 text-sm">No products match your filters</p>
              {filter && (
                <p className="text-xs text-slate-400">
                  Active filter: <span className="font-medium">{filter}</span>
                </p>
              )}
              {debouncedSearch && (
                <p className="text-xs text-slate-400">
                  Search: <span className="font-medium">"{debouncedSearch}"</span>
                </p>
              )}
              <button
                onClick={handleClearFilters}
                className="mt-1 text-xs text-violet-600 hover:text-violet-700 underline underline-offset-2"
              >
                Clear filters & search
              </button>
            </div>
          ) : (
            <ProductsTable
              products={filteredProducts}
              allProducts={listProduct}
              onProductsChange={setListProduct}
              onRefresh={handleRefresh}
              restockPredictions={restockPredictions}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function SearchInput({ search, setSearch }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
      <Input
        data-testid="product-list-search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by brand or product name..."
        className="pl-8 pr-7 text-sm h-9 focus-visible:ring-violet-200 focus-visible:border-violet-500"
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
