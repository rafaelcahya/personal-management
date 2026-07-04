'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from '@/components/base/Modal/Modal.jsx'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import Button from '@/components/base/Button/Button'

function thisMonthTotal(items) {
  const thisMonth = new Date().toISOString().slice(0, 7)
  return items.filter((i) => i.month === thisMonth).reduce((sum, i) => sum + i.total_spent, 0)
}

function groupByMonth(items) {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.month]) acc[item.month] = []
    acc[item.month].push(item)
    return acc
  }, {})
  const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
  return { grouped, months }
}

function MonthBlock({ month, items }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-2 border-b border-slate-100">
        {format(new Date(month + '-01'), 'MMMM yyyy')}
      </p>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
        >
          <div className="min-w-0">
            <p className="text-xs text-slate-400 truncate">{item.brand || '—'}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 mt-0.5">
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
  )
}

function SpendList({ items }) {
  const { grouped, months } = groupByMonth(items)
  return (
    <div className="flex flex-col gap-4">
      {months.map((month) => (
        <MonthBlock key={month} month={month} items={grouped[month]} />
      ))}
    </div>
  )
}

const MONTHS_PER_PAGE = 2

function PaginatedSpendList({ items }) {
  const [page, setPage] = useState(0)
  const { grouped, months } = useMemo(() => groupByMonth(items), [items])
  const totalPages = Math.ceil(months.length / MONTHS_PER_PAGE)
  const pageMonths = months.slice(page * MONTHS_PER_PAGE, (page + 1) * MONTHS_PER_PAGE)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-4">
        {pageMonths.map((month) => (
          <MonthBlock key={month} month={month} items={grouped[month]} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="size-3.5" />
            Prev
          </Button>
          <span className="text-xs text-slate-500">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      )}
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
            <Button variant="ghost" onClick={() => setModalOpen(true)}>
              View All
            </Button>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent
          variant="bordered"
          borderColor="border-slate-200"
          className="max-w-md w-full max-h-[85vh] flex flex-col p-0 gap-0"
        >
          <ModalHeader className="flex flex-col items-start px-6 py-4 border-b border-slate-100 shrink-0">
            <ModalTitle className="text-base font-semibold text-slate-800">
              Monthly Spend by Type
            </ModalTitle>
            <p className="text-xs text-slate-400">All categories across the last 6 months</p>
          </ModalHeader>
          <ModalBody>
            <div className="py-3 px-1">
              <PaginatedSpendList items={items} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
