'use client'

import { useCallback, useEffect, useState } from 'react'
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
import { fetchProductName, bulkUpdateProductNameStatus } from '@/lib/api/productName'
import ProductNameUpdate from '../UpdateProductName'
import { Pencil, SearchX, X } from 'lucide-react'
import { toast } from 'sonner'

function applySorting(names, sortOrder) {
  const list = [...names]
  switch (sortOrder) {
    case 'name-desc':
      return list.sort((a, b) => b.product_name.localeCompare(a.product_name))
    case 'most-products':
      return list.sort((a, b) => (b.product_count ?? 0) - (a.product_count ?? 0))
    case 'least-products':
      return list.sort((a, b) => (a.product_count ?? 0) - (b.product_count ?? 0))
    case 'name-asc':
    default:
      return list.sort((a, b) => a.product_name.localeCompare(b.product_name))
  }
}

export default function ProductNamesTable({
  productNames: initialProductNames,
  filterStatus,
  searchQuery = '',
  sortOrder = 'name-asc',
  onClearSearch,
  onClearFilter,
}) {
  const router = useRouter()
  const [productNameList, setProductNameList] = useState(initialProductNames || [])
  const [selectedName, setSelectedName] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)

  const filteredNames = applySorting(
    (productNameList || []).filter((productName) => {
      const matchesStatus = !filterStatus || productName.product_name_status === filterStatus
      const matchesSearch =
        !searchQuery || productName.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    }),
    sortOrder
  )

  const fetchProductNames = async () => {
    try {
      const names = await fetchProductName()
      setProductNameList(names)
    } catch (err) {
      console.error('Failed to fetch product names:', err)
    }
  }

  const refreshAll = useCallback(async () => {
    try {
      await fetchProductNames()
    } catch (err) {
      console.error('Refresh error:', err)
    }
  }, [])

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

  // Auto-deselect rows that are no longer visible when filter/search changes
  useEffect(() => {
    const visibleIds = new Set(filteredNames.map((n) => n.id))
    setSelectedIds((prev) => prev.filter((id) => visibleIds.has(id)))
  }, [filterStatus, searchQuery])

  useEffect(() => {
    setProductNameList(initialProductNames)
  }, [initialProductNames])

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredNames.map((n) => n.id))
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
      const namesToUpdate = productNameList.filter((n) => selectedIds.includes(n.id))
      await bulkUpdateProductNameStatus(
        namesToUpdate.map(({ id, product_name }) => ({ id, product_name })),
        newStatus
      )
      toast.success(`${namesToUpdate.length} name${namesToUpdate.length > 1 ? 's' : ''} updated`)
      setSelectedIds([])
      await refreshAll()
    } catch (err) {
      toast.error(err.message || 'Failed to update product names')
    } finally {
      setBulkLoading(false)
    }
  }

  const allFilteredSelected =
    filteredNames.length > 0 && filteredNames.every((n) => selectedIds.includes(n.id))
  const someFilteredSelected =
    filteredNames.some((n) => selectedIds.includes(n.id)) && !allFilteredSelected

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

      {filteredNames.length === 0 ? (
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
      ) : (
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
                    checked={
                      allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false
                    }
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
              {filteredNames.map((productName, index) => (
                <TableRow
                  key={productName.id}
                  className="hover:bg-slate-100 cursor-pointer"
                  onClick={() => setSelectedName(productName)}
                >
                  {/* Checkbox cell */}
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
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold w-[200px]">
                    {productName.product_name}
                  </TableCell>
                  <TableCell className="text-center w-[120px]">
                    <Badge
                      className={cn(
                        'capitalize',
                        getStatusClasses(productName.product_name_status)
                      )}
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
      )}

      <ProductNameUpdate
        productName={selectedName}
        onClose={() => setSelectedName(null)}
        onUpdated={refreshAll}
      />
    </>
  )
}
