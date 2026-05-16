'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  FilePenLine,
  MoreHorizontalIcon,
  Pencil,
  StarIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { favoriteProduct } from '@/lib/api/product'
import AddStockForm from '../detail/AddStockForm'
import StockAdjustment from '../detail/StockAdjustment'
import DeleteProductDialog from './component/DeleteProductDialog'
import EditProductSheet from './component/EditProductSheet'

const LOW_STOCK_THRESHOLD = 5

function QuantityBadge({ quantity }) {
  if (quantity === 0) {
    return (
      <Badge className="bg-red-100 text-red-600 hover:bg-red-100 font-mono">Out of Stock</Badge>
    )
  }
  if (quantity > 0 && quantity < LOW_STOCK_THRESHOLD) {
    return (
      <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100 font-mono">
        Low Stock
      </Badge>
    )
  }
  return <span className="font-mono font-medium tabular-nums">{quantity}</span>
}

function ActionMenu({
  product,
  onEdit,
  onRecordUsage,
  onToggleFavorite,
  loadingFavorite,
  onRefresh,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="actionMenuTrigger_productListPage"
          variant="ghost"
          size="icon"
          className="size-8 outline-none hover:bg-slate-200"
        >
          <MoreHorizontalIcon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          id="editAction_productListPage"
          onClick={() => onEdit(product)}
          className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Product
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="p-0 hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
        >
          <AddStockForm product={product} onAdded={onRefresh} />
        </DropdownMenuItem>
        <DropdownMenuItem
          id="recordUsageAction_productListPage"
          onClick={() => onRecordUsage(product)}
          className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
        >
          <FilePenLine className="h-4 w-4 mr-2" />
          Record Usage
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onToggleFavorite(product)}
          disabled={loadingFavorite === product.id}
          className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
        >
          <StarIcon
            className={`size-4 mr-2 ${
              product.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''
            }`}
          />
          {product.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </DropdownMenuItem>
        {!product.deleted_at && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
              <DeleteProductDialog product={product} onDeleted={onRefresh} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function ProductsTable({
  products,
  allProducts,
  onProductsChange,
  onRefresh,
  restockPredictions = {},
}) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editProduct, setEditProduct] = useState(null)
  const [loadingFavorite, setLoadingFavorite] = useState(null)
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedProducts = [...products].sort((a, b) => {
    const { column, direction } = sortConfig
    if (!column) return 0

    let aVal, bVal
    if (column === 'product') {
      aVal = `${a.brand ?? ''} ${a.product ?? ''}`.toLowerCase()
      bVal = `${b.brand ?? ''} ${b.product ?? ''}`.toLowerCase()
    } else if (column === 'quantity') {
      aVal = a.quantity ?? 0
      bVal = b.quantity ?? 0
    } else if (column === 'usage_date') {
      aVal = a.usage_date ? new Date(a.usage_date).getTime() : null
      bVal = b.usage_date ? new Date(b.usage_date).getTime() : null
      if (aVal === null && bVal === null) return 0
      if (aVal === null) return 1
      if (bVal === null) return -1
    } else if (column === 'in_use') {
      aVal = a.usage_quantity ?? 0
      bVal = b.usage_quantity ?? 0
    } else {
      return 0
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ column }) => {
    if (sortConfig.column !== column)
      return <ArrowUpDown className="size-3 opacity-50 inline ml-1" />
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="size-3 inline ml-1" />
    ) : (
      <ArrowDown className="size-3 inline ml-1" />
    )
  }

  const handleToggleFavorite = async (product) => {
    const newFavoriteStatus = !product.is_favorite
    const previousState = [...allProducts]
    setLoadingFavorite(product.id)

    onProductsChange((prev) => {
      const updated = prev.map((p) =>
        p.id === product.id ? { ...p, is_favorite: newFavoriteStatus } : p
      )
      return updated.sort((a, b) => {
        if (a.is_favorite === b.is_favorite) return 0
        return a.is_favorite ? -1 : 1
      })
    })

    try {
      await favoriteProduct(product.id, newFavoriteStatus)
      toast.success(
        newFavoriteStatus
          ? `${product.brand} added to favorites`
          : `${product.brand} removed from favorites`
      )
    } catch (error) {
      onProductsChange(previousState)
      toast.error(error.message || 'Failed to update favorite status')
    } finally {
      setLoadingFavorite(null)
    }
  }

  const sharedActionProps = {
    onEdit: setEditProduct,
    onRecordUsage: setSelectedProduct,
    onToggleFavorite: handleToggleFavorite,
    loadingFavorite,
    onRefresh,
  }

  return (
    <>
      {/* ── Mobile Card List (< sm) ── */}
      <div id="mobileCards_productListPage" className="flex flex-col gap-2 sm:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            id="mobileCard_productListPage"
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            {/* Row 1: name + status + actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <StarIcon
                  className={`size-3.5 flex-shrink-0 ${
                    product.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'invisible'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 truncate leading-tight">{product.brand}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <p className="font-medium text-slate-700 text-sm truncate">{product.product}</p>
                    {product.type && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                        {product.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Badge
                  className={`text-xs ${
                    product.product_status === 'active'
                      ? 'bg-green-100 text-green-600 hover:bg-green-100'
                      : 'bg-red-100 text-red-600 hover:bg-red-100'
                  } capitalize`}
                >
                  {product.product_status}
                </Badge>
                <ActionMenu product={product} {...sharedActionProps} />
              </div>
            </div>

            {/* Row 2: stats */}
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span>Qty:</span>
                <span className="font-medium text-slate-700">
                  <QuantityBadge quantity={product.quantity} />
                </span>
              </div>
              {restockPredictions[product.id] &&
                product.quantity > 0 &&
                (() => {
                  const { days_until_empty } = restockPredictions[product.id]
                  const isUrgent = days_until_empty <= 7
                  return (
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs font-mono ${isUrgent ? 'text-orange-500' : 'text-muted-foreground'}`}
                      >
                        ~{days_until_empty}d left
                      </span>
                    </div>
                  )
                })()}
              <div className="flex items-center gap-1">
                <span>In Use:</span>
                <span className="font-mono font-medium text-slate-700">
                  {product.usage_quantity}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>Last used:</span>
                <span className="font-medium text-slate-700">
                  {product.usage_date ? format(new Date(product.usage_date), 'dd MMM yyyy') : '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop Table (sm+) ── */}
      <Table id="desktopTable_productListPage" className="hidden sm:table w-full table-auto">
        <TableHeader className="bg-slate-100 sticky top-0 z-20">
          <TableRow className="border-none uppercase text-xs">
            <TableHead
              className="py-2 text-slate-foreground rounded-l-lg w-[35%] cursor-pointer select-none"
              onClick={() => handleSort('product')}
            >
              Product
              <SortIcon column="product" />
            </TableHead>
            <TableHead
              className="py-2 text-slate-foreground text-right w-[12%] cursor-pointer select-none"
              onClick={() => handleSort('quantity')}
            >
              Quantity
              <SortIcon column="quantity" />
            </TableHead>
            <TableHead
              className="py-2 text-slate-foreground text-right w-[15%] cursor-pointer select-none"
              onClick={() => handleSort('in_use')}
            >
              In Use
              <SortIcon column="in_use" />
            </TableHead>
            <TableHead
              className="py-2 text-slate-foreground text-center w-[13%] cursor-pointer select-none"
              onClick={() => handleSort('usage_date')}
            >
              Usage Date
              <SortIcon column="usage_date" />
            </TableHead>
            <TableHead className="py-2 text-slate-foreground text-center w-[13%]">
              Product Status
            </TableHead>
            <TableHead className="py-2 text-slate-foreground text-center rounded-r-lg w-[12%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-slate-100">
              <TableCell className="w-[35%]">
                <div className="flex items-center gap-3">
                  <StarIcon
                    className={`size-4 flex-shrink-0 ${
                      product.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'invisible'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 truncate">{product.brand}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="font-medium text-slate-700 truncate">{product.product}</p>
                      {product.type && (
                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                          {product.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right w-[12%]">
                <QuantityBadge quantity={product.quantity} />
                {restockPredictions[product.id] &&
                  product.quantity > 0 &&
                  (() => {
                    const { days_until_empty } = restockPredictions[product.id]
                    const isUrgent = days_until_empty <= 7
                    return (
                      <p
                        className={`text-xs mt-0.5 font-mono ${isUrgent ? 'text-orange-500' : 'text-muted-foreground'}`}
                      >
                        ~{days_until_empty}d left
                      </p>
                    )
                  })()}
              </TableCell>
              <TableCell className="text-right font-mono font-medium tabular-nums w-[15%]">
                {product.usage_quantity}
              </TableCell>
              <TableCell className="text-center text-sm w-[13%]">
                {product.usage_date ? format(new Date(product.usage_date), 'dd MMM yyyy') : '-'}
              </TableCell>
              <TableCell className="text-center w-[13%]">
                <Badge
                  className={`${
                    product.product_status === 'active'
                      ? 'bg-green-100 text-green-600 hover:bg-green-100 capitalize'
                      : 'bg-red-100 text-red-600 hover:bg-red-100 capitalize'
                  }`}
                >
                  {product.product_status}
                </Badge>
              </TableCell>
              <TableCell className="text-center w-[12%]">
                <ActionMenu product={product} {...sharedActionProps} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProduct && (
        <StockAdjustment
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdated={async () => {
            await onRefresh()
            setSelectedProduct(null)
          }}
        />
      )}

      <EditProductSheet
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditProduct(null)
        }}
        onUpdated={onRefresh}
      />
    </>
  )
}
