import { PackageOpen, SearchX } from 'lucide-react'
import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Empty State' }
export default meta

const columns = [
  { id: 'ticker', header: 'Ticker', cell: (row) => row.ticker, width: 100 },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'price', header: 'Price', cell: (row) => row.price, align: 'right' },
]

function DefaultEmpty() {
  return (
    <div className="py-12 flex flex-col items-center gap-2 text-center">
      <PackageOpen className="size-8 text-gray-300" />
      <p className="text-sm font-medium text-gray-500">No positions yet</p>
      <p className="text-xs text-gray-400">Add a trade to see your portfolio here.</p>
    </div>
  )
}

function SearchEmpty() {
  return (
    <div className="py-12 flex flex-col items-center gap-2 text-center">
      <SearchX className="size-8 text-gray-300" />
      <p className="text-sm font-medium text-gray-500">No results</p>
      <p className="text-xs text-gray-400">Try a different search term.</p>
    </div>
  )
}

export const EmptyState = {
  name: 'Empty State',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass an <code className="font-mono bg-gray-100 px-1 rounded text-xs">emptyState</code> node
        to customize what is shown when{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">data</code> is empty (and not
        loading). If omitted, a minimal fallback message is rendered.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Custom empty state
        </span>
        <DataTable data={[]} rowId="id" columns={columns} emptyState={<DefaultEmpty />} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Search empty state
        </span>
        <DataTable
          data={[]}
          rowId="id"
          columns={columns}
          searchable
          searchKeys={['ticker']}
          emptyState={<SearchEmpty />}
        />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<DataTable
  data={[]}
  rowId="id"
  columns={columns}
  emptyState={
    <div className="py-12 text-center">
      <PackageOpen className="size-8 text-gray-300 mx-auto mb-2" />
      <p className="text-sm text-gray-500">No positions yet</p>
    </div>
  }
/>`}</code>
      </pre>
    </div>
  ),
}
