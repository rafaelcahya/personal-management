import {
  AlertCircle,
  Package,
  PackageOpen,
  Plus,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import Button from '../Button'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from '../Card'
import PageHeader from '@/app/main/components/PageHeader'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Layout/Card/Usage',
}

export default meta

const AddButton = () => (
  <Button
    size="md"
    useIcon={<Plus className="size-4" aria-hidden="true" />}
    className="bg-violet-600 hover:bg-violet-700 min-w-11"
  >
    <span className="hidden sm:inline">Add Product</span>
    <span className="sm:hidden">Add</span>
  </Button>
)

export const FullPage = {
  name: 'Full Page',
  render: () => (
    <div className="p-6 max-w-5xl space-y-6">
      <PageHeader
        title="Inventory Dashboard"
        description="Overview of your inventory"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Dashboard' }]}
      />

      {/* Overview: transparent section > shell stat cards */}
      <Card variant="transparent">
        <CardHeader>
          <CardIcon icon={Package} />
          <div className="min-w-0 flex-1">
            <CardTitle>Overview</CardTitle>
            <CardDescription>Stock summary at a glance</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Products', value: '48', sub: 'All active inventory' },
              { label: 'Active', value: '42', sub: 'Currently in use' },
              { label: 'Low Stock', value: '6', sub: 'Need restocking' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent>
                  <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products: transparent section > table */}
      <Card variant="transparent">
        <CardHeader>
          <CardIcon icon={ShoppingCart} />
          <div className="min-w-0 flex-1">
            <CardTitle>Products</CardTitle>
            <CardDescription>All active items in your inventory</CardDescription>
          </div>
          <CardAction>
            <div className="flex items-center gap-2">
              <Button size="md" variant="outline" className="min-w-11">
                Export
              </Button>
              <AddButton />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex border-b border-slate-100 bg-slate-50 px-5 py-3">
            <span className="flex-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
              Product
            </span>
            <span className="w-28 text-xs font-medium text-slate-500 uppercase tracking-wide">
              Category
            </span>
            <span className="w-16 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
              Stock
            </span>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {[
              { name: 'Moisturizer Cetaphil', category: 'Skincare', stock: 3 },
              { name: 'Vitamin C Serum', category: 'Skincare', stock: 1 },
              { name: 'Shampoo Dove', category: 'Hair Care', stock: 8 },
              { name: 'Face Wash', category: 'Skincare', stock: 5 },
              { name: 'Body Lotion', category: 'Body Care', stock: 2 },
              { name: 'Sunscreen SPF 50', category: 'Skincare', stock: 4 },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center px-5 py-3.5 border-b border-slate-100 last:border-0"
              >
                <span className="flex-1 text-sm font-medium text-slate-900">{row.name}</span>
                <span className="w-28 text-sm text-slate-500">{row.category}</span>
                <span className="w-16 text-right text-sm text-slate-700">{row.stock}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-slate-500">6 items · last updated today</p>
        </CardFooter>
      </Card>

      {/* Alerts: transparent section > 2 shell cards */}
      <Card variant="transparent">
        <CardHeader>
          <CardIcon icon={AlertCircle} />
          <div className="min-w-0 flex-1">
            <CardTitle>Alerts & Actions</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardIcon icon={TrendingDown} />
                <div className="min-w-0 flex-1">
                  <CardTitle>Low Stock Alert</CardTitle>
                  <CardDescription>3 items need restocking</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'Vitamin C Serum', stock: 1 },
                  { name: 'Body Lotion', stock: 2 },
                  { name: 'Moisturizer', stock: 3 },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-slate-700">{row.name}</span>
                    <span className="text-xs font-medium text-red-500">{row.stock} left</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button size="md" className="w-full bg-violet-600 hover:bg-violet-700">
                  Restock All
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardIcon icon={ShoppingCart} />
                <div className="min-w-0 flex-1">
                  <CardTitle>Pending Order</CardTitle>
                  <CardDescription>Order #4821 · 5 items</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'Moisturizer Cetaphil', qty: 2 },
                  { name: 'Vitamin C Serum', qty: 1 },
                  { name: 'Shampoo Dove', qty: 2 },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-slate-700">{row.name}</span>
                    <span className="text-xs text-slate-500">×{row.qty}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="md" variant="outline" className="flex-1">
                  Decline
                </Button>
                <Button size="md" className="flex-1 bg-violet-600 hover:bg-violet-700">
                  Approve
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* States: transparent section > empty + error shell cards */}
      <Card variant="transparent">
        <CardHeader>
          <CardIcon icon={Package} />
          <div className="min-w-0 flex-1">
            <CardTitle>Empty & Error States</CardTitle>
            <CardDescription>
              How cards look when there is no data or a failure occurs
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardIcon icon={Package} />
                <div className="min-w-0 flex-1">
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Organize your products by group</CardDescription>
                </div>
                <CardAction>
                  <Button
                    size="md"
                    useIcon={<Plus className="size-4" aria-hidden="true" />}
                    className="bg-violet-600 hover:bg-violet-700 min-w-11"
                  >
                    Add Category
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <PackageOpen className="size-10 text-slate-300" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">No categories yet</p>
                  <p className="text-xs text-slate-500">
                    Create a category to start organizing your inventory
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardIcon icon={TrendingUp} />
                <div className="min-w-0 flex-1">
                  <CardTitle>Usage History</CardTitle>
                  <CardDescription>Track item consumption over time</CardDescription>
                </div>
              </CardHeader>
              <CardContent
                className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">Failed to load history</p>
                  <p className="text-xs text-slate-500">Check your connection and try again</p>
                </div>
                <Button variant="outline" size="md" className="min-w-11">
                  Try again
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}
