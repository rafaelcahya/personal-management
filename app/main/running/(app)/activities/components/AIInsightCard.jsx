'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Sparkles,
  Loader2,
  Zap,
  Heart,
  Trophy,
  Footprints,
  BookOpen,
  Activity,
  BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchActivityInsight, requestInsightGeneration } from '@/lib/api/running'

const FOCUS_BUTTONS = [
  { focus: 'performance', label: 'Performance & Pace', icon: Zap },
  { focus: 'recovery', label: 'Recovery & Load', icon: Heart },
  { focus: 'next_race', label: 'Race Tips', icon: Trophy },
  { focus: 'next_training', label: 'Next Training', icon: Footprints },
]

const FOLLOWUP_BUTTONS = [
  { focus: 'detail_training', label: 'Training Plan', icon: BookOpen },
  { focus: 'zone_analysis', label: 'HR Zone Analysis', icon: Activity },
  { focus: 'compare_baseline', label: 'Compare Baseline', icon: BarChart2 },
]

const FOCUS_LABELS = {
  general: 'General',
  performance: 'Performance & Pace',
  recovery: 'Recovery & Load',
  next_race: 'Race Tips',
  next_training: 'Next Training',
  detail_training: 'Training Plan',
  zone_analysis: 'HR Zone Analysis',
  compare_baseline: 'Compare Baseline',
}

const PENDING_STATUS_COPY = [
  { maxSec: 5, text: 'Reading your run data...' },
  { maxSec: 15, text: 'Analyzing pace, HR zones, and splits...' },
  { maxSec: 30, text: 'Writing your coaching insights...' },
  { maxSec: Infinity, text: 'Almost done — final touches...' },
]

function getPendingStatusCopy(elapsedSec) {
  return (
    PENDING_STATUS_COPY.find((s) => elapsedSec < s.maxSec)?.text ?? 'Almost done — final touches...'
  )
}

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

function FocusButtons({ onSelect, generating, variant = 'primary', selected = null }) {
  const buttons = variant === 'followup' ? FOLLOWUP_BUTTONS : FOCUS_BUTTONS
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0"
      style={{ scrollbarWidth: 'none' }}
    >
      {buttons.map(({ focus, label, icon: Icon }) => {
        const isSelected = selected === focus
        return (
          <button
            key={focus}
            id={`aiInsightGenerateBtn_${focus}_activityDetailPage`}
            onClick={() => onSelect(focus)}
            disabled={generating === focus}
            className={`flex flex-shrink-0 items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-60
              ${
                variant === 'primary'
                  ? isSelected
                    ? 'bg-violet-600 text-white'
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            {generating === focus ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              <Icon className="h-3 w-3" aria-hidden="true" />
            )}
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function AIInsightCard({ activityId }) {
  const [insight, setInsight] = useState(undefined)
  const [loadError, setLoadError] = useState(false)
  const [generating, setGenerating] = useState(null)
  const [generateError, setGenerateError] = useState(false)
  const [selectedFocus, setSelectedFocus] = useState(null)
  const [pendingElapsed, setPendingElapsed] = useState(0)
  const [longWait, setLongWait] = useState(false)
  const pollRef = useRef(null)
  const pollCountRef = useRef(0)
  const baselineIdRef = useRef(null)
  const pendingStartRef = useRef(null)
  const pendingTimerRef = useRef(null)
  const longWaitTimerRef = useRef(null)

  const loadInsight = useCallback(async () => {
    setLoadError(false)
    try {
      const data = await fetchActivityInsight(activityId)
      setInsight(data)
      return data
    } catch {
      setLoadError(true)
      setInsight(null)
      return null
    }
  }, [activityId])

  useEffect(() => {
    const isPending = insight && insight.status === 'pending'
    if (!isPending) {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      if (pendingTimerRef.current) {
        clearInterval(pendingTimerRef.current)
        pendingTimerRef.current = null
      }
      if (longWaitTimerRef.current) {
        clearTimeout(longWaitTimerRef.current)
        longWaitTimerRef.current = null
      }
      setPendingElapsed(0)
      setLongWait(false)
      return
    }

    if (!pendingStartRef.current) pendingStartRef.current = Date.now()
    if (!pendingTimerRef.current) {
      pendingTimerRef.current = setInterval(() => {
        setPendingElapsed(Math.floor((Date.now() - pendingStartRef.current) / 1000))
      }, 1000)
    }
    if (!longWaitTimerRef.current) {
      longWaitTimerRef.current = setTimeout(() => setLongWait(true), 60000)
    }

    if (pollRef.current) return
    pollCountRef.current = 0
    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1
      const data = await fetchActivityInsight(activityId).catch(() => null)
      const isNewResult =
        data &&
        data.status === 'completed' &&
        data.is_valid === true &&
        data.id !== baselineIdRef.current
      const timedOut = pollCountRef.current >= 15
      if (isNewResult || timedOut) {
        setInsight(data)
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }, 8000)

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [insight, activityId])

  useEffect(() => {
    loadInsight()
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      if (pendingTimerRef.current) {
        clearInterval(pendingTimerRef.current)
        pendingTimerRef.current = null
      }
      if (longWaitTimerRef.current) {
        clearTimeout(longWaitTimerRef.current)
        longWaitTimerRef.current = null
      }
    }
  }, [loadInsight])

  async function handleGenerate(focus) {
    baselineIdRef.current = insight?.id ?? null
    pendingStartRef.current = null
    setGenerating(focus)
    setGenerateError(false)
    setLongWait(false)
    try {
      await requestInsightGeneration(activityId, focus, {})
      setSelectedFocus(null)
      setInsight({ status: 'pending', is_valid: true })
    } catch {
      setGenerateError(true)
    } finally {
      setGenerating(null)
    }
  }

  async function handleRefresh() {
    setInsight(undefined)
    await loadInsight()
  }

  const isGenerating = generating !== null
  const isValidInsight =
    insight && insight.status === 'completed' && insight.is_valid === true && insight.content
  const currentFocus = insight?.data_refs?.focus
  const focusLabel = currentFocus ? FOCUS_LABELS[currentFocus] : null

  const isPending = !loadError && insight && insight.status === 'pending'
  const statusCopy = getPendingStatusCopy(pendingElapsed)

  return (
    <div
      id="aiInsightCard_activityDetailPage"
      className="space-y-4"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={isPending}
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 flex-shrink-0">
          <Sparkles className="h-4 w-4 text-violet-600" aria-hidden="true" />
        </span>
        <span className="text-base font-semibold text-slate-800">AI Coach</span>
        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
          BETA
        </span>
      </div>

      {/* Loading skeleton */}
      {insight === undefined && !loadError && (
        <div
          id="aiInsightLoading_activityDetailPage"
          className="space-y-3 animate-pulse motion-reduce:animate-none"
        >
          <div className="h-5 w-28 bg-violet-100 rounded-full" />
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 rounded w-2/5" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-3/4" />
          </div>
        </div>
      )}

      {/* Fetch error */}
      {loadError && (
        <div id="aiInsightError_activityDetailPage" className="flex items-center gap-3">
          <p className="text-sm text-slate-400">Could not load analysis.</p>
          <Button
            id="aiInsightRetry_activityDetailPage"
            variant="ghost"
            size="sm"
            className="text-violet-600 hover:text-violet-700 px-0 h-auto font-normal"
            onClick={() => {
              setInsight(undefined)
              loadInsight()
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {/* No insight yet */}
      {!loadError && insight === null && (
        <div id="aiInsightEmpty_activityDetailPage" className="space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-slate-500">
              Choose a focus to get AI-powered coaching insights for this run.
            </p>
          </div>
          <FocusButtons
            onSelect={setSelectedFocus}
            generating={generating}
            variant="primary"
            selected={selectedFocus}
          />
          {generateError && (
            <p className="text-xs text-red-400">Failed to start analysis. Try again.</p>
          )}
          {selectedFocus && (
            <Button
              id="aiInsightGetRecommendationBtn_activityDetailPage"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white focus-visible:ring-2 focus-visible:ring-violet-200"
              disabled={isGenerating}
              onClick={() => handleGenerate(selectedFocus)}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                  Analyzing...
                </>
              ) : (
                'Get Recommendation'
              )}
            </Button>
          )}
        </div>
      )}

      {/* Pending / generating */}
      {isPending && (
        <div id="aiInsightPending_activityDetailPage" className="space-y-3">
          <div
            id="aiInsightPendingBar_activityDetailPage"
            className="h-1 w-full bg-violet-100 rounded-full overflow-hidden"
          >
            <div className="h-full w-1/2 bg-violet-300 rounded-full animate-pulse motion-reduce:animate-none" />
          </div>
          <p
            id="aiInsightPendingStatus_activityDetailPage"
            className="text-sm text-slate-500 italic motion-reduce:not-italic"
          >
            {statusCopy}
          </p>
          <div
            id="aiInsightPendingSkeleton_activityDetailPage"
            className="space-y-3 animate-pulse motion-reduce:animate-none"
          >
            <div className="h-5 w-28 bg-violet-100 rounded-full" />
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
              <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-2/5" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
          {longWait && (
            <div id="aiInsightLongWaitHint_activityDetailPage" className="flex items-center gap-2">
              <p className="text-xs text-slate-400">This is taking longer than usual.</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-600 hover:text-violet-700 px-0 h-auto font-normal text-xs"
                onClick={handleRefresh}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Has valid insight */}
      {isValidInsight && (
        <div id="aiInsightContent_activityDetailPage" className="space-y-4">
          <div>
            {focusLabel && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-medium mb-3">
                {focusLabel}
              </span>
            )}
            <div className="prose-sm">{renderMarkdown(insight.content)}</div>
          </div>

          <div className="bg-white/60 border border-violet-100 rounded-lg p-3 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Analyze with a different focus
              </p>
              {generateError && (
                <p className="text-xs text-red-400">Failed to start analysis. Try again.</p>
              )}
              <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
            </div>

            <div className="space-y-2 border-t border-violet-100 pt-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Ask more</p>
              <FocusButtons onSelect={handleGenerate} generating={generating} variant="followup" />
            </div>
          </div>

          {insight.created_at && (
            <p className="text-xs text-slate-400">
              {new Date(insight.created_at).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      )}

      {/* Completed but invalid */}
      {!loadError && insight && insight.status === 'completed' && !isValidInsight && (
        <div id="aiInsightInvalid_activityDetailPage" className="space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-slate-500">
              Choose a focus to get AI-powered coaching insights for this run.
            </p>
          </div>
          <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
        </div>
      )}
    </div>
  )
}
