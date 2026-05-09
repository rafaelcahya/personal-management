'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

function thisMonthTotal(items) {
  const thisMonth = new Date().toISOString().slice(0, 7)
  return items.filter((i) => i.month === thisMonth).reduce((sum, i) => sum + i.total_spent, 0)
}

function SpendList({ items }) {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.month]) acc[item.month] = []
    acc[item.month].push(item)
    return acc
  }, {})
  const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div>
      {months.map((month) => (
        <div key={month}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-2 border-b border-slate-100 mt-3 first:mt-0">
            {format(new Date(month + '-01'), 'MMMM yyyy')}
          </p>
          {grouped[month].map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-xs text-slate-400 truncate">{item.brand || '—'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="font-medium text-slate-700 text-sm truncate">{item.product}</p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                      {item.type}
                    </span>
                  )}
                </div>
              </div>
              <span className="font-semibold text-violet-700 text-sm shrink-0 ml-3">
                {formatRupiah(item.total_spent)}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function MonthlySpendByType({ items, loading }) {
  const [modalOpen, setModalOpen] = useState(false)
  const top5 = items.slice(0, 5)
  const totalThisMonth = thisMonthTotal(items)

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-800">💸 Monthly Spend by Type</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Spending per product category (last 6 months)
            </p>
          </div>
          {!loading && totalThisMonth > 0 && (
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400">This month</p>
              <p className="text-sm font-bold text-violet-700">{formatRupiah(totalThisMonth)}</p>
            </div>
          )}
        </div>
        <div className="px-5 py-3">
          {loading ? (
            <div className="space-y-2 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between py-2">
                  <div className="h-3 bg-slate-200 rounded w-24"></div>
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">No purchase data yet 📋</p>
            </div>
          ) : (
            <SpendList items={top5} />
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
        <DialogContent className="max-w-md w-full max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-base font-semibold text-slate-800">
              Monthly Spend by Type
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-0.5">All categories across the last 6 months</p>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-5 py-3">
            <SpendList items={items} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
