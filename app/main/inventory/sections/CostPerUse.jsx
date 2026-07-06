'use client'

import { useState } from 'react'
import { BarChart2, AlertCircle } from 'lucide-react'
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
        <Button variant="outline" size="base" onClick={onRetry} className="min-w-11">
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
      <Card>
        <CardHeader>
          <CardIcon icon={BarChart2} />
          <CardHeaderContent>
            <CardTitle>Cost Per Use</CardTitle>
            <CardDescription>Price per single use</CardDescription>
          </CardHeaderContent>
        </CardHeader>

        <CardContent padding="none">
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <ErrorState onRetry={onRetry} />
          ) : top5.length === 0 ? (
            <EmptyState />
          ) : (
            <ProductTable products={top5} />
          )}
        </CardContent>

        {!loading && !error && top5.length > 0 && (
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
          className="w-[calc(100vw-2rem)] md:w-full md:max-w-5xl max-h-[85vh] flex flex-col p-0 gap-0"
        >
          <ModalHeader layout="beside" padding={{ x: 4 }}>
            <ModalIcon icon={BarChart2} />
            <ModalHeaderContent>
              <ModalTitle>All Products — Cost Per Use</ModalTitle>
              <ModalDescription>Sorted by highest cost per use</ModalDescription>
            </ModalHeaderContent>
          </ModalHeader>
          <ModalBody padding={{ x: 0 }} className="overflow-y-auto flex-1">
            {all.length === 0 ? <EmptyState /> : <ProductTable products={all} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
