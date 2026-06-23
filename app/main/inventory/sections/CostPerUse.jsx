'use client'

import { useState } from 'react'
import { BarChart2, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProductTable from '../components/ProductTable'

function TableSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading data">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-4 w-20 hidden sm:block" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-14 rounded-full hidden sm:block" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <BarChart2 className="size-10 text-slate-300" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">No products yet</p>
        <p className="text-xs text-slate-500">Add your first product to see cost per use data</p>
      </div>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
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
  )
}

export default function CostPerUse({ top5, all, loading, error, onRetry }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
            <BarChart2 className="size-4 text-violet-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Cost Per Use</p>
            <p className="text-xs text-slate-500 mt-0.5">Price per single use</p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState onRetry={onRetry} />
        ) : top5.length === 0 ? (
          <EmptyState />
        ) : (
          <ProductTable products={top5} />
        )}

        {!loading && !error && top5.length > 0 && (
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
        <DialogContent className="w-[calc(100vw-2rem)] md:w-full md:max-w-5xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="flex flex-col items-start px-6 py-4 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-base font-semibold text-slate-800">
              All Products — Cost Per Use
            </DialogTitle>
            <p className="text-xs text-slate-400">Sorted by highest cost per use</p>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            {all.length === 0 ? <EmptyState /> : <ProductTable products={all} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
