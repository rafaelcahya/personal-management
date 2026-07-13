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

// ─── Primitives ──────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed w-full">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const colStyles = [
  'font-mono text-violet-700 whitespace-nowrap',
  'font-mono text-gray-500 max-w-xs',
  'font-mono text-gray-400',
  'text-gray-700',
]

const ApiTable = ({ headers = ['Prop', 'Type', 'Default', 'Description'], rows }) => (
  <div className="mb-6 overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h) => (
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
        {rows.map((row, ri) => (
          <tr key={ri} className="even:bg-gray-50">
            {row.map((cell, ci) => (
              <td
                key={ci}
                className={`px-3 py-2 border border-gray-200 text-xs ${colStyles[ci] || 'text-gray-700'}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// ─── Data ────────────────────────────────────────────────────────────────────

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

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Table & DataTable</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A two-layer table system built from scratch. Layer 1 provides pure presentational HTML
          wrappers (<code className="font-mono text-sm">Table</code>,{' '}
          <code className="font-mono text-sm">TableHeader</code>,{' '}
          <code className="font-mono text-sm">TableBody</code>, etc.). Layer 2 wraps them into{' '}
          <code className="font-mono text-sm">DataTable</code> — a feature-rich compound component
          with sorting, search, selection, expand, pagination, loading skeleton, and empty state.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
          <span className="text-xs text-gray-400 block mb-3">DataTable — all features enabled</span>
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
        </div>
        <Code>{`import { DataTable } from '@/components/base/Table/DataTable'

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
/>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <SubSection title="Layer 1 — Base Components">
          <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed mb-4 w-full overflow-x-auto">{`<Table>                             ← overflow wrapper + <table>
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
</Table>`}</pre>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <span className="text-xs text-gray-400 block mb-3">
              Table with header, body, footer, caption
            </span>
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
          </div>
        </SubSection>

        <SubSection title="Layer 2 — DataTable">
          <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed w-full overflow-x-auto">{`DataTable
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
└── pagination controls     (pagination prop)`}</pre>
        </SubSection>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Minimal — just data + columns">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <span className="text-xs text-gray-400 block mb-3">Layer 1 — read-only table</span>
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
          </div>
          <Code>{`<Table>
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
</Table>`}</Code>
        </SubSection>

        <SubSection title="DataTable — sort + search + pagination">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <span className="text-xs text-gray-400 block mb-3">
              Layer 2 — sort, search, pagination
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
          </div>
          <Code>{`<DataTable
  data={trades}
  rowId="id"
  columns={columns}
  searchable
  searchKeys={['ticker', 'name']}
  sortable
  pagination
  pageSize={10}
/>`}</Code>
        </SubSection>

        <SubSection title="Column alignment">
          <p className="text-xs text-gray-500 mb-3">
            Both <code className="font-mono bg-gray-100 px-1 rounded">TableHead</code> and{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">TableCell</code> accept an{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">align</code> prop:{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">&quot;left&quot;</code> (default),{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">&quot;right&quot;</code>, or{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">&quot;center&quot;</code>. In
            DataTable, set <code className="font-mono bg-gray-100 px-1 rounded">align</code> on the
            column definition and it applies to both header and cell automatically.
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <span className="text-xs text-gray-400 block mb-3">
              left (default) · center · right
            </span>
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
          </div>
          <Code>{`{/* Layer 1 */}
<TableHead align="center">Type</TableHead>
<TableHead align="right">Price</TableHead>
<TableCell align="center">{row.type}</TableCell>
<TableCell align="right">{row.price}</TableCell>

{/* Layer 2 — column definition */}
const columns = [
  { id: 'type',  header: 'Type',  cell: (row) => row.type,  align: 'center' },
  { id: 'price', header: 'Price', cell: (row) => row.price, align: 'right' },
]`}</Code>
        </SubSection>

        <SubSection title="Table inside Popover">
          <p className="text-xs text-gray-500 mb-3">
            Use <code className="font-mono bg-gray-100 px-1 rounded">Table</code> (Layer 1) inside a
            Popover to show compact data breakdowns — lot detail, price history, or fee summaries —
            without navigating away from the current view.
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <span className="text-xs text-gray-400 block mb-3">
              click a button to open the lot breakdown
            </span>
            <div className="flex gap-3 flex-wrap">
              {[
                {
                  ticker: 'BBCA',
                  name: 'Bank Central Asia',
                  lots: [
                    { date: '12 Jan', price: 8900, qty: 100 },
                    { date: '3 Mar', price: 9100, qty: 50 },
                    { date: '18 Jun', price: 9250, qty: 75 },
                  ],
                },
                {
                  ticker: 'TLKM',
                  name: 'Telkom Indonesia',
                  lots: [
                    { date: '5 Feb', price: 3300, qty: 100 },
                    { date: '20 May', price: 3120, qty: 100 },
                  ],
                },
              ].map((pos) => {
                const total = pos.lots.reduce((s, l) => s + l.price * l.qty, 0)
                const totalQty = pos.lots.reduce((s, l) => s + l.qty, 0)
                return (
                  <Popover key={pos.ticker}>
                    <PopoverTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 shadow-sm">
                        {pos.ticker} · {totalQty} shares
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 overflow-hidden" align="start">
                      <div className="px-3 py-2.5 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-700">
                          {pos.ticker} — Lot breakdown
                        </p>
                        <p className="text-xs text-gray-400">{pos.name}</p>
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
                          {pos.lots.map((lot, i) => (
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
                          Rp {total.toLocaleString()}
                        </span>
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              })}
            </div>
          </div>
          <Code>{`import { Popover, PopoverTrigger, PopoverContent } from '@/components/base/Popover/Popover'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/base/Table/Table'

<Popover>
  <PopoverTrigger asChild>
    <button>BBCA · 225 shares</button>
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
</Popover>`}</Code>
        </SubSection>

        <SubSection title="Popover inside Table">
          <p className="text-xs text-gray-500 mb-3">
            Place a <code className="font-mono bg-gray-100 px-1 rounded">Popover</code> inside a{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">TableCell</code> to surface inline
            detail or actions without leaving the row — price history, notes, or a quick-edit form.
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <span className="text-xs text-gray-400 block mb-3">
              click &quot;N entries&quot; to open the price history popover
            </span>
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
          </div>
          <Code>{`<TableCell align="right">
  <Popover>
    <PopoverTrigger asChild>
      <button className="text-xs text-violet-600 hover:underline">
        {row.history.length} entries
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-64 p-0 overflow-hidden" align="end">
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
</TableCell>`}</Code>
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Use Table (Layer 1) for static, read-only data',
                  body: 'No sorting, filtering, or pagination needed. Use it when you need a footer, caption, full cell control (custom spanning, merged cells), or when embedding a table inside a Popover.',
                },
                {
                  title: 'Use DataTable (Layer 2) for interactive data tables',
                  body: 'When users need to sort, search, page through, select rows, or expand inline detail. DataTable handles loading skeleton and empty state consistently without extra state management.',
                },
                {
                  title: 'Use pagination when the dataset can grow beyond 20–30 rows',
                  body: 'Pagination keeps page height predictable and avoids overwhelming the user with a long scrollable list.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't nest Table inside a TableCell for layout",
                  body: 'Use CSS grid or flexbox instead. Nested tables break column alignment and screen-reader accessibility.',
                },
                {
                  title: "Don't put more than 7–8 columns in a single table",
                  body: 'More columns than this becomes unreadable on standard screen widths. Move secondary attributes into an expandable detail row using expandContent.',
                },
                {
                  title: "Don't recreate sort or search on top of raw Table",
                  body: 'If you find yourself building these features manually on Layer 1, switch to DataTable instead — it handles all of this out of the box.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always use TableHead for column labels, never TableCell',
                  body: 'Table renders semantic HTML (table, thead, th). Using TableCell as a header breaks screen reader navigation.',
                },
                {
                  title: 'Always right-align numeric columns',
                  body: 'Price, quantity, P&L — right-alignment makes values scannable by magnitude and aligns decimal points vertically.',
                },
                {
                  title: 'Always provide a meaningful emptyState when data may be empty',
                  body: 'Explain WHY the table is empty and offer a next action ("No trades yet — add your first trade"). Screen reader users rely on this to understand the state.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Start with DataTable, drop to Table only when needed',
                  body: 'Drop down to Layer 1 only when you need structure DataTable cannot express — merged cells, custom footers, or embedding inside a Popover.',
                },
                {
                  title: 'Always provide rowId with a unique value',
                  body: 'Missing or duplicate IDs break row selection, expand state, and React reconciliation. Use the actual database ID, never a derived or non-unique value.',
                },
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
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
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="DataTable">
          <ApiTable
            rows={[
              ['data', 'object[]', '[]', 'Array of row objects.'],
              ['rowId', 'string', '"id"', 'Key of the unique row identifier.'],
              ['columns', 'ColumnDef[]', '[]', 'Column definitions — see ColumnDef below.'],
              ['searchable', 'boolean', 'false', 'Show search bar and filter rows.'],
              ['searchKeys', 'string[]', '[]', 'Row fields to search across.'],
              ['sortable', 'boolean', 'false', 'Enable column sort on TableHead click.'],
              ['selectable', 'boolean', 'false', 'Add checkbox column + select-all.'],
              ['expandable', 'boolean', 'false', 'Make rows clickable; show expandContent below.'],
              ['expandContent', '(row) => ReactNode', '—', 'Content rendered in the expand row.'],
              ['pagination', 'boolean', 'false', 'Enable page controls below the table.'],
              ['pageSize', 'number', '10', 'Rows per page.'],
              [
                'paginationVariant',
                '"full" | "center" | "left" | "right"',
                '"full"',
                'Layout of pagination controls. full = prev far left, page centered, next far right.',
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
            ]}
          />
        </SubSection>

        <SubSection title="ColumnDef">
          <ApiTable
            headers={['Key', 'Type', 'Default', 'Description']}
            rows={[
              ['id', 'string', '—', 'Unique column identifier — used as sort key.'],
              ['header', 'ReactNode', '—', 'Column header label.'],
              ['cell', '(row) => ReactNode', '—', 'Cell renderer — receives the row object.'],
              [
                'sortable',
                'boolean',
                '—',
                'Whether this column is sortable (requires sortable prop on DataTable).',
              ],
              ['align', '"left" | "right" | "center"', '"left"', 'Cell and header text alignment.'],
              ['width', 'number | string', '—', 'Fixed column width (CSS value).'],
            ]}
          />
        </SubSection>

        <SubSection title="Layer 1 — Base Components">
          <ApiTable
            headers={['Component', 'Notable Props']}
            rows={[
              ['Table', 'className'],
              ['TableHeader', 'sticky (boolean) — pins header on scroll'],
              ['TableBody', 'className'],
              ['TableFooter', 'className'],
              ['TableRow', 'selected (boolean), clickable (boolean)'],
              ['TableHead', 'align ("left" | "right" | "center"), width'],
              ['TableCell', 'align ("left" | "right" | "center")'],
              ['TableCaption', 'className'],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
