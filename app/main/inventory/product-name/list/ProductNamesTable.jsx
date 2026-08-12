'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/base/Badge/Badge'
import Button from '@/components/base/Button/Button'
import { Checkbox } from '@/components/base/Checkbox/Checkbox'
import { bulkUpdateProductNameStatus } from '@/lib/api/productName'
import ProductNameUpdate from '../UpdateProductName'
import { SearchX, X } from 'lucide-react'
import { toast } from 'sonner'
import Pagination from '@/components/base/Pagination/Pagination'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

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
        <Button variant="outline" onClick={handleClearAll} className="text-xs h-8">
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
          className="flex items-center gap-2 flex-wrap mx-5 mt-4 mb-3 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg"
        >
          <span className="text-sm font-medium text-violet-700">{selectedIds.length} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              id="bulkSetActiveBtn_productNamePage"
              className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50"
              disabled={bulkLoading}
              onClick={() => handleBulkStatusChange('active')}
            >
              Set Active
            </Button>
            <Button
              variant="outline"
              id="bulkSetInactiveBtn_productNamePage"
              className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
              disabled={bulkLoading}
              onClick={() => handleBulkStatusChange('inactive')}
            >
              Set Inactive
            </Button>
            <Button
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

      <div className="flex-1 overflow-x-auto">
        <Table
          id="productNamesTable_productNamePage"
          className="min-w-full"
          aria-label="Product names"
        >
          <TableHeader sticky>
            <TableRow>
              <TableHead className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  id="selectAllNames_productNamePage"
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all product names"
                />
              </TableHead>
              <TableHead className="w-[30px]" align="center">
                #
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]" align="right">
                Products
              </TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {names.map((productName, index) => (
              <TableRow key={productName.id} clickable onClick={() => setSelectedName(productName)}>
                <TableCell className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    id={`nameCheckbox_${productName.id}_productNamePage`}
                    checked={selectedIds.includes(productName.id)}
                    onCheckedChange={(checked) => handleSelectOne(productName.id, checked)}
                    aria-label={`Select ${productName.product_name}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-slate-700 w-[30px]" align="center">
                  {(page - 1) * 15 + index + 1}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {productName.product_name}
                </TableCell>
                <TableCell className="w-[120px]">
                  <Badge
                    className={cn('capitalize', getStatusClasses(productName.product_name_status))}
                  >
                    {productName.product_name_status}
                  </Badge>
                </TableCell>
                <TableCell
                  className="font-mono text-slate-700 w-[100px]"
                  align="right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {productName.product_count > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      id={`productCountBadge_${productName.id}_productNamePage`}
                      aria-label={`View ${productName.product_count} product(s) for ${productName.product_name}`}
                      onClick={() =>
                        router.push(
                          `/main/inventory/product-list?name=${encodeURIComponent(productName.product_name)}`
                        )
                      }
                      className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-1 rounded hover:bg-transparent"
                    >
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer">
                        {productName.product_count}
                      </Badge>
                    </Button>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-500 border-slate-200">0</Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-500 max-w-xs truncate">
                  {productName.note || '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        id="paginationFooter_productNamePage"
        prevId="prevPageBtn_productNamePage"
        nextId="nextPageBtn_productNamePage"
        page={page}
        totalPages={totalPages}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
      />

      <ProductNameUpdate
        productName={selectedName}
        onClose={() => setSelectedName(null)}
        onUpdated={onRefresh}
      />
    </>
  )
}
