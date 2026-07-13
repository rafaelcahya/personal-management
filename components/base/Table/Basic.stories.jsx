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

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Basic' }
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

const rows = [
  { id: 1, ticker: 'BBCA', name: 'Bank Central Asia', price: 9250, qty: 100 },
  { id: 2, ticker: 'TLKM', name: 'Telkom Indonesia', price: 3120, qty: 200 },
  { id: 3, ticker: 'ASII', name: 'Astra International', price: 5400, qty: 150 },
]

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed">
        Layer 1 base components assembled into a simple read-only table.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableHeader</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableBody</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableFooter</code> are plain
        wrappers — compose them freely.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Table with header, body, footer, and caption</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead align="right">Price (IDR)</TableHead>
                  <TableHead align="right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="font-mono font-semibold text-gray-900">{row.ticker}</span>
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">Rp {row.price.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="font-medium text-gray-700">
                    Total
                  </TableCell>
                  <TableCell align="right" className="font-medium">
                    {rows.reduce((s, r) => s + r.qty, 0)}
                  </TableCell>
                </TableRow>
              </TableFooter>
              <TableCaption>Portfolio positions as of today</TableCaption>
            </Table>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Table (Layer 1) for static, read-only data',
                body: 'When you need a footer, caption, or full control over every row and cell — no sorting, filtering, or pagination required.',
              },
              {
                title: 'Always include a TableFooter for aggregated values',
                body: 'Totals and averages belong in a TableFooter — it visually separates summary from data rows and is semantically correct.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Switch to DataTable when users need to sort, search, or paginate',
                body: 'If you find yourself building these features manually on top of a raw Table, use DataTable instead — it handles all of this out of the box.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always use TableHead for column labels, never TableCell',
                body: 'Table renders semantic HTML. Using TableCell as a header breaks screen reader navigation and table semantics.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use TableCaption for supplementary context',
                body: 'Data source, last-updated timestamp, or unit notes — TableCaption renders below the table and is read by screen readers.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from '@/components/base/Table/Table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Ticker</TableHead>
      <TableHead align="right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.ticker}</TableCell>
        <TableCell align="right">{row.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell align="right">{total}</TableCell>
    </TableRow>
  </TableFooter>
  <TableCaption>Portfolio positions as of today</TableCaption>
</Table>`}</code>
      </pre>
    </div>
  ),
}
