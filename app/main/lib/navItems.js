import {
  LayoutDashboard,
  Package,
  Tag,
  Type,
  History,
  TrendingUp,
  Receipt,
  Calendar,
  Settings,
  Activity,
  BarChart2,
  BrainCircuit,
  Trophy,
  Timer,
  Microscope,
  GitBranch,
  MapPin,
  Bell,
  ShieldCheck,
} from 'lucide-react'

export const INVENTORY_ITEMS = [
  {
    id: 'inventoryDashboardNav_sidebar',
    name: 'Dashboard',
    tooltip: 'Inventory Dashboard',
    href: '/main/inventory',
    icon: LayoutDashboard,
  },
  { name: 'Product List', href: '/main/inventory/product-list', icon: Package },
  { name: 'Product Brand', href: '/main/inventory/product-brand', icon: Tag },
  { name: 'Product Name', href: '/main/inventory/product-name', icon: Type },
  { name: 'Product History', href: '/main/inventory/product-history', icon: History },
]

export const TRADING_ITEMS = [
  {
    id: 'tradingDashboardNav_sidebar',
    name: 'Dashboard',
    tooltip: 'Trading Dashboard',
    href: '/main/trading/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'tradingValuationNav_sidebar',
    name: 'Valuation',
    tooltip: 'Stock Valuation',
    href: '/main/trading/valuation',
    icon: BarChart2,
  },
  { name: 'Trades', href: '/main/trading/trade', icon: TrendingUp },
  { name: 'Market Events', href: '/main/trading/event', icon: Calendar },
  { name: 'Research', href: '/main/trading/research', icon: Microscope },
  { name: 'Fees', href: '/main/trading/fee', icon: Receipt },
  { name: 'Investment Flow', href: '/main/trading/investment-flow', icon: GitBranch },
  { name: 'Settings', href: '/main/trading/settings', icon: Settings },
]

export const CURRENCY_SUBITEMS = [
  {
    id: 'currencyDashboardNav_sidebar',
    name: 'Dashboard',
    href: '/main/trading/currency',
    exact: true,
    icon: LayoutDashboard,
  },
  {
    id: 'currencyHoldingsNav_sidebar',
    name: 'Holdings',
    href: '/main/trading/currency/holdings',
    icon: BarChart2,
  },
]

export const RUNNING_ITEMS = [
  {
    id: 'runningDashboardNav_sidebar',
    name: 'Dashboard',
    tooltip: 'Running Dashboard',
    href: '/main/running/dashboard',
    icon: LayoutDashboard,
  },
  { name: 'Activities', href: '/main/running/activities', icon: Activity },
  { name: 'Race Log', href: '/main/running/race-log', icon: Trophy },
  { name: 'Analytics', href: '/main/running/analytics', icon: BarChart2 },
  { name: 'AI Coach', href: '/main/running/ai', icon: BrainCircuit },
  {
    id: 'runCalcNav_sidebar',
    name: 'Run Calc',
    href: '/main/running/run-calculator',
    icon: Timer,
  },
  {
    id: 'routeBuilderNav_sidebar',
    name: 'Routes',
    href: '/main/running/route-builder',
    icon: MapPin,
  },
  { name: 'Settings', href: '/main/running/settings', icon: Settings },
]

export const ACCOUNT_ITEMS = [
  { name: 'Notifications', href: '/main/notifications', icon: Bell },
  { name: 'Security', href: '/main/security', icon: ShieldCheck },
]

// Flattened, module-grouped view the command palette consumes so it never drifts
// from the sidebar. Currency subitems are relabeled to stay meaningful once detached
// from their parent group ("Dashboard" alone would collide with three other dashboards).
export const COMMAND_GROUPS = [
  { module: 'Inventory', items: INVENTORY_ITEMS },
  {
    module: 'Trading',
    items: [
      ...TRADING_ITEMS,
      ...CURRENCY_SUBITEMS.map((item) => ({ ...item, name: `Currency · ${item.name}` })),
    ],
  },
  { module: 'Running', items: RUNNING_ITEMS },
  { module: 'Account', items: ACCOUNT_ITEMS },
]
