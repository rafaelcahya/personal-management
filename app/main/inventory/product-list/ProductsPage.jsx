'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchProductList } from '@/lib/api/product'
import { toast } from 'sonner'
import ProductListSummary from './list/component/ProductListSummary'
import ProductTableHeader from './list/component/ProductTableHeader'
import ProductsTable from './list/ProductsTable'
import AddProductForm from './add-product/AddProductForm'
import ProductFilterDropdown from './list/component/ProductFilterDropdown'
import PageHeader from '../../components/PageHeader'

const FILTER_STORAGE_KEY = 'product-list-filter'

export default function ProductsPageClient() {
  const [listProduct, setListProduct] = useState([])
  const [filter, setFilter] = useState(null)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  const scrollContainerRef = useRef(null)
  const headerSentinelRef = useRef(null)

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

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const sentinel = headerSentinelRef.current
    const container = scrollContainerRef.current

    if (!sentinel || !container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting)
      },
      {
        root: container,
        threshold: 0,
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [listProduct])

  const filteredProducts = listProduct.filter((product) => {
    if (!filter) return true

    switch (filter) {
      case 'low-stock':
        return product.quantity < 5 && product.quantity > 0
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
  })

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)

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

    const message = messages[newFilter] || messages[null]
    const toastType = toastTypes[newFilter] || 'success'

    toast[toastType](message)
  }

  return (
    <div className="flex flex-col h-full gap-3 sm:gap-5 overflow-hidden">
      <PageHeader
        title="Product List"
        description="Manage and track all your products"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product List' }]}
      />
      <ProductListSummary products={listProduct} />

      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto relative border border-slate-200/50 shadow-slate-100 rounded-xl flex flex-col p-3 sm:p-5 bg-white"
      >
        <div
          className={`sticky top-0 z-30 transition-all duration-300 rounded-lg ${
            showStickyHeader
              ? 'opacity-100 translate-y-0 pointer-events-auto mb-2'
              : 'opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden'
          }`}
        >
          <div className="px-3 py-2.5 rounded-lg bg-white/5 backdrop-blur-[50px] border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between gap-2 shrink-0">
              <ProductFilterDropdown
                filter={filter}
                onFilterChange={handleFilterChange}
                products={listProduct}
              />
              <AddProductForm onAdded={fetchProducts} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-4 gap-2 sm:gap-3">
            <div className="max-w-full sm:max-w-[500px]">
              <ProductTableHeader />
              <div ref={headerSentinelRef} className="h-px" />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
              <ProductFilterDropdown
                filter={filter}
                onFilterChange={handleFilterChange}
                products={listProduct}
              />
              <AddProductForm onAdded={fetchProducts} />
            </div>
          </div>

          {listProduct.length === 0 ? (
            <p className="text-center font-medium text-slate-foreground py-8 sm:py-10 text-sm sm:text-base">
              No products yet. Start by adding a new product 🚀
            </p>
          ) : (
            <ProductsTable
              products={filteredProducts}
              allProducts={listProduct}
              filter={filter}
              setFilter={setFilter}
              onProductsChange={setListProduct}
              onRefresh={fetchProducts}
            />
          )}
        </div>
      </div>
    </div>
  )
}
