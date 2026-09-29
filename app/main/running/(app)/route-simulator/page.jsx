'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Mountain, AlertCircle, Trash2, Eye, Pencil, Check, X as XIcon } from 'lucide-react'
import Card, {
  CardContent,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
} from '@/components/base/Card/Card'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import PageHeader from '@/app/main/components/PageHeader'
import SimulatorInput from './components/SimulatorInput'
import SimulationResult from './components/SimulationResult'
import { fmtDuration } from '../dashboard/utils/format'
import {
  fetchRouteSimulations,
  fetchRouteSimulation,
  previewRouteSimulation,
  saveRouteSimulation,
  updateRouteSimulation,
  deleteRouteSimulation,
  generateRouteStrategy,
} from '@/lib/api/running'

// numeric(...) columns can come back as strings from PostgREST — coerce the
// top-level fields the result view does maths on.
function normalize(row) {
  return {
    ...row,
    total_distance_m: Number(row.total_distance_m),
    total_elevation_gain_m: Number(row.total_elevation_gain_m),
    total_elevation_loss_m: Number(row.total_elevation_loss_m),
    effort_flat_pace_sec_per_km: Number(row.effort_flat_pace_sec_per_km),
    predicted_time_sec: Number(row.predicted_time_sec),
    suggested_time_sec: row.suggested_time_sec == null ? null : Number(row.suggested_time_sec),
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function SavedSimRow({ sim, onView, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(sim.name)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function confirmEdit() {
    const trimmed = editName.trim()
    if (!trimmed || trimmed === sim.name) return setEditing(false)
    setSaving(true)
    try {
      await onRename(sim.id, trimmed)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      id={`savedSim_${sim.id}_routeSimulatorPage`}
      className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0"
    >
      <div className="min-w-0 flex-1">
        {editing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmEdit()
              if (e.key === 'Escape') setEditing(false)
            }}
            maxLength={100}
            autoFocus
            className="h-auto py-1 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
          />
        ) : (
          <>
            <p className="truncate text-sm font-medium text-slate-800">{sim.name}</p>
            <p className="text-xs text-slate-400">
              {(Number(sim.total_distance_m) / 1000).toFixed(1)} km · +
              {Math.round(Number(sim.total_elevation_gain_m))} m ·{' '}
              {fmtDuration(sim.predicted_time_sec)}
              {!sim.is_realistic && ' · optimistic'} · {formatDate(sim.created_at)}
            </p>
          </>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <Button
              variant="ghost"
              size="xs"
              onClick={confirmEdit}
              disabled={saving || !editName.trim()}
              className="text-slate-400 hover:bg-green-50 hover:text-green-600"
              aria-label="Confirm rename"
            >
              <Check className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setEditing(false)}
              className="text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cancel rename"
            >
              <XIcon className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              id={`viewSimBtn_${sim.id}_routeSimulatorPage`}
              variant="ghost"
              size="xs"
              onClick={() => onView(sim.id)}
              className="text-slate-400 hover:bg-violet-50 hover:text-violet-600"
              aria-label={`View ${sim.name}`}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              id={`renameSimBtn_${sim.id}_routeSimulatorPage`}
              variant="ghost"
              size="xs"
              onClick={() => {
                setEditName(sim.name)
                setEditing(true)
              }}
              className="text-slate-400 hover:bg-violet-50 hover:text-violet-600"
              aria-label={`Rename ${sim.name}`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              id={`deleteSimBtn_${sim.id}_routeSimulatorPage`}
              variant="ghost"
              size="xs"
              onClick={async () => {
                setDeleting(true)
                try {
                  await onDelete(sim.id)
                } finally {
                  setDeleting(false)
                }
              }}
              disabled={deleting}
              className="text-slate-400 hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${sim.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default function RouteSimulatorPage() {
  const [result, setResult] = useState(null)
  const [simulationId, setSimulationId] = useState(null)
  const [aiStrategy, setAiStrategy] = useState(null)
  const [pendingPayload, setPendingPayload] = useState(null)

  const [simulating, setSimulating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [strategyLoading, setStrategyLoading] = useState(false)
  const [strategyError, setStrategyError] = useState(null)

  const [sims, setSims] = useState(null)
  const [simsLoading, setSimsLoading] = useState(true)
  const [simsError, setSimsError] = useState(null)

  const loadSims = useCallback(async () => {
    setSimsLoading(true)
    setSimsError(null)
    try {
      setSims(await fetchRouteSimulations())
    } catch (err) {
      setSimsError(err.message)
    } finally {
      setSimsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSims()
  }, [loadSims])

  async function handleSimulate(payload) {
    setSimulating(true)
    try {
      const data = await previewRouteSimulation(payload)
      setResult(data)
      setSimulationId(null)
      setAiStrategy(null)
      setStrategyError(null)
      setPendingPayload(payload)
    } catch (err) {
      toast.error(err.message || 'Failed to simulate route')
    } finally {
      setSimulating(false)
    }
  }

  async function handleSave(name) {
    if (!pendingPayload || !name) return
    setSaving(true)
    try {
      const saved = await saveRouteSimulation({ ...pendingPayload, name })
      setSimulationId(saved.id)
      setAiStrategy(saved.ai_strategy ?? null)
      toast.success('Simulation saved')
      loadSims()
    } catch (err) {
      toast.error(err.message || 'Failed to save simulation')
    } finally {
      setSaving(false)
    }
  }

  async function handleView(id) {
    try {
      const row = await fetchRouteSimulation(id)
      setResult(normalize(row))
      setSimulationId(row.id)
      setAiStrategy(row.ai_strategy ?? null)
      setStrategyError(null)
      setPendingPayload(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(err.message || 'Failed to open simulation')
    }
  }

  async function handleGenerateStrategy() {
    if (!simulationId) return
    setStrategyLoading(true)
    setStrategyError(null)
    try {
      setAiStrategy(await generateRouteStrategy(simulationId))
    } catch (err) {
      setStrategyError(err.message || 'Failed to generate strategy')
    } finally {
      setStrategyLoading(false)
    }
  }

  async function handleRename(id, name) {
    try {
      const updated = await updateRouteSimulation(id, { name })
      setSims((prev) => prev.map((s) => (s.id === id ? { ...s, name: updated.name } : s)))
      toast.success('Renamed')
    } catch (err) {
      toast.error(err.message || 'Failed to rename')
      throw err
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRouteSimulation(id)
      setSims((prev) => prev.filter((s) => s.id !== id))
      if (simulationId === id) {
        setResult(null)
        setSimulationId(null)
      }
      toast.success('Simulation deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <main id="routeSimulatorPage" className="space-y-6">
      <PageHeader
        title="Route Simulator"
        description="Plan even-effort pacing for a hilly route — upload a GPX or reuse a past run"
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Route Simulator' },
        ]}
      />

      <Card as="section" aria-label="Route Simulator" id="simulatorInputCard_routeSimulatorPage">
        <CardHeader>
          <CardIcon icon={Mountain} />
          <CardHeaderContent>
            <CardTitle>Route Simulator</CardTitle>
            <CardDescription>
              Set a route and a target — get a per-km plan that keeps your effort even across the
              climbs
            </CardDescription>
          </CardHeaderContent>
        </CardHeader>
        <CardContent className="space-y-6">
          <SimulatorInput onSimulate={handleSimulate} simulating={simulating} />
          {result && (
            <SimulationResult
              result={result}
              simulationId={simulationId}
              aiStrategy={aiStrategy}
              onSave={handleSave}
              saving={saving}
              onGenerateStrategy={handleGenerateStrategy}
              strategyLoading={strategyLoading}
              strategyError={strategyError}
            />
          )}
        </CardContent>
      </Card>

      <Card
        as="section"
        aria-label="Saved Simulations"
        id="savedSimulationsCard_routeSimulatorPage"
      >
        <CardHeader>
          <CardHeaderContent>
            <CardTitle>Saved Simulations</CardTitle>
          </CardHeaderContent>
        </CardHeader>
        <CardContent>
          {simsLoading && (
            <div id="savedSimulationsLoading_routeSimulatorPage" className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3 w-52 rounded" />
                  </div>
                  <Skeleton className="size-7 rounded" />
                </div>
              ))}
            </div>
          )}

          {simsError && (
            <div
              id="savedSimulationsError_routeSimulatorPage"
              className="flex flex-col items-center gap-2 py-6 text-center"
            >
              <AlertCircle className="size-5 text-red-400" />
              <p className="text-sm text-slate-500">{simsError}</p>
              <Button variant="ghost" onClick={loadSims} className="text-violet-600">
                Retry
              </Button>
            </div>
          )}

          {!simsLoading && !simsError && sims?.length === 0 && (
            <p
              id="savedSimulationsEmpty_routeSimulatorPage"
              className="py-6 text-center text-sm text-slate-400"
            >
              No saved simulations yet — run one above and save it.
            </p>
          )}

          {!simsLoading && !simsError && sims?.length > 0 && (
            <div id="savedSimulationsList_routeSimulatorPage">
              {sims.map((sim) => (
                <SavedSimRow
                  key={sim.id}
                  sim={sim}
                  onView={handleView}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
