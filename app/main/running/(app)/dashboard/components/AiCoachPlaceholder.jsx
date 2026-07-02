'use client'

import { useEffect, useState, useCallback } from 'react'
import Button from '@/components/base/Button/Button'
import { BrainCircuit } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
      <Card className="border border-violet-200/60 shadow-sm py-0 bg-gradient-to-br from-violet-50 to-purple-50">
        <CardContent className="px-5 py-5">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">AI Coach</h3>
            </div>
            <p className="text-xs text-slate-400">
              Personalized training insights generated after each activity.
            </p>
          </div>

          {status === 'loading' && (
            <div
              id="aiCoachLoading_dashboardPage"
              className="flex flex-col gap-3"
              aria-label="Loading AI insights"
            >
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          )}

          {status === 'empty' && (
            <div id="aiCoachEmpty_dashboardPage" className="flex items-start gap-3">
              <p className="text-sm text-slate-500">Complete a run to get AI analysis.</p>
            </div>
          )}

          {status === 'error' && (
            <div id="aiCoachError_dashboardPage" className="flex items-center gap-3">
              <p className="text-sm text-red-600">Unable to load insights.</p>
              <Button
                id="aiCoachRetryBtn_dashboardPage"
                variant="link"
                size="sm"
                onClick={load}
                className="shrink-0"
              >
                Retry
              </Button>
            </div>
          )}

          {status === 'content' && insights.length > 0 && (
            <div
              id="aiCoachContent_dashboardPage"
              className="flex flex-col divide-y divide-violet-100"
            >
              {insights.map((insight) => (
                <div key={insight.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold text-slate-700 line-clamp-1">
                    {insight.title}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {firstParagraph(insight.content)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {relativeTime(insight.created_at)}
                    </span>
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
        </CardContent>
      </Card>
    </section>
  )
}
