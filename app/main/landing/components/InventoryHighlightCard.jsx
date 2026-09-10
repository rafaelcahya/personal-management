'use client'

import { Package } from 'lucide-react'
import HighlightSection from './HighlightSection'
import { fetchInventoryHighlights } from '@/lib/api/home'
import { useHighlightData } from '@/hooks/useHighlightData'

export default function InventoryHighlightCard() {
  const { data, loading, error, reload } = useHighlightData(fetchInventoryHighlights)

  const isEmpty = data && data.totalProducts === 0

  return (
    <HighlightSection
      id="inventoryHighlight_homePage"
      linkId="viewLink_inventoryHighlight_homePage"
      retryId="retryBtn_inventoryHighlight_homePage"
      title="Inventory"
      description="Stock at a glance"
      icon={Package}
      href="/main/inventory/product-list"
      loading={loading}
      error={error}
      onRetry={reload}
    >
      {isEmpty ? (
        <p className="text-sm text-muted-foreground">No products yet.</p>
      ) : data ? (
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold tabular-nums ${
                data.lowStockCount > 0 ? 'text-warning' : 'text-foreground'
              }`}
            >
              {data.lowStockCount}
            </span>
            <span className="text-sm text-muted-foreground">
              {data.lowStockCount === 1 ? 'product low on stock' : 'products low on stock'}
            </span>
          </div>

          {data.lowStockCount > 0 && (
            <ul className="space-y-1">
              {data.lowStockItems.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate capitalize text-foreground">
                    {it.brand} · {it.product}
                  </span>
                  <span className="font-mono text-muted-foreground shrink-0">
                    {it.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2 border-t border-border">
            <span>
              <span className="font-medium text-foreground tabular-nums">
                {data.activeProducts}
              </span>{' '}
              active
            </span>
            <span>
              <span className="font-medium text-foreground tabular-nums">
                {data.favoriteProducts}
              </span>{' '}
              favorites
            </span>
            <span>
              <span className="font-medium text-foreground tabular-nums">{data.totalProducts}</span>{' '}
              total
            </span>
          </div>
        </div>
      ) : null}
    </HighlightSection>
  )
}
