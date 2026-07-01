import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Table in Popover' }
export default meta

const positions = [
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
  {
    ticker: 'ASII',
    name: 'Astra International',
    lots: [
      { date: '20 Jan', price: 4950, qty: 50 },
      { date: '10 Apr', price: 5100, qty: 100 },
      { date: '1 Jun', price: 5400, qty: 50 },
    ],
  },
]

export const TableInPopover = {
  name: 'Table in Popover',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        A <code className="font-mono bg-gray-100 px-1 rounded text-xs">Table</code> rendered inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">PopoverContent</code> — useful
        for compact data breakdowns (lot detail, fee summary, price history) that don't warrant a
        separate page or modal.
      </p>

      <div className="flex gap-3 flex-wrap">
        {positions.map((pos) => {
          const total = pos.lots.reduce((s, l) => s + l.price * l.qty, 0)
          const totalQty = pos.lots.reduce((s, l) => s + l.qty, 0)
          return (
            <Popover key={pos.ticker}>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 shadow-sm">
                  <span className="font-mono font-semibold text-gray-900">{pos.ticker}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{totalQty} shares</span>
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
                        <TableCell className="text-xs">{lot.date}</TableCell>
                        <TableCell align="right" className="text-xs font-mono">
                          Rp {lot.price.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" className="text-xs">
                          {lot.qty}
                        </TableCell>
                        <TableCell align="right" className="text-xs font-mono">
                          Rp {(lot.price * lot.qty).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total value</span>
                  <span className="text-xs font-semibold text-gray-800 font-mono">
                    Rp {total.toLocaleString()}
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          )
        })}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
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
</Popover>`}</code>
      </pre>
    </div>
  ),
}
