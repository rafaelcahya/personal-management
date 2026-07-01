import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Sortable' }
export default meta

const data = [
  { id: 1, ticker: 'BBCA', name: 'Bank Central Asia', price: 9250, change: 1.2 },
  { id: 2, ticker: 'TLKM', name: 'Telkom Indonesia', price: 3120, change: -0.8 },
  { id: 3, ticker: 'ASII', name: 'Astra International', price: 5400, change: 2.5 },
  { id: 4, ticker: 'BMRI', name: 'Bank Mandiri', price: 6750, change: -1.1 },
  { id: 5, ticker: 'UNVR', name: 'Unilever Indonesia', price: 2800, change: 0.4 },
]

const columns = [
  {
    id: 'ticker',
    header: 'Ticker',
    cell: (row) => <span className="font-mono font-semibold">{row.ticker}</span>,
    sortable: true,
    width: 100,
  },
  {
    id: 'name',
    header: 'Name',
    cell: (row) => row.name,
    sortable: true,
  },
  {
    id: 'price',
    header: 'Price (IDR)',
    cell: (row) => `Rp ${row.price.toLocaleString()}`,
    sortable: true,
    align: 'right',
  },
  {
    id: 'change',
    header: 'Change %',
    cell: (row) => (
      <span className={row.change >= 0 ? 'text-emerald-600' : 'text-red-500'}>
        {row.change >= 0 ? '+' : ''}
        {row.change}%
      </span>
    ),
    sortable: true,
    align: 'right',
  },
]

export const Sortable = {
  name: 'Sortable',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Click any column header to sort. First click → ascending, second → descending, third →
        reset. Only one column sorts at a time. Columns with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">sortable: true</code> in the
        column definition show a sort icon.
      </p>

      <DataTable data={data} rowId="id" columns={columns} sortable />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`const columns = [
  { id: 'ticker', header: 'Ticker', cell: (row) => row.ticker, sortable: true },
  { id: 'price',  header: 'Price',  cell: (row) => row.price,  sortable: true, align: 'right' },
]

<DataTable
  data={stocks}
  rowId="id"
  columns={columns}
  sortable
/>`}</code>
      </pre>
    </div>
  ),
}
