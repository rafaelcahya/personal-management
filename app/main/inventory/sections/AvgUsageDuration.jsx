'use client'

import { useState } from 'react'
import { Timer, AlertCircle } from 'lucide-react'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
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
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import Pagination from '@/components/base/Pagination/Pagination'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

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

function DurationTable({ data, startIndex = 0 }) {
  return (
    <>
      {/* Desktop table */}
      <Table
        wrapperClassName="hidden md:block overflow-clip"
        id="avgUsageDurationTable_inventoryPage"
        className="min-w-full"
        aria-label="Average usage duration per product"
      >
        <TableHeader sticky>
          <TableRow>
            <TableHead className="w-8" align="center">
              No
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Average Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody divider={false}>
          {data.map((item, index) => (
            <TableRow key={item.product_list_id}>
              <TableCell className="text-slate-500 text-xs" align="center">
                {startIndex + index + 1}
              </TableCell>
              <TableCell>
                <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="font-semibold text-slate-900">{item.product}</p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                      {item.type}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DurationBadge days={item.avg_days} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 py-2 px-3">
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
                <span className="text-xs text-slate-400">#{startIndex + index + 1}</span>
                <DurationBadge days={item.avg_days} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const MODAL_PAGE_SIZE = 10

export default function AvgUsageDuration({ items, loading, error, onRetry }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPage, setModalPage] = useState(1)
  const top5 = items.slice(0, 5)

  const modalTotalPages = Math.max(1, Math.ceil(items.length / MODAL_PAGE_SIZE))
  const modalStartIndex = (modalPage - 1) * MODAL_PAGE_SIZE
  const modalItems = items.slice(modalStartIndex, modalStartIndex + MODAL_PAGE_SIZE)

  function handleModalOpen(open) {
    setModalOpen(open)
    if (!open) setModalPage(1)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardIcon icon={Timer} />
          <CardHeaderContent>
            <CardTitle>Average Usage Duration</CardTitle>
            <CardDescription>How long each product typically lasts per session</CardDescription>
          </CardHeaderContent>
        </CardHeader>

        <CardContent className="p-4 md:p-0">
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
                <Button variant="outline" size="base" onClick={onRetry} className="min-w-11">
                  Try again
                </Button>
              )}
            </div>
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <DurationTable data={top5} />
          )}
        </CardContent>

        {!loading && !error && items.length > 0 && (
          <CardFooter align="end" className="py-3">
            <Button variant="ghost" onClick={() => setModalOpen(true)}>
              View All
            </Button>
          </CardFooter>
        )}
      </Card>

      <Modal open={modalOpen} onOpenChange={handleModalOpen}>
        <ModalContent
          variant="bordered"
          borderColor="border-slate-200"
          className="w-[calc(100vw-2rem)] md:w-full md:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0"
        >
          <ModalHeader layout="beside" padding={{ x: 4 }}>
            <ModalIcon icon={Timer} />
            <ModalHeaderContent>
              <ModalTitle>All Products — Average Usage Duration</ModalTitle>
              <ModalDescription>Sorted by longest average duration</ModalDescription>
            </ModalHeaderContent>
          </ModalHeader>
          <ModalBody padding={{ x: 0, y: 0 }} className="overflow-y-auto flex-1">
            <DurationTable data={modalItems} startIndex={modalStartIndex} />
          </ModalBody>
          {modalTotalPages > 1 && (
            <ModalFooter className="border-t border-slate-100 p-0 pb-4">
              <Pagination
                page={modalPage}
                totalPages={modalTotalPages}
                total={items.length}
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
