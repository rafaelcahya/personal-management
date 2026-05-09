'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import SkeletonRows from '../components/SkeletonRows'

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

function ScoreTable({ items }) {
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
                Cost/Use
              </th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Avg Duration
              </th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tier
              </th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide rounded-r-lg">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-violet-50/30 transition-colors"
              >
                <td className="py-3 px-3 text-slate-400 text-xs">{index + 1}</td>
                <td className="py-3 px-3">
                  <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-1.5 mt-0.5">
                    <p className="font-medium text-slate-700">{item.product}</p>
                    {item.type && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                        {item.type}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-right text-slate-600 text-sm">
                  {formatRupiah(item.cost_per_use)}
                </td>
                <td className="py-3 px-3 text-right text-slate-600 text-sm">
                  <p className="whitespace-nowrap">{item.avg_days} days</p>
                </td>
                <td className="py-3 px-3 text-center">
                  <TierBadge score={item.score} />
                </td>
                <td className="py-3 px-3">
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
      <div className="md:hidden space-y-2">
        {items.map((item, index) => (
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
                <TierBadge score={item.score} />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2 text-xs flex-1">
                <div>
                  <p className="text-slate-400">Cost/Use</p>
                  <p className="font-medium text-slate-600 mt-0.5 whitespace-nowrap">
                    {formatRupiah(item.cost_per_use)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Avg Duration</p>
                  <p className="font-medium text-slate-600 mt-0.5 whitespace-nowrap">
                    {item.avg_days} days
                  </p>
                </div>
              </div>
              <ScoreBar score={item.score} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LifecycleScore({ items, loading }) {
  const [modalOpen, setModalOpen] = useState(false)
  const top5 = items.slice(0, 5)

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">🏆 Product Lifecycle Score</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Composite score based on cost efficiency and usage duration
          </p>
        </div>
        <div className="px-2 py-2">
          {loading ? (
            <SkeletonRows count={5} />
          ) : items.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">Not enough data to score products 📊</p>
            </div>
          ) : (
            <ScoreTable items={top5} />
          )}
        </div>
        {!loading && items.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-violet-700 border border-violet-200 hover:bg-violet-50 focus:outline-none transition-colors"
            >
              View All
            </button>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] md:w-full md:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="flex flex-col items-start px-6 py-4 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-base font-semibold text-slate-800">
              All Products — Lifecycle Score
            </DialogTitle>
            <p className="text-xs text-slate-400">Sorted by highest score</p>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-2 py-2">
            <ScoreTable items={items} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
