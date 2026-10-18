import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from '@/components/base/Button/Button'

export default function SectionLoadError({ id, retryId, message, onRetry }) {
  return (
    <div
      id={id}
      role="alert"
      className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
    >
      <div className="flex items-start gap-2 text-sm text-red-700 min-w-0">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        <p className="break-words min-w-0">{message}</p>
      </div>
      <Button
        id={retryId}
        type="button"
        variant="outline"
        onClick={onRetry}
        className="h-11 md:h-8 shrink-0"
      >
        <RefreshCw className="size-3.5" aria-hidden="true" />
        Retry
      </Button>
    </div>
  )
}
