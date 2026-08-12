'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalBody } from '@/components/base/Modal/Modal.jsx'
import { Badge } from '@/components/base/Badge/Badge'
import { ArrowDown, ArrowUp, ArrowUpDown, StarIcon } from 'lucide-react'
import Pagination from '@/components/base/Pagination/Pagination'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { favoriteProduct } from '@/lib/api/product'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'
import Link from 'next/link'

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
    return <Badge className="bg-red-100 text-red-700">Out of Stock</Badge>
  }
  if (quantity > 0 && quantity < LOW_STOCK_THRESHOLD) {
    return <Badge className="bg-yellow-100 text-yellow-700">Low Stock</Badge>
  }
  return <span className="font-mono font-medium tabular-nums">{quantity}</span>
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
  const [loadingFavorite, setLoadingFavorite] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)

  const handleSort = (column) => {
    const sortMap = COLUMN_SORT_MAP[column]
    if (!sortMap) return
    // toggle: if currently asc → desc; otherwise → asc
    const newSort = sort === sortMap.asc ? sortMap.desc : sortMap.asc
    onSortChange(newSort)
  }

  const handleToggleFavorite = async (e, product) => {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <>
      {/* ── Mobile Card List (< sm) ── */}
      <div id="mobileCards_productListPage" className="flex flex-col gap-2 sm:hidden px-3 py-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/main/inventory/product-list/${product.id}`}
            id={`mobileCard_${product.id}_productListPage`}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm block"
          >
            {/* Row 1: name + status + star */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={(e) => handleToggleFavorite(e, product)}
                  disabled={loadingFavorite === product.id}
                  aria-label={product.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="shrink-0 p-0.5 rounded transition-opacity disabled:opacity-50"
                  id={`starBtn_${product.id}_productListPage`}
                >
                  <StarIcon
                    className={`size-3.5 ${
                      product.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                    }`}
                  />
                </button>
                <div className="flex flex-col items-start gap-2">
                  {product.product_image && (
                    <span
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setPreviewImg(product.product_image)
                      }}
                      className="shrink-0 cursor-pointer"
                      aria-label="View product image"
                    >
                      <img
                        src={product.product_image}
                        alt={product.product}
                        className="size-8 rounded object-cover border border-slate-200"
                      />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 truncate leading-tight">{product.brand}</p>
                    <p className="font-medium text-slate-700 text-sm truncate capitalize mt-0.5">
                      {product.product} {product.type}
                    </p>
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
          </Link>
        ))}
      </div>

      {/* ── Desktop Table (sm+) ── */}
      <div className="hidden sm:block flex-1">
        <Table id="desktopTable_productListPage" className="min-w-full" aria-label="Products">
          <TableHeader sticky>
            <TableRow>
              <TableHead
                className="w-[38%] cursor-pointer select-none"
                onClick={() => handleSort('product')}
              >
                Product <SortIcon column="product" sort={sort} />
              </TableHead>
              <TableHead
                className="w-[14%] cursor-pointer select-none"
                align="right"
                onClick={() => handleSort('quantity')}
              >
                Quantity <SortIcon column="quantity" sort={sort} />
              </TableHead>
              <TableHead
                className="w-[16%] cursor-pointer select-none"
                align="right"
                onClick={() => handleSort('in_use')}
              >
                In Use <SortIcon column="in_use" sort={sort} />
              </TableHead>
              <TableHead
                className="w-[16%] cursor-pointer select-none"
                align="center"
                onClick={() => handleSort('usage_date')}
              >
                Usage Date <SortIcon column="usage_date" sort={sort} />
              </TableHead>
              <TableHead className="w-[16%]" align="center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {' '}
            {products.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => {
                  window.location.href = `/main/inventory/product-list/${product.id}`
                }}
              >
                <TableCell className="w-[38%]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(e, product)}
                      disabled={loadingFavorite === product.id}
                      aria-label={
                        product.is_favorite ? 'Remove from favorites' : 'Add to favorites'
                      }
                      className="shrink-0 p-0.5 rounded transition-opacity disabled:opacity-50"
                      id={`starBtn_${product.id}_productListPage`}
                    >
                      <StarIcon
                        className={`size-4 ${
                          product.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                    {product.product_image && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewImg(product.product_image)
                        }}
                        className="shrink-0 cursor-pointer"
                        aria-label="View product image"
                      >
                        <img
                          src={product.product_image}
                          alt={product.product}
                          className="size-8 rounded object-cover border border-slate-200"
                        />
                      </span>
                    )}
                    <div className="pr-2">
                      <p className="text-xs text-slate-400 truncate">{product.brand}</p>
                      <p className="font-medium text-slate-900 truncate capitalize mt-0.5">
                        {product.product} {product.type}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-[14%]" align="right">
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
                <TableCell
                  className="font-mono font-medium tabular-nums text-slate-700 w-[16%]"
                  align="right"
                >
                  {product.usage_quantity}
                </TableCell>
                <TableCell className="text-slate-700 w-[16%]" align="center">
                  {product.usage_date ? format(new Date(product.usage_date), 'dd MMM yyyy') : '—'}
                </TableCell>
                <TableCell className="w-[16%]" align="center">
                  <Badge
                    className={`${
                      product.product_status === 'active'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100 capitalize'
                        : 'bg-red-100 text-red-700 hover:bg-red-100 capitalize'
                    }`}
                  >
                    {product.product_status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        id="paginationFooter_productListPage"
        page={page}
        totalPages={totalPages}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        className="pb-4"
      />

      <Modal
        open={!!previewImg}
        onOpenChange={(open) => {
          if (!open) setPreviewImg(null)
        }}
      >
        <ModalContent
          variant="bordered"
          borderColor="border-slate-200"
          id="imagePreviewDialog_productListPage"
          className="max-w-lg p-2"
        >
          <ModalBody>
            {previewImg && (
              <img
                src={previewImg}
                alt="Product preview"
                className="w-full rounded object-contain max-h-[80vh]"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
