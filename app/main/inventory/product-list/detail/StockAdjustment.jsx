'use client'

import { useEffect, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from '@/components/base/Modal/Modal.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/Tabs/Tabs.jsx'
import { getProductLogByProductListId } from '@/lib/api/productHistory'
import ProductSummary from './ProductSummary'
import ProductUsageLog from './ProductUsageLog'
import RecordUsageForm from './RecordUsageForm'

export default function StockAdjustment({ product, onClose, onUpdated }) {
  const [productLog, setProductLog] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchProductHistory = async (productId) => {
    try {
      setIsRefreshing(true)
      const log = await getProductLogByProductListId(productId)
      setProductLog(log)
    } catch (err) {
      console.error('Failed to fetch log:', err.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleUpdated = async () => {
    if (product?.id) {
      await fetchProductHistory(product.id)
    }

    await onUpdated?.()
  }

  useEffect(() => {
    if (product?.id) {
      fetchProductHistory(product.id)
    }
  }, [product])

  if (!product) return null

  return (
    <Modal open={!!product} onOpenChange={onClose}>
      <ModalContent
        id="stockAdjustmentDialog_productListPage"
        className="sm:max-w-2xl flex flex-col max-h-[90vh]"
        variant="bordered" borderColor="border-slate-200"
        onPointerDownOutside={(e) => {
          if (e.target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault()
          }
        }}
      >
        <ModalHeader className="text-left shrink-0">
          <ModalTitle>Track Product Usage</ModalTitle>
          <ModalDescription className="text-slate-foreground">
            Record when you start using a product and mark it as depleted when finished.
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-5 w-full">
            {/* Product Summary */}
            <ProductSummary product={product} />

            <Tabs defaultValue="recordNewUsage" className="w-full gap-5">
              <TabsList className="flex w-full" variant="pill">
                <TabsTrigger
                  value="recordNewUsage"
                  id="recordNewUsageTab"
                  className="text-sm flex-1 justify-center"
                >
                  Record Usage
                </TabsTrigger>
                <TabsTrigger
                  value="productUsageLog"
                  id="productUsageLogTab"
                  className="text-sm flex-1 justify-center"
                >
                  Usage Log
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recordNewUsage">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">Record New Usage</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Log when you open and start using this product.
                    </p>
                  </div>
                  <RecordUsageForm product={product} onUpdated={handleUpdated} onClose={onClose} />
                </div>
              </TabsContent>

              <TabsContent value="productUsageLog">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">Usage Log</h3>
                      {isRefreshing && (
                        <span className="text-xs text-muted-foreground">Refreshing...</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      History of when this product was opened and how long each session lasted.
                    </p>
                  </div>
                  <ProductUsageLog log={productLog} onUpdate={handleUpdated} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
