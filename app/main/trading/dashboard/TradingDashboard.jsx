'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { toast } from 'sonner'
import OverviewSection from './section/OverviewSection'
import PerformanceSection from './section/PerformanceSection'
import RiskSection from './section/RiskSection'
import PageHeader from '../../components/PageHeader'
import { fetchMetrics } from '@/lib/api/dashboard'

export default function TradingDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardMetrics()
  }, [])

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchMetrics()
      setMetrics(data)
    } catch (err) {
      console.error('Fetch metrics error:', err)
      setError(true)
      toast.error('Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="size-10 text-red-400" aria-hidden="true" />
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-1">Error Loading Dashboard</p>
          <p className="text-sm text-slate-500">Failed to load dashboard. Please try again.</p>
        </div>
        <Button size="base" variant="outline" onClick={fetchDashboardMetrics}>
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <main id="tradingDashboardPage" className="space-y-6">
      <PageHeader
        title="Trading Dashboard"
        description="Complete overview of your trading performance and analytics"
        breadcrumbs={[{ label: 'Trading' }, { label: 'Dashboard' }]}
      />
      <section id="overview" aria-label="Overview">
        <OverviewSection metrics={metrics} loading={loading} />
      </section>

      <section id="performance" aria-label="Performance">
        <PerformanceSection metrics={metrics} loading={loading} />
      </section>

      <section id="risk" aria-label="Risk">
        <RiskSection metrics={metrics} loading={loading} />
      </section>
    </main>
  )
}
