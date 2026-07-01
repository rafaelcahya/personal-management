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
  title: 'EmptyState/Inside Table',
}

export default meta

const columns = ['Product', 'SKU', 'Stock', 'Price', 'Status']

function TableShell({ children }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden w-full">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length}>{children}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const InsideTable = {
  name: 'Inside Table',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">EmptyState</code> inside
        a table&apos;s <code className="font-mono bg-gray-100 px-1 rounded text-xs">tbody</code>{' '}
        spanning all columns. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;sm&quot;</code> for
        compact tables and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;default&quot;</code>{' '}
        for full-height tables.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-3xl">
        {/* Empty — no data */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            variant=&quot;empty&quot; — no data
          </span>
          <TableShell>
            <EmptyState size="default">
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
              </EmptyStateActions>
            </EmptyState>
          </TableShell>
        </div>

        {/* Search — no results */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            variant=&quot;search&quot; — no results
          </span>
          <TableShell>
            <EmptyState variant="search" size="sm">
              <EmptyStateIcon icon={SearchX} />
              <EmptyStateTitle>No results for &quot;AAPL&quot;</EmptyStateTitle>
              <EmptyStateDescription>
                Try a different symbol or clear the filter.
              </EmptyStateDescription>
            </EmptyState>
          </TableShell>
        </div>

        {/* Error */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            variant=&quot;error&quot; — load failed
          </span>
          <TableShell>
            <EmptyState variant="error" size="sm">
              <EmptyStateIcon icon={AlertCircle} />
              <EmptyStateTitle>Failed to load products</EmptyStateTitle>
              <EmptyStateDescription>Please try again.</EmptyStateDescription>
              <EmptyStateActions>
                <Button size="sm" variant="outline">
                  Retry
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </TableShell>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<table>
  <thead>...</thead>
  <tbody>
    <tr>
      <td colSpan={5}>
        <EmptyState size="default">
          <EmptyStateIcon icon={PackageOpen} />
          <EmptyStateTitle>No products yet</EmptyStateTitle>
          <EmptyStateDescription>
            Add your first product to start tracking inventory.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button size="sm">Add Product</Button>
          </EmptyStateActions>
        </EmptyState>
      </td>
    </tr>
  </tbody>
</table>`}</code>
      </pre>
    </div>
  ),
}
