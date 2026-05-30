'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Footprints, Pencil, Check, X, AlertTriangle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchGear, updateGear } from '@/lib/api/running'
import { updateGearSchema } from '@/schemas/runningGear'

const CATEGORY_OPTIONS = ['daily', 'tempo', 'race', 'trail', 'recovery', 'cross-training']

// ─── progress bar ──────────────────────────────────────────────────────────────

function MileageBar({ distanceKm, retirementKm }) {
  if (!retirementKm) return null
  const pct = Math.min((distanceKm / retirementKm) * 100, 100)
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-violet-500'

  return (
    <div aria-label={`${Math.round(pct)}% of retirement threshold`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-slate-400">
          {distanceKm.toFixed(2)} km / {Number(retirementKm).toFixed(2)} km
        </span>
        <span
          className={`text-[10px] font-medium ${
            pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

// ─── inline edit form ──────────────────────────────────────────────────────────

function GearEditForm({ gear, onSave, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateGearSchema),
    defaultValues: {
      category: gear.category ?? null,
      retirement_km: gear.retirement_km ?? null,
    },
  })

  const selectedCategory = watch('category')

  async function onSubmit(values) {
    await onSave(gear.id, values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-3 flex flex-col gap-3"
      aria-label={`Edit ${gear.name}`}
    >
      {/* Category */}
      <div>
        <Label
          htmlFor={`gearCategoryInput-${gear.id}`}
          className="text-xs text-slate-600 mb-1 block"
        >
          Category
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setValue('category', selectedCategory === cat ? null : cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-400 hover:text-violet-600'
              }`}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setValue('category', null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              selectedCategory === null
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
            }`}
            aria-pressed={selectedCategory === null}
          >
            none
          </button>
        </div>
        {/* hidden input so register works */}
        <input type="hidden" {...register('category')} />
      </div>

      {/* Retirement km */}
      <div>
        <Label
          htmlFor={`gearRetirementKmInput-${gear.id}`}
          className="text-xs text-slate-600 mb-1 block"
        >
          Retire at (km)
        </Label>
        <Input
          id={`gearRetirementKmInput-${gear.id}`}
          type="number"
          min={0}
          max={100000}
          placeholder="e.g. 800"
          className="h-8 text-sm"
          aria-describedby={errors.retirement_km ? `retirementKmErr-${gear.id}` : undefined}
          {...register('retirement_km', {
            setValueAs: (v) => (v === '' || v == null ? null : Number(v)),
          })}
        />
        {errors.retirement_km && (
          <p id={`retirementKmErr-${gear.id}`} role="alert" className="mt-1 text-xs text-red-600">
            {errors.retirement_km.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="h-7 px-3 text-xs gap-1.5"
          id="gearSaveBtn"
          aria-label="Save gear settings"
        >
          {isSubmitting ? (
            <Loader2 className="size-3 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="size-3" aria-hidden="true" />
          )}
          Save
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isSubmitting}
          onClick={onCancel}
          className="h-7 px-3 text-xs gap-1.5 text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
          aria-label="Cancel editing"
        >
          <X className="size-3" aria-hidden="true" />
          Cancel
        </Button>
      </div>
    </form>
  )
}

// ─── single gear card ──────────────────────────────────────────────────────────

function GearCard({ gear, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const distanceKm = (gear.distance_m ?? 0) / 1000
  const stravaLimitKm =
    gear.notification_distance_m != null ? gear.notification_distance_m / 1000 : null
  const manualLimitKm = gear.retirement_km ?? null
  const hasAnyLimit = stravaLimitKm != null || manualLimitKm != null

  const [limitTab, setLimitTab] = useState(manualLimitKm != null ? 'manual' : 'strava')
  const activeLimitKm = limitTab === 'strava' ? stravaLimitKm : manualLimitKm
  const isNearRetirement = activeLimitKm != null && distanceKm / activeLimitKm >= 0.9

  async function handleSave(id, values) {
    setSaveError(null)
    try {
      const res = await updateGear(id, values)
      onUpdate(res.data)
      setEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Failed to save')
    }
  }

  return (
    <li
      id="gearCard"
      className={`rounded-xl border p-4 transition-colors ${
        gear.retired ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-slate-200 bg-white'
      }`}
      aria-label={gear.name}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`p-1.5 rounded-lg shrink-0 ${gear.retired ? 'bg-slate-100' : 'bg-violet-50'}`}
          >
            <Footprints
              className={`size-4 ${gear.retired ? 'text-slate-400' : 'text-violet-600'}`}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate" title={gear.name}>
              {gear.name}
            </p>
            {(gear.brand_name || gear.model_name) && (
              <p className="text-xs text-slate-400 truncate">
                {[gear.brand_name, gear.model_name].filter(Boolean).join(' ')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {gear.category && !gear.retired && (
            <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-medium capitalize">
              {gear.category}
            </span>
          )}
          {gear.retired && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
              Retired
            </span>
          )}
          {!gear.retired && (
            <button
              onClick={() => {
                setEditing((v) => !v)
                setSaveError(null)
              }}
              className="p-1 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
              aria-label={editing ? 'Close editor' : `Edit ${gear.name}`}
              aria-expanded={editing}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Distance + mileage bar */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-lg font-bold text-slate-800 tabular-nums">
            {distanceKm.toFixed(2)}
            <span className="text-xs font-normal text-slate-400 ml-1">km</span>
          </span>
          {hasAnyLimit && !gear.retired && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLimitTab('strava')}
                className={`px-2 py-0.5 rounded-l-full text-[10px] font-medium border transition-colors ${
                  limitTab === 'strava'
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-violet-400 hover:text-violet-600'
                }`}
                aria-pressed={limitTab === 'strava'}
              >
                Strava{stravaLimitKm != null ? ` · ${stravaLimitKm.toFixed(2)} km` : ' · —'}
              </button>
              <button
                type="button"
                onClick={() => setLimitTab('manual')}
                className={`px-2 py-0.5 rounded-r-full text-[10px] font-medium border-t border-b border-r transition-colors ${
                  limitTab === 'manual'
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-violet-400 hover:text-violet-600'
                }`}
                aria-pressed={limitTab === 'manual'}
              >
                Manual{manualLimitKm != null ? ` · ${Number(manualLimitKm).toFixed(2)} km` : ' · —'}
              </button>
            </div>
          )}
        </div>
        <MileageBar distanceKm={distanceKm} retirementKm={activeLimitKm} />
        {isNearRetirement && (
          <p
            className="mt-1 flex items-center gap-1 text-[10px] font-medium text-amber-600"
            role="alert"
            aria-label="Approaching retirement threshold"
          >
            <AlertTriangle className="size-3" aria-hidden="true" />
            Nearing limit
          </p>
        )}
      </div>

      {/* Save error */}
      {saveError && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {saveError}
        </p>
      )}

      {/* Edit form */}
      {editing && (
        <GearEditForm
          gear={gear}
          onSave={handleSave}
          onCancel={() => {
            setEditing(false)
            setSaveError(null)
          }}
        />
      )}
    </li>
  )
}

// ─── main export ───────────────────────────────────────────────────────────────

export default function ShoeRotation() {
  const [gearList, setGearList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchGear()
        setGearList(res.data ?? [])
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          window.location.href = '/login'
          return
        }
        setError(err.message || 'Failed to load gear')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleUpdate(updatedGear) {
    setGearList((prev) => prev.map((g) => (g.id === updatedGear.id ? { ...g, ...updatedGear } : g)))
  }

  const activeGear = gearList.filter((g) => !g.retired)
  const retiredGear = gearList.filter((g) => g.retired)

  return (
    <section
      id="gearPage"
      aria-label="Shoe Rotation"
      aria-live="polite"
      className="flex flex-col h-full"
    >
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Shoe Rotation
      </h2>

      <Card className="border border-slate-200/70 shadow-sm flex-1 py-4">
        <CardContent className="px-5">
          {loading && (
            <div id="gearLoadingSkeleton" aria-label="Loading gear" className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-slate-100 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Skeleton className="h-3.5 w-32 rounded" />
                      <Skeleton className="h-2.5 w-24 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div
              id="gearError"
              role="alert"
              className="flex flex-col items-center gap-2 py-6 text-center"
            >
              <AlertTriangle className="size-5 text-slate-400" aria-hidden="true" />
              <p className="text-sm text-slate-500">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  fetchGear()
                    .then((res) => setGearList(res.data ?? []))
                    .catch((err) => setError(err.message || 'Failed to load gear'))
                    .finally(() => setLoading(false))
                }}
                className="text-xs text-violet-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && gearList.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Footprints className="size-8 text-slate-300" aria-hidden="true" />
              <p className="text-sm text-slate-500">No shoes synced yet</p>
              <p className="text-xs text-slate-400">
                Connect Strava and sync to import your shoes automatically.
              </p>
            </div>
          )}

          {!loading && !error && gearList.length > 0 && (
            <div className="flex flex-col gap-6">
              {activeGear.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                    Active ({activeGear.length})
                  </p>
                  <ul
                    id="gearList"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3"
                    aria-label="Active shoes"
                  >
                    {activeGear.map((gear) => (
                      <GearCard key={gear.id} gear={gear} onUpdate={handleUpdate} />
                    ))}
                  </ul>
                </div>
              )}

              {retiredGear.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                    Retired ({retiredGear.length})
                  </p>
                  <ul
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3"
                    aria-label="Retired shoes"
                  >
                    {retiredGear.map((gear) => (
                      <GearCard key={gear.id} gear={gear} onUpdate={handleUpdate} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
