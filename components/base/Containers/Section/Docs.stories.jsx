import {
  AlertCircle,
  PackageOpen,
  Plus,
  ShoppingCart,
  SlidersHorizontal,
  Tag as TagIcon,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Button from '../../Button'
import SectionCard from '../../SectionCard'
import PageHeader from '@/app/main/components/PageHeader'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Layout/Section',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Preview = ({ children, className = '' }) => (
  <div className={`p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 ${className}`}>
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Chip = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

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

const body = (
  <div className="px-5 py-6 text-sm text-slate-400 italic">— body content goes here —</div>
)

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Containers</h1>
          <Chip color="violet">Structural Patterns</Chip>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Two layout patterns used on every page: <strong>Page Container</strong> — the app-wide
          structural convention for wrapping a page, and <strong>SectionCard</strong> — the white
          card component that holds each section's header and body content.
        </p>
      </div>

      {/* Overview */}
      <Section
        title="Overview"
        description="Every page follows the same outer structure: a <main> wrapper, a PageHeader, and one or more SectionCards."
      >
        <Preview className="bg-slate-50">
          <div className="max-w-2xl space-y-4">
            <PageHeader
              title="Product List"
              description="Manage your inventory items"
              breadcrumbs={[
                { label: 'Inventory', href: '/main/inventory' },
                { label: 'Product List' },
              ]}
            />
            <SectionCard
              icon={ShoppingCart}
              title="Products"
              description="All active items in your inventory"
              action={<AddButton />}
            >
              <div className="px-5 py-3 text-xs text-slate-400 italic">— table content —</div>
            </SectionCard>
          </div>
        </Preview>
      </Section>

      {/* Page Container */}
      <Section
        title="Page Container — App-wide Structure Rule"
        description="This is not a component — it's a structural convention every page must follow."
      >
        <div className="mb-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <Chip color="violet">main</Chip>
            <span>
              outer wrapper — never{' '}
              <code className="font-mono bg-gray-100 px-1 rounded text-xs">div</code>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Chip color="violet">space-y-6</Chip>
            <span>
              vertical spacing — never{' '}
              <code className="font-mono bg-gray-100 px-1 rounded text-xs">
                flex flex-col gap-*
              </code>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Chip color="violet">id="{'{pageName}'}"</Chip>
            <span>
              camelCase on <code className="font-mono bg-gray-100 px-1 rounded text-xs">main</code>{' '}
              — e.g.{' '}
              <code className="font-mono bg-gray-100 px-1 rounded text-xs">holdingsPage</code>,{' '}
              <code className="font-mono bg-gray-100 px-1 rounded text-xs">analyticsPage</code>
            </span>
          </div>
        </div>
        <Code>{`export default function ExamplePage() {
  return (
    <main id="{pageName}" className="space-y-6">
      <PageHeader
        title="Page Title"
        description="Short description"
        breadcrumbs={[
          { label: 'Module', href: '/main/module' },
          { label: 'Current Page' },
        ]}
      />

      <SectionCard icon={SomeIcon} title="Section Title" description="...">
        {/* body */}
      </SectionCard>
    </main>
  )
}`}</Code>
      </Section>

      {/* SectionCard Props */}
      <Section
        title="SectionCard Props"
        description="All props are optional — any combination is valid, including no props at all."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'variant',
                  "'shell' | 'transparent'",
                  "'shell'",
                  'shell — white card with border and shadow. transparent — no shell, no border-b on header. Use transparent for stat card grids or full-bleed charts.',
                ],
                [
                  'icon',
                  'ComponentType',
                  '—',
                  'Lucide icon component type — pass the component itself, not a rendered element. Use icon={ShoppingCart}, not icon={<ShoppingCart />}.',
                ],
                [
                  'title',
                  'string',
                  '—',
                  'Section heading. Renders as <h3> by default (override with titleAs). Auto-wires aria-labelledby on the outer <section> for accessibility.',
                ],
                ['description', 'string', '—', 'Short subtitle rendered below the title.'],
                [
                  'action',
                  'ReactNode',
                  '—',
                  'ReactNode rendered on the right side of the header. Pass a single Button or a <div> wrapping multiple buttons.',
                ],
                [
                  'actionAlign',
                  "'left' | 'center' | 'right'",
                  "'right'",
                  'Controls action position when action is the only header content (no icon/title/description). Has no effect when any text content is present.',
                ],
                [
                  'children',
                  'ReactNode',
                  '—',
                  'Body content rendered below the header. No padding applied — children must manage their own px/py.',
                ],
                [
                  'className',
                  'string',
                  "''",
                  'Extra CSS classes on the outer <section> — use for layout overrides like col-span-2 or mb-8.',
                ],
                [
                  'id',
                  'string',
                  '—',
                  'Sets id on <section>. Per project convention: id="{componentName}_{pageName}". Also used for anchor links and test selectors.',
                ],
                [
                  'titleAs',
                  "'h2' | 'h3' | 'h4' | 'p'",
                  "'h3'",
                  'HTML element used to render the title. Override when the page heading hierarchy requires a different level.',
                ],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {prop}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                    {type}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {def}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* SectionCard Variants */}
      <Section
        title="SectionCard Variants"
        description="All header props are optional and can be combined freely."
      >
        <SubSection title="With Action Button">
          <Preview>
            <SectionCard
              icon={ShoppingCart}
              title="Section Title"
              description="Short description"
              action={<AddButton />}
            >
              {body}
            </SectionCard>
          </Preview>
        </SubSection>

        <SubSection title="2 Action Buttons">
          <Preview>
            <SectionCard
              icon={ShoppingCart}
              title="Section Title"
              description="Short description"
              action={
                <div className="flex items-center gap-2">
                  <Button size="md" variant="outline" className="min-w-11">
                    Export
                  </Button>
                  <AddButton />
                </div>
              }
            >
              {body}
            </SectionCard>
          </Preview>
        </SubSection>

        <SubSection title="3 Action Buttons">
          <Preview>
            <SectionCard
              icon={ShoppingCart}
              title="Section Title"
              description="Short description"
              action={
                <div className="flex items-center gap-2">
                  <Button size="md" variant="ghost" className="min-w-11">
                    Filter
                  </Button>
                  <Button size="md" variant="outline" className="min-w-11">
                    Export
                  </Button>
                  <AddButton />
                </div>
              }
            >
              {body}
            </SectionCard>
          </Preview>
        </SubSection>

        <SubSection title="Header Combinations">
          <div className="space-y-3">
            {[
              {
                label: 'Without button',
                node: (
                  <SectionCard icon={TagIcon} title="Section Title" description="Short description">
                    {body}
                  </SectionCard>
                ),
              },
              {
                label: 'No icon',
                node: (
                  <SectionCard title="Section Title" description="Short description">
                    {body}
                  </SectionCard>
                ),
              },
              {
                label: 'Title only',
                node: <SectionCard title="Section Title">{body}</SectionCard>,
              },
              {
                label: 'Description only',
                node: <SectionCard description="Short description">{body}</SectionCard>,
              },
              { label: 'No header', node: <SectionCard>{body}</SectionCard> },
              {
                label: 'Header only',
                node: (
                  <SectionCard
                    icon={ShoppingCart}
                    title="Section Title"
                    description="Short description"
                    action={<AddButton />}
                  />
                ),
              },
            ].map(({ label, node }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="w-36 shrink-0 text-xs font-mono text-violet-700 pt-4">
                  {label}
                </span>
                <div className="flex-1">{node}</div>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection
          title="Button Only — actionAlign"
          description="When action is the only header content, use actionAlign to control its position."
        >
          <div className="space-y-3">
            {[
              { align: 'left', label: 'actionAlign="left"' },
              { align: 'center', label: 'actionAlign="center"' },
              { align: 'right', label: 'actionAlign="right" (default)' },
            ].map(({ align, label }) => (
              <div key={align} className="flex items-start gap-4">
                <span className="w-52 shrink-0 text-xs font-mono text-violet-700 pt-4">
                  {label}
                </span>
                <div className="flex-1">
                  <SectionCard actionAlign={align} action={<AddButton />}>
                    {body}
                  </SectionCard>
                </div>
              </div>
            ))}
          </div>
        </SubSection>
      </Section>

      {/* Section States */}
      <Section
        title="Section States"
        description="Every section must handle all four body states. See the SectionStates stories for individual examples."
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Loading
            </p>
            <SectionCard icon={ShoppingCart} title="Products" description="All active items">
              <div className="animate-pulse" aria-label="Loading data">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 px-5 py-3.5 border-b border-slate-100 last:border-0"
                  >
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Empty
            </p>
            <SectionCard
              icon={ShoppingCart}
              title="Products"
              description="All active items"
              action={<AddButton />}
            >
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <PackageOpen className="size-8 text-slate-300" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-700">No items yet</p>
                  <p className="text-xs text-slate-500">Add your first item to get started</p>
                </div>
                <Button
                  size="md"
                  useIcon={<Plus className="size-4" />}
                  className="bg-violet-600 hover:bg-violet-700 min-w-11"
                >
                  Add Item
                </Button>
              </div>
            </SectionCard>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Error
            </p>
            <SectionCard icon={ShoppingCart} title="Products" description="All active items">
              <div
                className="flex flex-col items-center justify-center py-10 gap-3 text-center"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="size-8 text-slate-400" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-700">Failed to load data</p>
                  <p className="text-xs text-slate-500">Check your connection and try again</p>
                </div>
                <Button variant="outline" size="md" className="min-w-11">
                  Try again
                </Button>
              </div>
            </SectionCard>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data</p>
            <SectionCard
              icon={ShoppingCart}
              title="Products"
              description="All active items"
              action={<AddButton />}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Product
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Moisturizer', stock: 3 },
                      { name: 'Vitamin C', stock: 1 },
                      { name: 'Shampoo', stock: 8 },
                    ].map((row) => (
                      <tr key={row.name} className="border-b border-slate-100 last:border-0">
                        <td className="px-5 py-3 font-medium text-slate-900">{row.name}</td>
                        <td className="px-5 py-3 text-right text-slate-700">{row.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="mt-4">
          <Code>{`{isLoading && <TableSkeleton />}
{isError && <ErrorState onRetry={loadData} />}
{!isLoading && !isError && data.length === 0 && <EmptyState onAdd={openSheet} />}
{!isLoading && !isError && data.length > 0 && <DataTable rows={data} />}`}</Code>
        </div>
      </Section>

      {/* Dos & Don'ts */}
      <Section title="Dos & Don'ts">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="mb-3 text-xs font-mono bg-white border border-green-200 rounded px-2 py-1 text-green-800">
                  {'<main id="productListPage" className="space-y-6">'}
                </div>
                <p className="text-xs text-green-800">
                  Use <code className="font-mono">&lt;main&gt;</code> with{' '}
                  <code className="font-mono">space-y-6</code> as the page wrapper.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <Preview>
                  <SectionCard
                    icon={ShoppingCart}
                    title="Products"
                    description="Manage items"
                    action={<AddButton />}
                  >
                    <div className="px-5 py-3 text-xs text-slate-400">— content —</div>
                  </SectionCard>
                </Preview>
                <p className="text-xs text-green-800">
                  Always give a section an icon, title, and description so context is immediately
                  clear.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Handle all four body states: Loading, Empty, Error, and Data — every section must
                  implement all four.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don't</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="mb-3 text-xs font-mono bg-white border border-red-200 rounded px-2 py-1 text-red-800">
                  {'<div className="flex flex-col gap-6">'}
                </div>
                <p className="text-xs text-red-800">
                  Don't use <code className="font-mono">&lt;div&gt;</code> or{' '}
                  <code className="font-mono">flex flex-col gap-*</code> as the page wrapper.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="mb-3 text-xs font-mono bg-white border border-red-200 rounded px-2 py-1 text-red-800">
                  {'<section className="bg-white rounded-xl border ...">'}
                </div>
                <p className="text-xs text-red-800">
                  Don't write the section card shell manually — use{' '}
                  <code className="font-mono">&lt;SectionCard&gt;</code>.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't skip states — a section that has no empty or error state leaves users with a
                  blank screen and no feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Usage Examples */}
      <Section title="Usage Examples" description="Copy-ready code for common scenarios.">
        <SubSection title="Full Page with Two Sections">
          <Code>{`import SectionCard from '@/components/base/SectionCard'
import PageHeader from '@/app/main/components/PageHeader'

export default function ProductListPage() {
  return (
    <main id="productListPage" className="space-y-6">
      <PageHeader
        title="Product List"
        description="Manage your inventory items"
        breadcrumbs={[
          { label: 'Inventory', href: '/main/inventory' },
          { label: 'Product List' },
        ]}
      />

      <SectionCard
        icon={ShoppingCart}
        title="Products"
        description="All active items"
        action={
          <Button size="md" useIcon={<Plus className="size-4" />} className="bg-violet-600 hover:bg-violet-700 min-w-11">
            Add Product
          </Button>
        }
      >
        {isLoading && <TableSkeleton />}
        {isError && <ErrorState onRetry={loadData} />}
        {!isLoading && !isError && data.length === 0 && <EmptyState onAdd={openSheet} />}
        {!isLoading && !isError && data.length > 0 && <ProductTable rows={data} />}
      </SectionCard>

      <SectionCard icon={TagIcon} title="Categories" description="Product categories in use">
        <div className="px-5 py-4 text-sm text-slate-500">Skincare · Hair Care</div>
      </SectionCard>
    </main>
  )
}`}</Code>
        </SubSection>

        <SubSection title="Section with Multiple Action Buttons">
          <Code>{`<SectionCard
  icon={SlidersHorizontal}
  title="Trade List"
  description="All your open and closed trades"
  action={
    <div className="flex items-center gap-2">
      <Button size="md" variant="outline" className="min-w-11">Export</Button>
      <Button size="md" useIcon={<Plus className="size-4" />} className="bg-violet-600 hover:bg-violet-700 min-w-11">
        Add Trade
      </Button>
    </div>
  }
>
  {/* body */}
</SectionCard>`}</Code>
        </SubSection>

        <SubSection title="Section without Header">
          <Code>{`{/* Use when section context is obvious from the page title */}
<SectionCard>
  <div className="px-5 py-4">
    {/* content */}
  </div>
</SectionCard>`}</Code>
        </SubSection>

        <SubSection title="Button Only — Centered CTA">
          <Code>{`<SectionCard actionAlign="center" action={
  <Button size="md" useIcon={<Plus className="size-4" />} className="bg-violet-600 hover:bg-violet-700 min-w-11">
    Add your first item
  </Button>
}>
  {/* body */}
</SectionCard>`}</Code>
        </SubSection>
      </Section>
    </div>
  ),
}
