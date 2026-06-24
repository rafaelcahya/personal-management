'use client'

import { useEffect, useState } from 'react'
import { getInventoryDashboard } from '@/lib/api/inventoryDashboard'
import SummaryCards from './components/SummaryCards'
import PageHeader from '../components/PageHeader'
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
        const dashboardData = await getInventoryDashboard()
        setSummary(
          dashboardData.summary ?? {
            totalProducts: 0,
            activeProducts: 0,
            inactiveProducts: 0,
            totalQuantity: 0,
            totalUsageQuantity: 0,
            favoriteProducts: 0,
          }
        )
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
    <main id="inventoryDashboardPage" className="space-y-6">
      <PageHeader
        title="Inventory Dashboard"
        description="Overview of your inventory, spending, and product analytics"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Dashboard' }]}
      />
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      <SummaryCards summary={summary} lowStockCount={lowStockAlerts.length} loading={loading} />
      <SpendComparison data={spendComparison} loading={loading} />
      <SpendingHeatmap items={spendingHeatmap} loading={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockAlert items={lowStockAlerts} loading={loading} />
        <MostRestocked items={mostRestocked} loading={loading} />
      </div>
      <RestockPrediction items={restockPrediction} loading={loading} />
      <MonthlyBudgetTracker monthlySpendByType={monthlySpendByType} loading={loading} />
      <MonthlySpendByType items={monthlySpendByType} loading={loading} />
      <CostPerUse top5={top5} all={allProducts} loading={loading} />
      <CostPerUseHistory items={costPerUseHistory} loading={loading} />
      <AvgUsageDuration items={avgUsageDuration} loading={loading} />
      <LifecycleScore items={lifecycleScore} loading={loading} />
    </main>
  )
}
