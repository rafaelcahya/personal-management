'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Sparkles, AlertCircle } from 'lucide-react'
import Card, {
  CardHeader,
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

function UrgencyBadge({ quantity, daysUntilEmpty }) {
  if (quantity === 0)
    return (
      <Badge className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 whitespace-nowrap">
        Out of Stock
      </Badge>
    )
  if (daysUntilEmpty <= 7)
    return (
      <Badge className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 whitespace-nowrap">
        Critical
      </Badge>
    )
  if (daysUntilEmpty <= 14)
    return (
      <Badge className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
        Soon
      </Badge>
    )
  if (daysUntilEmpty <= 30)
    return (
      <Badge className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">
        This Month
      </Badge>
    )
  return (
    <Badge className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
      6+ Months
    </Badge>
  )
}

function TableSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading data">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16 hidden sm:block" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function PredictionTable({ items, startIndex = 0 }) {
  return (
    <>
      {/* Desktop table */}
      <Table
        wrapperClassName="hidden md:block overflow-clip"
        id="restockPredictionTable_inventoryPage"
        aria-label="Restock predictions"
      >
        <TableHeader sticky>
          <TableRow>
            <TableHead className="w-8" align="center">
              No
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead align="right">Qty</TableHead>
            <TableHead>Est. Empty</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody divider={false}>
          {items.map((item, index) => (
            <TableRow key={item.id} clickable>
              <TableCell className="text-slate-500 text-xs" align="center">
                {startIndex + index + 1}
              </TableCell>
              <TableCell>
                <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                <div className="flex flex-col">
                  <p className="font-semibold text-slate-900">{item.product}</p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0 w-max">
                      {item.type}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono text-slate-700" align="right">
                {item.quantity}
              </TableCell>
              <TableCell className="text-slate-700 whitespace-nowrap">
                {item.predicted_date ? format(new Date(item.predicted_date), 'dd MMM yyyy') : '—'}
              </TableCell>
              <TableCell>
                <UrgencyBadge quantity={item.quantity} daysUntilEmpty={item.days_until_empty} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 py-2 px-3">
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
                <UrgencyBadge quantity={item.quantity} daysUntilEmpty={item.days_until_empty} />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Qty</p>
                <p className="font-mono text-slate-700 mt-0.5">{item.quantity}</p>
              </div>
              <div>
                <p className="text-slate-400">Est. Empty</p>
                <p className="text-slate-700 mt-0.5">
                  {item.predicted_date ? format(new Date(item.predicted_date), 'dd MMM yyyy') : '—'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const MODAL_PAGE_SIZE = 10

export default function RestockPrediction({ items, loading, error, onRetry }) {
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
          <CardIcon icon={Sparkles} />
          <div className="min-w-0 flex-1">
            <CardTitle>Restock Prediction</CardTitle>
            <CardDescription>
              Estimated when each product will run out based on usage history
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-0">
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
              <EmptyStateIcon icon={Sparkles} />
              <EmptyStateTitle>Not enough data yet</EmptyStateTitle>
              <EmptyStateDescription>
                Use products regularly to see predictions
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            <PredictionTable items={top5} />
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
            <ModalIcon icon={Sparkles} />
            <ModalHeaderContent>
              <ModalTitle>All Products — Restock Prediction</ModalTitle>
              <ModalDescription>Sorted by most urgent first</ModalDescription>
            </ModalHeaderContent>
          </ModalHeader>
          <ModalBody className="p-0">
            <PredictionTable items={modalItems} startIndex={modalStartIndex} />
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
