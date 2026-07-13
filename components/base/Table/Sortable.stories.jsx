import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Sortable' }
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed">
        Click any column header to sort. First click → ascending, second → descending, third →
        reset. Only one column sorts at a time. Columns with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">sortable: true</code> in the
        column definition show a sort icon.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">click any column header to sort</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable data={data} rowId="id" columns={columns} sortable />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Only mark columns sortable when the values are meaningfully comparable',
                body: 'Numeric columns (price, qty, P&L), dates, and names are good sort candidates. Sorting a "Notes" or free-text "Status" column rarely helps users.',
              },
              {
                title: 'Always set align: "right" on numeric sortable columns',
                body: 'Right-aligned numeric values stay vertically aligned when sorted ascending — decimal points line up and magnitudes are scannable at a glance.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mark every column sortable by default",
                body: 'Too many sort icons create visual noise and suggest every column is equally useful to sort. Only enable sorting on columns users actually benefit from sorting.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Sort icon rotates to communicate the active sort direction',
                body: 'The chevron icon on the active column rotates to indicate ascending vs descending. A third click resets to unsorted — users can always return to the original order.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Only use controlled sort when you need to persist state externally',
                body: 'Pass sort + onSortChange only when sort state must survive navigation or be synced to a URL. Omit both for the default local uncontrolled behavior.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
