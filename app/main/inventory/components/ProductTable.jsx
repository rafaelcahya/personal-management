import { formatRupiah } from '@/lib/utils/currencyFormatter'
import StatusBadge from './StatusBadge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

export default function ProductTable({ products, startIndex = 0 }) {
  return (
    <>
      {/* Desktop table */}
      <Table
        wrapperClassName="hidden md:block overflow-clip"
        id="productTable_productListPage"
        className="min-w-full"
        aria-label="Product cost per use"
      >
        <TableHeader sticky>
          <TableRow>
            <TableHead className="w-8" align="center">
              No
            </TableHead>
            <TableHead className="text-slate-500">Product</TableHead>
            <TableHead className="text-slate-500" align="right">
              Total Spent
            </TableHead>
            <TableHead className="text-slate-500" align="right">
              Total Units
            </TableHead>
            <TableHead className="text-slate-500" align="right">
              Cost/Use
            </TableHead>
            <TableHead className="text-slate-500" align="center">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody divider={false}>
          {products.map((item, index) => (
            <TableRow key={item.id} clickable>
              <TableCell className="text-slate-500 text-xs" align="center">
                {startIndex + index + 1}
              </TableCell>
              <TableCell>
                <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="font-semibold text-slate-900">{item.product}</p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                      {item.type}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono text-slate-700" align="right">
                {item.total_spent != null ? formatRupiah(item.total_spent) : '—'}
              </TableCell>
              <TableCell className="font-mono text-slate-700" align="right">
                {item.total_units ?? '—'}
              </TableCell>
              <TableCell className="font-mono font-semibold text-violet-700" align="right">
                {item.cost_per_use != null ? formatRupiah(item.cost_per_use) : '—'}
              </TableCell>
              <TableCell align="center">
                <StatusBadge status={item.product_status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {products.map((item, index) => (
          <div
            key={item.id}
            className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5 min-w-0">
                  <p className="font-semibold text-slate-900 break-words min-w-0">{item.product}</p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                      {item.type}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">#{startIndex + index + 1}</span>
                <StatusBadge status={item.product_status} />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap justify-between gap-2 text-xs">
              <div>
                <p className="text-slate-400">Total Spent</p>
                <p className="font-mono text-slate-700 mt-0.5 whitespace-nowrap">
                  {item.total_spent != null ? formatRupiah(item.total_spent) : '—'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Total Units</p>
                <p className="font-mono text-slate-700 mt-0.5 whitespace-nowrap">
                  {item.total_units ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Cost/Use</p>
                <p className="font-mono font-semibold text-violet-700 mt-0.5 whitespace-nowrap">
                  {item.cost_per_use != null ? formatRupiah(item.cost_per_use) : '—'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
