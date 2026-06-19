'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { bulkUpdateProductNameStatus } from '@/lib/api/productName'
import ProductNameUpdate from '../UpdateProductName'
import { ChevronLeft, ChevronRight, Pencil, SearchX, X } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductNamesTable({
  names = [],
  page = 1,
  totalPages = 1,
  total = 0,
  filterStatus,
  searchQuery = '',
  onPrev,
  onNext,
  onRefresh,
  onClearSearch,
  onClearFilter,
}) {
  const router = useRouter()
  const [selectedName, setSelectedName] = useState(null)
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
        return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
    }
  }

  const handleClearAll = () => {
    if (searchQuery) onClearSearch?.()
    if (filterStatus) onClearFilter?.()
  }

  const clearLabel = (() => {
    if (searchQuery && filterStatus) return 'Clear all'
    if (searchQuery) return 'Clear search'
    return 'Clear filter'
  })()

  const emptySubtext = (() => {
    if (searchQuery && filterStatus)
      return `No ${filterStatus} product names match "${searchQuery}"`
    if (searchQuery) return `No product names match "${searchQuery}"`
    return `No ${filterStatus} product names found`
  })()

  // Deselect rows that are no longer on the current page
  useEffect(() => {
    const visibleIds = new Set(names.map((n) => n.id))
    setSelectedIds((prev) => prev.filter((id) => visibleIds.has(id)))
  }, [names])

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? names.map((n) => n.id) : [])
  }

  const handleSelectOne = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))
  }

  const handleBulkStatusChange = async (newStatus) => {
    setBulkLoading(true)
    try {
      await bulkUpdateProductNameStatus(selectedIds, newStatus)
      toast.success(`${selectedIds.length} name${selectedIds.length > 1 ? 's' : ''} updated`)
      setSelectedIds([])
      onRefresh?.()
    } catch (err) {
      toast.error(err.message || 'Failed to update product names')
    } finally {
      setBulkLoading(false)
    }
  }

  const allSelected = names.length > 0 && names.every((n) => selectedIds.includes(n.id))
  const someSelected = names.some((n) => selectedIds.includes(n.id)) && !allSelected

  if (names.length === 0) {
    return (
      <div
        id="emptyState_productNamePage"
        className="flex flex-col items-center justify-center gap-3 py-12 text-center"
      >
        <SearchX className="h-10 w-10 text-slate-300" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-600">No results found</p>
          <p className="text-xs text-slate-400">{emptySubtext}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearAll} className="text-xs h-8">
          {clearLabel}
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div
          id="bulkActionBar_productNamePage"
          className="flex items-center gap-2 flex-wrap mb-3 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg"
        >
          <span className="text-sm font-medium text-violet-700">{selectedIds.length} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              id="bulkSetActiveBtn_productNamePage"
              className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50"
              disabled={bulkLoading}
              onClick={() => handleBulkStatusChange('active')}
            >
              Set Active
            </Button>
            <Button
              size="sm"
              variant="outline"
              id="bulkSetInactiveBtn_productNamePage"
              className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
              disabled={bulkLoading}
              onClick={() => handleBulkStatusChange('inactive')}
            >
              Set Inactive
            </Button>
            <Button
              size="sm"
              variant="ghost"
              id="bulkDeselectAllBtn_productNamePage"
              className="h-7 text-xs text-slate-500 hover:text-slate-700"
              disabled={bulkLoading}
              onClick={() => setSelectedIds([])}
            >
              <X className="size-3 mr-1" aria-hidden="true" />
              Deselect All
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <Table id="productNamesTable_productNamePage" className="w-full table-auto">
          <TableHeader className="bg-slate-100">
            <TableRow className="border-none">
              <TableHead
                className="py-2 text-slate-foreground rounded-l-lg w-[40px] text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  id="selectAllNames_productNamePage"
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all product names"
                  className="mx-auto"
                />
              </TableHead>
              <TableHead className="py-2 text-slate-foreground text-center w-[30px]">#</TableHead>
              <TableHead className="py-2 text-slate-foreground w-[200px]">Product Name</TableHead>
              <TableHead className="py-2 text-slate-foreground text-center w-[120px]">
                Status
              </TableHead>
              <TableHead className="py-2 text-slate-foreground text-center w-[100px]">
                Products
              </TableHead>
              <TableHead className="py-2 text-slate-foreground">Notes</TableHead>
              <TableHead className="py-2 text-slate-foreground rounded-r-lg text-center w-[60px]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {names.map((productName, index) => (
              <TableRow
                key={productName.id}
                className="hover:bg-slate-100 cursor-pointer"
                onClick={() => setSelectedName(productName)}
              >
                <TableCell className="text-center w-[40px]" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    id={`nameCheckbox_${productName.id}_productNamePage`}
                    checked={selectedIds.includes(productName.id)}
                    onCheckedChange={(checked) => handleSelectOne(productName.id, checked)}
                    aria-label={`Select ${productName.product_name}`}
                    className="mx-auto"
                  />
                </TableCell>

                <TableCell className="text-center text-sm font-mono w-[30px]">
                  {(page - 1) * 15 + index + 1}
                </TableCell>
                <TableCell className="font-semibold w-[200px]">
                  {productName.product_name}
                </TableCell>
                <TableCell className="text-center w-[120px]">
                  <Badge
                    className={cn('capitalize', getStatusClasses(productName.product_name_status))}
                  >
                    {productName.product_name_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center w-[100px]" onClick={(e) => e.stopPropagation()}>
                  {productName.product_count > 0 ? (
                    <button
                      type="button"
                      id={`productCountBadge_${productName.id}_productNamePage`}
                      aria-label={`View ${productName.product_count} product(s) for ${productName.product_name}`}
                      onClick={() =>
                        router.push(
                          `/main/inventory/product-list?name=${encodeURIComponent(productName.product_name)}`
                        )
                      }
                      className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-1 rounded"
                    >
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer">
                        {productName.product_count}
                      </Badge>
                    </button>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-500 border-slate-200">0</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <p className="line-clamp-2 text-sm text-slate-600">{productName.note || '-'}</p>
                </TableCell>
                <TableCell className="text-center w-[60px]" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    id={`editProductNameBtn_${productName.id}_productNamePage`}
                    aria-label={`Edit ${productName.product_name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedName(productName)
                    }}
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-violet-500 hover:bg-violet-100 transition-colors min-h-[32px] min-w-[32px]"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div
          id="paginationFooter_productNamePage"
          className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 text-xs text-slate-500"
        >
          <span>
            Page {page} of {totalPages} · {total} records
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              id="prevPageBtn_productNamePage"
              className="h-7 px-2 text-xs"
              onClick={onPrev}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              id="nextPageBtn_productNamePage"
              className="h-7 px-2 text-xs"
              onClick={onNext}
              disabled={page >= totalPages}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      <ProductNameUpdate
        productName={selectedName}
        onClose={() => setSelectedName(null)}
        onUpdated={onRefresh}
      />
    </>
  )
}
