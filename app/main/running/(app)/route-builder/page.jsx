'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Map, Trash2, AlertCircle, Eye, Pencil, Check, X as XIcon } from 'lucide-react'
import { toast } from 'sonner'
import polyline from '@mapbox/polyline'
import Card, {
  CardContent,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
} from '@/components/base/Card/Card'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import Input from '@/components/base/Input/Input'
import RouteStats from './components/RouteStats'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalHeaderContent,
  ModalTitle,
  ModalBody,
} from '@/components/base/Modal/Modal'
import { totalDistance } from '@/lib/running/geo'
import { fetchSavedRoutes, saveRoute, deleteSavedRoute, updateSavedRoute } from '@/lib/api/running'

const RouteBuilderMap = dynamic(() => import('./components/RouteBuilderMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full rounded-xl" style={{ height: 420 }} />,
})

const RouteMap = dynamic(() => import('@/app/main/running/(app)/activities/components/RouteMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full rounded-xl" style={{ height: 480 }} />,
})

function formatDistance(m) {
  return (m / 1000).toFixed(2) + ' km'
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function SavedRouteRow({ route, onDelete, onView, onRename }) {
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(route.name)
  const [saving, setSaving] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(route.id)
    } finally {
      setDeleting(false)
    }
  }

  function startEdit() {
    setEditName(route.name)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setEditName(route.name)
  }

  async function confirmEdit() {
    const trimmed = editName.trim()
    if (!trimmed || trimmed === route.name) {
      cancelEdit()
      return
    }
    setSaving(true)
    try {
      await onRename(route.id, trimmed)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') confirmEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  return (
    <div
      id={`savedRoute_${route.id}_routeBuilderPage`}
      className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0"
    >
      <div className="min-w-0 flex-1">
        {editing ? (
          <Input
            id={`editRouteNameInput_${route.id}_routeBuilderPage`}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
            autoFocus
            className="h-auto py-1 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
          />
        ) : (
          <>
            <p className="text-sm font-medium text-slate-800 truncate">{route.name}</p>
            <p className="text-xs text-slate-400">
              {formatDistance(route.distance_m)} · {formatDate(route.created_at)}
            </p>
          </>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {editing ? (
          <>
            <Button
              id={`confirmRenameBtn_${route.id}_routeBuilderPage`}
              variant="ghost"
              size="xs"
              onClick={confirmEdit}
              disabled={saving || !editName.trim()}
              className="text-slate-400 hover:text-green-600 hover:bg-green-50"
              aria-label="Confirm rename"
            >
              <Check className="size-4" />
            </Button>
            <Button
              id={`cancelRenameBtn_${route.id}_routeBuilderPage`}
              variant="ghost"
              size="xs"
              onClick={cancelEdit}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Cancel rename"
            >
              <XIcon className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              id={`viewRouteBtn_${route.id}_routeBuilderPage`}
              variant="ghost"
              size="xs"
              onClick={() => onView(route)}
              className="text-slate-400 hover:text-violet-600 hover:bg-violet-50"
              aria-label={`View route ${route.name}`}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              id={`renameRouteBtn_${route.id}_routeBuilderPage`}
              variant="ghost"
              size="xs"
              onClick={startEdit}
              className="text-slate-400 hover:text-violet-600 hover:bg-violet-50"
              aria-label={`Rename route ${route.name}`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              id={`deleteRouteBtn_${route.id}_routeBuilderPage`}
              variant="ghost"
              size="xs"
              onClick={handleDelete}
              disabled={deleting}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50"
              aria-label={`Delete route ${route.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default function RouteBuilderPage() {
  const [waypoints, setWaypoints] = useState([])
  const [routeName, setRouteName] = useState('')
  const [saving, setSaving] = useState(false)

  const [routes, setRoutes] = useState(null)
  const [routesLoading, setRoutesLoading] = useState(true)
  const [routesError, setRoutesError] = useState(null)
  const [viewingRoute, setViewingRoute] = useState(null)

  const distanceM = useMemo(() => Math.round(totalDistance(waypoints)), [waypoints])

  const loadRoutes = useCallback(async () => {
    setRoutesLoading(true)
    setRoutesError(null)
    try {
      const data = await fetchSavedRoutes()
      setRoutes(data)
    } catch (err) {
      setRoutesError(err.message)
    } finally {
      setRoutesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoutes()
  }, [loadRoutes])

  function handleUndo() {
    setWaypoints((prev) => prev.slice(0, -1))
  }

  function handleClear() {
    setWaypoints([])
  }

  async function handleSave() {
    if (waypoints.length < 2 || !routeName.trim()) return
    setSaving(true)
    try {
      const encoded = polyline.encode(waypoints)
      const saved = await saveRoute({
        name: routeName.trim(),
        waypoints,
        encoded_polyline: encoded,
        distance_m: distanceM,
      })
      toast.success('Route saved!')
      setRoutes((prev) => [saved, ...(prev ?? [])])
      setWaypoints([])
      setRouteName('')
    } catch (err) {
      toast.error(err.message || 'Failed to save route')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSavedRoute(id)
      setRoutes((prev) => prev.filter((r) => r.id !== id))
      toast.success('Route deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete route')
    }
  }

  async function handleRename(id, name) {
    try {
      const updated = await updateSavedRoute(id, { name })
      setRoutes((prev) => prev.map((r) => (r.id === id ? updated : r)))
      toast.success('Route renamed')
    } catch (err) {
      toast.error(err.message || 'Failed to rename route')
      throw err
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Builder */}
      <Card as="section" aria-label="Route Builder" id="routeBuilderCard_routeBuilderPage">
        <CardHeader>
          <CardIcon icon={Map} />
          <CardHeaderContent>
            <CardTitle>Route Builder</CardTitle>
            <CardDescription>Click the map to place waypoints and trace your route</CardDescription>
          </CardHeaderContent>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <RouteBuilderMap waypoints={waypoints} onChange={setWaypoints} />
          </div>
          <div className="lg:w-64 shrink-0">
            <RouteStats
              distanceM={distanceM}
              waypointCount={waypoints.length}
              routeName={routeName}
              onRouteNameChange={setRouteName}
              onSave={handleSave}
              onUndo={handleUndo}
              onClear={handleClear}
              saving={saving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Saved routes */}
      <Card as="section" aria-label="Saved Routes" id="savedRoutesCard_routeBuilderPage">
        <CardHeader>
          <CardHeaderContent>
            <CardTitle>Saved Routes</CardTitle>
          </CardHeaderContent>
        </CardHeader>
        <CardContent>
          {routesLoading && (
            <div id="savedRoutesLoading_routeBuilderPage" className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3 w-28 rounded" />
                  </div>
                  <Skeleton className="size-7 rounded" />
                </div>
              ))}
            </div>
          )}

          {routesError && (
            <div
              id="savedRoutesError_routeBuilderPage"
              className="flex flex-col items-center gap-2 py-6 text-center"
            >
              <AlertCircle className="size-5 text-red-400" />
              <p className="text-sm text-slate-500">{routesError}</p>
              <Button variant="ghost" onClick={loadRoutes} className="text-violet-600">
                Retry
              </Button>
            </div>
          )}

          {!routesLoading && !routesError && routes?.length === 0 && (
            <p
              id="savedRoutesEmpty_routeBuilderPage"
              className="text-sm text-slate-400 text-center py-6"
            >
              No saved routes yet. Build and save your first route above.
            </p>
          )}

          {!routesLoading && !routesError && routes && routes.length > 0 && (
            <div id="savedRoutesList_routeBuilderPage">
              {routes.map((route) => (
                <SavedRouteRow
                  key={route.id}
                  route={route}
                  onDelete={handleDelete}
                  onView={setViewingRoute}
                  onRename={handleRename}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route preview modal */}
      <Modal
        open={!!viewingRoute}
        onOpenChange={(open) => {
          if (!open) setViewingRoute(null)
        }}
      >
        <ModalContent
          id="routePreviewModal_routeBuilderPage"
          className="max-w-2xl w-full overflow-hidden !p-0 !gap-0"
        >
          <ModalHeader className="px-6 pt-6 pb-0">
            <ModalHeaderContent>
              <ModalTitle>{viewingRoute?.name}</ModalTitle>
            </ModalHeaderContent>
          </ModalHeader>
          {viewingRoute && (
            <>
              <p className="text-xs text-slate-400 px-6 pt-2 pb-3">
                {formatDistance(viewingRoute.distance_m)} · {formatDate(viewingRoute.created_at)}
              </p>
              <div className="px-6 pb-6">
                <RouteMap encodedPolyline={viewingRoute.encoded_polyline} height={480} />
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
