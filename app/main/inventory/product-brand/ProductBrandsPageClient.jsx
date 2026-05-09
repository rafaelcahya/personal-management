// ProductBrandsPageClient.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import ProductBrandsTable from './list/ProductBrandsTable'
import ProductBrandTableHeader from './list/component/ProductBrandTableHeader'
import AddProductBrand from './AddProductBrand'
import { fetchProductBrand } from '@/lib/api/productBrand'
import ProductBrandFilterDropdown from './list/component/ProductBrandFilterDropdown'
import PageHeader from '../../components/PageHeader'

export default function ProductBrandsPageClient({ initialBrands }) {
  const [brands, setBrands] = useState(initialBrands)
  const [filterStatus, setFilterStatus] = useState(null)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  const scrollContainerRef = useRef(null)
  const headerSentinelRef = useRef(null)

  const fetchProductBrands = async () => {
    try {
      const data = await fetchProductBrand()
      setBrands(data || [])
    } catch (err) {
      console.error('Failed to fetch product brands:', err)
    }
  }

  const handleFilter = (status) => {
    setFilterStatus(status)
  }

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
  }, [brands])

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <PageHeader
        title="Product Brand"
        description="Manage product brands in your inventory"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product Brand' }]}
      />
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
            <div className="flex items-center gap-2 justify-between shrink-0">
              <ProductBrandFilterDropdown
                filter={filterStatus}
                onFilterChange={handleFilter}
                productBrands={brands}
              />
              <AddProductBrand onAdded={fetchProductBrands} context="mobile" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-4 gap-2 sm:gap-3">
            <div className="max-w-full sm:max-w-[500px]">
              <ProductBrandTableHeader brands={brands} />
              <div ref={headerSentinelRef} className="h-px" />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <ProductBrandFilterDropdown
                filter={filterStatus}
                onFilterChange={handleFilter}
                productBrands={brands}
              />
              <AddProductBrand onAdded={fetchProductBrands} context="desktop" />
            </div>
          </div>

          {brands.length === 0 ? (
            <p className="text-center font-medium text-slate-foreground py-8 sm:py-10 text-sm sm:text-base">
              No product brands yet. Start by adding a new product brand 🚀
            </p>
          ) : (
            <ProductBrandsTable
              productBrands={brands}
              filterStatus={filterStatus}
              onFilterChange={handleFilter}
            />
          )}
        </div>
      </div>
    </div>
  )
}
