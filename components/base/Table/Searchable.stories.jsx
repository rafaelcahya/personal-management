import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Searchable' }
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed">
        The built-in search bar filters rows across the fields listed in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">searchKeys</code>. Search is
        case-insensitive and resets pagination to page 1 on each keystroke. Try typing{' '}
        <strong>bank</strong> or <strong>TLKM</strong>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">searchKeys: ticker, name, sector</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable
            data={data}
            rowId="id"
            columns={columns}
            searchable
            searchKeys={['ticker', 'name', 'sector']}
          />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Combine searchable with sortable and pagination for long lists',
                body: 'For lists longer than 10–15 rows, combining all three gives users a complete browsing experience — filter first, sort within the filtered set, page through results.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add every field to searchKeys",
                body: "Only include fields users actually search by. Adding every field creates confusing results (a match on an ID or internal field the user can't see) and slows filtering on large datasets.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Search resets pagination to page 1 automatically',
                body: 'No manual reset needed when combining searchable with pagination. The DataTable handles this internally on every keystroke.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'searchKeys controls what gets matched, not what gets displayed',
                body: 'You can include fields that are not rendered as columns — e.g. an internal code or alias — so users can find rows by terms not visible in the table.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
