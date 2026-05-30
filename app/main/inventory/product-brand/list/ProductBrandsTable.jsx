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
import ProductBrandUpdate from '../UpdateProductBrand'
import { fetchProductBrand, updateProductBrand } from '@/lib/api/productBrand'
import { Pencil, X } from 'lucide-react'
import { toast } from 'sonner'

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'A → Z' },
  { value: 'name-desc', label: 'Z → A' },
  { value: 'most-products', label: 'Most' },
  { value: 'least-products', label: 'Fewest' },
]

function applySorting(brands, sortOrder) {
  const list = [...brands]
  switch (sortOrder) {
    case 'name-desc':
      return list.sort((a, b) => b.brand.localeCompare(a.brand))
    case 'most-products':
      return list.sort((a, b) => (b.product_count ?? 0) - (a.product_count ?? 0))
    case 'least-products':
      return list.sort((a, b) => (a.product_count ?? 0) - (b.product_count ?? 0))
    case 'name-asc':
    default:
      return list.sort((a, b) => a.brand.localeCompare(b.brand))
  }
}

export default function ProductBrandsTable({
  productBrands: initialProductBrands,
  filterStatus,
  searchQuery = '',
  sortOrder = 'name-asc',
}) {
  const router = useRouter()
  const [productBrandList, setProductBrandList] = useState(initialProductBrands || [])
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)

  const filteredBrands = applySorting(
    (productBrandList || []).filter((brand) => {
      const matchesStatus = !filterStatus || brand.brand_status === filterStatus
      const matchesSearch =
        !searchQuery || brand.brand.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    }),
    sortOrder
  )

  const fetchProductBrands = async () => {
    try {
      const brands = await fetchProductBrand()
      setProductBrandList(brands || [])
    } catch (err) {
      console.error('Failed to fetch product brands:', err)
    }
  }

  const refreshAll = useCallback(async () => {
    try {
      await fetchProductBrands()
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
        return 'bg-slate-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    }
  }

  useEffect(() => {
    setProductBrandList(initialProductBrands)
  }, [initialProductBrands])

  useEffect(() => {
    const visibleIds = new Set(filteredBrands.map((b) => b.id))
    setSelectedIds((prev) => prev.filter((id) => visibleIds.has(id)))
  }, [filterStatus, searchQuery])

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredBrands.map((b) => b.id))
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
      const brandsToUpdate = productBrandList.filter((b) => selectedIds.includes(b.id))
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
      await refreshAll()
    } catch (err) {
      toast.error(err.message || 'Failed to update brands')
    } finally {
      setBulkLoading(false)
    }
  }

  const allFilteredSelected =
    filteredBrands.length > 0 && filteredBrands.every((b) => selectedIds.includes(b.id))
  const someFilteredSelected =
    filteredBrands.some((b) => selectedIds.includes(b.id)) && !allFilteredSelected

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
          className="flex items-center gap-2 flex-wrap mb-3 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg"
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

      {filteredBrands.length === 0 ? (
        <div
          id="emptyState_productBrandPage"
          className="text-center font-medium text-slate-foreground py-10"
        >
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <Table id="productBrandsTable_productBrandPage" className="w-full table-auto">
            <TableHeader className="bg-slate-100">
              <TableRow className="border-none">
                <TableHead
                  className="py-2 text-slate-foreground rounded-l-lg w-[40px] text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    id="selectAllBrands_productBrandPage"
                    checked={
                      allFilteredSelected ? true : someFilteredSelected ? 'indeterminate' : false
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all brands"
                    className="mx-auto"
                  />
                </TableHead>
                <TableHead className="py-2 text-slate-foreground text-center w-[30px]">#</TableHead>
                <TableHead className="py-2 text-slate-foreground w-[200px]">
                  Product Brand
                </TableHead>
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
              {filteredBrands.map((productBrand, index) => (
                <TableRow
                  key={productBrand.id}
                  data-testid={`brandRow_${productBrand.id}_productBrandPage`}
                  className="hover:bg-slate-100 cursor-pointer"
                  onClick={() => setSelectedBrand(productBrand)}
                >
                  {/* Checkbox cell */}
                  <TableCell className="text-center w-[40px]" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      data-testid={`brandCheckbox_${productBrand.id}_productBrandPage`}
                      checked={selectedIds.includes(productBrand.id)}
                      onCheckedChange={(checked) => handleSelectOne(productBrand.id, checked)}
                      aria-label={`Select ${productBrand.brand}`}
                      className="mx-auto"
                    />
                  </TableCell>

                  <TableCell className="text-center text-sm font-mono w-[30px]">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold w-[200px]">{productBrand.brand}</TableCell>
                  <TableCell className="text-center w-[120px]">
                    <Badge
                      className={cn('capitalize', getStatusClasses(productBrand.brand_status))}
                    >
                      {productBrand.brand_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center w-[100px]">
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
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {productBrand.note || '-'}
                    </p>
                  </TableCell>

                  {/* Edit action button */}
                  <TableCell className="text-center w-[60px]" onClick={(e) => e.stopPropagation()}>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductBrandUpdate
        productBrand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        onUpdated={refreshAll}
      />
    </>
  )
}
