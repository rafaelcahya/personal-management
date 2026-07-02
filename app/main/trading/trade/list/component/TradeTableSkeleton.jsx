import { Skeleton } from '@/components/base/Skeleton/Skeleton'

const ROW_COUNT = 15

const TH =
  'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap'

export default function TradeTableSkeleton() {
  return (
    <div id="tradeTableSkeleton_tradePage" className="overflow-x-auto flex-1">
      <table className="min-w-full text-sm animate-pulse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className={`${TH} text-left`}>Date</th>
            <th className={`${TH} text-left`}>Ticker</th>
            <th className={`${TH} text-right`}>Margin</th>
            <th className={`${TH} text-right`}>Proceeds</th>
            <th className={`${TH} text-left`}>Return %</th>
            <th className={`${TH} text-right`}>P/L</th>
            <th className={`${TH} text-left`}>Type</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <tr key={i} className="border-b border-slate-50">
              <td className="px-5 py-3.5">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-5 py-3.5">
                <Skeleton className="h-4 w-12" />
              </td>
              <td className="px-5 py-3.5 text-right">
                <Skeleton className="h-4 w-28 ml-auto" />
              </td>
              <td className="px-5 py-3.5 text-right">
                <Skeleton className="h-4 w-28 ml-auto" />
              </td>
              <td className="px-5 py-3.5">
                <Skeleton className="h-4 w-14" />
              </td>
              <td className="px-5 py-3.5 text-right">
                <Skeleton className="h-4 w-28 ml-auto" />
              </td>
              <td className="px-5 py-3.5">
                <Skeleton className="h-4 w-16" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
