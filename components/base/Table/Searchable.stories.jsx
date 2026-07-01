import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Searchable' }
export default meta

const data = [
  { id: 1, ticker: 'BBCA', name: 'Bank Central Asia', sector: 'Financials' },
  { id: 2, ticker: 'TLKM', name: 'Telkom Indonesia', sector: 'Telecom' },
  { id: 3, ticker: 'ASII', name: 'Astra International', sector: 'Consumer Disc.' },
  { id: 4, ticker: 'BMRI', name: 'Bank Mandiri', sector: 'Financials' },
  { id: 5, ticker: 'UNVR', name: 'Unilever Indonesia', sector: 'Consumer Staples' },
  { id: 6, ticker: 'ICBP', name: 'Indofood CBP', sector: 'Consumer Staples' },
]

const columns = [
  {
    id: 'ticker',
    header: 'Ticker',
    cell: (row) => <span className="font-mono font-semibold">{row.ticker}</span>,
    width: 100,
  },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'sector', header: 'Sector', cell: (row) => row.sector },
]

export const Searchable = {
  name: 'Searchable',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        The built-in search bar filters rows across the fields listed in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">searchKeys</code>. Search is
        case-insensitive and resets pagination to page 1 on each keystroke. Try typing{' '}
        <strong>bank</strong> or <strong>TLKM</strong>.
      </p>

      <DataTable
        data={data}
        rowId="id"
        columns={columns}
        searchable
        searchKeys={['ticker', 'name', 'sector']}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<DataTable
  data={stocks}
  rowId="id"
  columns={columns}
  searchable
  searchKeys={['ticker', 'name', 'sector']}
/>`}</code>
      </pre>
    </div>
  ),
}
