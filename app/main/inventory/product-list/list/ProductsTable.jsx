'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/base/Badge/Badge'
import Button from '@/components/base/Button/Button'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
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

// Maps table column clicks to SORT_MAP keys used by the API
const COLUMN_SORT_MAP = {
  product: { asc: 'product_asc', desc: 'product_desc' },
  quantity: { asc: 'quantity_asc', desc: 'quantity_desc' },
  in_use: { asc: 'in_use_asc', desc: 'in_use_desc' },
  usage_date: { asc: 'usage_date_asc', desc: 'usage_date_desc' },
}

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

function SortIcon({ column, sort }) {
  if (!sort) return <ArrowUpDown className="size-3 opacity-50 inline ml-1" />
  const sortMap = COLUMN_SORT_MAP[column]
  if (!sortMap) return <ArrowUpDown className="size-3 opacity-50 inline ml-1" />
  if (sort === sortMap.asc) return <ArrowUp className="size-3 inline ml-1" />
  if (sort === sortMap.desc) return <ArrowDown className="size-3 inline ml-1" />
  return <ArrowUpDown className="size-3 opacity-50 inline ml-1" />
}

export default function ProductsTable({
  products,
  sort,
  onSortChange,
  onRefresh,
  restockPredictions = {},
  page,
  total,
  totalPages,
  onPrev,
  onNext,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editProduct, setEditProduct] = useState(null)
  const [loadingFavorite, setLoadingFavorite] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)

  const handleSort = (column) => {
    const sortMap = COLUMN_SORT_MAP[column]
    if (!sortMap) return
    // toggle: if currently asc → desc; otherwise → asc
    const newSort = sort === sortMap.asc ? sortMap.desc : sortMap.asc
    onSortChange(newSort)
  }

  const handleToggleFavorite = async (product) => {
    const newFavoriteStatus = !product.is_favorite
    setLoadingFavorite(product.id)
    try {
      await favoriteProduct(product.id, newFavoriteStatus)
      toast.success(
        newFavoriteStatus
          ? `${product.brand} added to favorites`
          : `${product.brand} removed from favorites`
      )
      await onRefresh()
    } catch (error) {
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
      <div id="mobileCards_productListPage" className="flex flex-col gap-2 sm:hidden px-3 py-3">
        {products.map((product) => (
          <div
            key={product.id}
            id={`mobileCard_${product.id}_productListPage`}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            {/* Row 1: name + status + actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <StarIcon
                  className={`size-3.5 flex-shrink-0 ${
                    product.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                  }`}
                />
                {product.product_image && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewImg(product.product_image)
                    }}
                    className="shrink-0 hover:bg-transparent"
                    aria-label="View product image"
                  >
                    <img
                      src={product.product_image}
                      alt={product.product}
                      className="size-8 rounded object-cover border border-slate-200"
                    />
                  </Button>
                )}
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
      <div className="hidden sm:block overflow-x-auto flex-1">
        <table
          id="desktopTable_productListPage"
          className="min-w-full text-sm"
          aria-label="Products"
        >
          <thead>
            <tr className="border-b border-slate-100">
              <th
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[35%] cursor-pointer select-none"
                onClick={() => handleSort('product')}
              >
                Product <SortIcon column="product" sort={sort} />
              </th>
              <th
                className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[12%] cursor-pointer select-none"
                onClick={() => handleSort('quantity')}
              >
                Quantity <SortIcon column="quantity" sort={sort} />
              </th>
              <th
                className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[15%] cursor-pointer select-none"
                onClick={() => handleSort('in_use')}
              >
                In Use <SortIcon column="in_use" sort={sort} />
              </th>
              <th
                className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[13%] cursor-pointer select-none"
                onClick={() => handleSort('usage_date')}
              >
                Usage Date <SortIcon column="usage_date" sort={sort} />
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[13%]">
                Status
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-[12%]">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 w-[35%]">
                  <div className="flex items-center gap-3">
                    <StarIcon
                      className={`size-4 flex-shrink-0 ${
                        product.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                      }`}
                    />
                    {product.product_image && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewImg(product.product_image)
                        }}
                        className="shrink-0 hover:bg-transparent"
                        aria-label="View product image"
                      >
                        <img
                          src={product.product_image}
                          alt={product.product}
                          className="size-8 rounded object-cover border border-slate-200"
                        />
                      </Button>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 truncate">{product.brand}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="font-semibold text-slate-900 truncate">{product.product}</p>
                        {product.type && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                            {product.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right w-[12%]">
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
                </td>
                <td className="px-5 py-3.5 text-right font-mono font-medium tabular-nums text-slate-700 w-[15%]">
                  {product.usage_quantity}
                </td>
                <td className="px-5 py-3.5 text-center text-slate-700 w-[13%]">
                  {product.usage_date ? format(new Date(product.usage_date), 'dd MMM yyyy') : '—'}
                </td>
                <td className="px-5 py-3.5 text-center w-[13%]">
                  <Badge
                    className={`${
                      product.product_status === 'active'
                        ? 'bg-green-100 text-green-600 hover:bg-green-100 capitalize'
                        : 'bg-red-100 text-red-600 hover:bg-red-100 capitalize'
                    }`}
                  >
                    {product.product_status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-center w-[12%]">
                  <ActionMenu product={product} {...sharedActionProps} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div
            id="paginationFooter_productListPage"
            className="flex items-center justify-between px-5 pt-2 mt-2"
            aria-label="Pagination"
          >
            <Button
              variant="ghost"
              onClick={onPrev}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 min-h-[44px]"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Prev
            </Button>
            <span className="text-xs text-slate-400 text-center" aria-live="polite">
              Page {page} of {totalPages} · {total} records
            </span>
            <Button
              variant="ghost"
              onClick={onNext}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 min-h-[44px]"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

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

      <Dialog
        open={!!previewImg}
        onOpenChange={(open) => {
          if (!open) setPreviewImg(null)
        }}
      >
        <DialogContent id="imagePreviewDialog_productListPage" className="max-w-lg p-2">
          {previewImg && (
            <img
              src={previewImg}
              alt="Product preview"
              className="w-full rounded object-contain max-h-[80vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
