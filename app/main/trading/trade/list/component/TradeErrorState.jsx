import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TradeErrorState({ message, onRetry }) {
  return (
    <div
      id="tradeErrorState_tradePage"
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="p-3 rounded-full bg-red-50">
        <AlertCircle className="size-8 text-red-500" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-700">Failed to load trades</p>
        <p className="text-sm text-slate-500">
          {message || 'Something went wrong. Please try again.'}
        </p>
      </div>
      <Button
        id="tradeErrorRetryBtn_tradePage"
        variant="outline"
        onClick={onRetry}
        className="min-h-11"
      >
        Retry
      </Button>
    </div>
  )
}
