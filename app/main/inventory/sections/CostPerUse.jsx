'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ProductTable from '../components/ProductTable'
import SkeletonRows from '../components/SkeletonRows'

export default function CostPerUse({ top5, all, loading, error }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Cost Per Use</h2>
          <p className="text-xs text-slate-400 mt-0.5">Price per single use</p>
        </div>

        <div className="px-2 py-2">
          {error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : loading ? (
            <SkeletonRows count={5} />
          ) : top5.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">No products yet.</p>
            </div>
          ) : (
            <ProductTable products={top5} />
          )}
        </div>

        {!loading && !error && top5.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-violet-700 border border-violet-200 hover:bg-violet-50 focus:outline-none transition-colors"
            >
              View All
            </button>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="flex flex-col items-start px-6 py-4 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-base font-semibold text-slate-800">
              All Products — Cost Per Used
            </DialogTitle>
            <p className="text-xs text-slate-400">Sorted by highest cost per use</p>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-2 py-2">
            {all.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-400">No products yet.</p>
              </div>
            ) : (
              <ProductTable products={all} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
