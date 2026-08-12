'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProductById, getStockHistory, getProductUsageHistory } from '@/lib/api/product'
import PageHeader from '@/app/main/components/PageHeader'
import EditProductSheet from '@/app/main/inventory/product-list/list/component/EditProductSheet'
import State from '@/components/base/State/State'
import ProductDetailSkeleton from './components/ProductDetailSkeleton'
import ProductInfoCard from './components/ProductInfoCard'
import AddStockSection from './components/AddStockSection'
import RecordUsageSection from './components/RecordUsageSection'
import StockHistorySection from './components/StockHistorySection'
import UsageHistorySection from './components/UsageHistorySection'

function computeDaysUntilEmpty(usageHistory, product) {
  if (!usageHistory || usageHistory.length === 0) return null
  const dates = usageHistory
    .map((h) => h.start_usage_date)
    .filter(Boolean)
    .sort()
  if (dates.length === 0) return null
  const now = new Date()
  let avgDays
  if (dates.length >= 2) {
    const gaps = []
    for (let i = 1; i < dates.length; i++) {
      gaps.push((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000)
    }
    avgDays = Math.max(1, Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length))
  } else {
    avgDays = Math.max(1, Math.round((now - new Date(dates[0])) / 86400000))
  }
  if (!product || product.quantity === 0) return 0
  return Math.round(avgDays * product.quantity)
}

export default function ProductDetailPage({ productId }) {
  const [product, setProduct] = useState(null)
  const [stockHistory, setStockHistory] = useState([])
  const [usageHistory, setUsageHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

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

  const totalAdded = stockHistory.reduce((s, h) => s + (h.quantity_added ?? 0), 0)
  const totalSpent = stockHistory.reduce((s, h) => s + Number(h.price || 0), 0)
  const usageSessions = usageHistory.length
  const daysUntilEmpty = computeDaysUntilEmpty(usageHistory, product)

  const productName = product?.product ?? 'Product Detail'
  const productBrand = product?.brand ?? ''
  const productType = product?.type ?? ''

  const breadcrumbs = [
    { label: 'Inventory', href: '/main/inventory' },
    { label: 'Product List', href: '/main/inventory/product-list' },
    { label: productName },
  ]

  if (loading) return <ProductDetailSkeleton />

  if (error) {
    return (
      <div id="errorState_productDetailPage">
        <State
          variant="error"
          title="Failed to load product"
          description={error}
          action={{ label: 'Try again', onClick: loadData }}
        />
      </div>
    )
  }

  return (
    <div id="container_productDetailPage" className="flex flex-col gap-5">
      <PageHeader
        title={productName}
        description={[productBrand, productType].filter(Boolean).join(' · ')}
        breadcrumbs={breadcrumbs}
        backHref="/main/inventory/product-list"
      />

      <ProductInfoCard
        product={product}
        onEdit={() => setEditOpen(true)}
        totalAdded={totalAdded}
        totalSpent={totalSpent}
        usageSessions={usageSessions}
        daysUntilEmpty={daysUntilEmpty}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <AddStockSection product={product} onAdded={loadData} />
        <RecordUsageSection product={product} onUpdated={loadData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <StockHistorySection history={stockHistory} onRefresh={loadData} />
        <UsageHistorySection usageHistory={usageHistory} onRefresh={loadData} />
      </div>

      <EditProductSheet
        product={product}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadData}
      />
    </div>
  )
}
