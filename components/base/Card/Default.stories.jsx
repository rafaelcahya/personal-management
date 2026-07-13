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
  title: 'Card/Default',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

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
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">shell</code> variant
        (default) works for any content type — tables, forms, stats, alerts. Combine{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardHeader</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardContent</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardFooter</code> as needed.
        Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          CardContent className="p-0"
        </code>{' '}
        for flush content like tables.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-6">
          {/* Table */}
          <Card className="col-span-2">
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
          <Card>
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
                Don&apos;t have an account?{' '}
                <span className="text-violet-600 font-medium cursor-pointer">Register</span>
              </p>
            </CardFooter>
          </Card>

          {/* Register */}
          <Card>
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
                  <span className="text-sm text-slate-300">•••••���••</span>
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
          <Card>
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
          <Card>
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

          {/* Export Report */}
          <Card>
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
          <Card>
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use shell (default) for all neutral containers',
                body: 'Tables, forms, stats, and alerts all fit in shell without needing a different variant. Only switch to a status variant when the card communicates a real semantic state.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't manually set background or border on the card root",
                body: 'Let variant control the visual style — overriding bg or border via className bypasses the variant system and breaks consistency across the app.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always wrap CardTitle and CardDescription in CardHeaderContent',
                body: 'CardHeaderContent handles min-w-0 flex-1 so long titles truncate correctly when CardAction is present. Using a raw div breaks this truncation.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use CardContent className="p-0" for tables and charts',
                body: 'The default p-4 padding breaks table row alignment at the card edge. Always override to p-0 for flush content, then let the table cells control their own padding.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Table card — flush content */}
<Card>
  <CardHeader>
    <CardIcon icon={ShoppingCart} />
    <div className="min-w-0 flex-1">
      <CardTitle>Products</CardTitle>
      <CardDescription>All active items</CardDescription>
    </div>
    <CardAction>
      <Button>Add Item</Button>
    </CardAction>
  </CardHeader>
  <CardContent className="p-0">
    <table>...</table>
  </CardContent>
  <CardFooter>
    <p className="text-xs text-slate-500">3 items</p>
  </CardFooter>
</Card>`}</code>
      </pre>
    </div>
  ),
}

export const ScrollableContent = {
  name: 'Scrollable Content',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        For long lists inside a card, wrap the list in a div with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">max-h-* overflow-y-auto</code>{' '}
        inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          CardContent className=&quot;p-0&quot;
        </code>
        . The header and footer stay pinned while the body scrolls.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
        <Card>
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use max-h-* overflow-y-auto for long lists inside CardContent',
                body: 'When the list is too long to show in full, wrap it in a scroll container inside CardContent className="p-0". The CardHeader and CardFooter stay pinned while the body scrolls.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't wrap the entire card in a scroll container",
                body: 'Only scroll the list inside CardContent — the header and footer must remain fixed. Wrapping the whole card hides the header as the user scrolls and breaks the sticky action button pattern.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Ensure the scroll container is keyboard accessible',
                body: 'Users should be able to focus into the list with Tab and scroll with arrow keys. Test that focus does not get trapped inside the scroll region.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pin column headers outside the scroll div',
                body: 'Place headers in a sibling div with border-b before the scroll container — they become visually sticky without needing position: sticky since they sit above the scroll region.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card>
  <CardHeader>...</CardHeader>
  <CardContent className="p-0">
    {/* sticky column headers */}
    <div className="flex bg-slate-50 px-5 py-3 border-b border-slate-100">
      <span className="flex-1 ...">Product</span>
      <span className="w-12 text-right ...">Stock</span>
    </div>
    {/* scrollable list */}
    <div className="max-h-44 overflow-y-auto">
      {items.map(row => (
        <div key={row.name} className="flex px-5 py-3.5 border-b ...">
          <span className="flex-1">{row.name}</span>
          <span className="w-12 text-right">{row.stock}</span>
        </div>
      ))}
    </div>
  </CardContent>
  <CardFooter>...</CardFooter>
</Card>`}</code>
      </pre>
    </div>
  ),
}

export const Grid = {
  name: 'Grid',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Cards work in CSS Grid at any column count. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">grid grid-cols-N gap-3</code>{' '}
        on the parent. Cards stretch equally — no extra props needed.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-3">
          <Card>
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
            <Card key={s.label}>
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
            <Card key={s.label}>
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
            <Card key={s.label}>
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use grid grid-cols-N gap-3 for uniform stat or summary card layouts',
                body: 'Cards stretch equally in a grid — no extra props needed. Use grid-cols-2 for pairs, grid-cols-3 for summary stats, grid-cols-4 max on desktop.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't exceed 4 columns on desktop",
                body: 'More than 4 columns makes stat values too small to scan quickly and they collapse poorly on mobile. Stick to 3–4 columns max for readability across screen sizes.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep variant consistent across all tiles in a grid',
                body: 'Mixing variants (shell + warning + danger) in a uniform stat grid creates visual inconsistency and confuses users about which cards have semantic meaning. Use text color for semantic emphasis instead.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use col-span-N on individual cards to span multiple columns',
                body: 'A table card can span col-span-2 or col-span-3 above a row of stat tiles in the same grid. Cards stretch equally — the grid handles height alignment automatically.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* 3-column stat grid */}
<div className="grid grid-cols-3 gap-3">
  {stats.map(s => (
    <Card key={s.label}>
      <CardHeader>
        <CardIcon icon={ShoppingCart} />
        <div className="min-w-0 flex-1">
          <CardTitle>{s.label}</CardTitle>
          <CardDescription>{s.sub}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
      </CardContent>
    </Card>
  ))}
</div>`}</code>
      </pre>
    </div>
  ),
}

export const FooterAlignment = {
  name: 'Footer Alignment',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardFooter</code> to control
        horizontal alignment:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;start&quot;</code>{' '}
        (default),{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;center&quot;</code>, or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;end&quot;</code>. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          className=&quot;justify-between&quot;
        </code>{' '}
        for a description + button layout.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-lg">
        <div className="grid grid-cols-1 gap-6">
          <Card>
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

          <Card>
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

          <Card>
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use align="start" for forms and align="end" for destructive actions',
                body: 'align="start" (default) for forms with Cancel + Save follows LTR reading flow. align="end" for destructive flows (Delete, Remove) follows iOS/Android and web modal conventions.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t use align="center" for multiple buttons',
                body: 'Centering a button group looks disconnected from the card content. Use start or end instead — centering works only for a single confirmation action.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Destructive buttons should come after Cancel in DOM order',
                body: 'Screen readers and keyboard users encounter buttons in source order. Place Cancel before Delete regardless of visual alignment — this ensures the safer action is always reached first.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use className="justify-between gap-3" for a description + action layout',
                body: 'For "N items · last updated" + Export button layouts, use className="justify-between gap-3" with min-w-0 on the text and shrink-0 on the button — more reliable than an align prop.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<CardFooter align="start" className="gap-2">   {/* default */}
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</CardFooter>

<CardFooter align="center" className="gap-2">
  <Button>Confirm</Button>
</CardFooter>

<CardFooter align="end" className="gap-2">
  <Button variant="outline">Cancel</Button>
  <Button className="bg-red-500">Delete</Button>
</CardFooter>

{/* description + button */}
<CardFooter className="justify-between gap-3">
  <p className="text-xs text-slate-500 min-w-0">This cannot be undone</p>
  <Button className="shrink-0">Confirm</Button>
</CardFooter>`}</code>
      </pre>
    </div>
  ),
}

export const HeaderOnly = {
  name: 'Header Only',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A card with only a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardHeader</code> — no body or
        footer. Use for section titles with an action button, or as the top band of a card that
        loads content dynamically below.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
        <Card>
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use when content loads dynamically below the header',
                body: 'The header appears immediately while the body skeleton or error state renders below — this prevents layout shift from an empty card and gives users immediate context.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use HeaderOnly for static body content",
                body: 'If you always have static body content, render the full card with CardContent and CardFooter instead of hiding them. HeaderOnly is for dynamic loading patterns, not just a header preference.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Set the right aria attributes if the header-only card is a landmark',
                body: 'Even with no CardContent, the Card still renders a div. Add the appropriate role or aria-label if this header-only pattern is used as a region landmark on the page.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Combine with CardAction for a persistent Add button',
                body: 'The header + action button stays visible regardless of the loading, empty, or error state of the body below. This is the correct pattern for all data table section headers in this app.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card>
  <CardHeader>
    <CardIcon icon={ShoppingCart} />
    <div className="min-w-0 flex-1">
      <CardTitle>Section Title</CardTitle>
      <CardDescription>Description text</CardDescription>
    </div>
    <CardAction>
      <Button>Add Item</Button>
    </CardAction>
  </CardHeader>
</Card>`}</code>
      </pre>
    </div>
  ),
}
