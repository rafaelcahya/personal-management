'use client'

import { useEffect, useState, useCallback } from 'react'
import { BrainCircuit } from 'lucide-react'
import Link from 'next/link'
import { fetchInsights } from '@/lib/api/running'

function firstParagraph(content) {
  if (!content) return ''
  const lines = content.split('\n')
  const para = lines.find((l) => l.trim() && !l.trim().startsWith('#'))
  return para?.trim() ?? ''
}

function relativeTime(isoString) {
  if (!isoString) return ''
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  return `${Math.floor(diffHour / 24)}d ago`
}

export default function AiCoachPlaceholder() {
  const [status, setStatus] = useState('loading')
  const [insights, setInsights] = useState([])

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const all = await fetchInsights(10)
      const valid = all.filter((i) => i.status === 'completed' && i.is_valid === true).slice(0, 3)
      if (valid.length === 0) {
        setStatus('empty')
      } else {
        setInsights(valid)
        setStatus('content')
      }
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <section id="aiCoachCard" aria-label="AI Coach">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        AI Coach
      </h2>
      <div className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-purple-50 p-5">
        {status === 'loading' && (
          <div
            id="aiCoachLoading_dashboardPage"
            className="flex flex-col gap-2 animate-pulse"
            aria-label="Loading AI insights"
          >
            <div className="h-3 bg-violet-100 rounded w-3/4" />
            <div className="h-3 bg-violet-100 rounded w-1/2" />
          </div>
        )}

        {status === 'empty' && (
          <div id="aiCoachEmpty_dashboardPage" className="flex items-start gap-3">
            <div className="rounded-full bg-violet-100 p-2 shrink-0">
              <BrainCircuit className="size-5 text-violet-600" aria-hidden="true" />
            </div>
            <p className="text-sm text-slate-500">Complete a run to get AI analysis.</p>
          </div>
        )}

        {status === 'error' && (
          <div id="aiCoachError_dashboardPage" className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Unable to load insights.</p>
            <button
              id="aiCoachRetryBtn_dashboardPage"
              onClick={load}
              className="text-xs text-violet-600 hover:underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'content' && insights.length > 0 && (
          <div
            id="aiCoachContent_dashboardPage"
            className="flex flex-col divide-y divide-violet-100"
          >
            {insights.map((insight) => (
              <div key={insight.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold text-slate-700 line-clamp-1">{insight.title}</p>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {firstParagraph(insight.content)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{relativeTime(insight.created_at)}</span>
                  {insight.data_refs?.activity_id && (
                    <Link
                      href={`/main/running/activities/${insight.data_refs.activity_id}`}
                      className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
                    >
                      View activity →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
