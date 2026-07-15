'use client'

import { useState } from 'react'
import { Flag, Plus, AlertTriangle } from 'lucide-react'

import Button from '@/components/base/Button/Button'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/base/EmptyState/EmptyState'
import UpcomingRaceCard from './UpcomingRaceCard'
import UpcomingRaceFormModal from './UpcomingRaceFormModal'

export default function UpcomingRacesSection({
  races,
  loading,
  error,
  onRetry,
  onAdd,
  onUpdated,
  onDeleted,
  onCompleted,
}) {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <section id="upcomingRacesSection_raceLogPage" aria-label="Upcoming races">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800">Upcoming Races</h2>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          aria-busy="true"
          aria-label="Loading upcoming races"
        >
          <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <AlertTriangle className="size-6 text-red-400" aria-hidden="true" />
          <p className="text-sm text-slate-600">{error}</p>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && races.length === 0 && (
        <EmptyState
          id="upcomingRacesEmptyState_raceLogPage"
          className="border border-slate-200/50 rounded-xl bg-white"
        >
          <EmptyStateIcon icon={Flag} className="text-violet-400 bg-violet-50 rounded-full p-2.5" />
          <EmptyStateTitle>No upcoming races</EmptyStateTitle>
          <EmptyStateDescription>
            Add a race you&apos;re planning to run and track your progress.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button onClick={() => setFormOpen(true)} className="flex items-center gap-1.5">
              <Plus className="size-4" aria-hidden="true" />
              Add upcoming race
            </Button>
          </EmptyStateActions>
        </EmptyState>
      )}

      {/* Race cards */}
      {!loading && !error && races.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {races.map((r) => (
            <UpcomingRaceCard
              key={r.id}
              race={r}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
              onCompleted={onCompleted}
            />
          ))}
        </div>
      )}

      <UpcomingRaceFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={(r) => {
          onAdd(r)
          setFormOpen(false)
        }}
        race={null}
      />
    </section>
  )
}
