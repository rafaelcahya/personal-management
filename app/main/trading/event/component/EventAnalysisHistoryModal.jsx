'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from '@/components/base/Modal/Modal.jsx'
import Button from '@/components/base/Button/Button'
import {
  SelectCard,
  SelectCardTitle,
  SelectCardDescription,
} from '@/components/base/SelectCard/SelectCard'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
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
          <SelectCard
            key={item.id}
            value={item.id}
            layout="horizontal"
            indicator="border"
            onSelect={() => onSelect(item)}
          >
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2">
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

              {eventNames.length === 0 ? (
                <SelectCardDescription className="italic">Unknown event</SelectCardDescription>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {eventNames.map((name, i) => (
                    <SelectCardTitle key={i}>{name}</SelectCardTitle>
                  ))}
                </div>
              )}
            </div>
          </SelectCard>
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
  const scrollRef = useRef(null)

  useEffect(() => {
    if (selected && scrollRef.current) scrollRef.current.scrollTop = 0
  }, [selected])

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
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent
        variant="bordered" borderColor="border-slate-200"
        className="w-[90vw] !max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        <ModalHeader className="shrink-0">
          <ModalTitle className="flex items-center gap-2 text-base">
            <History className="size-4 text-violet-500" />
            {selected ? 'Analysis Detail' : 'AI Analysis History'}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1">
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
                size="base"
                onClick={() => setSelected(null)}
                className="gap-1 text-xs text-slate-500"
              >
                <ChevronLeft className="size-3.5" /> Back
              </Button>
            )}
          </div>
          <Button variant="outline" size="base" onClick={handleClose}>
            Close
          </Button>
        </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
