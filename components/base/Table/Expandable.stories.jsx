import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Expandable' }
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed">
        Click any row to expand it and reveal additional content via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">expandContent</code>. Multiple
        rows can be expanded at the same time. The chevron icon rotates to indicate expanded state.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">click any row to expand inline detail</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
                    <strong className="text-gray-800">
                      Rp {row.currentPrice.toLocaleString()}
                    </strong>
                  </span>
                </div>
                <p className="text-gray-500 leading-relaxed">{row.notes}</p>
              </div>
            )}
          />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use expandContent to surface secondary attributes inline',
                body: 'Notes, lot breakdown, audit trail — data that is relevant but not important enough to show in a column. This avoids requiring the user to navigate to a detail page.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't put long-form content in expandContent",
                body: 'Very long expand rows push other rows off screen and feel like a hidden second page. If the content is too long to skim at a glance, link to a full detail page instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Multiple rows can be expanded simultaneously',
                body: 'Design expandContent to be independently readable — each expanded row should make sense on its own without relying on adjacent rows for context.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep expandContent compact — max 3–4 fields or a short paragraph',
                body: 'A quick stat grid or a one-line note is the sweet spot. If you find yourself adding a table or a form inside expandContent, consider a sheet or detail page instead.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
