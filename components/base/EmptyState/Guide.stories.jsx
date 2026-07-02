import { AlertCircle, PackageOpen, Plus, SearchX } from 'lucide-react'
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from './EmptyState'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'EmptyState',
}

export default meta

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">EmptyState</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A composable empty-state pattern for tables, cards, and full-page views. Supports three
          sizes, three semantic variants, and an optional icon, title, description, and action slot.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <div className="flex flex-col gap-4">
          <div className="border border-gray-200 rounded-xl">
            <EmptyState>
              <EmptyStateIcon icon={PackageOpen} />
              <EmptyStateTitle>No products yet</EmptyStateTitle>
              <EmptyStateDescription>
                Add your first product to start tracking inventory.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button size="sm">
                  <Plus className="size-4" />
                  Add Product
                </Button>
                <Button size="sm" variant="ghost">
                  Learn more
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </div>
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/base/EmptyState/EmptyState'

<EmptyState variant="empty" size="default">
  <EmptyStateIcon icon={PackageOpen} />
  <EmptyStateTitle>No products yet</EmptyStateTitle>
  <EmptyStateDescription>
    Add your first product to start tracking inventory.
  </EmptyStateDescription>
  <EmptyStateActions>
    <Button size="sm">Add Product</Button>
    <Button size="sm" variant="ghost">Learn more</Button>
  </EmptyStateActions>
</EmptyState>`}</code>
        </pre>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <div className="overflow-x-auto w-full">
          <div className="min-w-max py-4">
            <div className="relative inline-flex flex-col items-center gap-3 border-2 border-dashed border-gray-400 rounded px-8 py-5 pt-9">
              <span className="absolute top-1.5 left-2.5 text-[10px] font-mono text-gray-500">
                EmptyState
              </span>

              <div className="relative border-2 border-dashed border-violet-400 rounded px-4 py-2 pt-6 min-w-[120px] flex justify-center">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-violet-500 whitespace-nowrap">
                  EmptyStateIcon (opt)
                </span>
                <PackageOpen className="size-8 text-gray-300" />
              </div>

              <div className="relative border-2 border-dashed border-blue-400 rounded px-4 py-2 pt-6 min-w-[180px] flex justify-center">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-blue-500 whitespace-nowrap">
                  EmptyStateTitle (opt)
                </span>
                <span className="text-sm font-semibold text-gray-700">No products yet</span>
              </div>

              <div className="relative border-2 border-dashed border-green-400 rounded px-4 py-2 pt-6 min-w-[240px] flex justify-center">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-green-600 whitespace-nowrap">
                  EmptyStateDescription (opt)
                </span>
                <span className="text-xs text-gray-400">Add your first product.</span>
              </div>

              <div className="relative border-2 border-dashed border-orange-400 rounded px-4 py-2 pt-6 min-w-[200px] flex justify-center gap-2">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-orange-500 whitespace-nowrap">
                  EmptyStateActions (opt)
                </span>
                <div className="h-6 w-20 rounded bg-gray-200" />
                <div className="h-6 w-16 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-48">
                Part
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">EmptyState</td>
              <td className="py-2.5 text-xs text-gray-600">
                Root container — centered flex column. Provides size and variant context to all
                children.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">EmptyStateIcon</td>
              <td className="py-2.5 text-xs text-gray-600">
                Icon slot — pass any Lucide icon or custom SVG via the{' '}
                <code className="bg-gray-100 px-1 rounded">icon</code> prop. Size and color are
                controlled by size/variant context.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">EmptyStateTitle</td>
              <td className="py-2.5 text-xs text-gray-600">
                Heading rendered as <code className="bg-gray-100 px-1 rounded">&lt;h3&gt;</code>.
                Font size and color follow size/variant context.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">EmptyStateDescription</td>
              <td className="py-2.5 text-xs text-gray-600">
                Supporting text rendered as{' '}
                <code className="bg-gray-100 px-1 rounded">&lt;p&gt;</code>. Max-width constrained
                to keep lines readable.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">EmptyStateActions</td>
              <td className="py-2.5 text-xs text-gray-600">
                Flex row wrapper for one or more action buttons. Place primary action first.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Variants */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Variants</h2>
        <p className="text-sm text-gray-500">
          Three semantic variants signal different situations. The{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> variant applies
          red tones throughout all sub-components.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              variant: 'empty',
              icon: PackageOpen,
              title: 'No products',
              desc: 'No data exists yet — neutral tone',
            },
            {
              variant: 'search',
              icon: SearchX,
              title: 'No results',
              desc: 'No results for a query',
            },
            {
              variant: 'error',
              icon: AlertCircle,
              title: 'Load failed',
              desc: 'Failed to load — red tone',
            },
          ].map(({ variant, icon, title, desc }) => (
            <div key={variant} className="flex flex-col gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit">
                {variant}
              </code>
              <div className="border border-gray-200 rounded-xl">
                <EmptyState variant={variant} size="sm">
                  <EmptyStateIcon icon={icon} />
                  <EmptyStateTitle>{title}</EmptyStateTitle>
                  <EmptyStateDescription>{desc}</EmptyStateDescription>
                </EmptyState>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Sizes</h2>
        <p className="text-sm text-gray-500">
          Three sizes scale vertical padding, icon size, and typography. Match the size to the
          container — compact for table rows, default for cards, large for full pages.
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Size
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Icon
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Title
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Use case
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              {
                size: 'xs',
                icon: 'size-5',
                title: 'text-xs',
                use: 'Dropdowns, popovers, combobox — max-h-60 constraint',
              },
              {
                size: 'sm',
                icon: 'size-8',
                title: 'text-sm',
                use: 'Table rows, small inline lists',
              },
              {
                size: 'default',
                icon: 'size-12',
                title: 'text-base',
                use: 'Cards, panels, SectionCard',
              },
              {
                size: 'lg',
                icon: 'size-16',
                title: 'text-xl',
                use: 'Full-page — entire view has no data',
              },
            ].map(({ size, icon, title, use }) => (
              <tr key={size}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">
                  {size}
                  {size === 'default' ? ' (default)' : ''}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{icon}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{title}</td>
                <td className="py-2.5 text-xs text-gray-600">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Usage */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usage</h2>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Minimal — title only</span>
            <div className="border border-gray-200 rounded-xl">
              <EmptyState size="sm">
                <EmptyStateTitle>Nothing here yet</EmptyStateTitle>
              </EmptyState>
            </div>
            <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
              <code>{`<EmptyState size="sm">
  <EmptyStateTitle>Nothing here yet</EmptyStateTitle>
</EmptyState>`}</code>
            </pre>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Search — no results</span>
            <div className="border border-gray-200 rounded-xl">
              <EmptyState variant="search" size="sm">
                <EmptyStateIcon icon={SearchX} />
                <EmptyStateTitle>No results for &quot;BBCA&quot;</EmptyStateTitle>
                <EmptyStateDescription>
                  Try a different symbol or check for typos.
                </EmptyStateDescription>
              </EmptyState>
            </div>
            <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
              <code>{`<EmptyState variant="search" size="sm">
  <EmptyStateIcon icon={SearchX} />
  <EmptyStateTitle>No results for "BBCA"</EmptyStateTitle>
  <EmptyStateDescription>
    Try a different symbol or check for typos.
  </EmptyStateDescription>
</EmptyState>`}</code>
            </pre>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Error — with retry action</span>
            <div className="border border-gray-200 rounded-xl">
              <EmptyState variant="error">
                <EmptyStateIcon icon={AlertCircle} />
                <EmptyStateTitle>Failed to load trades</EmptyStateTitle>
                <EmptyStateDescription>
                  Something went wrong. Please try again.
                </EmptyStateDescription>
                <EmptyStateActions>
                  <Button size="sm" variant="outline">
                    Retry
                  </Button>
                </EmptyStateActions>
              </EmptyState>
            </div>
            <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
              <code>{`<EmptyState variant="error">
  <EmptyStateIcon icon={AlertCircle} />
  <EmptyStateTitle>Failed to load trades</EmptyStateTitle>
  <EmptyStateDescription>
    Something went wrong. Please try again.
  </EmptyStateDescription>
  <EmptyStateActions>
    <Button size="sm" variant="outline">Retry</Button>
  </EmptyStateActions>
</EmptyState>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* When to Use */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">When to Use</h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use EmptyState when…', 'Consider an alternative when…'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      A list, table, or card section has zero items to display and you need to
                      communicate that to the user
                    </li>
                    <li>
                      A data fetch fails and you want to show an error state with an optional retry
                      action
                    </li>
                    <li>
                      A search or filter query returns no matching results and you need to guide the
                      user on next steps
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use a <strong>skeleton loader</strong> when data is still loading — EmptyState
                      is for resolved zero-data states only
                    </li>
                    <li>
                      Use a <strong>toast or alert</strong> when you need to notify the user of a
                      transient error that does not replace page content
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dos & Don'ts */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Dos & Don&apos;ts</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Match the <code className="bg-green-100 px-1 rounded">variant</code> to the
                  situation — use <strong>empty</strong> for zero data, <strong>search</strong> when
                  a filter or query produced no results, and <strong>error</strong> when a network
                  or server failure occurred.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Match the <code className="bg-green-100 px-1 rounded">size</code> to the container
                  — use <strong>xs/sm</strong> inside dropdowns and table rows,{' '}
                  <strong>default</strong> inside cards and panels, and <strong>lg</strong> when the
                  entire page is empty.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Always provide at least a <strong>title</strong>. Add a description when the
                  reason for the empty state is not immediately obvious, and add an action button
                  when there is a clear next step the user can take.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don&apos;t</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don&apos;t hide a section or render nothing when there is no data. A missing
                  section causes confusion — always render <strong>EmptyState</strong> so the user
                  knows the section exists but is currently empty.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don&apos;t use the <strong>error</strong> variant for zero-data situations.
                  Reserve it exclusively for failed fetches or server errors — misusing it trains
                  users to ignore real error states.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don&apos;t place multiple action buttons without a clear primary action first.
                  Keep <strong>EmptyStateActions</strong> to one primary button and at most one
                  ghost/secondary button to avoid decision paralysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>

        {/* EmptyState */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800">EmptyState</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Default
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  prop: 'size',
                  type: 'sm | default | lg',
                  def: 'default',
                  desc: 'Controls padding, icon size, and typography scale.',
                },
                {
                  prop: 'variant',
                  type: 'empty | search | error',
                  def: 'empty',
                  desc: 'Semantic tone — error applies red colors throughout.',
                },
                {
                  prop: 'className',
                  type: 'string',
                  def: '—',
                  desc: 'Additional CSS classes merged via cn().',
                },
                {
                  prop: 'children',
                  type: 'ReactNode',
                  def: '—',
                  desc: 'Compose EmptyStateIcon, EmptyStateTitle, etc.',
                },
              ].map(({ prop, type, def, desc }) => (
                <tr key={prop}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{def}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EmptyStateIcon */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800">EmptyStateIcon</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Default
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">icon</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                  LucideIcon | ComponentType
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">—</td>
                <td className="py-2.5 text-xs text-gray-600">
                  Icon component — rendered at full size of the slot. Pass the component reference,
                  not JSX.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">className</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">string</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">—</td>
                <td className="py-2.5 text-xs text-gray-600">
                  Additional classes on the icon wrapper span.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* EmptyStateTitle / Description / Actions */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800">
            EmptyStateTitle · EmptyStateDescription · EmptyStateActions
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Type
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">children</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">ReactNode</td>
                <td className="py-2.5 text-xs text-gray-600">
                  Text content or button elements. Styling is inherited from size/variant context.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">className</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">string</td>
                <td className="py-2.5 text-xs text-gray-600">
                  Additional CSS classes merged via cn().
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  ),
}
