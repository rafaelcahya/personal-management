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
  ModalFooter,
} from '@/components/base/Modal/Modal.jsx'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import Pagination from '@/components/base/Pagination/Pagination'
import ProductTable from '../components/ProductTable'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/base/EmptyState/EmptyState'

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

const MODAL_PAGE_SIZE = 10

export default function CostPerUse({ top5, all, loading, error, onRetry }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPage, setModalPage] = useState(1)

  const modalTotalPages = Math.max(1, Math.ceil(all.length / MODAL_PAGE_SIZE))
  const modalStartIndex = (modalPage - 1) * MODAL_PAGE_SIZE
  const modalItems = all.slice(modalStartIndex, modalStartIndex + MODAL_PAGE_SIZE)

  function handleModalOpen(open) {
    setModalOpen(open)
    if (!open) setModalPage(1)
  }

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
          ) : top5.length === 0 ? (
            <EmptyState size="sm">
              <EmptyStateIcon icon={BarChart2} />
              <EmptyStateTitle>No products yet</EmptyStateTitle>
              <EmptyStateDescription>
                Add your first product to see cost per use data
              </EmptyStateDescription>
            </EmptyState>
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

      <Modal open={modalOpen} onOpenChange={handleModalOpen}>
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
          <ModalBody padding={{ x: 0, y: 0 }} className="overflow-y-auto flex-1">
            {all.length === 0 ? (
              <EmptyState size="sm">
                <EmptyStateIcon icon={BarChart2} />
                <EmptyStateTitle>No products yet</EmptyStateTitle>
                <EmptyStateDescription>
                  Add your first product to see cost per use data
                </EmptyStateDescription>
              </EmptyState>
            ) : (
              <ProductTable products={modalItems} startIndex={modalStartIndex} />
            )}
          </ModalBody>
          {modalTotalPages > 1 && (
            <ModalFooter className="border-t border-slate-100 p-0 pb-4">
              <Pagination
                page={modalPage}
                totalPages={modalTotalPages}
                total={all.length}
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
