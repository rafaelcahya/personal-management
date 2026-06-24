import { formatRupiah } from '@/lib/utils/currencyFormatter'
import StatusBadge from './StatusBadge'

export default function ProductTable({ products }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table
          id="productTable_productListPage"
          className="min-w-full text-sm"
          aria-label="Product cost per use"
        >
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-8">
                No
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Product
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Total Spent
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Total Units
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Cost/Use
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 text-slate-500 text-xs">{index + 1}</td>
                <td className="px-5 py-3.5">
                  <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="font-semibold text-slate-900">{item.product}</p>
                    {item.type && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                        {item.type}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  {item.total_spent != null ? formatRupiah(item.total_spent) : '—'}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  {item.total_units ?? '—'}
                </td>
                <td className="px-5 py-3.5 text-right font-mono font-semibold text-violet-700">
                  {item.cost_per_use != null ? formatRupiah(item.cost_per_use) : '—'}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <StatusBadge status={item.product_status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 px-2 py-2">
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
                <span className="text-xs text-slate-400">#{index + 1}</span>
                <StatusBadge status={item.product_status} />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
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
