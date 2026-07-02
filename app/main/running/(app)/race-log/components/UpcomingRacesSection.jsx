'use client'

import { useState } from 'react'
import { Flag, Plus, AlertTriangle } from 'lucide-react'

import Button from '@/components/base/Button/Button'
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
          <Button variant="outline" size="base" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && races.length === 0 && (
        <div
          id="upcomingRacesEmptyState_raceLogPage"
          className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-slate-200/50 rounded-xl bg-white"
        >
          <div className="flex items-center justify-center size-12 rounded-full bg-violet-50">
            <Flag className="size-6 text-violet-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">No upcoming races</p>
            <p className="text-xs text-slate-400 mt-1">
              Add a race you&apos;re planning to run and track your progress.
            </p>
          </div>
          <Button
            size="base"
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add upcoming race
          </Button>
        </div>
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
