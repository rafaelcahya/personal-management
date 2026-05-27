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

function parseInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-slate-700">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  )
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
        {header && <p className="text-sm font-semibold text-slate-700 mb-1">{header}</p>}
        {bodyParts.map((part, j) =>
          part.type === 'list' ? (
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

function FocusButtons({ onSelect, generating, activeFocus, variant = 'primary' }) {
  const buttons = variant === 'followup' ? FOLLOWUP_BUTTONS : FOCUS_BUTTONS
  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map(({ focus, label, icon: Icon }) => (
        <button
          key={focus}
          id={`aiInsightGenerateBtn_${focus}_activityDetailPage`}
          onClick={() => onSelect(focus)}
          disabled={generating === focus}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-60
            ${
              variant === 'primary'
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
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
      ))}
    </div>
  )
}

export default function AIInsightCard({ activityId }) {
  const [insight, setInsight] = useState(undefined)
  const [loadError, setLoadError] = useState(false)
  const [generating, setGenerating] = useState(null) // focus string or null
  const [generateError, setGenerateError] = useState(false)
  const pollRef = useRef(null)

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
      return
    }
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      const data = await fetchActivityInsight(activityId).catch(() => null)
      if (data && data.status !== 'pending') {
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
    }
  }, [loadInsight])

  async function handleGenerate(focus) {
    setGenerating(focus)
    setGenerateError(false)
    try {
      await requestInsightGeneration(activityId, focus)
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

  const isValidInsight =
    insight && insight.status === 'completed' && insight.is_valid === true && insight.content

  const currentFocus = insight?.data_refs?.focus
  const focusLabel = currentFocus ? FOCUS_LABELS[currentFocus] : null

  return (
    <div
      id="aiInsightCard_activityDetailPage"
      className="bg-white rounded-lg p-4 border-l-4 border-purple-400"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-purple-400" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-700">AI Coach</span>
        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
          BETA
        </span>
      </div>

      {/* Loading */}
      {insight === undefined && !loadError && (
        <div id="aiInsightLoading_activityDetailPage" className="space-y-2">
          <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-slate-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-slate-200 rounded animate-pulse w-5/6" />
        </div>
      )}

      {/* Fetch error */}
      {loadError && (
        <div id="aiInsightError_activityDetailPage" className="flex items-center gap-3">
          <p className="text-sm text-slate-400">Failed to load analysis</p>
          <Button
            id="aiInsightRetry_activityDetailPage"
            variant="outline"
            size="sm"
            onClick={() => {
              setInsight(undefined)
              loadInsight()
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {/* No insight yet — show focus buttons */}
      {!loadError && insight === null && (
        <div id="aiInsightEmpty_activityDetailPage" className="space-y-3">
          <p className="text-sm text-slate-400">Choose analysis focus:</p>
          {generateError && (
            <p className="text-xs text-red-400">Failed to start analysis. Try again.</p>
          )}
          <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
        </div>
      )}

      {/* Pending / generating */}
      {!loadError && insight && insight.status === 'pending' && (
        <div id="aiInsightPending_activityDetailPage" className="text-center py-2 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-purple-400" aria-hidden="true" />
            <span className="text-sm text-slate-600">Analyzing...</span>
          </div>
          <p className="text-xs text-slate-400">Usually &lt; 30 seconds</p>
          <Button
            id="aiInsightRetry_activityDetailPage"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      )}

      {/* Has valid insight */}
      {isValidInsight && (
        <div id="aiInsightContent_activityDetailPage" className="space-y-4">
          <div>
            {focusLabel && (
              <span className="inline-block text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium mb-2">
                {focusLabel}
              </span>
            )}
            <div className="prose-sm">{renderMarkdown(insight.content)}</div>
            {insight.created_at && (
              <p className="text-xs text-slate-400 mt-3">
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

          <div className="border-t border-slate-200 pt-3 space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Re-analyze with different focus
            </p>
            {generateError && (
              <p className="text-xs text-red-400">Failed to start analysis. Try again.</p>
            )}
            <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Ask more</p>
            <FocusButtons onSelect={handleGenerate} generating={generating} variant="followup" />
          </div>
        </div>
      )}

      {/* Completed but invalid */}
      {!loadError && insight && insight.status === 'completed' && !isValidInsight && (
        <div id="aiInsightEmpty_activityDetailPage" className="space-y-3">
          <p className="text-sm text-slate-400">Choose analysis focus:</p>
          <FocusButtons onSelect={handleGenerate} generating={generating} variant="primary" />
        </div>
      )}
    </div>
  )
}
