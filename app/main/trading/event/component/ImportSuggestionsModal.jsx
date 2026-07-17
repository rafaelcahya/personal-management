'use client'

import { useEffect, useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'
import {
  AlertTriangle,
  CalendarDays,
  Download,
  Loader2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/base/Badge/Badge'
import Button from '@/components/base/Button/Button'
import { Checkbox } from '@/components/base/Checkbox/Checkbox'
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/base/EmptyState/EmptyState'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalTitle,
  ModalTrigger,
} from '@/components/base/Modal/Modal.jsx'
import { createEvent, fetchImportSuggestions } from '@/lib/api/event'
import { toast } from 'sonner'

export default function ImportSuggestionsModal({ onImported }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [importing, setImporting] = useState(false)
  const hasFetchedRef = useRef(false)

  // Background fetch on mount for button badge
  useEffect(() => {
    fetchImportSuggestions()
      .then((data) => {
        setSuggestions(data)
        hasFetchedRef.current = true
      })
      .catch(() => {
        hasFetchedRef.current = true
      })
  }, [])

  useEffect(() => {
    if (!open) return
    setSelected(new Set())
    setError(null)
    if (hasFetchedRef.current) return
    setLoading(true)
    fetchImportSuggestions()
      .then((data) => setSuggestions(data))
      .catch((err) => setError(err.message || 'Failed to fetch suggestions'))
      .finally(() => setLoading(false))
  }, [open])

  function toggleItem(key) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === suggestions.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(suggestions.map((s) => s.key)))
    }
  }

  async function handleImport() {
    const toImport = suggestions.filter((s) => selected.has(s.key))
    if (toImport.length === 0) return

    setImporting(true)
    let successCount = 0
    let failCount = 0

    for (const item of toImport) {
      try {
        await createEvent({
          title: item.title,
          event_description: item.event_description || '',
          impact_direction: item.impact_direction,
          actual_outcome: null,
          event_date: item.event_date,
          tags: item.tags,
          links: item.links,
        })
        successCount++
      } catch {
        failCount++
      }
    }

    setImporting(false)
    setOpen(false)

    if (successCount > 0) {
      toast.success(`${successCount} event${successCount > 1 ? 's' : ''} imported successfully`)
      onImported?.()
    }
    if (failCount > 0) {
      toast.error(`${failCount} event${failCount > 1 ? 's' : ''} failed to import`)
    }
  }

  const allSelected = suggestions.length > 0 && selected.size === suggestions.length
  const someSelected = selected.size > 0 && !allSelected

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button
          id="importSuggestionsBtn_eventPage"
          variant="outline"
          className="gap-1.5 text-xs text-violet-600 border-violet-200 hover:bg-violet-50"
        >
          <Download className="size-3.5" />
          Import suggestions
          {suggestions.length > 0 && (
            <Badge size="xs" className="bg-violet-600 text-white border-transparent">
              {suggestions.length} new
            </Badge>
          )}
        </Button>
      </ModalTrigger>

      <ModalContent className="max-w-lg">
        <ModalHeader layout="beside">
          <ModalIcon icon={CalendarDays} />
          <ModalHeaderContent>
            <ModalTitle>Import Event Suggestions</ModalTitle>
            <ModalDescription>
              Upcoming earnings and macro events from Finnhub. Select what to add.
            </ModalDescription>
          </ModalHeaderContent>
        </ModalHeader>

        <ModalBody>
          {loading && (
            <div
              id="importSuggestionsLoading_eventPage"
              className="flex flex-col items-center justify-center py-10 gap-3"
            >
              <Loader2 className="size-6 text-violet-500 animate-spin" />
              <p className="text-sm text-slate-500">Fetching upcoming events…</p>
            </div>
          )}

          {!loading && error && (
            <div
              id="importSuggestionsError_eventPage"
              className="flex flex-col items-center justify-center py-10 gap-3 text-center"
            >
              <AlertTriangle className="size-6 text-red-400" />
              <p className="text-sm text-slate-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLoading(true)
                  setError(null)
                  fetchImportSuggestions()
                    .then((data) => setSuggestions(data))
                    .catch((err) => setError(err.message || 'Failed to fetch suggestions'))
                    .finally(() => setLoading(false))
                }}
              >
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <EmptyState id="importSuggestionsEmpty_eventPage" size="sm">
              <EmptyStateIcon icon={CalendarDays} />
              <EmptyStateTitle>No upcoming events found</EmptyStateTitle>
              <EmptyStateDescription>
                No earnings or macro events found for your tickers in the next 30 days.
              </EmptyStateDescription>
            </EmptyState>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <div className="flex flex-col gap-2">
              {/* Select all row */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={someSelected ? 'indeterminate' : allSelected}
                    onCheckedChange={toggleAll}
                  />
                  <span className="text-xs font-medium text-slate-600">
                    {allSelected ? 'Deselect all' : 'Select all'} ({suggestions.length})
                  </span>
                </label>
                {selected.size > 0 && (
                  <span className="text-xs text-violet-600 font-medium">
                    {selected.size} selected
                  </span>
                )}
              </div>

              {/* Suggestion list */}
              <div
                id="importSuggestionsList_eventPage"
                className="flex flex-col gap-1 max-h-72 overflow-y-auto -mx-1 px-1"
              >
                {suggestions.map((s) => (
                  <label
                    key={s.key}
                    id={`importSuggestionItem_${s.key}_eventPage`}
                    className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <Checkbox
                      checked={selected.has(s.key)}
                      onCheckedChange={() => toggleItem(s.key)}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {s.title}
                        </span>
                        {s.type === 'earnings' ? (
                          <Badge
                            size="xs"
                            className="bg-violet-100 text-violet-700 border-transparent uppercase tracking-wide"
                          >
                            Earnings
                          </Badge>
                        ) : (
                          <Badge
                            size="xs"
                            className="bg-blue-100 text-blue-700 border-transparent uppercase tracking-wide"
                          >
                            Macro
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">
                          {format(parseISO(s.event_date), 'dd MMM yyyy')}
                        </span>
                        <span className="text-slate-200">·</span>
                        {s.impact_direction === 'UP' ? (
                          <Badge
                            size="xs"
                            className="bg-green-50 text-green-600 border-transparent gap-0.5"
                          >
                            <TrendingUp />
                            Bullish
                          </Badge>
                        ) : (
                          <Badge
                            size="xs"
                            className="bg-red-50 text-red-500 border-transparent gap-0.5"
                          >
                            <TrendingDown />
                            Bearish
                          </Badge>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline" disabled={importing}>
              Cancel
            </Button>
          </ModalClose>
          <Button
            id="importSelectedBtn_eventPage"
            onClick={handleImport}
            disabled={selected.size === 0 || importing}
          >
            {importing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Importing…
              </>
            ) : (
              `Import ${selected.size > 0 ? selected.size : ''} selected`
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
