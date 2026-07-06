'use client'

import { useState } from 'react'
import { Trophy, AlertCircle } from 'lucide-react'
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
      <Table
        wrapperClassName="hidden md:block"
        id="lifecycleScoreTable_inventoryPage"
        className="min-w-full"
        aria-label="Product lifecycle scores"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" align="center">
              No
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead align="right">Cost/Use</TableHead>
            <TableHead>Avg Duration</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Score</TableHead>
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
                <div className="flex flex-col gap-1.5 mt-0.5">
                  <p className="font-semibold text-slate-900">{item.product}</p>
                  {item.type && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0 w-max">
                      {item.type}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono text-slate-700 whitespace-nowrap" align="right">
                {formatRupiah(item.cost_per_use)}
              </TableCell>
              <TableCell className="font-mono text-slate-700 whitespace-nowrap">
                {item.avg_days} days
              </TableCell>
              <TableCell>
                <TierBadge score={item.score} />
              </TableCell>
              <TableCell>
                <ScoreBar score={item.score} />
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
                <TierBadge score={item.score} />
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
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
      <Card>
        <CardHeader>
          <CardIcon icon={Trophy} />
          <CardHeaderContent>
            <CardTitle>Product Lifecycle Score</CardTitle>
            <CardDescription>
              Composite score based on cost efficiency and usage duration
            </CardDescription>
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
            <ScoreTable items={top5} />
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
          className="w-[calc(100vw-2rem)] md:w-full md:max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0"
        >
          <ModalHeader layout="beside" padding={{ x: 4 }}>
            <ModalIcon icon={Trophy} />
            <ModalHeaderContent>
              <ModalTitle>All Products — Lifecycle Score</ModalTitle>
              <ModalDescription>Sorted by highest score</ModalDescription>
            </ModalHeaderContent>
          </ModalHeader>
          <ModalBody padding={{ x: 0 }} className="overflow-y-auto flex-1">
            <ScoreTable items={items} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
