'use client'

import { useEffect, useState } from 'react'
import { getProductSummary } from '@/lib/api/product'
import { getInventoryDashboard } from '@/lib/api/inventoryDashboard'
import SummaryCards from './components/SummaryCards'
import CostPerUse from './sections/CostPerUse'
import LowStockAlert from './sections/LowStockAlert'
import MonthlySpendByType from './sections/MonthlySpendByType'
import AvgUsageDuration from './sections/AvgUsageDuration'

export default function InventoryDashboard() {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalQuantity: 0,
    totalUsageQuantity: 0,
    favoriteProducts: 0,
  })
  const [top5, setTop5] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [lowStockAlerts, setLowStockAlerts] = useState([])
  const [monthlySpendByType, setMonthlySpendByType] = useState([])
  const [avgUsageDuration, setAvgUsageDuration] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [summaryData, dashboardData] = await Promise.all([
          getProductSummary(),
          getInventoryDashboard(),
        ])
        setSummary(summaryData)
        setTop5(dashboardData.top5 ?? [])
        setAllProducts(dashboardData.all ?? [])
        setLowStockAlerts(dashboardData.lowStockAlerts ?? [])
        setMonthlySpendByType(dashboardData.monthlySpendByType ?? [])
        setAvgUsageDuration(dashboardData.avgUsageDuration ?? [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="flex flex-col gap-6 pb-6">
      <SummaryCards summary={summary} loading={loading} />
      <CostPerUse top5={top5} all={allProducts} loading={loading} error={error} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockAlert items={lowStockAlerts} loading={loading} />
        <MonthlySpendByType items={monthlySpendByType} loading={loading} />
        <AvgUsageDuration items={avgUsageDuration} loading={loading} />
      </div>
    </div>
  )
}
