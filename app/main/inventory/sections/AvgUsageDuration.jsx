'use client'

import { useState } from 'react'
import { Timer, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function DurationBadge({ days }) {
  let cls = 'bg-green-100 text-green-700 border-green-200'
  if (days < 30) cls = 'bg-red-100 text-red-700 border-red-200'
  else if (days < 60) cls = 'bg-yellow-100 text-yellow-700 border-yellow-200'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {days} days
    </span>
  )
}

function TableSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading data">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <Timer className="size-10 text-slate-300" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">Not enough usage data yet</p>
        <p className="text-xs text-slate-500">Record product usage to see duration trends</p>
      </div>
    </div>
  )
}

function DurationTable({ data }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table
          id="avgUsageDurationTable_inventoryPage"
          className="min-w-full text-sm"
          aria-label="Average usage duration per product"
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
                Average Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.product_list_id}
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
                <td className="px-5 py-3.5 text-right">
                  <DurationBadge days={item.avg_days} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 px-2 py-2">
        {data.map((item, index) => (
          <div
            key={item.product_list_id}
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
                <DurationBadge days={item.avg_days} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function AvgUsageDuration({ items, loading, error, onRetry }) {
  const [modalOpen, setModalOpen] = useState(false)
  const top5 = items.slice(0, 5)

  return (
    <>
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
            <Timer className="size-4 text-violet-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Average Usage Duration</p>
            <p className="text-xs text-slate-500 mt-0.5">
              How long each product typically lasts per session
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Failed to load data</p>
              <p className="text-xs text-slate-500">Check your connection and try again</p>
            </div>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="min-w-11">
                Try again
              </Button>
            )}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <DurationTable data={top5} />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-violet-700 border border-violet-200 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 transition-colors"
            >
              View All
            </button>
          </div>
        )}
      </section>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] md:w-full md:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="flex flex-col items-start px-6 py-4 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-base font-semibold text-slate-800 text-left">
              All Products — Average Usage Duration
            </DialogTitle>
            <p className="text-xs text-slate-400">Sorted by longest average duration</p>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <DurationTable data={items} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
