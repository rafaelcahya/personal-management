'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Sparkles, Loader2, Clock, History, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchAnalyticsInsight, generateAnalyticsInsight } from '@/lib/api/running'

const POLL_INTERVAL_MS = 8000
const MAX_POLLS = 15
const STALE_THRESHOLD_HOURS = 24

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

function renderMarkdown(content) {
  if (!content) return null

  const sections = content.split(/\n(?=## )/)

  return sections.map((section, i) => {
    const lines = section.split('\n')
    const firstLine = lines[0]
    const isHeader = firstLine.startsWith('## ')
    const header = isHeader ? firstLine.replace(/^## /, '') : null
    const bodyLines = isHeader ? lines.slice(1) : lines

    const bodyParts = []
    let listItems = []

    for (const line of bodyLines) {
      if (line.trim() === '') {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        continue
      }
      if (line.trim() === '---') {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        bodyParts.push({ type: 'hr' })
        continue
      }
      if (line.trim().startsWith('- ')) {
        listItems.push(line.trim().slice(2))
      } else {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        if (line.trim()) bodyParts.push({ type: 'p', text: line.trim() })
      }
    }
    if (listItems.length > 0) bodyParts.push({ type: 'list', items: listItems })

    return (
      <div key={i} className="mb-3 last:mb-0">
        {header && (
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mt-3 mb-1.5 first:mt-0">
            {header}
          </p>
        )}
        {bodyParts.map((part, j) =>
          part.type === 'hr' ? (
            <hr key={j} className="border-slate-200 my-2" />
          ) : part.type === 'list' ? (
            <ul key={j} className="list-disc list-inside space-y-0.5 mb-1">
              {part.items.map((item, k) => (
                <li key={k} className="text-sm text-slate-600">
                  {parseInline(item)}
                </li>
              ))}
            </ul>
          ) : (
            <p key={j} className="text-sm text-slate-600 mb-1">
              {parseInline(part.text)}
            </p>
          )
        )}
      </div>
    )
  })
}

function RoleInsight({ content }) {
  const parsed = useMemo(() => {
    if (!content) return null
    try {
      const obj = JSON.parse(content)
      if (obj.running_coach || obj.performance_analyst || obj.summary) return obj
    } catch {}
    return null
  }, [content])

  if (!parsed) return <div className="prose-sm">{renderMarkdown(content)}</div>

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-3 space-y-1">
        <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">
          Running Coach
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{parsed.running_coach}</p>
      </div>
      <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 space-y-1">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
          Performance Analyst
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{parsed.performance_analyst}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Summary</p>
        <p className="text-sm text-slate-600 leading-relaxed italic">{parsed.summary}</p>
      </div>
    </div>
  )
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

function isStale(createdAt) {
  if (!createdAt) return false
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
  return ageHours > STALE_THRESHOLD_HOURS
}

export default function AnalyticsAICard({ section, isPageStale = false }) {
  const [insights, setInsights] = useState(undefined)
  const [loadError, setLoadError] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const pollRef = useRef(null)
  const pollCountRef = useRef(0)

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    pollCountRef.current = 0
  }, [])

  const loadInsights = useCallback(async () => {
    setLoadError(false)
    try {
      const data = await fetchAnalyticsInsight(section)
      setInsights(data)
      return data
    } catch {
      setLoadError(true)
      setInsights(null)
      return null
    }
  }, [section])

  const startPolling = useCallback(() => {
    if (pollRef.current) return
    pollCountRef.current = 0
    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1
      try {
        const data = await fetchAnalyticsInsight(section)
        const latest = data?.[0]
        const isDone = latest && latest.status === 'completed' && latest.is_valid === true
        const timedOut = pollCountRef.current >= MAX_POLLS
        if (isDone || timedOut) {
          setInsights(data)
          stopPolling()
        }
      } catch {
        stopPolling()
        setLoadError(true)
      }
    }, POLL_INTERVAL_MS)
  }, [section, stopPolling])

  useEffect(() => {
    loadInsights()
    return () => stopPolling()
  }, [loadInsights, stopPolling])

  const latestInsight = insights?.[0]
  const isPending = latestInsight && latestInsight.status === 'pending'

  useEffect(() => {
    if (isPending) {
      startPolling()
    } else {
      stopPolling()
    }
  }, [isPending, startPolling, stopPolling])

  async function handleGenerate() {
    setGenerating(true)
    setGenerateError(false)
    try {
      await generateAnalyticsInsight(section)
      const data = await fetchAnalyticsInsight(section)
      setInsights(data)
      startPolling()
    } catch {
      setGenerateError(true)
    } finally {
      setGenerating(false)
    }
  }

  const isValidInsight =
    latestInsight &&
    latestInsight.status === 'completed' &&
    latestInsight.is_valid === true &&
    latestInsight.content

  const stale = isPageStale || isStale(latestInsight?.created_at)
  const historyInsights = useMemo(
    () => (insights ?? []).filter((ins) => ins.status === 'completed' && ins.is_valid === true),
    [insights]
  )
  const historyGroups = useMemo(() => groupInsightsByMonth(historyInsights), [historyInsights])

  const sectionId = section.replace(/_/g, '')

  return (
    <div
      id={`analyticsAiCard_${sectionId}_analyticsPage`}
      className="mt-4 border-t border-slate-100 pt-4 space-y-3"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={isPending || generating}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-100 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            AI Recommendations
          </span>
          <span className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-medium">
            BETA
          </span>
        </div>

        {historyInsights.length > 1 && (
          <button
            id={`analyticsAiHistoryBtn_${sectionId}_analyticsPage`}
            onClick={() => setHistoryOpen(true)}
            aria-label="View analysis history"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
          >
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            History
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {insights === undefined && !loadError && (
        <div
          id={`analyticsAiLoading_${sectionId}_analyticsPage`}
          className="space-y-2 animate-pulse motion-reduce:animate-none"
          aria-label="Loading AI recommendations"
        >
          <div className="h-3 bg-slate-200 rounded w-2/3" aria-hidden="true" />
          <div className="h-3 bg-slate-200 rounded w-full" aria-hidden="true" />
          <div className="h-3 bg-slate-200 rounded w-5/6" aria-hidden="true" />
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div
          id={`analyticsAiError_${sectionId}_analyticsPage`}
          className="flex items-center gap-2"
          role="alert"
        >
          <p className="text-sm text-slate-400">Could not load recommendations.</p>
          <Button
            id={`analyticsAiRetryBtn_${sectionId}_analyticsPage`}
            variant="ghost"
            size="sm"
            className="text-violet-600 hover:text-violet-700 px-0 h-auto font-normal text-xs"
            onClick={() => {
              stopPolling()
              setInsights(undefined)
              loadInsights()
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Empty state — no insights yet */}
      {!loadError && insights !== undefined && !latestInsight && (
        <div id={`analyticsAiEmpty_${sectionId}_analyticsPage`} className="space-y-2">
          <p className="text-xs text-slate-400">
            No recommendations yet. Generate AI insights for this section.
          </p>
          {generateError && (
            <p className="text-xs text-red-400" role="alert">
              Failed to start analysis. Try again.
            </p>
          )}
          <Button
            id={`analyticsAiGenerateBtn_${sectionId}_analyticsPage`}
            size="sm"
            disabled={generating}
            onClick={handleGenerate}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            {generating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" aria-hidden="true" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1.5" aria-hidden="true" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
      )}

      {/* Pending / generating */}
      {!loadError && isPending && (
        <div id={`analyticsAiPending_${sectionId}_analyticsPage`} className="space-y-2">
          <div className="h-1 w-full bg-violet-100 rounded-full overflow-hidden" aria-hidden="true">
            <div className="h-full w-1/2 bg-violet-300 rounded-full animate-pulse motion-reduce:animate-none" />
          </div>
          <div
            className="space-y-2 animate-pulse motion-reduce:animate-none"
            aria-label="Generating AI recommendations"
          >
            <div className="h-3 bg-slate-200 rounded w-1/2" aria-hidden="true" />
            <div className="h-3 bg-slate-200 rounded w-full" aria-hidden="true" />
            <div className="h-3 bg-slate-200 rounded w-4/5" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-400 italic">Analyzing your training data...</p>
        </div>
      )}

      {/* Content state */}
      {!loadError && isValidInsight && (
        <div id={`analyticsAiContent_${sectionId}_analyticsPage`} className="space-y-3">
          {stale && (
            <div
              id={`analyticsAiStalenessBadge_${sectionId}_analyticsPage`}
              className="inline-flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded-full"
              role="status"
              aria-label="Recommendations may be outdated — new activity data is available"
            >
              <Clock className="h-3 w-3" aria-hidden="true" />
              Outdated — newer activity data available
            </div>
          )}

          <RoleInsight content={latestInsight.content} />

          <div className="flex items-center justify-between pt-1">
            {latestInsight.created_at && (
              <p className="text-xs text-slate-400">
                {new Date(latestInsight.created_at).toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
            <Button
              id={`analyticsAiRefreshBtn_${sectionId}_analyticsPage`}
              variant="ghost"
              size="sm"
              disabled={generating || isPending}
              onClick={handleGenerate}
              className="text-violet-600 hover:text-violet-700 px-0 h-auto text-xs font-normal focus-visible:ring-2 focus-visible:ring-violet-200"
              aria-label="Refresh AI recommendations"
            >
              {generating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" aria-hidden="true" />
                  Refreshing...
                </>
              ) : (
                'Refresh'
              )}
            </Button>
          </div>

          {generateError && (
            <p className="text-xs text-red-400" role="alert">
              Failed to start analysis. Try again.
            </p>
          )}
        </div>
      )}

      {/* History modal */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent
          id={`analyticsAiHistoryModal_${sectionId}_analyticsPage`}
          side="right"
          className="w-full md:w-[480px] p-0"
          aria-label="Analysis history"
        >
          <SheetHeader className="px-6 py-4 border-b border-slate-100">
            <SheetTitle className="text-base font-semibold text-slate-800">
              Analysis History
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="px-6 py-4 space-y-6">
              {historyGroups.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No past analyses found.</p>
              ) : (
                historyGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      {group.label}
                    </p>
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <HistoryItem key={item.id} insight={item} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function HistoryItem({ insight }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-200"
        aria-expanded={expanded}
      >
        <p className="text-xs text-slate-500">
          {new Date(insight.created_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          <RoleInsight content={insight.content} />
        </div>
      )}
    </div>
  )
}
