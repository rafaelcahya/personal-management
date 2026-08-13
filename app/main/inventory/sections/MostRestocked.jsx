'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { RefreshCw, AlertCircle } from 'lucide-react'
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
import Pagination from '@/components/base/Pagination/Pagination'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/base/EmptyState/EmptyState'
import { Badge } from '@/components/base/Badge/Badge'

function TableSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading data">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function RestockTable({ items, startIndex = 0 }) {
  return (
    <>
      {/* Desktop table */}
      <Table
        wrapperClassName="hidden md:block overflow-clip"
        id="mostRestockedTable_inventoryPage"
        className="min-w-full"
        aria-label="Most restocked products"
      >
        <TableHeader sticky>
          <TableRow>
            <TableHead className="w-8" align="center">
              No
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Last Restock</TableHead>
            <TableHead align="right">Restocks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-slate-500 text-xs" align="center">
                {startIndex + index + 1}
              </TableCell>
              <TableCell>
                <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                <p className="font-semibold text-slate-900">
                  {item.product} {item.type}
                </p>
              </TableCell>
              <TableCell className="text-slate-700">
                {item.last_restock_date
                  ? format(new Date(item.last_restock_date), 'dd MMM yyyy')
                  : '—'}
              </TableCell>
              <TableCell align="right">
                <Badge variant="secondary">{item.restock_count}×</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
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
                <span className="text-xs text-slate-400">#{startIndex + index + 1}</span>
                <span className="bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 text-xs font-medium">
                  {item.restock_count}×
                </span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
              <p className="text-slate-400">Last Restock</p>
              <p className="text-slate-700 mt-0.5">
                {item.last_restock_date
                  ? format(new Date(item.last_restock_date), 'dd MMM yyyy')
                  : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const MODAL_PAGE_SIZE = 10

export default function MostRestocked({ items, loading, error, onRetry }) {
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
          <CardIcon icon={RefreshCw} />
          <CardHeaderContent>
            <CardTitle>Most Restocked</CardTitle>
            <CardDescription>Products you restock most frequently</CardDescription>
          </CardHeaderContent>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <EmptyState size="sm" variant="error" role="alert" aria-live="assertive">
              <EmptyStateIcon icon={AlertCircle} />
              <EmptyStateTitle>Failed to load data</EmptyStateTitle>
              <EmptyStateDescription>Check your connection and try again</EmptyStateDescription>
              {onRetry && (
                <EmptyStateActions>
                  <Button variant="outline" onClick={onRetry} className="min-w-11">
                    Try again
                  </Button>
                </EmptyStateActions>
              )}
            </EmptyState>
          ) : items.length === 0 ? (
            <EmptyState size="sm">
              <EmptyStateIcon icon={RefreshCw} />
              <EmptyStateTitle>No restock history yet</EmptyStateTitle>
              <EmptyStateDescription>Restock products to see frequency data</EmptyStateDescription>
            </EmptyState>
          ) : (
            <RestockTable items={top5} />
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
          className="max-h-[85vh]"
          size="lg"
        >
          <ModalHeader layout="beside">
            <ModalIcon icon={RefreshCw} />
            <ModalHeaderContent>
              <ModalTitle>All Products — Restock History</ModalTitle>
              <ModalDescription>Sorted by most restocked</ModalDescription>
            </ModalHeaderContent>
          </ModalHeader>
          <ModalBody className="p-0">
            <RestockTable items={modalItems} startIndex={modalStartIndex} />
          </ModalBody>
          {modalTotalPages > 1 && (
            <ModalFooter>
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
