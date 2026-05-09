'use client'

import { useRouter } from 'next/navigation'
import PerformConfig from './PerformConfig'
import PageHeader from '../../components/PageHeader'

export default function TradingSettingsPage() {
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <PageHeader
        title="Settings"
        description="Configure your trading performance preferences"
        breadcrumbs={[{ label: 'Trading', href: '/main/trading/dashboard' }, { label: 'Settings' }]}
      />
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <PerformConfig onClose={() => router.push('/main/trading/dashboard')} />
      </div>
    </div>
  )
}
