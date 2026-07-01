import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table'
import { DataTable } from './DataTable'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/base/Popover/Popover'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table' }
export default meta

const sampleData = [
  { id: 1, ticker: 'BBCA', name: 'Bank Central Asia', price: 9250, qty: 100, type: 'Buy' },
  { id: 2, ticker: 'TLKM', name: 'Telkom Indonesia', price: 3120, qty: 200, type: 'Sell' },
  { id: 3, ticker: 'ASII', name: 'Astra International', price: 5400, qty: 150, type: 'Buy' },
]

const columns = [
  {
    id: 'ticker',
    header: 'Ticker',
    cell: (row) => <span className="font-mono font-semibold">{row.ticker}</span>,
    sortable: true,
    width: 100,
  },
  { id: 'name', header: 'Name', cell: (row) => row.name, sortable: true },
  {
    id: 'price',
    header: 'Price',
    cell: (row) => `Rp ${row.price.toLocaleString()}`,
    sortable: true,
    align: 'right',
  },
  { id: 'qty', header: 'Qty', cell: (row) => row.qty, align: 'right' },
  { id: 'type', header: 'Type', cell: (row) => row.type },
]

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-4xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Table & DataTable</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A two-layer table system built from scratch. Layer 1 provides pure presentational HTML
          wrappers ( <code className="font-mono bg-gray-100 px-1 rounded text-xs">Table</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableHeader</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableBody</code>, etc.).
          Layer 2 wraps them into{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">DataTable</code> — a
          feature-rich compound component with sorting, search, selection, expand, pagination,
          loading skeleton, and empty state.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <DataTable
          data={sampleData}
          rowId="id"
          columns={columns}
          searchable
          searchKeys={['ticker', 'name']}
          sortable
          selectable
          expandable
          expandContent={(row) => (
            <div className="text-xs text-gray-500">
              Full name: <strong>{row.name}</strong> · Type: <strong>{row.type}</strong>
            </div>
          )}
          pagination
          pageSize={5}
        />
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import { DataTable } from '@/components/base/Table/DataTable'

const columns = [
  { id: 'ticker', header: 'Ticker', cell: (row) => row.ticker, sortable: true },
  { id: 'name',   header: 'Name',   cell: (row) => row.name,   sortable: true },
  { id: 'price',  header: 'Price',  cell: (row) => row.price,  sortable: true, align: 'right' },
]

<DataTable
  data={trades}
  rowId="id"
  columns={columns}
  searchable
  searchKeys={['ticker', 'name']}
  sortable
  selectable
  expandable
  expandContent={(row) => <TradeDetail trade={row} />}
  pagination
  pageSize={15}
/>`}</code>
        </pre>
      </section>

      {/* Anatomy — Layer 1 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Anatomy — Layer 1 (Base)
        </h2>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed">
          <code>{`<Table>                             ← overflow wrapper + <table>
  <TableHeader sticky?>              ← <thead>, optional sticky
    <TableRow>
      <TableHead align? width?>      ← <th>, uppercase tracking-wide
    </TableRow>
  </TableHeader>
  <TableBody>                        ← <tbody> divide-y
    <TableRow selected? clickable?>  ← <tr>, hover + selected states
      <TableCell align?>             ← <td>
    </TableRow>
  </TableBody>
  <TableFooter>                      ← <tfoot>
    <TableRow>
      <TableCell />
    </TableRow>
  </TableFooter>
  <TableCaption />                   ← <caption>
</Table>`}</code>
        </pre>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Name</TableHead>
                <TableHead align="right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-mono font-semibold">{row.ticker}</span>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">Rp {row.price.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-medium">Total</TableCell>
                <TableCell />
                <TableCell align="right">
                  Rp {sampleData.reduce((s, r) => s + r.price, 0).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
            <TableCaption>All amounts in Indonesian Rupiah (IDR)</TableCaption>
          </Table>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-40">
                Part
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ['Table', 'Overflow wrapper + <table>. Use inside any container.'],
              ['TableHeader', 'Renders <thead>. Pass sticky to pin on scroll.'],
              ['TableBody', 'Renders <tbody> with divide-y between rows.'],
              ['TableFooter', 'Renders <tfoot> with gray-50 background.'],
              [
                'TableRow',
                'Renders <tr>. selected adds violet-50 bg. clickable adds pointer cursor.',
              ],
              ['TableHead', 'Renders <th>. Uppercase tracking-wide. Accepts align and width.'],
              ['TableCell', 'Renders <td>. Accepts align prop (left | right | center).'],
              ['TableCaption', 'Renders <caption> below the table.'],
            ].map(([part, desc]) => (
              <tr key={part}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{part}</td>
                <td className="py-2.5 text-xs text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Anatomy — Layer 2 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Anatomy — Layer 2 (DataTable)
        </h2>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed">
          <code>{`DataTable
├── search bar              (searchable prop)
├── Table
│   ├── TableHeader
│   │   └── TableRow
│   │       ├── TableHead (checkbox)   (selectable)
│   │       ├── TableHead (expand)     (expandable)
│   │       └── TableHead + sort icon (sortable)
│   └── TableBody
│       └── TableRow (selected? clickable?)
│           ├── TableCell (checkbox)   (selectable)
│           ├── TableCell (chevron)    (expandable)
│           ├── TableCell per column
│           └── expand row (colspan)  (expandable)
└── pagination controls     (pagination prop)`}</code>
        </pre>
      </section>

      {/* Usage */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usage</h2>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Minimal — just data + columns</span>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.ticker}</TableCell>
                    <TableCell>{row.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Ticker</TableHead>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.ticker}</TableCell>
        <TableCell>{row.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">
            DataTable — sort + search + pagination
          </span>
          <DataTable
            data={sampleData}
            rowId="id"
            columns={columns}
            searchable
            searchKeys={['ticker', 'name']}
            sortable
            pagination
            pageSize={5}
          />
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<DataTable
  data={trades}
  rowId="id"
  columns={columns}
  searchable
  searchKeys={['ticker', 'name']}
  sortable
  pagination
  pageSize={10}
/>`}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Column alignment</span>
          <p className="text-sm text-gray-500 leading-relaxed">
            Both <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableHead</code> and{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableCell</code> accept an{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> prop:{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;left&quot;</code>{' '}
            (default),{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;right&quot;</code>,
            or{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;center&quot;</code>.
            In <code className="font-mono bg-gray-100 px-1 rounded text-xs">DataTable</code>, set{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> on the column
            definition and it applies to both header and cell automatically.
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead align="center">Type</TableHead>
                  <TableHead align="right">Price (IDR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="font-mono font-semibold">{row.ticker}</span>
                    </TableCell>
                    <TableCell align="center">{row.type}</TableCell>
                    <TableCell align="right">Rp {row.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`{/* Layer 1 — TableHead + TableCell */}
<TableHead>Ticker</TableHead>          {/* left (default) */}
<TableHead align="center">Type</TableHead>
<TableHead align="right">Price</TableHead>

<TableCell>{row.ticker}</TableCell>    {/* left (default) */}
<TableCell align="center">{row.type}</TableCell>
<TableCell align="right">{row.price}</TableCell>

{/* Layer 2 — via column definition */}
const columns = [
  { id: 'ticker', header: 'Ticker', cell: (row) => row.ticker },
  { id: 'type',   header: 'Type',   cell: (row) => row.type,  align: 'center' },
  { id: 'price',  header: 'Price',  cell: (row) => row.price, align: 'right' },
]`}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Table inside Popover</span>
          <p className="text-sm text-gray-500 leading-relaxed">
            Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">Table</code> (Layer 1)
            inside a Popover to show a compact data breakdown — e.g. lot detail, price history, or a
            breakdown of totals — without navigating away from the current view.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 shadow-sm">
                  BBCA · 3 lots
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 overflow-hidden" align="start">
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-700">BBCA — Lot breakdown</p>
                  <p className="text-xs text-gray-400">Bank Central Asia</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead align="right">Price</TableHead>
                      <TableHead align="right">Qty</TableHead>
                      <TableHead align="right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '12 Jan', price: 8900, qty: 100 },
                      { date: '3 Mar', price: 9100, qty: 50 },
                      { date: '18 Jun', price: 9250, qty: 75 },
                    ].map((lot, i) => (
                      <TableRow key={i}>
                        <TableCell>{lot.date}</TableCell>
                        <TableCell align="right">Rp {lot.price.toLocaleString()}</TableCell>
                        <TableCell align="right">{lot.qty}</TableCell>
                        <TableCell align="right">
                          Rp {(lot.price * lot.qty).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between text-xs">
                  <span className="text-gray-400">Total</span>
                  <span className="font-semibold text-gray-700">
                    Rp {(8900 * 100 + 9100 * 50 + 9250 * 75).toLocaleString()}
                  </span>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 shadow-sm">
                  TLKM · 2 lots
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 overflow-hidden" align="start">
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-700">TLKM — Lot breakdown</p>
                  <p className="text-xs text-gray-400">Telkom Indonesia</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead align="right">Price</TableHead>
                      <TableHead align="right">Qty</TableHead>
                      <TableHead align="right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '5 Feb', price: 3300, qty: 100 },
                      { date: '20 May', price: 3120, qty: 100 },
                    ].map((lot, i) => (
                      <TableRow key={i}>
                        <TableCell>{lot.date}</TableCell>
                        <TableCell align="right">Rp {lot.price.toLocaleString()}</TableCell>
                        <TableCell align="right">{lot.qty}</TableCell>
                        <TableCell align="right">
                          Rp {(lot.price * lot.qty).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between text-xs">
                  <span className="text-gray-400">Total</span>
                  <span className="font-semibold text-gray-700">
                    Rp {(3300 * 100 + 3120 * 100).toLocaleString()}
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`import { Popover, PopoverTrigger, PopoverContent } from '@/components/base/Popover/Popover'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/base/Table/Table'

<Popover>
  <PopoverTrigger asChild>
    <button>BBCA · 3 lots</button>
  </PopoverTrigger>
  <PopoverContent className="w-80 p-0 overflow-hidden" align="start">
    <div className="px-3 py-2.5 border-b border-gray-100">
      <p className="text-xs font-semibold">BBCA — Lot breakdown</p>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead align="right">Price</TableHead>
          <TableHead align="right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lots.map((lot) => (
          <TableRow key={lot.date}>
            <TableCell>{lot.date}</TableCell>
            <TableCell align="right">{lot.price}</TableCell>
            <TableCell align="right">{lot.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between text-xs">
      <span className="text-gray-400">Total</span>
      <span className="font-semibold">{total}</span>
    </div>
  </PopoverContent>
</Popover>`}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Popover inside Table</span>
          <p className="text-sm text-gray-500 leading-relaxed">
            Place a <code className="font-mono bg-gray-100 px-1 rounded text-xs">Popover</code>{' '}
            inside a <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableCell</code>{' '}
            to surface inline detail or actions without leaving the row — e.g. a price history
            tooltip, a note preview, or a quick-edit form triggered from the row itself.
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead align="right">Price</TableHead>
                  <TableHead align="right">Qty</TableHead>
                  <TableHead align="right">History</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    id: 1,
                    ticker: 'BBCA',
                    name: 'Bank Central Asia',
                    price: 9250,
                    qty: 100,
                    history: [
                      { date: 'Jun 18', price: 9250 },
                      { date: 'Mar 3', price: 9100 },
                      { date: 'Jan 12', price: 8900 },
                    ],
                  },
                  {
                    id: 2,
                    ticker: 'TLKM',
                    name: 'Telkom Indonesia',
                    price: 3120,
                    qty: 200,
                    history: [
                      { date: 'May 20', price: 3120 },
                      { date: 'Feb 5', price: 3300 },
                    ],
                  },
                  {
                    id: 3,
                    ticker: 'ASII',
                    name: 'Astra International',
                    price: 5400,
                    qty: 150,
                    history: [
                      { date: 'Jun 1', price: 5400 },
                      { date: 'Apr 10', price: 5100 },
                      { date: 'Jan 20', price: 4950 },
                    ],
                  },
                ].map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="font-mono font-semibold text-gray-900">{row.ticker}</span>
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">Rp {row.price.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.qty}</TableCell>
                    <TableCell align="right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-xs text-violet-600 hover:text-violet-800 hover:underline underline-offset-2 font-medium">
                            {row.history.length} entries
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0 overflow-hidden" align="end">
                          <div className="px-3 py-2.5 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-700">
                              {row.ticker} — Price history
                            </p>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead align="right">Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.history.map((h, i) => (
                                <TableRow key={i}>
                                  <TableCell className="text-xs">{h.date}</TableCell>
                                  <TableCell align="right" className="text-xs font-mono">
                                    Rp {h.price.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Ticker</TableHead>
      <TableHead align="right">History</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.ticker}</TableCell>
        <TableCell align="right">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-xs text-violet-600 hover:underline">
                {row.history.length} entries
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 overflow-hidden" align="end">
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-xs font-semibold">{row.ticker} — Price history</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead align="right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {row.history.map((h) => (
                    <TableRow key={h.date}>
                      <TableCell>{h.date}</TableCell>
                      <TableCell align="right">{h.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}</code>
          </pre>
        </div>
      </section>

      {/* When to use */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">When to use</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800">
              Use{' '}
              <code className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs">
                Table
              </code>{' '}
              (Layer 1) when…
            </p>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 leading-relaxed list-none">
              {[
                'The data is static or already fully prepared — no sorting, filtering, or pagination needed.',
                'You need full control over every row and cell, such as custom row spanning, merged cells, or complex nesting.',
                'The table is purely presentational — a summary card, a receipt, a comparison grid.',
                'You want to build your own feature layer on top (e.g. a custom controlled sort outside the table).',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-violet-400 shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-violet-200 bg-violet-50">
            <p className="text-sm font-semibold text-gray-800">
              Use{' '}
              <code className="font-mono bg-white border border-violet-200 px-1.5 py-0.5 rounded text-xs">
                DataTable
              </code>{' '}
              (Layer 2) when…
            </p>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 leading-relaxed list-none">
              {[
                'Users need to sort, search, or page through a list — any interactive data table in the app.',
                'You want row selection (bulk actions, delete, export) without managing the state yourself.',
                'Rows have detail content that can be expanded inline without navigating to a new page.',
                'You need a loading skeleton and empty state that are consistent with the rest of the app.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-violet-500 shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Rule of thumb:</strong> start with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">DataTable</code>. Drop down to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">Table</code> only when you need
          structure that <code className="font-mono bg-gray-100 px-1 rounded">DataTable</code>{' '}
          cannot express — merged cells, custom footers, or a fully controlled feature layer.
        </p>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>

        {/* DataTable */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800">DataTable</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-40">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-56">
                  Type
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-20">
                  Default
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['data', 'object[]', '[]', 'Array of row objects.'],
                ['rowId', 'string', '"id"', 'Key of the unique row identifier.'],
                ['columns', 'ColumnDef[]', '[]', 'Column definitions — see ColumnDef below.'],
                ['searchable', 'boolean', 'false', 'Show search bar and filter rows.'],
                ['searchKeys', 'string[]', '[]', 'Row fields to search across.'],
                ['sortable', 'boolean', 'false', 'Enable column sort on TableHead click.'],
                ['selectable', 'boolean', 'false', 'Add checkbox column + select-all.'],
                [
                  'expandable',
                  'boolean',
                  'false',
                  'Make rows clickable; show expandContent below.',
                ],
                ['expandContent', '(row) => ReactNode', '—', 'Content rendered in the expand row.'],
                ['pagination', 'boolean', 'false', 'Enable page controls below the table.'],
                ['pageSize', 'number', '10', 'Rows per page.'],
                [
                  'paginationVariant',
                  '"full" | "center" | "left" | "right"',
                  '"full"',
                  'Layout of pagination controls. full = prev far left, page centered, next far right. center/left/right = all controls together.',
                ],
                [
                  'stickyHeader',
                  'boolean',
                  'false',
                  'Pin the header on scroll (max-h-96 container).',
                ],
                ['loading', 'boolean', 'false', 'Show skeleton rows instead of data.'],
                ['emptyState', 'ReactNode', '—', 'Node shown when data is empty.'],
                ['sort', '{ column, direction } | null', '—', 'Controlled sort state.'],
                ['onSortChange', '(sort) => void', '—', 'Called when sort changes.'],
                ['selectedRows', 'string[] | number[]', '—', 'Controlled selected row IDs.'],
                ['onSelectionChange', '(ids[]) => void', '—', 'Called when selection changes.'],
              ].map(([prop, type, def, desc]) => (
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

        {/* ColumnDef */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800">ColumnDef</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-24">
                  Key
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-40">
                  Type
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['id', 'string', 'Unique column identifier — used as sort key.'],
                ['header', 'ReactNode', 'Column header label.'],
                ['cell', '(row) => ReactNode', 'Cell renderer — receives the row object.'],
                [
                  'sortable',
                  'boolean',
                  'Whether this column is sortable (requires sortable prop on DataTable).',
                ],
                ['align', '"left" | "right" | "center"', 'Cell and header text alignment.'],
                ['width', 'number | string', 'Fixed column width (CSS value).'],
              ].map(([key, type, desc]) => (
                <tr key={key}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{key}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Layer 1 quick ref */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-800">Layer 1 — Base Components</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
                  Component
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Notable Props
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['Table', 'className'],
                ['TableHeader', 'sticky (boolean) — pins header on scroll'],
                ['TableBody', 'className'],
                ['TableFooter', 'className'],
                ['TableRow', 'selected (boolean), clickable (boolean)'],
                ['TableHead', 'align ("left"|"right"|"center"), width'],
                ['TableCell', 'align ("left"|"right"|"center")'],
                ['TableCaption', 'className'],
              ].map(([comp, props]) => (
                <tr key={comp}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{comp}</td>
                  <td className="py-2.5 text-xs text-gray-600">{props}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  ),
}
