'use client'

import { useEffect, useState } from 'react'
import { getProductSummary } from '@/lib/api/product'
import { getInventoryDashboard } from '@/lib/api/inventoryDashboard'
import SummaryCards from './components/SummaryCards'
import SpendComparison from './sections/SpendComparison'
import CostPerUse from './sections/CostPerUse'
import LowStockAlert from './sections/LowStockAlert'
import MostRestocked from './sections/MostRestocked'
import MonthlySpendByType from './sections/MonthlySpendByType'
import CostPerUseHistory from './sections/CostPerUseHistory'
import AvgUsageDuration from './sections/AvgUsageDuration'
import RestockPrediction from './sections/RestockPrediction'
import MonthlyBudgetTracker from './sections/MonthlyBudgetTracker'
import SpendingHeatmap from './sections/SpendingHeatmap'
import LifecycleScore from './sections/LifecycleScore'

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
  const [mostRestocked, setMostRestocked] = useState([])
  const [spendComparison, setSpendComparison] = useState(null)
  const [costPerUseHistory, setCostPerUseHistory] = useState([])
  const [restockPrediction, setRestockPrediction] = useState([])
  const [spendingHeatmap, setSpendingHeatmap] = useState([])
  const [lifecycleScore, setLifecycleScore] = useState([])
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
        setMostRestocked(dashboardData.mostRestocked ?? [])
        setSpendComparison(dashboardData.spendComparison ?? null)
        setCostPerUseHistory(dashboardData.costPerUseHistory ?? [])
        setRestockPrediction(dashboardData.restockPrediction ?? [])
        setSpendingHeatmap(dashboardData.spendingHeatmap ?? [])
        setLifecycleScore(dashboardData.lifecycleScore ?? [])
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
      <SpendComparison data={spendComparison} loading={loading} />
      <SpendingHeatmap items={spendingHeatmap} loading={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockAlert items={lowStockAlerts} loading={loading} />
        <MostRestocked items={mostRestocked} loading={loading} />
      </div>
      <RestockPrediction items={restockPrediction} loading={loading} />
      <MonthlySpendByType items={monthlySpendByType} loading={loading} />
      <CostPerUse top5={top5} all={allProducts} loading={loading} error={error} />
      <MonthlyBudgetTracker monthlySpendByType={monthlySpendByType} loading={loading} />
      <CostPerUseHistory items={costPerUseHistory} loading={loading} />
      <AvgUsageDuration items={avgUsageDuration} loading={loading} />
      <LifecycleScore items={lifecycleScore} loading={loading} />
    </div>
  )
}
