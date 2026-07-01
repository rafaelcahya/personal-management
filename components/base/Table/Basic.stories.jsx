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

const rows = [
  { id: 1, ticker: 'BBCA', name: 'Bank Central Asia', price: 9250, qty: 100 },
  { id: 2, ticker: 'TLKM', name: 'Telkom Indonesia', price: 3120, qty: 200 },
  { id: 3, ticker: 'ASII', name: 'Astra International', price: 5400, qty: 150 },
]

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Layer 1 base components assembled into a simple read-only table.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableHeader</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableBody</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableFooter</code> are plain
        wrappers — compose them freely.
      </p>

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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
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
