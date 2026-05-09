// ProductNamesPageClient.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import ProductNamesTable from './list/ProductNamesTable'
import ProductNameTableHeader from './list/component/ProductNameTableHeader'
import AddProductName from './AddProductName'
import { fetchProductName } from '@/lib/api/productName'
import ProductNameFilterDropdown from './list/component/ProductNameFilterDropdown'
import PageHeader from '../../components/PageHeader'

export default function ProductNamesPageClient({ initialNames }) {
  const [names, setNames] = useState(initialNames)
  const [filterStatus, setFilterStatus] = useState(null)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  const scrollContainerRef = useRef(null)
  const headerSentinelRef = useRef(null)

  const fetchProductNames = async () => {
    try {
      const productNames = await fetchProductName()
      setNames(productNames || [])
    } catch (err) {
      console.error('Failed to fetch product names:', err)
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
  }, [names])

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <PageHeader
        title="Product Name"
        description="Manage product names and categories"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product Name' }]}
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
            <div className="flex items-center justify-between gap-2 shrink-0">
              <ProductNameFilterDropdown
                filter={filterStatus}
                onFilterChange={handleFilter}
                productNames={names}
              />
              <AddProductName onAdded={fetchProductNames} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-4 gap-2 sm:gap-3">
            <div className="max-w-full sm:max-w-[500px]">
              <ProductNameTableHeader names={names} />
              <div ref={headerSentinelRef} className="h-px" />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <ProductNameFilterDropdown
                filter={filterStatus}
                onFilterChange={handleFilter}
                productNames={names}
              />
              <AddProductName onAdded={fetchProductNames} />
            </div>
          </div>

          {names.length === 0 ? (
            <p className="text-center font-medium text-slate-foreground py-8 sm:py-10 text-sm sm:text-base">
              No product names yet. Start by adding a new product name 🚀
            </p>
          ) : (
            <ProductNamesTable
              productNames={names}
              filterStatus={filterStatus}
              onFilterChange={handleFilter}
            />
          )}
        </div>
      </div>
    </div>
  )
}
