import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Pagination' }
export default meta

const tickers = [
  'BBCA',
  'TLKM',
  'ASII',
  'BMRI',
  'UNVR',
  'ICBP',
  'GGRM',
  'INDF',
  'KLBF',
  'HMSP',
  'MYOR',
  'SIDO',
  'CPIN',
  'JPFA',
  'MAIN',
  'DSFI',
  'BWPT',
  'AALI',
  'LSIP',
  'SSMS',
]
const data = tickers.map((ticker, i) => ({
  id: i + 1,
  ticker,
  name: `Company ${ticker}`,
  price: 1000 + (i + 1) * 450,
  qty: 50 + (i + 1) * 25,
}))

const columns = [
  {
    id: 'ticker',
    header: 'Ticker',
    cell: (row) => <span className="font-mono font-semibold">{row.ticker}</span>,
    width: 100,
  },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  {
    id: 'price',
    header: 'Price (IDR)',
    cell: (row) => `Rp ${row.price.toLocaleString()}`,
    align: 'right',
  },
  { id: 'qty', header: 'Qty', cell: (row) => row.qty, align: 'right' },
]

export const Pagination = {
  name: 'Pagination',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Built-in pagination slices data after sort and search are applied.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">pageSize</code> controls rows
        per page.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">paginationVariant</code>{' '}
        controls the layout — four options:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">center</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">left</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">right</code>.
      </p>

      {/* full */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">full</code>
          <span className="text-xs text-gray-400">
            prev on far left · page centered · next on far right (default)
          </span>
        </div>
        <DataTable
          data={data}
          rowId="id"
          columns={columns}
          pagination
          paginationVariant="full"
          pageSize={5}
        />
      </div>

      {/* center */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">center</code>
          <span className="text-xs text-gray-400">prev · page · next — centered</span>
        </div>
        <DataTable
          data={data}
          rowId="id"
          columns={columns}
          pagination
          paginationVariant="center"
          pageSize={5}
        />
      </div>

      {/* left */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">left</code>
          <span className="text-xs text-gray-400">prev · page · next — aligned left</span>
        </div>
        <DataTable
          data={data}
          rowId="id"
          columns={columns}
          pagination
          paginationVariant="left"
          pageSize={5}
        />
      </div>

      {/* right */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">right</code>
          <span className="text-xs text-gray-400">prev · page · next — aligned right</span>
        </div>
        <DataTable
          data={data}
          rowId="id"
          columns={columns}
          pagination
          paginationVariant="right"
          pageSize={5}
        />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* full — prev far left, page centered, next far right (default) */}
<DataTable ... pagination paginationVariant="full" pageSize={5} />

{/* center — all controls centered */}
<DataTable ... pagination paginationVariant="center" pageSize={5} />

{/* left — all controls aligned left */}
<DataTable ... pagination paginationVariant="left" pageSize={5} />

{/* right — all controls aligned right */}
<DataTable ... pagination paginationVariant="right" pageSize={5} />`}</code>
      </pre>
    </div>
  ),
}
