import { PackageOpen, SearchX } from 'lucide-react'
import {
  EmptyState as EmptyStateBase,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Empty State' }
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

const columns = [
  { id: 'ticker', header: 'Ticker', cell: (row) => row.ticker, width: 100 },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'price', header: 'Price', cell: (row) => row.price, align: 'right' },
]

function DefaultEmpty() {
  return (
    <EmptyStateBase size="sm">
      <EmptyStateIcon icon={PackageOpen} />
      <EmptyStateTitle>No positions yet</EmptyStateTitle>
      <EmptyStateDescription>Add a trade to see your portfolio here.</EmptyStateDescription>
    </EmptyStateBase>
  )
}

function SearchEmpty() {
  return (
    <EmptyStateBase size="sm" variant="search">
      <EmptyStateIcon icon={SearchX} />
      <EmptyStateTitle>No results</EmptyStateTitle>
      <EmptyStateDescription>Try a different search term.</EmptyStateDescription>
    </EmptyStateBase>
  )
}

export const EmptyState = {
  name: 'Empty State',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass an <code className="font-mono bg-gray-100 px-1 rounded text-xs">emptyState</code> node
        to customize what is shown when{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">data</code> is empty (and not
        loading). If omitted, a minimal fallback message is rendered.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">custom empty state — no data exists</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable data={[]} rowId="id" columns={columns} emptyState={<DefaultEmpty />} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          search empty state — no results for current filter
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable
            data={[]}
            rowId="id"
            columns={columns}
            searchable
            searchKeys={['ticker']}
            emptyState={<SearchEmpty />}
          />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always provide a custom emptyState — the default fallback is generic',
                body: 'Explain WHY the table is empty and offer a clear next action. "Add your first trade" is better than "No data". "Try a different filter" is better than "No results".',
              },
              {
                title: 'Distinguish "no data exists" from "no results match the search"',
                body: 'Pass a different emptyState when the search term is non-empty. Users who typed a query need to know their search found nothing — not that the dataset is empty.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't rely on the built-in fallback for production tables",
                body: 'The fallback message is intentionally minimal. Ship a custom emptyState with a domain-relevant icon and action for every table that real users interact with.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep emptyState at a reasonable min-height',
                body: "Use py-12 or h-48 so the table doesn't collapse to a thin strip when empty. A collapsed empty state looks like a broken layout, not an intentional empty state.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use the EmptyState component for consistent styling',
                body: 'EmptyState + EmptyStateIcon + EmptyStateTitle + EmptyStateDescription gives a consistent visual language across all empty states in the app.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<DataTable
  data={[]}
  rowId="id"
  columns={columns}
  emptyState={
    <EmptyState size="sm">
      <EmptyStateIcon icon={PackageOpen} />
      <EmptyStateTitle>No positions yet</EmptyStateTitle>
      <EmptyStateDescription>Add a trade to see your portfolio here.</EmptyStateDescription>
    </EmptyState>
  }
/>`}</code>
      </pre>
    </div>
  ),
}
