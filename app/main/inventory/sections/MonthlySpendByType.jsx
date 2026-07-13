'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Wallet } from 'lucide-react'
import Card, {
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/base/Card/Card'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from '@/components/base/Modal/Modal.jsx'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import Button from '@/components/base/Button/Button'
import Pagination from '@/components/base/Pagination/Pagination'

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

export default function MonthlySpendByType({ items, loading }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPage, setModalPage] = useState(1)
  const top5 = items.slice(0, 5)
  const totalThisMonth = thisMonthTotal(items)

  const { grouped, months } = useMemo(() => groupByMonth(items), [items])
  const modalTotalPages = Math.max(1, Math.ceil(months.length / MONTHS_PER_PAGE))
  const pageMonths = months.slice((modalPage - 1) * MONTHS_PER_PAGE, modalPage * MONTHS_PER_PAGE)

  function handleModalOpen(open) {
    setModalOpen(open)
    if (!open) setModalPage(1)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardIcon icon={Wallet} />
          <div className="min-w-0 flex-1">
            <CardTitle>Monthly Spend by Type</CardTitle>
            <CardDescription>Spending per product category (last 6 months)</CardDescription>
          </div>
          {!loading && totalThisMonth > 0 && (
            <CardAction className="text-right">
              <p className="text-xs text-slate-400">This month</p>
              <p className="text-sm font-bold text-violet-700">{formatRupiah(totalThisMonth)}</p>
            </CardAction>
          )}
        </CardHeader>

        <CardContent className="p-0">
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
        </CardContent>

        {!loading && items.length > 0 && (
          <CardFooter align="end" className="py-3">
            <Button variant="ghost" onClick={() => setModalOpen(true)}>
              View All
            </Button>
          </CardFooter>
        )}
      </Card>

      <Modal open={modalOpen} onOpenChange={handleModalOpen}>
        <ModalContent variant="bordered" borderColor="border-slate-200" className="max-h-[85vh]">
          <ModalHeader layout="beside">
            <ModalIcon icon={Wallet} />
            <ModalHeaderContent>
              <ModalTitle>Monthly Spend by Type</ModalTitle>
              <ModalDescription>All categories across the last 6 months</ModalDescription>
            </ModalHeaderContent>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              {pageMonths.map((month) => (
                <MonthBlock key={month} month={month} items={grouped[month]} />
              ))}
            </div>
          </ModalBody>
          {modalTotalPages > 1 && (
            <ModalFooter>
              <Pagination
                page={modalPage}
                totalPages={modalTotalPages}
                total={months.length}
                onPrev={() => setModalPage((p) => Math.max(1, p - 1))}
                onNext={() => setModalPage((p) => Math.min(modalTotalPages, p + 1))}
              />
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
