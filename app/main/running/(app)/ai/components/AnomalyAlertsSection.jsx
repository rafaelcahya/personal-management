'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { acknowledgeInsight } from '@/lib/api/running'

const ANOMALY_LABELS = {
  acwr_spike: 'Training Load Spike',
  hr_drift: 'Heart Rate Drift',
  pace_drop: 'Pace Drop',
  consistency_gap: 'Consistency Gap',
}

function anomalyLabel(type) {
  return ANOMALY_LABELS[type] ?? type?.replace(/_/g, ' ') ?? 'Anomaly'
}

function AnomalyCard({ insight, onAcknowledged }) {
  const [acknowledging, setAcknowledging] = useState(false)
  const [ackError, setAckError] = useState(false)

  const anomalyType = insight.data_refs?.anomaly_type ?? null

  const handleAcknowledge = useCallback(async () => {
    setAcknowledging(true)
    setAckError(false)
    try {
      await acknowledgeInsight(insight.id)
      onAcknowledged(insight.id)
    } catch {
      setAckError(true)
    } finally {
      setAcknowledging(false)
    }
  }, [insight.id, onAcknowledged])

  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col gap-3"
      role="alert"
      aria-label={`Anomaly alert: ${anomalyLabel(anomalyType)}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">
          <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
            {anomalyLabel(anomalyType)}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
            {insight.content ?? insight.title ?? 'Anomaly detected in your training data.'}
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
    </div>
  )
}

export default function AnomalyAlertsSection({ anomalies: initialAnomalies }) {
  const [anomalies, setAnomalies] = useState(initialAnomalies ?? [])

  const handleAcknowledged = useCallback((id) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id))
  }, [])

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
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-400">No unacknowledged anomalies. All clear.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {anomalies.map((insight) => (
            <AnomalyCard key={insight.id} insight={insight} onAcknowledged={handleAcknowledged} />
          ))}
        </div>
      )}
    </section>
  )
}
