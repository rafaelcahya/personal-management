'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchActivityInsight, requestInsightGeneration } from '@/lib/api/running'

function parseInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-slate-700">{part.slice(2, -2)}</strong>
      : part
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
        {header && (
          <p className="text-sm font-semibold text-slate-700 mb-1">{header}</p>
        )}
        {bodyParts.map((part, j) =>
          part.type === 'list' ? (
            <ul key={j} className="list-disc list-inside space-y-0.5 mb-1">
              {part.items.map((item, k) => (
                <li key={k} className="text-sm text-slate-600">{parseInline(item)}</li>
              ))}
            </ul>
          ) : (
            <p key={j} className="text-sm text-slate-600 mb-1">{parseInline(part.text)}</p>
          )
        )}
      </div>
    )
  })
}

export default function AIInsightCard({ activityId }) {
  const [insight, setInsight] = useState(undefined) // undefined = loading, null = no insight
  const [loadError, setLoadError] = useState(false)
  const [generating, setGenerating] = useState(false)
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

  // Auto-poll every 8s while pending
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

  async function handleGenerate() {
    setGenerating(true)
    setGenerateError(false)
    try {
      await requestInsightGeneration(activityId)
      setInsight({ status: 'pending', is_valid: true })
    } catch {
      setGenerateError(true)
    } finally {
      setGenerating(false)
    }
  }

  async function handleRefresh() {
    setInsight(undefined)
    await loadInsight()
  }

  const isValidInsight =
    insight &&
    insight.status === 'completed' &&
    insight.is_valid === true &&
    insight.content

  return (
    <div
      data-testid="aiInsightCard"
      className="border-l-4 border-purple-400 bg-slate-50 rounded-lg p-4"
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
        <div data-testid="aiInsightLoading" className="space-y-2">
          <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-slate-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-slate-200 rounded animate-pulse w-5/6" />
        </div>
      )}

      {/* Fetch error */}
      {loadError && (
        <div data-testid="aiInsightError" className="flex items-center gap-3">
          <p className="text-sm text-slate-400">Gagal memuat analisis</p>
          <Button
            data-testid="aiInsightRetry"
            variant="outline"
            size="sm"
            onClick={() => {
              setInsight(undefined)
              loadInsight()
            }}
          >
            Coba lagi
          </Button>
        </div>
      )}

      {/* No insight yet */}
      {!loadError && insight === null && (
        <div data-testid="aiInsightEmpty" className="text-center py-2">
          <p className="text-sm text-slate-400 mb-3">Belum ada analisis untuk aktivitas ini</p>
          {generateError && (
            <p className="text-xs text-red-400 mb-2">Gagal memulai analisis. Coba lagi.</p>
          )}
          <Button
            data-testid="aiInsightGenerateBtn"
            size="sm"
            onClick={handleGenerate}
            disabled={generating}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {generating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" aria-hidden="true" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            )}
            Analisis Aktivitas
          </Button>
        </div>
      )}

      {/* Pending / generating */}
      {!loadError && insight && insight.status === 'pending' && (
        <div data-testid="aiInsightPending" className="text-center py-2 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-purple-400" aria-hidden="true" />
            <span className="text-sm text-slate-600">Sedang dianalisis...</span>
          </div>
          <p className="text-xs text-slate-400">Biasanya &lt; 30 detik</p>
          <Button
            data-testid="aiInsightRetry"
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
        <div data-testid="aiInsightContent">
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
      )}

      {/* Completed but invalid — show empty state */}
      {!loadError &&
        insight &&
        insight.status === 'completed' &&
        !isValidInsight && (
          <div data-testid="aiInsightEmpty" className="text-center py-2">
            <p className="text-sm text-slate-400 mb-3">Belum ada analisis untuk aktivitas ini</p>
            <Button
              data-testid="aiInsightGenerateBtn"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {generating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" aria-hidden="true" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              )}
              Analisis Aktivitas
            </Button>
          </div>
        )}
    </div>
  )
}
