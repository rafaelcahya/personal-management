'use client'

import PageHeader from '@/app/main/components/PageHeader'
import InventoryHighlightCard from './InventoryHighlightCard'
import TradingHighlightCard from './TradingHighlightCard'
import RunningHighlightCard from './RunningHighlightCard'

export default function HomeDashboard() {
  return (
    <main id="homePage" className="space-y-6">
      <PageHeader
        title="Home"
        description="Today's highlights across Inventory, Trading, and Running."
        breadcrumbs={[{ label: 'Home' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InventoryHighlightCard />
        <TradingHighlightCard />
        <RunningHighlightCard />
      </div>
    </main>
  )
}
