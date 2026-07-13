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
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">transparent</code> variant
        has no background or border — it acts as a page-level section wrapper. Use it as the outer
        card in the card-in-card pattern:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">transparent</code> for the
        section header, <code className="font-mono bg-gray-100 px-1 rounded text-xs">shell</code>{' '}
        for nested content cards.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-4xl">
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
                Don&apos;t have an account?{' '}
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
                {
                  label: 'Unrealized P&L',
                  value: '− Rp 420.000',
                  trend: 'down',
                  change: '−0.9%',
                },
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
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use transparent as the page-level section wrapper only',
                body: 'transparent provides the header structure without adding a white box. Inner content should be in shell cards — transparent outer + shell inner is the standard page layout pattern.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't nest a transparent card inside a shell",
                body: 'The invisible border makes the inner layout look unstructured and confuses the visual hierarchy. transparent is always the outer wrapper — never an inner card.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use CardTitle with the correct heading level for section structure',
                body: 'Transparent cards act as section wrappers — use as="h2" or as="h3" on CardTitle so screen readers understand the document hierarchy, especially on multi-section pages.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pass CardContent className="p-0" on the transparent outer',
                body: 'Without p-0, inner shell cards or tables start with an extra p-4 offset. Always remove the default padding on the transparent wrapper so inner content starts flush.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* transparent — no bg/border, just structure */}
<Card variant="transparent">
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
    {/* inner shell cards or table */}
  </CardContent>
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
        Same scrollable pattern as the shell variant — wrap the list in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">max-h-* overflow-y-auto</code>{' '}
        inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          CardContent className=&quot;p-0&quot;
        </code>
        . The transparent card provides the section header without the white box.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use transparent scrollable when the page background is already styled',
                body: 'The transparent scrollable pattern gives a section-title feel with no box — ideal when the page background is styled and a white card would look out of place.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use transparent with a scroll list on plain white pages",
                body: 'Without a background, the scroll container has no visual edge and looks like a disconnected list. Use a shell card instead so the scroll region has a visible boundary.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pin column headers outside the scroll container',
                body: 'Column headers become visually sticky without position: sticky since they sit in a sibling div above the scroll region. This also ensures they are read before list items by screen readers.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with CardAction for the Add button',
                body: 'The Add button anchors to the title row and stays pinned regardless of scroll position — giving users consistent access to the create action even when the list is scrolled.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="transparent">
  <CardHeader>...</CardHeader>
  <CardContent className="p-0">
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
        Transparent cards in a grid give each stat a section title without the white box. Use when
        the background is already styled (e.g., inside a page layout) and you don&apos;t want double
        borders.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-5xl space-y-6">
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use transparent tiles in a grid when the page already has a background',
                body: 'The absence of white boxes and double borders gives a clean, minimal stat layout — ideal when the page background is styled and extra card boxes would feel heavy.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use transparent tiles on plain white pages",
                body: 'Transparent tiles on white have no visual separation between them — the grid looks like a list of numbers. Use shell tiles instead so each stat has a visible boundary.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Transparent card grids have no visual boundary per tile',
                body: 'Add aria-label or role="region" to each tile to communicate its purpose to screen readers — the absence of a visual box means grouping cues must come from the markup.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep to 3–4 columns max for transparent stat grids',
                body: 'Transparent tiles have no box shadow to define boundaries, so wide grids look like undifferentiated lists of numbers. 3 columns is the sweet spot for readability.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="grid grid-cols-3 gap-3">
  {stats.map(s => (
    <Card key={s.label} variant="transparent">
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
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardFooter</code> works
        identically in the transparent variant. The footer has no top border in this variant — just
        top spacing.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-lg">
        <div className="grid grid-cols-1 gap-6">
          <Card variant="transparent">
            <CardHeader>
              <CardIcon icon={ShoppingCart} />
              <div className="min-w-0 flex-1">
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>align=&quot;start&quot; (default)</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-600">Product Name</p>
                <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400">
                  Moisturizer Cetaphil
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
                <CardDescription>align=&quot;center&quot;</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Product', value: 'Vitamin C Serum' },
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
                <CardDescription>align=&quot;end&quot;</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">
                Deleting this product will remove it permanently.
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
                title: 'Use align="start" or justify-between for transparent footers',
                body: 'align="start" (default) works for forms. For "N items · last updated" + Export button layouts common in transparent section footers, use className="justify-between gap-3" instead.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t use align="center" in a transparent footer',
                body: 'Without a border or background, centered buttons look unanchored. Left-align or justify-between are the right choices for transparent CardFooter.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Transparent CardFooter has no border-t — ensure spacing is clear',
                body: 'Unlike shell, the transparent footer has no visual divider above it — just top padding. If the footer content feels too close to the body, add extra spacing via className on CardContent.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'The align prop works identically in transparent but without border-t',
                body: 'Shell CardFooter has a visible divider line above it; transparent has no border-t. This makes footer content feel part of the card body — account for spacing accordingly.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="transparent">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>

  <CardFooter align="start" className="gap-2">    {/* default */}
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>

  <CardFooter align="center">...</CardFooter>
  <CardFooter align="end">...</CardFooter>
</Card>`}</code>
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
        A transparent card with only a header — the standard pattern for page section titles. The
        title + description + action appear without any container box, sitting cleanly above the
        content below it.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'This is the go-to pattern for page section headings',
                body: 'Transparent header-only gives the title and action without any visual container box cluttering the layout — use it above shell inner cards, tables, or grids.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't add CardContent or CardFooter to the transparent outer when content lives outside it",
                body: 'If content sits in sibling shell cards below the transparent outer, keep the outer as header-only. Adding CardContent with p-0 creates an unnecessary wrapper around the sibling layout.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use CardTitle with the correct heading level for the page hierarchy',
                body: 'This pattern is typically the page or section header — set as="h1" or as="h2" on CardTitle. Defaulting to h3 can break the document outline for screen reader users.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use CardHeaderContent to wrap title + description inside the header',
                body: 'CardHeaderContent handles min-w-0 flex-1 so the title truncates correctly when a CardAction Add button is present. Using a raw div breaks this truncation logic.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* transparent header-only — standard section title pattern */}
<Card variant="transparent">
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
