import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Loading State' }
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

const columns = [
  { id: 'ticker', header: 'Ticker', cell: (row) => row.ticker, width: 100 },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'price', header: 'Price', cell: (row) => row.price, align: 'right' },
  { id: 'qty', header: 'Qty', cell: (row) => row.qty, align: 'right' },
]

export const LoadingState = {
  name: 'Loading State',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">loading={'{true}'}</code>{' '}
        to show animated skeleton rows. The skeleton uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">pageSize</code> to determine
        how many placeholder rows to render — defaults to 10.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          loading={'{true}'} with pageSize={'{5}'}
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DataTable data={[]} rowId="id" columns={columns} loading pageSize={5} />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always pass loading={isLoading} — never show an empty table while fetching',
                body: 'An empty table and a loaded-but-empty table look identical. Skeleton rows make the loading state explicit so users know data is on its way.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a full-page spinner instead of a table skeleton",
                body: 'A table skeleton preserves the column header layout, giving users spatial context. A full-page spinner destroys it — the loaded table appears to jump into place.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep column definitions identical between loading and loaded states',
                body: "Changing columns after load causes a header-row jump that is visually jarring and breaks the user's spatial memory of which column is where.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pass the same pageSize in loading and loaded states',
                body: 'The skeleton uses pageSize to render the right number of placeholder rows. A jump from 3 skeleton rows to 10 data rows causes layout shift.',
              },
              {
                title: 'Pair loading with a meaningful emptyState',
                body: 'After the first load, if the result is empty, users need to know WHY. A generic "No data" fallback is better than silence — a custom emptyState with a next action is best.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<DataTable
  data={[]}
  rowId="id"
  columns={columns}
  loading={isLoading}
  pageSize={5}
/>`}</code>
      </pre>
    </div>
  ),
}
