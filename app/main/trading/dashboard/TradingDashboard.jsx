'use client'

import { useEffect, useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, BarChart3, Shield, List } from 'lucide-react'
import { toast } from 'sonner'
import OverviewSection from './section/OverviewSection'
import PerformanceSection from './section/PerformanceSection'
import RiskSection from './section/RiskSection'
import QuickViewSection from './section/QuickViewSection'
import DashboardHeader from './component/DashboardHeader'
import PageHeader from '../../components/PageHeader'
import { fetchMetrics, fetchQuickView } from '@/lib/api/dashboard'

export default function TradingDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [quickViewData, setQuickViewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardMetrics()
  }, [])

  useEffect(() => {
    if (activeTab === 'quick' && !quickViewData) {
      fetchQuickViewData()
    }
  }, [activeTab, quickViewData])

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchMetrics()
      setMetrics(data)
    } catch (err) {
      console.error('Fetch metrics error:', err)
      setError(err.message)
      toast.error(err.message || 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuickViewData = async () => {
    try {
      const data = await fetchQuickView(5)
      setQuickViewData(data)
    } catch (err) {
      console.error('Fetch quick view error:', err)
      toast.error(err.message || 'Failed to fetch quick view data')
    }
  }

  const portfolioHealth = useMemo(() => {
    if (!metrics || metrics.totalTrades === 0) return 'neutral'

    const { winRate, profitFactor } = metrics

    if (winRate >= 60 && profitFactor >= 1.5) return 'excellent'
    if (winRate >= 50 && profitFactor >= 1) return 'good'
    if (winRate >= 40) return 'fair'
    return 'poor'
  }, [metrics])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">⚠️ Error Loading Dashboard</p>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Trading Dashboard"
        description="Complete overview of your trading performance and analytics"
        breadcrumbs={[{ label: 'Trading' }, { label: 'Dashboard' }]}
      />
      <DashboardHeader portfolioHealth={portfolioHealth} loading={loading} />

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="size-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="gap-2">
            <Shield className="size-4" />
            <span className="hidden sm:inline">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="quick" className="gap-2">
            <List className="size-4" />
            <span className="hidden sm:inline">Quick View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection metrics={metrics} loading={loading} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceSection metrics={metrics} loading={loading} />
        </TabsContent>

        <TabsContent value="risk">
          <RiskSection metrics={metrics} loading={loading} />
        </TabsContent>

        <TabsContent value="quick">
          <QuickViewSection initialData={quickViewData} onRefresh={fetchQuickViewData} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
