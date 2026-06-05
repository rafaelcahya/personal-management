'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { acknowledgeInsight, fetchAcknowledgedAnomalyInsights } from '@/lib/api/running'

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
  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)

  const handleAcknowledged = useCallback((id) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const toggleHistory = useCallback(async () => {
    if (historyOpen) {
      setHistoryOpen(false)
      return
    }
    setHistoryOpen(true)
    if (history !== null) return
    setHistoryLoading(true)
    try {
      const data = await fetchAcknowledgedAnomalyInsights()
      setHistory(data)
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [historyOpen, history])

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

      <button
        id="anomalyHistoryToggle_aiCoachPage"
        onClick={toggleHistory}
        className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
        aria-expanded={historyOpen}
      >
        {historyOpen ? (
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {historyOpen ? 'Hide history' : 'Show history'}
      </button>

      {historyOpen && (
        <div className="mt-3 flex flex-col gap-3">
          {historyLoading && (
            <p className="text-xs text-slate-400 text-center py-2">Loading history...</p>
          )}
          {!historyLoading && history?.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">No acknowledged alerts yet.</p>
          )}
          {!historyLoading &&
            history?.map((insight) => (
              <AnomalyCard key={insight.id} insight={insight} onAcknowledged={() => {}} dimmed />
            ))}
        </div>
      )}
    </section>
  )
}
