import { formatRupiah } from '@/lib/utils/currencyFormatter'
import StatusBadge from './StatusBadge'

export default function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide rounded-l-lg w-8">
              No
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Product
            </th>
            <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
              Total Spent
            </th>
            <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
              Total Units
            </th>
            <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Cost/Use
            </th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide rounded-r-lg hidden sm:table-cell">
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 mt-0.5">
                  <p className="font-medium text-slate-700 truncate max-w-[120px] sm:max-w-none">
                    {item.product}
                  </p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                      {item.type}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-3 text-right text-slate-600 hidden md:table-cell">
                {item.total_spent != null ? formatRupiah(item.total_spent) : '—'}
              </td>
              <td className="py-3 px-3 text-right text-slate-600 hidden md:table-cell">
                {item.total_units ?? '—'}
              </td>
              <td className="py-3 px-3 text-right font-semibold text-violet-700">
                {item.cost_per_use != null ? formatRupiah(item.cost_per_use) : '—'}
              </td>
              <td className="py-3 px-3 text-center hidden sm:table-cell">
                <StatusBadge status={item.product_status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
