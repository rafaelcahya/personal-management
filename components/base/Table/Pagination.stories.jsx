import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Pagination' }
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
    <div className="flex flex-col gap-6 w-full">
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

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          full — prev far left · page centered · next far right (default)
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable
            data={data}
            rowId="id"
            columns={columns}
            pagination
            paginationVariant="full"
            pageSize={5}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">center — prev · page · next centered</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable
            data={data}
            rowId="id"
            columns={columns}
            pagination
            paginationVariant="center"
            pageSize={5}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">left — prev · page · next aligned left</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable
            data={data}
            rowId="id"
            columns={columns}
            pagination
            paginationVariant="left"
            pageSize={5}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">right — prev · page · next aligned right</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable
            data={data}
            rowId="id"
            columns={columns}
            pagination
            paginationVariant="right"
            pageSize={5}
          />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use full for wide tables, center for narrow ones',
                body: 'full (default) puts prev/next at opposite edges — ideal for wide tables where both controls are easy to reach. center groups all controls centrally — better for narrow tables where full leaves awkward empty space.',
              },
              {
                title: 'Set pageSize to match data density',
                body: '10 rows for most tables. 5 for dense multi-column tables where each row is tall. Up to 20 for simple 2–3 column lists where rows are thin.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't paginate tables with fewer than 10–15 rows",
                body: 'Pagination on a short list adds UI chrome with no benefit. Render all rows directly — users can scan without paging controls getting in the way.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'pageSize controls skeleton row count — keep it consistent',
                body: 'The loading skeleton uses pageSize to determine how many placeholder rows to render. If pageSize changes between loading and loaded states, users see a layout jump.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Search resets page to 1 automatically when combined with searchable',
                body: 'No manual page reset needed. The DataTable handles this internally on every keystroke so users always land on the first page of filtered results.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
