'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, RefreshCw, Package } from 'lucide-react'
import { format } from 'date-fns'
import { getProductById, getStockHistory, getProductUsageHistory } from '@/lib/api/product'
import PageHeader from '@/app/main/components/PageHeader'
import ProductUsageLog from '@/app/main/inventory/product-list/detail/ProductUsageLog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// ----------------------------------------------------------------
// Stat card component
// ----------------------------------------------------------------
function StatCard({ label, value, subLabel }) {
  return (
    <Card className="bg-white border border-slate-200/50 shadow-sm shadow-slate-100">
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-semibold text-slate-800 tabular-nums leading-tight">{value}</p>
        {subLabel && <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>}
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="bg-white border border-slate-200/50 shadow-sm shadow-slate-100">
      <CardContent className="p-4 sm:p-5">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-16" />
      </CardContent>
    </Card>
  )
}

// ----------------------------------------------------------------
// Purchase history table
// ----------------------------------------------------------------
function PurchaseHistorySection({ history }) {
  if (!history || history.length === 0) {
    return (
      <div
        data-testid="product-detail-purchase-empty"
        className="flex flex-col items-center gap-2 py-12 text-center"
      >
        <Package className="size-8 text-slate-300" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-500">No purchase history yet</p>
      </div>
    )
  }

  // Sort most recent first
  const sorted = [...history].sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))

  return (
    <div className="overflow-x-auto">
      <table data-testid="product-detail-purchase-table" className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500 rounded-l-lg">
              Date
            </th>
            <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Qty Added</th>
            <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Price</th>
            <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500 rounded-r-lg">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((h, idx) => (
            <tr
              key={h.id ?? idx}
              data-testid="product-detail-purchase-row"
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            >
              <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                {h.purchase_date ? format(new Date(h.purchase_date), 'd MMM yyyy') : '—'}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                {h.quantity_added ?? '—'}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                {h.price != null ? `Rp ${Number(h.price).toLocaleString('id-ID')}` : '—'}
              </td>
              <td className="py-2.5 px-3 text-slate-500">{h.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ----------------------------------------------------------------
// Main page
// ----------------------------------------------------------------
export default function ProductDetailPage({ productId }) {
  const [product, setProduct] = useState(null)
  const [stockHistory, setStockHistory] = useState([])
  const [usageHistory, setUsageHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productData, stockData, usageData] = await Promise.all([
        getProductById(productId),
        getStockHistory(productId),
        getProductUsageHistory(productId),
      ])
      setProduct(productData)
      setStockHistory(stockData ?? [])
      setUsageHistory(usageData ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load product details')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ---- Derived stats ----
  const totalAdded = stockHistory.reduce((s, h) => s + (h.quantity_added ?? 0), 0)
  const totalSpent = stockHistory.reduce((s, h) => s + Number(h.price || 0), 0)
  const usageSessions = usageHistory.length

  // ---- Breadcrumbs ----
  const productName = product?.product ?? 'Product Detail'
  const productBrand = product?.brand ?? ''
  const productType = product?.type ?? ''

  const breadcrumbs = [
    { label: 'Inventory', href: '/main/inventory' },
    { label: 'Product List', href: '/main/inventory/product-list' },
    { label: productName },
  ]

  // ---- Loading state ----
  if (loading) {
    return (
      <div
        data-testid="product-detail-loading"
        className="flex flex-col gap-5"
        aria-live="polite"
        aria-label="Loading product details"
      >
        <Link
          href="/main/inventory/product-list"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2 w-fit"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to Product List
        </Link>

        {/* Header skeleton */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-48 mb-1" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/50 shadow-slate-100 rounded-xl p-4 sm:p-5"
            >
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ---- Error state ----
  if (error) {
    return (
      <div data-testid="product-detail-error" className="flex flex-col gap-5">
        <Link
          href="/main/inventory/product-list"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2 w-fit"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to Product List
        </Link>

        <div
          className="flex flex-col items-center gap-4 py-20 text-center"
          role="alert"
          aria-live="assertive"
        >
          <Package className="size-10 text-slate-300" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-700">Failed to load product</p>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
          <button
            data-testid="product-detail-retry-btn"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    )
  }

  // ---- Loaded state ----
  return (
    <div data-testid="product-detail-page" className="flex flex-col gap-5">
      {/* Back link */}
      <Link
        href="/main/inventory/product-list"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2 w-fit transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Back to Product List
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHeader
          title={productName}
          description={[productBrand, productType].filter(Boolean).join(' · ')}
          breadcrumbs={breadcrumbs}
        />
        {product?.product_status && (
          <Badge
            data-testid="product-detail-status-badge"
            className={
              product.product_status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0'
                : 'bg-red-50 text-red-700 border-red-200 shrink-0'
            }
            variant="outline"
          >
            {product.product_status}
          </Badge>
        )}
      </div>

      {/* Stats row */}
      <div
        data-testid="product-detail-stats"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <StatCard
          label="Current Stock"
          value={product?.quantity ?? 0}
          subLabel={
            product?.quantity === 0
              ? 'Out of stock'
              : product?.quantity < 5
                ? 'Low stock'
                : undefined
          }
        />
        <StatCard label="Total Added" value={totalAdded} subLabel="all time" />
        <StatCard label="Total Spent" value={`Rp ${totalSpent.toLocaleString('id-ID')}`} />
        <StatCard label="Usage Sessions" value={usageSessions} />
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Purchase History */}
        <section
          data-testid="product-detail-purchase-section"
          className="bg-white border border-slate-200/50 shadow-sm shadow-slate-100 rounded-xl p-4 sm:p-5"
          aria-labelledby="purchase-history-heading"
        >
          <h2 id="purchase-history-heading" className="text-sm font-semibold text-slate-700 mb-4">
            Purchase History
          </h2>
          <PurchaseHistorySection history={stockHistory} />
        </section>

        {/* Usage History */}
        <section
          data-testid="product-detail-usage-section"
          className="bg-white border border-slate-200/50 shadow-sm shadow-slate-100 rounded-xl p-4 sm:p-5"
          aria-labelledby="usage-history-heading"
        >
          <h2 id="usage-history-heading" className="text-sm font-semibold text-slate-700 mb-4">
            Usage History
          </h2>
          <ProductUsageLog log={usageHistory} onUpdate={loadData} />
        </section>
      </div>
    </div>
  )
}
