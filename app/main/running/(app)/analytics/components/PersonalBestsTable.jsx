'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/base/Button/Button'
import { useRouter } from 'next/navigation'
import { Trophy } from 'lucide-react'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { fetchPersonalBests } from '@/lib/api/running'

const DISTANCES = ['1 mile', '5K', '10K', '15K', 'Half-Marathon']

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(paceSec) {
  if (paceSec == null) return '—'
  const m = Math.floor(paceSec / 60)
  const s = paceSec % 60
  return `${m}:${String(s).padStart(2, '0')} /km`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function DistanceColumn({ distance, entries, onRowClick }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-2 border-b border-slate-100">
          {distance}
        </div>
        <div className="px-3 py-3 text-sm text-slate-400">—</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-2 border-b border-slate-100">
        {distance}
      </div>
      {entries.map((entry) => {
        const isPR = entry.rank === 1
        const distanceKey = distance.replace(/\s+/g, '-')
        return (
          <Button
            key={entry.rank}
            id={`personalBestsRow_${distanceKey}_${entry.rank}_analyticsPage`}
            variant="ghost"
            fullWidth
            onClick={() => entry.activity_id && onRowClick(entry.activity_id)}
            className={`flex-col items-start gap-0.5 px-3 py-2.5 h-auto hover:bg-slate-50 border-b border-slate-50 last:border-b-0 ${
              isPR ? 'bg-amber-50 hover:bg-amber-100' : ''
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isPR && <Trophy size={12} className="text-amber-500 shrink-0" />}
              <span
                className={`text-sm font-semibold ${isPR ? 'text-amber-700' : 'text-slate-800'}`}
              >
                {formatTime(entry.elapsed_time_sec)}
              </span>
            </div>
            <span className="text-xs text-slate-500">{formatPace(entry.pace_sec_per_km)}</span>
            <span className="text-xs text-slate-400">{formatDate(entry.date)}</span>
          </Button>
        )
      })}
    </div>
  )
}

export default function PersonalBestsTable() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchPersonalBests()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError('Failed to load personal bests')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div
        id="personalBestsLoading_analyticsPage"
        className="flex gap-2"
        aria-label="Loading personal bests"
      >
        {DISTANCES.map((d) => (
          <Skeleton key={d} className="h-40 flex-1 rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        id="personalBestsError_analyticsPage"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-4"
        role="alert"
      >
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div
      id="personalBestsTable_analyticsPage"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100"
    >
      {DISTANCES.map((distance) => (
        <div key={distance} className="bg-white">
          <DistanceColumn
            distance={distance}
            entries={data?.[distance] ?? []}
            onRowClick={(activityId) => router.push(`/main/running/activities/${activityId}`)}
          />
        </div>
      ))}
    </div>
  )
}
