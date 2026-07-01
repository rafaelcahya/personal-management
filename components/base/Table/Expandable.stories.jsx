import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Expandable' }
export default meta

const data = [
  {
    id: 1,
    ticker: 'BBCA',
    name: 'Bank Central Asia',
    qty: 100,
    avgPrice: 8900,
    currentPrice: 9250,
    notes: 'Long-term hold. Strong fundamentals, leading private bank in Indonesia.',
  },
  {
    id: 2,
    ticker: 'TLKM',
    name: 'Telkom Indonesia',
    qty: 200,
    avgPrice: 3300,
    currentPrice: 3120,
    notes: 'Under pressure from competition. Watching for Q3 earnings recovery.',
  },
  {
    id: 3,
    ticker: 'ASII',
    name: 'Astra International',
    qty: 150,
    avgPrice: 5100,
    currentPrice: 5400,
    notes: 'Diversified conglomerate. Benefiting from automotive recovery.',
  },
]

const columns = [
  {
    id: 'ticker',
    header: 'Ticker',
    cell: (row) => <span className="font-mono font-semibold">{row.ticker}</span>,
    width: 100,
  },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'qty', header: 'Qty', cell: (row) => row.qty, align: 'right' },
  {
    id: 'pl',
    header: 'P&L',
    cell: (row) => {
      const pl = (row.currentPrice - row.avgPrice) * row.qty
      return (
        <span className={pl >= 0 ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
          {pl >= 0 ? '+' : ''}Rp {pl.toLocaleString()}
        </span>
      )
    },
    align: 'right',
  },
]

export const Expandable = {
  name: 'Expandable',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Click any row to expand it and reveal additional content via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">expandContent</code>. Multiple
        rows can be expanded at the same time. The chevron icon rotates to indicate expanded state.
      </p>

      <DataTable
        data={data}
        rowId="id"
        columns={columns}
        expandable
        expandContent={(row) => (
          <div className="flex flex-col gap-1.5 text-xs text-gray-600">
            <div className="flex gap-4">
              <span>
                Avg price:{' '}
                <strong className="text-gray-800">Rp {row.avgPrice.toLocaleString()}</strong>
              </span>
              <span>
                Current:{' '}
                <strong className="text-gray-800">Rp {row.currentPrice.toLocaleString()}</strong>
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed">{row.notes}</p>
          </div>
        )}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<DataTable
  data={positions}
  rowId="id"
  columns={columns}
  expandable
  expandContent={(row) => (
    <div>
      <p>Avg price: {row.avgPrice}</p>
      <p>{row.notes}</p>
    </div>
  )}
/>`}</code>
      </pre>
    </div>
  ),
}
