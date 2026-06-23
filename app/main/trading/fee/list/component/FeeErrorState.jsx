'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FeeErrorState({ onRetry }) {
  return (
    <div
      id="feeErrorState_feePage"
      className="flex flex-col items-center justify-center py-12 gap-3"
    >
      <AlertCircle className="size-8 text-red-400" aria-hidden="true" />
      <p className="text-center font-medium text-slate-600">Failed to load fees</p>
      <Button
        id="feeRetryBtn_feePage"
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="text-violet-600 border-violet-200 hover:bg-violet-50"
      >
        Try again
      </Button>
    </div>
  )
}
