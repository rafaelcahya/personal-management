import { TrendingUp, Activity, Package } from 'lucide-react'

// Quick actions the command palette routes into. Each action navigates to a create flow
// via an `?action=...` query param that the target page reads to auto-open its modal.
// Keep this list flat and declarative so new actions (Add Fee, Set Price Alert, …) drop
// in without touching the palette itself. `keywords` widens fuzzy search beyond the label.
export const PALETTE_ACTIONS = [
  {
    id: 'action-add-trade',
    label: 'Add Trade',
    keywords: 'add trade buy sell position portfolio',
    icon: TrendingUp,
    href: '/main/trading/trade?action=add',
  },
  {
    id: 'action-log-run',
    label: 'Log Run',
    keywords: 'log run activity workout sync strava',
    icon: Activity,
    href: '/main/running/activities?action=sync',
  },
  {
    id: 'action-add-stock',
    label: 'Add Stock',
    keywords: 'add stock product inventory item',
    icon: Package,
    href: '/main/inventory/product-list?action=add',
  },
]
