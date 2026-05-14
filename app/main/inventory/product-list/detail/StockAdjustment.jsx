'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent
        id="stockAdjustmentDialog_productListPage"
        className="sm:max-w-3xl flex flex-col max-h-[90vh]"
        onPointerDownOutside={(e) => {
          if (e.target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>Track Product Usage</DialogTitle>
          <DialogDescription className="text-slate-foreground">
            Record when you start using a product and mark it as depleted when finished.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-5 w-full">
            {/* Product Summary */}
            <ProductSummary product={product} />

            <Tabs defaultValue="recordNewUsage" className="w-full sm:w-2/3 space-y-5">
              <TabsList className="bg-violet-50/75 w-full h-full grid grid-cols-2">
                <TabsTrigger value="recordNewUsage" id="recordNewUsageTab" className="text-sm py-2">
                  Record Usage
                </TabsTrigger>
                <TabsTrigger
                  value="productUsageLog"
                  id="productUsageLogTab"
                  className="text-sm py-2"
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
