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
} from '@/components/base/Modal/Modal.jsx'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <RefreshCw className="size-10 text-slate-300" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">No restock history yet</p>
        <p className="text-xs text-slate-500">Restock products to see frequency data</p>
      </div>
    </div>
  )
}

function RestockTable({ items }) {
  return (
    <>
      {/* Desktop table */}
      <Table
        wrapperClassName="hidden md:block"
        id="mostRestockedTable_inventoryPage"
        className="min-w-full"
        aria-label="Most restocked products"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" align="center">
              No
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Last Restock</TableHead>
            <TableHead>Restocks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-slate-500 text-xs" align="center">
                {index + 1}
              </TableCell>
              <TableCell>
                <p className="text-xs text-slate-400">{item.brand || '—'}</p>
                <div className="flex flex-col items-start gap-1.5 mt-0.5">
                  <p className="font-semibold text-slate-900">{item.product}</p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                      {item.type}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-slate-700">
                {item.last_restock_date
                  ? format(new Date(item.last_restock_date), 'dd MMM yyyy')
                  : '—'}
              </TableCell>
              <TableCell>
                <span className="bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 text-xs font-medium">
                  {item.restock_count}×
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 py-2">
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

export default function MostRestocked({ items, loading, error, onRetry }) {
  const [modalOpen, setModalOpen] = useState(false)
  const top5 = items.slice(0, 5)

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

        <CardContent padding="none">
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

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent
          variant="bordered"
          borderColor="border-slate-200"
          className="w-[calc(100vw-2rem)] md:w-full md:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0"
        >
          <ModalHeader layout="beside" padding={{ x: 4 }}>
            <ModalIcon icon={RefreshCw} />
            <ModalHeaderContent>
              <ModalTitle>All Products — Restock History</ModalTitle>
              <ModalDescription>Sorted by most restocked</ModalDescription>
            </ModalHeaderContent>
          </ModalHeader>
          <ModalBody padding={{ x: 0 }} className="overflow-y-auto flex-1">
            <RestockTable items={items} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
