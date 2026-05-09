import { formatRupiah } from '@/lib/utils/currencyFormatter'
import StatusBadge from './StatusBadge'

export default function ProductTable({ products }) {
  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide rounded-l-lg w-8">
                No
              </th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Product
              </th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Spent
              </th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Units
              </th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Cost/Use
              </th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide rounded-r-lg">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-violet-50/30 transition-colors"
              >
                <td className="py-3 px-3 text-slate-400 text-xs">{index + 1}</td>
                <td className="py-3 px-3">
                  <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="font-medium text-slate-700">{item.product}</p>
                    {item.type && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                        {item.type}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-right text-slate-600">
                  {item.total_spent != null ? formatRupiah(item.total_spent) : '—'}
                </td>
                <td className="py-3 px-3 text-right text-slate-600">{item.total_units ?? '—'}</td>
                <td className="py-3 px-3 text-right font-semibold text-violet-700">
                  {item.cost_per_use != null ? formatRupiah(item.cost_per_use) : '—'}
                </td>
                <td className="py-3 px-3 text-center">
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
            className="border border-slate-100 rounded-lg p-3 hover:bg-violet-50/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5 min-w-0">
                  <p className="font-medium text-slate-700 break-words min-w-0">{item.product}</p>
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
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap justify-between gap-2 text-xs">
              <div>
                <p className="text-slate-400">Total Spent</p>
                <p className="font-medium text-slate-600 mt-0.5 whitespace-nowrap">
                  {item.total_spent != null ? formatRupiah(item.total_spent) : '—'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Total Units</p>
                <p className="font-medium text-slate-600 mt-0.5 whitespace-nowrap">
                  {item.total_units ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Cost/Use</p>
                <p className="font-semibold text-violet-700 mt-0.5 whitespace-nowrap">
                  {item.cost_per_use != null ? formatRupiah(item.cost_per_use) : '—'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
