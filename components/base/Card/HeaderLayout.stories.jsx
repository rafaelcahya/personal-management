import {
  BarChart2,
  Bell,
  Calendar,
  Download,
  Filter,
  Plus,
  Settings,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import Button from '../Button/Button'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Header Layout',
}

export default meta

export const Beside = {
  name: 'Beside (default)',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The default{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          layout=&quot;beside&quot;
        </code>{' '}
        places <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardAction</code> on the
        far right, in the same row as the icon and title. Best for a single button, badge, or small
        control that sits alongside the header label.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Single action button */}
        <Card>
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <CardHeaderContent>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>All active products in your store</CardDescription>
            </CardHeaderContent>
            <CardAction>
              <Button size="md" className="bg-violet-600 hover:bg-violet-700 min-w-11">
                <Plus className="size-4 mr-1.5" />
                Add Item
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic">Table content here…</p>
          </CardContent>
        </Card>

        {/* Multiple action buttons */}
        <Card>
          <CardHeader>
            <CardIcon icon={BarChart2} />
            <CardHeaderContent>
              <CardTitle>Trade Journal</CardTitle>
              <CardDescription>All buy and sell entries</CardDescription>
            </CardHeaderContent>
            <CardAction>
              <div className="flex items-center gap-2">
                <Button size="md" variant="outline" className="min-w-11">
                  <Download className="size-4 mr-1.5" />
                  Export
                </Button>
                <Button size="md" className="bg-violet-600 hover:bg-violet-700 min-w-11">
                  <Plus className="size-4 mr-1.5" />
                  Add Trade
                </Button>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic">Table content here…</p>
          </CardContent>
        </Card>

        {/* Badge / status tag */}
        <Card>
          <CardHeader>
            <CardIcon icon={TrendingUp} />
            <CardHeaderContent>
              <CardTitle>Portfolio Overview</CardTitle>
              <CardDescription>Performance since last month</CardDescription>
            </CardHeaderContent>
            <CardAction>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                +12.4%
              </span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic">Chart content here…</p>
          </CardContent>
        </Card>

        {/* Icon button only */}
        <Card>
          <CardHeader>
            <CardIcon icon={Bell} />
            <CardHeaderContent>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Recent alerts and updates</CardDescription>
            </CardHeaderContent>
            <CardAction>
              <Button size="md" variant="ghost" className="min-w-11">
                <Settings className="size-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic">Notification list here…</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* layout="beside" is the default — no need to pass it explicitly */}
<CardHeader>
  <CardIcon icon={ShoppingCart} />
  <CardHeaderContent>
    <CardTitle>Inventory</CardTitle>
    <CardDescription>All active products</CardDescription>
  </CardHeaderContent>
  <CardAction>
    <Button>Add Item</Button>
  </CardAction>
</CardHeader>

{/* Multiple buttons in CardAction */}
<CardHeader>
  <CardIcon icon={BarChart2} />
  <CardHeaderContent>
    <CardTitle>Trade Journal</CardTitle>
    <CardDescription>All buy and sell entries</CardDescription>
  </CardHeaderContent>
  <CardAction>
    <div className="flex items-center gap-2">
      <Button variant="outline">Export</Button>
      <Button>Add Trade</Button>
    </div>
  </CardAction>
</CardHeader>

{/* Badge in CardAction */}
<CardHeader>
  <CardIcon icon={TrendingUp} />
  <CardHeaderContent>
    <CardTitle>Portfolio</CardTitle>
    <CardDescription>Performance this month</CardDescription>
  </CardHeaderContent>
  <CardAction>
    <span className="... rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
      +12.4%
    </span>
  </CardAction>
</CardHeader>`}</code>
      </pre>
    </div>
  ),
}

export const Below = {
  name: 'Below',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">layout=&quot;below&quot;</code>{' '}
        moves <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardAction</code> to a
        second row below the icon and title, spanning full width. Best for filter tab bars,
        multi-button toolbars, or date range pickers that need more horizontal space.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Filter tab bar */}
        <Card>
          <CardHeader layout="below">
            <CardIcon icon={TrendingUp} />
            <CardHeaderContent>
              <CardTitle>Unrealized P&L</CardTitle>
              <CardDescription>Portfolio performance over time</CardDescription>
            </CardHeaderContent>
            <CardAction>
              <div className="flex flex-wrap items-center gap-2">
                {['7D', '30D', '3M', '6M', '1Y'].map((label, i) => (
                  <Button
                    key={label}
                    size="md"
                    variant="ghost"
                    className={`px-3 py-1.5 rounded-full text-xs font-medium min-w-11 ${
                      i === 1
                        ? 'bg-violet-600 text-white hover:bg-violet-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic">Chart content here…</p>
          </CardContent>
        </Card>

        {/* Date range picker row */}
        <Card>
          <CardHeader layout="below">
            <CardIcon icon={Calendar} />
            <CardHeaderContent>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Filter by date range</CardDescription>
            </CardHeaderContent>
            <CardAction>
              <div className="flex items-center gap-2">
                <div className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 min-w-[120px]">
                  Start date
                </div>
                <span className="text-xs text-slate-400">–</span>
                <div className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 min-w-[120px]">
                  End date
                </div>
                <Button size="md" variant="outline" className="min-w-11">
                  <Filter className="size-4" />
                </Button>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic">Log entries here…</p>
          </CardContent>
        </Card>

        {/* Toolbar with multiple action groups */}
        <Card>
          <CardHeader layout="below">
            <CardIcon icon={ShoppingCart} />
            <CardHeaderContent>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your inventory items</CardDescription>
            </CardHeaderContent>
            <CardAction>
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  {['All', 'Skincare', 'Hair Care', 'Body Care'].map((tab, i) => (
                    <button
                      key={tab}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        i === 0
                          ? 'bg-violet-100 text-violet-700'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="md" variant="outline" className="min-w-11">
                    <Download className="size-4 mr-1.5" />
                    Export
                  </Button>
                  <Button size="md" className="bg-violet-600 hover:bg-violet-700 min-w-11">
                    <Plus className="size-4 mr-1.5" />
                    Add
                  </Button>
                </div>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 italic">Table content here…</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Filter tab bar below the header */}
<CardHeader layout="below">
  <CardIcon icon={TrendingUp} />
  <CardHeaderContent>
    <CardTitle>Unrealized P&L</CardTitle>
    <CardDescription>Portfolio performance over time</CardDescription>
  </CardHeaderContent>
  <CardAction>
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map(f => (
        <Button key={f.label} ...>{f.label}</Button>
      ))}
    </div>
  </CardAction>
</CardHeader>

{/* Toolbar with left tabs + right actions */}
<CardHeader layout="below">
  <CardIcon icon={ShoppingCart} />
  <CardHeaderContent>
    <CardTitle>Products</CardTitle>
    <CardDescription>Manage your inventory items</CardDescription>
  </CardHeaderContent>
  <CardAction>
    <div className="flex items-center justify-between gap-2 w-full">
      <div className="flex gap-2">
        {tabs.map(tab => <button key={tab}>...</button>)}
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Export</Button>
        <Button>Add</Button>
      </div>
    </div>
  </CardAction>
</CardHeader>`}</code>
      </pre>
    </div>
  ),
}
