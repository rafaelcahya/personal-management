'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, Sparkles, History } from 'lucide-react'
import { fetchAnalysisHistory } from '@/lib/api/event'

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

// List view — shows all history entries
function HistoryList({ history, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      {history.map((item) => {
        const isMulti = item.analysis_type === 'multi'
        const eventNames = isMulti ? item.event_titles : item.event_title ? [item.event_title] : []

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full text-left border border-slate-200 rounded-lg px-4 py-3 hover:bg-slate-50 hover:border-violet-200 transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  isMulti ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isMulti ? `Multi · ${item.event_titles.length} events` : 'Single'}
              </span>
              <span className="text-xs text-slate-400 shrink-0">
                {formatTimestamp(item.generated_at)}
              </span>
            </div>

            {/* Event names — full, not truncated */}
            <div className="flex flex-col gap-0.5">
              {eventNames.length === 0 && (
                <p className="text-sm text-slate-400 italic">Unknown event</p>
              )}
              {eventNames.map((name, i) => (
                <p key={i} className="text-sm font-medium text-slate-800 leading-snug">
                  {name}
                </p>
              ))}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// Detail view — shows full result for a selected entry
function HistoryDetail({ item, onBack }) {
  const isMulti = item.analysis_type === 'multi'
  const eventNames = isMulti ? item.event_titles : item.event_title ? [item.event_title] : []

  return (
    <div className="flex flex-col gap-4">
      {/* Event names */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              isMulti ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isMulti ? `Multi · ${item.event_titles.length} events` : 'Single'}
          </span>
          <span className="text-xs text-slate-400">{formatTimestamp(item.generated_at)}</span>
        </div>
        {eventNames.map((name, i) => (
          <p key={i} className="text-sm font-medium text-slate-800 leading-snug">
            {name}
          </p>
        ))}
      </div>

      {/* Full AI result */}
      <div className="prose prose-sm prose-slate max-w-none [&_hr]:my-3 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-3 [&_h3]:mb-1">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          }}
        >
          {item.output_md}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default function EventAnalysisHistoryModal({ open, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!open) return
    setSelected(null)
    setLoading(true)
    setError(null)
    fetchAnalysisHistory()
      .then(setHistory)
      .catch((err) => setError(err.message || 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [open])

  const handleClose = () => {
    setSelected(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] !max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <History className="size-4 text-violet-500" />
            {selected ? 'Analysis Detail' : 'AI Analysis History'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
          {loading && (
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          )}

          {!loading && error && <p className="text-sm text-red-600 text-center py-8">{error}</p>}

          {!loading && !error && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
              <Sparkles className="size-8" />
              <p className="text-sm font-medium">No analyses yet</p>
              <p className="text-xs">Run an AI analysis on any event to see it here.</p>
            </div>
          )}

          {!loading && !error && !selected && history.length > 0 && (
            <HistoryList history={history} onSelect={setSelected} />
          )}

          {!loading && !error && selected && (
            <HistoryDetail item={selected} onBack={() => setSelected(null)} />
          )}
        </div>

        <div className="shrink-0 flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {selected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
                className="gap-1 text-xs text-slate-500"
              >
                <ChevronLeft className="size-3.5" /> Back
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
