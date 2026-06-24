'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react'
import { analyzeEvent } from '@/lib/api/event'
import ImpactBadge from './ImpactBadge'

function formatEventDate(dateStr) {
  if (!dateStr) return '—'
  const datePart = String(dateStr).split('T')[0]
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [y, m, d] = datePart.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTimestamp(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EventAnalysisModal({
  open,
  onClose,
  analysisType,
  event,
  events,
  onAnalysisComplete,
}) {
  const [additionalContext, setAdditionalContext] = useState('')
  const [status, setStatus] = useState('idle')
  const [streamedText, setStreamedText] = useState('')
  const [error, setError] = useState(null)
  const [generatedAt, setGeneratedAt] = useState(null)

  const isSingle = analysisType === 'single'
  const descLen = isSingle ? (event?.event_description?.length ?? 0) : 0
  const hasDesc = isSingle
    ? Boolean(event?.event_description)
    : (events ?? []).some((e) => e.event_description && e.event_description.length > 0)
  const isBriefDesc = isSingle && event?.event_description && descLen > 0 && descLen < 50
  const noDescNoContext = !hasDesc && !additionalContext.trim()

  const handleAnalyze = async () => {
    setStatus('streaming')
    setStreamedText('')
    setError(null)

    try {
      const payload = isSingle
        ? { event_id: event.id, additional_context: additionalContext }
        : { event_ids: (events ?? []).map((e) => e.id), additional_context: additionalContext }

      const res = await analyzeEvent(payload)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Analysis failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setStreamedText((prev) => prev + chunk)
      }

      const now = new Date().toISOString()
      setGeneratedAt(now)
      setStatus('complete')
      onAnalysisComplete?.(now)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Analysis failed — please retry.')
    }
  }

  const handleRetry = () => {
    setStatus('idle')
    setStreamedText('')
    setError(null)
    setGeneratedAt(null)
  }

  const handleClose = () => {
    if (status === 'streaming') return
    setStatus('idle')
    setStreamedText('')
    setError(null)
    setGeneratedAt(null)
    setAdditionalContext('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        id="eventAnalysisModal"
        className="w-[90vw] !max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-violet-500" />
            Analyze with AI
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
          {/* Event summary — single */}
          {isSingle && event && status === 'idle' && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-2">
              <p className="font-semibold text-sm text-slate-800">{event.title}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <ImpactBadge value={event.impact_direction} />
                {event.actual_outcome && <ImpactBadge value={event.actual_outcome} />}
                <span className="text-xs text-slate-500">{formatEventDate(event.event_date)}</span>
              </div>
              {Array.isArray(event.tags) && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-violet-100 text-violet-700 text-xs font-medium rounded-md px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events list — multi */}
          {!isSingle && events && status === 'idle' && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {events.length} Selected Events
              </p>
              <div className="flex flex-col gap-1.5">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                        {(!e.event_description || e.event_description.length === 0) && (
                          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium shrink-0">
                            <AlertTriangle className="size-3" /> No description
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <ImpactBadge value={e.impact_direction} />
                        <span className="text-xs text-slate-500">
                          {formatEventDate(e.event_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brief description warning — single idle */}
          {isSingle && isBriefDesc && status === 'idle' && (
            <p
              id="briefDescriptionWarning_eventAnalysisModal"
              className="text-xs text-amber-600 flex items-start gap-1.5"
            >
              <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
              Your notes are brief — analysis may be less specific. Consider adding more context
              below.
            </p>
          )}

          {/* Additional context textarea — idle only */}
          {status === 'idle' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Additional Context{' '}
                <span className="normal-case font-normal text-slate-400">(optional)</span>
              </label>
              <Textarea
                id="additionalContextInput_eventAnalysisModal"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value.slice(0, 500))}
                placeholder="Anything not in your event notes that might be relevant — e.g. market opened -1.2% today, rupiah weakened past 16.400"
                rows={3}
                className="text-sm font-medium resize-none focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              />
              <p className="text-xs text-slate-400 text-right">{additionalContext.length}/500</p>
            </div>
          )}

          {/* Streaming result */}
          {(status === 'streaming' || status === 'complete') && (
            <div
              id="eventAnalysisResult_eventDetailPage"
              className="prose prose-sm prose-slate max-w-none [&_hr]:my-3 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-3 [&_h3]:mb-1"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {streamedText}
              </ReactMarkdown>
              {status === 'streaming' && (
                <span className="inline-block w-1.5 h-4 bg-violet-500 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div
              id="analysisError_eventDetailPage"
              className="rounded-lg border border-red-200 bg-red-50 p-4 flex flex-col gap-3"
            >
              <p className="text-sm text-red-700 font-medium">{error}</p>
              <Button
                id="analysisRetryBtn_eventDetailPage"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="self-start border-red-300 text-red-600 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Complete state — timestamp + refresh */}
          {status === 'complete' && generatedAt && (
            <div className="flex items-center justify-between">
              <p id="lastAnalyzedTimestamp_eventDetailPage" className="text-xs text-slate-400">
                Last analyzed: {formatTimestamp(generatedAt)}
              </p>
              <Button
                id="refreshAnalysisBtn_eventDetailPage"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="h-7 gap-1.5 text-xs"
              >
                <RefreshCw className="size-3" /> Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          {status === 'idle' && (
            <>
              <Button
                id="cancelAnalysisBtn_eventAnalysisModal"
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                id="analyzeConfirmBtn_eventAnalysisModal"
                size="sm"
                disabled={noDescNoContext}
                onClick={handleAnalyze}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
                title={noDescNoContext ? 'Add notes or additional context before analyzing' : ''}
              >
                <Sparkles className="size-3.5" /> Analyze
              </Button>
            </>
          )}
          {status === 'streaming' && (
            <Button size="sm" disabled className="gap-1.5">
              <Loader2 className="size-3.5 animate-spin" /> Analyzing…
            </Button>
          )}
          {(status === 'complete' || status === 'error') && (
            <Button variant="outline" size="sm" onClick={handleClose}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
