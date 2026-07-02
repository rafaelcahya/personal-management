import {
  BarChart2,
  Lock,
  Mail,
  Plus,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react'
import Button from '../Button/Button'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Transparent',
}

export default meta

const AddButton = () => (
  <Button
    size="md"
    useIcon={<Plus className="size-4" aria-hidden="true" />}
    className="bg-violet-600 hover:bg-violet-700 min-w-11"
  >
    <span className="hidden sm:inline">Add Item</span>
    <span className="sm:hidden">Add</span>
  </Button>
)

export const FullContent = {
  name: 'Full Content',
  render: () => (
    <div className="p-6 max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        {/* Table */}
        <Card variant="transparent" className="col-span-2">
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
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Moisturizer Cetaphil', category: 'Skincare', stock: 3 },
                  { name: 'Vitamin C Serum', category: 'Skincare', stock: 1 },
                  { name: 'Shampoo Dove', category: 'Hair Care', stock: 8 },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{row.name}</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.category}</td>
                    <td className="px-5 py-3.5 text-right text-slate-700">{row.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-500">3 items · last updated today</p>
          </CardFooter>
        </Card>

        {/* Login */}
        <Card variant="transparent">
          <CardHeader>
            <div className="min-w-0 flex-1">
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Email</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
                <Mail className="size-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-400">you@example.com</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
                <Lock className="size-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-300">••••••••</span>
              </div>
            </div>
            <Button className="w-full bg-violet-600 hover:bg-violet-700" size="md">
              Sign in
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <span className="text-violet-600 font-medium cursor-pointer">Register</span>
            </p>
          </CardFooter>
        </Card>

        {/* Register */}
        <Card variant="transparent">
          <CardHeader>
            <div className="min-w-0 flex-1">
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Full Name</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
                <User className="size-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-400">John Doe</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Email</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
                <Mail className="size-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-400">you@example.com</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
                <Lock className="size-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-300">••••••••</span>
              </div>
            </div>
            <Button className="w-full bg-violet-600 hover:bg-violet-700" size="md">
              Create account
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <span className="text-violet-600 font-medium cursor-pointer">Sign in</span>
            </p>
          </CardFooter>
        </Card>

        {/* Stats */}
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={BarChart2} />
            <div className="min-w-0 flex-1">
              <CardTitle>Portfolio Summary</CardTitle>
              <CardDescription>Performance this month</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: 'Total Value', value: 'Rp 48.200.000', trend: 'up', change: '+12.4%' },
              { label: 'Realized P&L', value: 'Rp 3.600.000', trend: 'up', change: '+8.1%' },
              { label: 'Unrealized P&L', value: '− Rp 420.000', trend: 'down', change: '−0.9%' },
              { label: 'Win Rate', value: '68%', trend: 'neutral', change: '0%' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm text-slate-500">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                  <span
                    className={[
                      'flex items-center gap-0.5 text-xs font-medium',
                      row.trend === 'up' && 'text-green-600',
                      row.trend === 'down' && 'text-red-500',
                      row.trend === 'neutral' && 'text-slate-400',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {row.trend === 'up' && <TrendingUp className="size-3" />}
                    {row.trend === 'down' && <TrendingDown className="size-3" />}
                    {row.change}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-500">Last updated: today, 15:42</p>
          </CardFooter>
        </Card>

        {/* Low Stock Alert */}
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
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

        {/* Pending Order */}
        <Card variant="transparent">
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

        {/* Export Report */}
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Export Report</CardTitle>
              <CardDescription>Download inventory data as CSV</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Total Products', value: '48 items' },
              { label: 'Last Export', value: '3 days ago' },
              { label: 'File Size', value: '~24 KB' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between py-1.5 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm text-slate-500">{row.label}</span>
                <span className="text-sm font-medium text-slate-900">{row.value}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <p className="text-xs text-slate-500 min-w-0">
              Includes all active products and stock levels
            </p>
            <Button size="md" className="bg-violet-600 hover:bg-violet-700 shrink-0">
              Export
            </Button>
          </CardFooter>
        </Card>

        {/* Delete Category */}
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Delete Category</CardTitle>
              <CardDescription>Skincare · 12 products</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">
              Deleting this category will unassign all 12 products. They will remain in your
              inventory but appear uncategorized.
            </p>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <p className="text-xs text-slate-500 min-w-0">This action cannot be undone</p>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="md" variant="outline">
                Cancel
              </Button>
              <Button size="md" className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
}

export const ScrollableContent = {
  name: 'Scrollable Content',
  render: () => (
    <div className="p-6 max-w-2xl">
      <Card variant="transparent">
        <CardHeader>
          <CardIcon icon={ShoppingCart} />
          <div className="min-w-0 flex-1">
            <CardTitle>Products</CardTitle>
            <CardDescription>All active items in your inventory</CardDescription>
          </div>
          <CardAction>
            <AddButton />
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
            <span className="w-12 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
              Stock
            </span>
          </div>
          <div className="max-h-44 overflow-y-auto">
            {[
              { name: 'Moisturizer Cetaphil', category: 'Skincare', stock: 3 },
              { name: 'Vitamin C Serum', category: 'Skincare', stock: 1 },
              { name: 'Shampoo Dove', category: 'Hair Care', stock: 8 },
              { name: 'Face Wash', category: 'Skincare', stock: 5 },
              { name: 'Body Lotion', category: 'Body Care', stock: 2 },
              { name: 'Sunscreen SPF 50', category: 'Skincare', stock: 4 },
              { name: 'Hair Conditioner', category: 'Hair Care', stock: 6 },
              { name: 'Lip Balm', category: 'Skincare', stock: 12 },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center px-5 py-3.5 border-b border-slate-100 last:border-0"
              >
                <span className="flex-1 text-sm font-medium text-slate-900">{row.name}</span>
                <span className="w-28 text-sm text-slate-500">{row.category}</span>
                <span className="w-12 text-right text-sm text-slate-700">{row.stock}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-slate-500">8 items · last updated today</p>
        </CardFooter>
      </Card>
    </div>
  ),
}

export const Grid = {
  name: 'Grid',
  render: () => (
    <div className="p-6 max-w-5xl space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Total Products</CardTitle>
              <CardDescription>All active inventory</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">
              48 <span className="text-sm font-normal text-slate-500">items</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Products', value: '48', unit: 'items', sub: 'All active inventory' },
          { label: 'Low Stock', value: '6', unit: 'items', sub: 'Need restocking' },
        ].map((s) => (
          <Card key={s.label} variant="transparent">
            <CardHeader>
              <CardIcon icon={ShoppingCart} />
              <div className="min-w-0 flex-1">
                <CardTitle>{s.label}</CardTitle>
                <CardDescription>{s.sub}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">
                {s.value} <span className="text-sm font-normal text-slate-500">{s.unit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Products', value: '48', unit: 'items', sub: 'All active inventory' },
          { label: 'Active', value: '42', unit: 'items', sub: 'Currently in use' },
          { label: 'Low Stock', value: '6', unit: 'items', sub: 'Need restocking' },
        ].map((s) => (
          <Card key={s.label} variant="transparent">
            <CardHeader>
              <CardIcon icon={ShoppingCart} />
              <div className="min-w-0 flex-1">
                <CardTitle>{s.label}</CardTitle>
                <CardDescription>{s.sub}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">
                {s.value} <span className="text-sm font-normal text-slate-500">{s.unit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: '48', unit: 'items', sub: 'All active' },
          { label: 'Active', value: '42', unit: 'items', sub: 'In use' },
          { label: 'Low Stock', value: '6', unit: 'items', sub: 'Restock soon' },
          { label: 'Out of Stock', value: '2', unit: 'items', sub: 'Empty' },
        ].map((s) => (
          <Card key={s.label} variant="transparent">
            <CardHeader>
              <CardIcon icon={ShoppingCart} />
              <div className="min-w-0 flex-1">
                <CardTitle>{s.label}</CardTitle>
                <CardDescription>{s.sub}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">
                {s.value} <span className="text-sm font-normal text-slate-500">{s.unit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', value: '48', unit: 'products', sub: 'In inventory' },
          { label: 'Active', value: '42', unit: 'products', sub: 'In use' },
          { label: 'Low Stock', value: '6', unit: 'items', sub: 'Restock soon' },
          { label: 'Out of Stock', value: '2', unit: 'items', sub: 'Need reorder' },
          { label: 'Categories', value: '5', unit: 'groups', sub: 'Item groups' },
        ].map((s) => (
          <Card key={s.label} variant="transparent">
            <CardHeader>
              <CardIcon icon={ShoppingCart} />
              <div className="min-w-0 flex-1">
                <CardTitle>{s.label}</CardTitle>
                <CardDescription>{s.sub}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">
                {s.value} <span className="text-sm font-normal text-slate-500">{s.unit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
}

export const FooterAlignment = {
  name: 'Footer Alignment',
  render: () => (
    <div className="p-6 max-w-lg">
      <div className="grid grid-cols-1 gap-6">
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Edit Product</CardTitle>
              <CardDescription>Update product details</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-600">Product Name</p>
              <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400">
                Moisturizer Cetaphil
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-600">Stock</p>
              <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400">
                3
              </div>
            </div>
          </CardContent>
          <CardFooter align="start" className="gap-2">
            <Button size="md" variant="outline">
              Cancel
            </Button>
            <Button size="md" className="bg-violet-600 hover:bg-violet-700">
              Save
            </Button>
          </CardFooter>
        </Card>

        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Confirm Purchase</CardTitle>
              <CardDescription>Review before submitting</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Product', value: 'Vitamin C Serum' },
              { label: 'Quantity', value: '2 pcs' },
              { label: 'Total', value: 'Rp 180.000' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between py-1.5 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm text-slate-500">{row.label}</span>
                <span className="text-sm font-medium text-slate-900">{row.value}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter align="center" className="gap-2">
            <Button size="md" variant="outline">
              Cancel
            </Button>
            <Button size="md" className="bg-violet-600 hover:bg-violet-700">
              Confirm
            </Button>
          </CardFooter>
        </Card>

        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Delete Product</CardTitle>
              <CardDescription>Moisturizer Cetaphil</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">
              Deleting this product will remove it permanently from your inventory. Any related
              usage history will also be erased.
            </p>
          </CardContent>
          <CardFooter align="end" className="gap-2">
            <Button size="md" variant="outline">
              Cancel
            </Button>
            <Button size="md" className="bg-red-500 hover:bg-red-600">
              Delete
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
}

export const Padding = {
  name: 'Padding',
  render: () => (
    <div className="p-6 max-w-2xl space-y-4">
      {[
        { size: 'none', label: 'none · p-0 · 0px' },
        { size: 'xs', label: 'xs · p-2 · 8px' },
        { size: 'sm', label: 'sm · p-3 · 12px' },
        { size: 'base', label: 'base · p-4 · 16px' },
        { size: 'md', label: 'md · p-5 · 20px' },
        { size: 'lg', label: 'lg · p-6 · 24px' },
        { size: 'xl', label: 'xl · p-8 · 32px' },
      ].map(({ size, label }) => (
        <Card key={size} variant="transparent">
          <CardHeader padding={size}>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Products</CardTitle>
              <CardDescription>All active items in your inventory</CardDescription>
            </div>
            <CardAction>
              <span className="text-xs font-mono text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                {label}
              </span>
            </CardAction>
          </CardHeader>
          <CardContent padding={size}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Moisturizer', stock: 3 },
                  { name: 'Vitamin C Serum', stock: 1 },
                  { name: 'Shampoo', stock: 8 },
                ].map((row) => (
                  <tr key={row.name} className="bg-white border-b border-slate-100 last:border-0">
                    <td className="px-3 py-2 font-medium text-slate-900">{row.name}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{row.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter padding={size}>
            <p className="text-xs text-slate-500">3 items · last updated today</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
}

export const HeaderOnly = {
  name: 'Header Only',
  render: () => (
    <div className="p-6 max-w-2xl">
      <Card variant="transparent">
        <CardHeader>
          <CardIcon icon={ShoppingCart} />
          <div className="min-w-0 flex-1">
            <CardTitle>Section Title</CardTitle>
            <CardDescription>Short description of what this section shows</CardDescription>
          </div>
          <CardAction>
            <AddButton />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  ),
}
