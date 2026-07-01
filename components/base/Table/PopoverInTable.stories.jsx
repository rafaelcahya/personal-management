import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Popover in Table' }
export default meta

const rows = [
  {
    id: 1,
    ticker: 'BBCA',
    name: 'Bank Central Asia',
    price: 9250,
    qty: 100,
    history: [
      { date: 'Jun 18', price: 9250, change: '+1.6%' },
      { date: 'Mar 3', price: 9100, change: '-0.5%' },
      { date: 'Jan 12', price: 8900, change: '+2.1%' },
    ],
  },
  {
    id: 2,
    ticker: 'TLKM',
    name: 'Telkom Indonesia',
    price: 3120,
    qty: 200,
    history: [
      { date: 'May 20', price: 3120, change: '-0.8%' },
      { date: 'Feb 5', price: 3300, change: '+0.3%' },
    ],
  },
  {
    id: 3,
    ticker: 'ASII',
    name: 'Astra International',
    price: 5400,
    qty: 150,
    history: [
      { date: 'Jun 1', price: 5400, change: '+2.5%' },
      { date: 'Apr 10', price: 5100, change: '+1.1%' },
      { date: 'Jan 20', price: 4950, change: '-0.2%' },
    ],
  },
  {
    id: 4,
    ticker: 'BMRI',
    name: 'Bank Mandiri',
    price: 6750,
    qty: 75,
    history: [
      { date: 'Jun 25', price: 6750, change: '-1.1%' },
      { date: 'Mar 15', price: 6500, change: '+0.8%' },
    ],
  },
]

export const PopoverInTable = {
  name: 'Popover in Table',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        A <code className="font-mono bg-gray-100 px-1 rounded text-xs">Popover</code> trigger placed
        inside a <code className="font-mono bg-gray-100 px-1 rounded text-xs">TableCell</code> —
        reveals inline detail (price history, notes, actions) without leaving the table view. The
        popover content can itself contain another{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Table</code>.
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
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className="font-mono font-semibold text-gray-900">{row.ticker}</span>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right" className="font-mono text-xs">
                  Rp {row.price.toLocaleString()}
                </TableCell>
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
                            <TableHead align="right">Change</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {row.history.map((h, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-xs">{h.date}</TableCell>
                              <TableCell align="right" className="text-xs font-mono">
                                Rp {h.price.toLocaleString()}
                              </TableCell>
                              <TableCell align="right">
                                <span
                                  className={`text-xs font-medium ${
                                    h.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
                                  }`}
                                >
                                  {h.change}
                                </span>
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
  ),
}
