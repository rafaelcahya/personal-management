import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Loading State' }
export default meta

const columns = [
  { id: 'ticker', header: 'Ticker', cell: (row) => row.ticker, width: 100 },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'price', header: 'Price', cell: (row) => row.price, align: 'right' },
  { id: 'qty', header: 'Qty', cell: (row) => row.qty, align: 'right' },
]

export const LoadingState = {
  name: 'Loading State',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">loading={'{true}'}</code>{' '}
        to show animated skeleton rows. The skeleton uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">pageSize</code> to determine
        how many placeholder rows to render — defaults to 10.
      </p>

      <DataTable data={[]} rowId="id" columns={columns} loading pageSize={5} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<DataTable
  data={[]}
  rowId="id"
  columns={columns}
  loading={isLoading}
  pageSize={5}
/>`}</code>
      </pre>
    </div>
  ),
}
