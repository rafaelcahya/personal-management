'use client'

import { useState } from 'react'
import { Trophy, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

function TierBadge({ score }) {
  if (score >= 80)
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-violet-100 text-violet-700 border-violet-200">
        S
      </span>
    )
  if (score >= 60)
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-green-100 text-green-700 border-green-200">
        A
      </span>
    )
  if (score >= 40)
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-yellow-100 text-yellow-700 border-yellow-200">
        B
      </span>
    )
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-500 border-slate-200">
      C
    </span>
  )
}

function ScoreBar({ score }) {
  const color =
    score >= 80
      ? 'bg-violet-500'
      : score >= 60
        ? 'bg-green-500'
        : score >= 40
          ? 'bg-yellow-400'
          : 'bg-slate-300'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-6 text-right">{score}</span>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading data">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20 hidden sm:block" />
          <Skeleton className="h-4 w-16 hidden sm:block" />
          <Skeleton className="h-5 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <Trophy className="size-10 text-slate-300" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">Not enough data to score products</p>
        <p className="text-xs text-slate-500">Use and restock products to generate scores</p>
      </div>
    </div>
  )
}

function ScoreTable({ items }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table
          id="lifecycleScoreTable_inventoryPage"
          className="min-w-full text-sm"
          aria-label="Product lifecycle scores"
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
                Cost/Use
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Avg Duration
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Tier
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 text-slate-500 text-xs">{index + 1}</td>
                <td className="px-5 py-3.5">
                  <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-1.5 mt-0.5">
                    <p className="font-semibold text-slate-900">{item.product}</p>
                    {item.type && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                        {item.type}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  {formatRupiah(item.cost_per_use)}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700 whitespace-nowrap">
                  {item.avg_days} days
                </td>
                <td className="px-5 py-3.5 text-right">
                  <TierBadge score={item.score} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end">
                    <ScoreBar score={item.score} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 px-2 py-2">
        {items.map((item, index) => (
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
                <TierBadge score={item.score} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2 text-xs flex-1">
                <div>
                  <p className="text-slate-400">Cost/Use</p>
                  <p className="font-mono text-slate-700 mt-0.5 whitespace-nowrap">
                    {formatRupiah(item.cost_per_use)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Avg Duration</p>
                  <p className="font-mono text-slate-700 mt-0.5 whitespace-nowrap">
                    {item.avg_days} days
                  </p>
                </div>
              </div>
              <ScoreBar score={item.score} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function LifecycleScore({ items, loading, error, onRetry }) {
  const [modalOpen, setModalOpen] = useState(false)
  const top5 = items.slice(0, 5)

  return (
    <>
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
            <Trophy className="size-4 text-violet-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Product Lifecycle Score</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Composite score based on cost efficiency and usage duration
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
          <ScoreTable items={top5} />
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
            <DialogTitle className="text-base font-semibold text-slate-800">
              All Products — Lifecycle Score
            </DialogTitle>
            <p className="text-xs text-slate-400">Sorted by highest score</p>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <ScoreTable items={items} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
