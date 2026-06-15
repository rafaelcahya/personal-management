'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { acknowledgeInsight, fetchAcknowledgedAnomalyInsights } from '@/lib/api/running'

const PAGE_SIZE = 5

function parseInline(text) {
  if (typeof text !== 'string') return text
  const result = []
  let remaining = text
  let key = 0
  while (remaining.length > 0) {
    const start = remaining.indexOf('**')
    if (start === -1) {
      result.push(remaining)
      break
    }
    if (start > 0) result.push(remaining.slice(0, start))
    const end = remaining.indexOf('**', start + 2)
    if (end === -1) {
      result.push(remaining.slice(start))
      break
    }
    result.push(
      <strong key={key++} className="font-semibold text-slate-700">
        {remaining.slice(start + 2, end)}
      </strong>
    )
    remaining = remaining.slice(end + 2)
  }
  return result
}

const ANOMALY_LABELS = {
  acwr_spike: 'Training Load Spike',
  hr_drift: 'Heart Rate Drift',
  pace_drop: 'Pace Drop',
  consistency_gap: 'Consistency Gap',
}

function anomalyLabel(type) {
  return ANOMALY_LABELS[type] ?? type?.replace(/_/g, ' ') ?? 'Anomaly'
}

function groupInsightsByMonth(insights) {
  const groups = {}
  for (const insight of insights) {
    const d = new Date(insight.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = { label, items: [] }
    groups[key].items.push(insight)
  }
  return Object.values(groups).sort((a, b) => (a.label < b.label ? 1 : -1))
}

function AnomalyHistoryItem({ insight }) {
  const [expanded, setExpanded] = useState(false)
  const anomalyType = insight.data_refs?.anomaly_type ?? null

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-200"
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide truncate">
            {anomalyLabel(anomalyType)}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(insight.created_at).toLocaleString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed">
            {parseInline(
              insight.content ?? insight.title ?? 'Anomaly detected in your training data.'
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function AnomalyCard({ insight, onAcknowledged, dimmed = false }) {
  const [acknowledging, setAcknowledging] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [ackError, setAckError] = useState(false)

  const anomalyType = insight.data_refs?.anomaly_type ?? null

  const handleAcknowledge = useCallback(async () => {
    setAcknowledging(true)
    setAckError(false)
    try {
      await acknowledgeInsight(insight.id)
      setAcknowledged(true)
      setTimeout(() => onAcknowledged(insight.id), 1500)
    } catch {
      setAckError(true)
    } finally {
      setAcknowledging(false)
    }
  }, [insight.id, onAcknowledged])

  if (acknowledged) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
        <p className="text-sm text-green-700">Acknowledged — alert dismissed.</p>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 ${dimmed ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-amber-200 bg-amber-50'}`}
      role={dimmed ? undefined : 'alert'}
      aria-label={dimmed ? undefined : `Anomaly alert: ${anomalyLabel(anomalyType)}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">
          {dimmed ? (
            <CheckCircle2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dimmed ? 'text-slate-400' : 'text-amber-700'}`}
          >
            {anomalyLabel(anomalyType)}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {parseInline(
              insight.content ?? insight.title ?? 'Anomaly detected in your training data.'
            )}
          </p>
          {insight.created_at && (
            <p className="text-xs text-slate-400 mt-1.5">
              {new Date(insight.created_at).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>

      {!dimmed && (
        <div className="flex items-center justify-between">
          {ackError && (
            <p className="text-xs text-red-500" role="alert">
              Failed to acknowledge. Try again.
            </p>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={acknowledging}
            onClick={handleAcknowledge}
            className="ml-auto h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-200"
            aria-label="Mark this anomaly alert as acknowledged"
          >
            {acknowledging ? (
              'Acknowledging...'
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Acknowledge
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default function AnomalyAlertsSection({ anomalies: initialAnomalies }) {
  const [anomalies, setAnomalies] = useState(initialAnomalies ?? [])
  const [historySheetOpen, setHistorySheetOpen] = useState(false)
  const [history, setHistory] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [page, setPage] = useState(1)

  const handleAcknowledged = useCallback((id) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id))
  }, [])

  useEffect(() => {
    async function loadHistory() {
      setHistoryLoading(true)
      try {
        const data = await fetchAcknowledgedAnomalyInsights()
        setHistory(data ?? [])
      } catch {
        setHistory([])
      } finally {
        setHistoryLoading(false)
      }
    }
    loadHistory()
  }, [])

  const totalPages = history ? Math.ceil(history.length / PAGE_SIZE) : 0
  const pagedItems = useMemo(() => {
    if (!history) return []
    const start = (page - 1) * PAGE_SIZE
    return history.slice(start, start + PAGE_SIZE)
  }, [history, page])
  const pagedGroups = useMemo(() => groupInsightsByMonth(pagedItems), [pagedItems])

  return (
    <section
      id="anomalyAlertsSection_aiCoachPage"
      aria-label="Anomaly alerts"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-700">Anomaly Alerts</h2>
        {anomalies.length > 0 && (
          <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
            {anomalies.length}
          </span>
        )}
      </div>

      {anomalies.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
          <p className="text-sm text-slate-500 font-medium">All clear — no anomalies detected.</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Alerts appear automatically after each activity sync when your training data shows a
            training load spike (ACWR &gt; 1.5), elevated heart rate (&gt;10% above baseline),
            significant pace drop (&gt;8% slower than baseline), or a gap of 10+ days since your
            last run.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {anomalies.map((insight) => (
            <AnomalyCard key={insight.id} insight={insight} onAcknowledged={handleAcknowledged} />
          ))}
        </div>
      )}

      {history !== null && history.length > 0 && (
        <button
          id="anomalyHistoryBtn_aiCoachPage"
          onClick={() => setHistorySheetOpen(true)}
          aria-label="View acknowledged anomaly alert history"
          className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-amber-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
        >
          <History className="h-3.5 w-3.5" aria-hidden="true" />
          History
        </button>
      )}

      <Sheet open={historySheetOpen} onOpenChange={setHistorySheetOpen}>
        <SheetContent
          id="anomalyHistoryModal_aiCoachPage"
          side="right"
          className="w-full md:w-[480px] p-0"
          aria-label="Anomaly history"
        >
          <SheetHeader className="px-6 py-4 border-b border-slate-100">
            <SheetTitle className="text-base font-semibold text-slate-800">
              Anomaly History
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="px-6 py-4 space-y-6">
              {historyLoading && (
                <p className="text-sm text-slate-400 text-center py-8">Loading history...</p>
              )}
              {!historyLoading && history?.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">
                  No acknowledged alerts yet.
                </p>
              )}
              {!historyLoading &&
                pagedGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      {group.label}
                    </p>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <AnomalyHistoryItem key={item.id} insight={item} />
                      ))}
                    </div>
                  </div>
                ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-xs h-8"
                  >
                    Prev
                  </Button>
                  <p className="text-xs text-slate-400">
                    Page {page} of {totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs h-8"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </section>
  )
}
