'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import ProductBrandUpdate from '../UpdateProductBrand'
import { updateProductBrand } from '@/lib/api/productBrand'
import { ChevronLeft, ChevronRight, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductBrandsTable({
  brands = [],
  page,
  totalPages,
  total,
  filterStatus,
  searchQuery = '',
  onPrev,
  onNext,
  onRefresh,
}) {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)

  const getStatusClasses = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
      case 'deleted':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
      case 'inactive':
        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
      default:
        return 'bg-slate-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    }
  }

  const allSelected = brands.length > 0 && brands.every((b) => selectedIds.includes(b.id))
  const someSelected = brands.some((b) => selectedIds.includes(b.id)) && !allSelected

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(brands.map((b) => b.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))
  }

  const handleBulkStatusChange = async (newStatus) => {
    setBulkLoading(true)
    try {
      const brandsToUpdate = brands.filter((b) => selectedIds.includes(b.id))
      await Promise.all(
        brandsToUpdate.map((b) =>
          updateProductBrand(b.id, {
            brand_status: newStatus,
            brand: b.brand,
            note: b.note || '',
          })
        )
      )
      toast.success(`${brandsToUpdate.length} brand${brandsToUpdate.length > 1 ? 's' : ''} updated`)
      setSelectedIds([])
      onRefresh()
    } catch (err) {
      toast.error(err.message || 'Failed to update brands')
    } finally {
      setBulkLoading(false)
    }
  }

  const emptyMessage = (() => {
    if (searchQuery) return 'No brands match your search'
    if (filterStatus) return `No ${filterStatus} brands found`
    return 'No product brands yet. Start by adding a new brand'
  })()

  return (
    <>
      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div
          id="bulkActionBar_productBrandPage"
          className="flex items-center gap-2 flex-wrap mx-5 mt-4 mb-3 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg"
        >
          <span className="text-sm font-medium text-violet-700">{selectedIds.length} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              id="bulkSetActiveBtn_productBrandPage"
              className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50"
              disabled={bulkLoading}
              onClick={() => handleBulkStatusChange('active')}
            >
              Set Active
            </Button>
            <Button
              size="sm"
              variant="outline"
              id="bulkSetInactiveBtn_productBrandPage"
              className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
              disabled={bulkLoading}
              onClick={() => handleBulkStatusChange('inactive')}
            >
              Set Inactive
            </Button>
            <Button
              size="sm"
              variant="ghost"
              id="bulkDeselectAllBtn_productBrandPage"
              className="h-7 text-xs text-slate-500 hover:text-slate-700"
              disabled={bulkLoading}
              onClick={() => setSelectedIds([])}
            >
              <X className="size-3 mr-1" />
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {brands.length === 0 ? (
        <div
          id="emptyState_productBrandPage"
          className="text-center font-medium text-slate-foreground py-10"
        >
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <table
            id="productBrandsTable_productBrandPage"
            className="min-w-full text-sm"
            aria-label="Product brands"
          >
            <thead>
              <tr className="border-b border-slate-100">
                <th
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[40px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    id="selectAllBrands_productBrandPage"
                    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all brands"
                  />
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[30px]">
                  #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Brand
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[120px]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[100px]">
                  Products
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Notes
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[60px]">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {brands.map((productBrand, index) => (
                <tr
                  key={productBrand.id}
                  data-testid={`brandRow_${productBrand.id}_productBrandPage`}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedBrand(productBrand)}
                >
                  <td className="px-5 py-3.5 w-[40px]" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      data-testid={`brandCheckbox_${productBrand.id}_productBrandPage`}
                      checked={selectedIds.includes(productBrand.id)}
                      onCheckedChange={(checked) => handleSelectOne(productBrand.id, checked)}
                      aria-label={`Select ${productBrand.brand}`}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-700 w-[30px]">
                    {(page - 1) * 15 + index + 1}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{productBrand.brand}</td>
                  <td className="px-5 py-3.5 w-[120px]">
                    <Badge
                      className={cn('capitalize', getStatusClasses(productBrand.brand_status))}
                    >
                      {productBrand.brand_status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-700 w-[100px]">
                    {productBrand.product_count > 0 ? (
                      <Badge
                        data-testid={`productCountBadge_${productBrand.id}_productBrandPage`}
                        className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(
                            `/main/inventory/product-list?brand=${encodeURIComponent(productBrand.brand)}`
                          )
                        }}
                        title={`View ${productBrand.product_count} product(s) for ${productBrand.brand}`}
                      >
                        {productBrand.product_count}
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200">
                        {productBrand.product_count}
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                    {productBrand.note || '—'}
                  </td>
                  <td
                    className="px-5 py-3.5 text-center w-[60px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      data-testid={`editBrandBtn_${productBrand.id}_productBrandPage`}
                      aria-label={`Edit ${productBrand.brand}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedBrand(productBrand)
                      }}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-violet-500 hover:bg-violet-100 transition-colors min-h-[32px] min-w-[32px]"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 mt-2" aria-label="Pagination">
              <button
                onClick={onPrev}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Prev
              </button>
              <span className="text-xs text-slate-400 text-center" aria-live="polite">
                Page {page} of {totalPages} · {total} records
              </span>
              <button
                onClick={onNext}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}

      <ProductBrandUpdate
        productBrand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        onUpdated={onRefresh}
      />
    </>
  )
}
