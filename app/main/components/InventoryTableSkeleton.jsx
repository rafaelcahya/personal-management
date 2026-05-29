import { Skeleton } from '@/components/ui/skeleton'

export default function InventoryTableSkeleton({ rows = 5, headerCols, rowCols, id }) {
  return (
    <div id={id} className="flex-1 overflow-auto">
      <div className="rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-4">
          {headerCols.map((cls, i) => (
            <Skeleton key={i} className={cls} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-4 border-b border-slate-100">
            {rowCols.map((cls, j) => (
              <Skeleton key={j} className={cls} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
