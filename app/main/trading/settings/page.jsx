import PerformConfig from './PerformConfig'
import PageHeader from '../../components/PageHeader'

export default function TradingSettingsPage() {
  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader
        title="Settings"
        description="Configure your trading performance preferences"
        breadcrumbs={[{ label: 'Trading', href: '/main/trading/dashboard' }, { label: 'Settings' }]}
      />
      <PerformConfig />
    </div>
  )
}
