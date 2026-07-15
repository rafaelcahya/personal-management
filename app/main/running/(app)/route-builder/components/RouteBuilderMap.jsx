'use client'

import { useEffect, useRef, useState } from 'react'
import { Undo2, Maximize2, Minimize2, Loader2, ArrowLeft } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Card, { CardContent } from '@/components/base/Card/Card'
import { fmtDuration } from '@/app/main/running/(app)/dashboard/utils/format'

const TILE_STYLE = `https://tile.jawg.io/jawg-lagoon.json?access-token=${process.env.NEXT_PUBLIC_JAWG_ACCESS_TOKEN}`

const DEFAULT_CENTER = [106.8456, -6.2088] // Jakarta [lng, lat]
const DEFAULT_ZOOM = 13
const ROUTE_LINE_COLOR = '#7c3aed'

export default function RouteBuilderMap({
  waypoints,
  onChange,
  onUndo,
  onClear,
  onSave,
  distanceM = 0,
  waypointCount = 0,
  estimatedSec = null,
  saving = false,
  canSave = false,
  routeName = '',
  onRouteNameChange,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const mlRef = useRef(null)
  const markersRef = useRef([])
  const waypointsRef = useRef(waypoints)
  const fullscreenBtnRef = useRef(null)
  const fullscreenBackBtnRef = useRef(null)
  const [showDeleteHint, setShowDeleteHint] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    waypointsRef.current = waypoints
  }, [waypoints])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : ''
    if (mapRef.current) {
      requestAnimationFrame(() => mapRef.current?.resize())
    }
    if (isFullscreen) {
      // Move focus into dialog on open
      requestAnimationFrame(() => fullscreenBackBtnRef.current?.focus())
    } else {
      // Restore focus to trigger button on close
      fullscreenBtnRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  useEffect(() => {
    if (!containerRef.current) return
    let isMounted = true

    import('maplibre-gl').then((maplibregl) => {
      import('maplibre-gl/dist/maplibre-gl.css')
      if (!isMounted || !containerRef.current || mapRef.current) return

      mlRef.current = maplibregl

      if (!document.getElementById('route-builder-styles')) {
        const style = document.createElement('style')
        style.id = 'route-builder-styles'
        style.textContent = `
          @keyframes routePing {
            0% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
            100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
          }
          #routeBuilderMap_routeBuilderPage canvas { outline: none; }
        `
        document.head.appendChild(style)
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: TILE_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
      })

      map.addControl(new maplibregl.NavigationControl())

      map.on('load', () => {
        if (!isMounted) return

        map.addSource('route', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } },
        })
        map.addLayer({
          id: 'route-border',
          type: 'line',
          source: 'route',
          paint: { 'line-color': '#000000', 'line-width': 6, 'line-opacity': 0.75 },
        })
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: { 'line-color': ROUTE_LINE_COLOR, 'line-width': 4, 'line-opacity': 0.9 },
        })

        map.on('click', (e) => {
          const { lng, lat } = e.lngLat
          const next = [...waypointsRef.current, [lng, lat]]
          onChange(next)
          if (next.length === 1 && localStorage.getItem('routeBuilder_deleteHintSeen') !== 'true') {
            localStorage.setItem('routeBuilder_deleteHintSeen', 'true')
            setShowDeleteHint(true)
            setTimeout(() => setShowDeleteHint(false), 5000)
          }
        })
      })

      mapRef.current = map
    })

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  function addMarker(maplibregl, map, lnglat, index, total) {
    const isStart = index === 1
    const isLast = index === total
    const color = isStart ? '#16a34a' : ROUTE_LINE_COLOR

    const el = document.createElement('div')
    el.style.cssText = 'position:relative;width:0;height:0;'
    el.setAttribute('role', 'button')
    el.setAttribute('tabindex', '0')
    el.setAttribute(
      'aria-label',
      `Waypoint ${index}${isStart ? ' (start)' : ''}. Press Delete to remove.`
    )

    let html = ''
    if (isLast && !isStart) {
      html += `<div style="position:absolute;width:20px;height:20px;border-radius:50%;background:${ROUTE_LINE_COLOR};transform:translate(-50%,-50%);animation:routePing 1.6s ease-out infinite;pointer-events:none;"></div>`
    }
    // innerHTML only uses internally-derived values (color constants) — never interpolate user input here
    html += `<div style="position:absolute;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);transform:translate(-50%,-50%);"></div>`
    el.innerHTML = html

    const markerIndex = index - 1
    function removeThisWaypoint() {
      onChange(waypointsRef.current.filter((_, i) => i !== markerIndex))
    }
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      removeThisWaypoint()
    })
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        removeThisWaypoint()
      }
    })

    const marker = new maplibregl.Marker({ element: el }).setLngLat(lnglat).addTo(map)
    markersRef.current.push(marker)
  }

  useEffect(() => {
    const map = mapRef.current
    const maplibregl = mlRef.current
    if (!map || !maplibregl) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    waypoints.forEach((lnglat, i) => addMarker(maplibregl, map, lnglat, i + 1, waypoints.length))

    const routeSource = map.getSource('route')
    if (!routeSource) return

    routeSource.setData({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: waypoints },
    })
  }, [waypoints])

  const distKm = (distanceM / 1000).toFixed(2)

  return (
    <div
      className={isFullscreen ? 'fixed inset-0 z-50 bg-white overflow-hidden' : 'relative'}
      {...(isFullscreen
        ? { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Route builder fullscreen' }
        : {})}
    >
      {/* Fullscreen toggle */}
      <Button
        ref={fullscreenBtnRef}
        id="fullscreenBtn_routeBuilderPage"
        variant="ghost"
        onClick={() => setIsFullscreen((v) => !v)}
        className="absolute bottom-3 right-3 z-10 size-8 bg-white/90 hover:bg-white border border-slate-200 shadow-sm rounded-lg p-0 flex items-center justify-center"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
      </Button>

      {/* Map canvas */}
      <div
        ref={containerRef}
        id="routeBuilderMap_routeBuilderPage"
        className={`w-full cursor-crosshair overflow-hidden ${isFullscreen ? 'h-full' : 'rounded-xl'}`}
        style={isFullscreen ? undefined : { height: 420 }}
        aria-label="Route builder map — click to add waypoints"
      />

      {/* Hint pills */}
      {waypoints.length === 0 && (
        <div
          id="mapHintPill_routeBuilderPage"
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-slate-200 pointer-events-none select-none z-10"
        >
          Click the map to add your first waypoint
        </div>
      )}
      {showDeleteHint && (
        <div
          id="waypointDeleteHint_routeBuilderPage"
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm pointer-events-none select-none z-10"
        >
          Right-click any waypoint to remove it
        </div>
      )}

      {/* Mobile undo (non-fullscreen, hidden on lg+) */}
      {!isFullscreen && (
        <Button
          id="undoFloatingBtn_routeBuilderPage"
          variant="ghost"
          onClick={onUndo}
          disabled={waypoints.length === 0}
          className="absolute bottom-3 right-12 z-10 lg:hidden size-11 bg-white/90 hover:bg-white border border-slate-200 shadow-sm rounded-lg p-0 flex items-center justify-center"
          aria-label="Undo last waypoint"
        >
          <Undo2 className="size-5 text-slate-600" />
        </Button>
      )}

      {/* Back button — top-left, fullscreen only */}
      {isFullscreen && (
        <Button
          ref={fullscreenBackBtnRef}
          id="fullscreenBackBtn_routeBuilderPage"
          variant="ghost"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 left-4 z-10 h-9 px-3 bg-white/95 backdrop-blur-sm hover:bg-white border border-slate-200 shadow-sm rounded-lg flex items-center gap-1.5 text-sm font-medium text-slate-700"
          aria-label="Exit fullscreen"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      )}

      {/* Fullscreen overlays — stacked bottom-left */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-3 w-56">
          {/* Stats card */}
          <Card
            id="fullscreenStatsOverlay_routeBuilderPage"
            className="backdrop-blur-sm bg-white/95"
          >
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Distance
                </p>
                <p className="text-base font-bold text-slate-800 tabular-nums">
                  {distKm}
                  <span className="text-xs font-medium text-slate-400 ml-1">km</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Waypoints
                </p>
                <p className="text-base font-bold text-slate-800 tabular-nums">{waypointCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Est. Time
                </p>
                <p className="text-base font-bold text-slate-800 tabular-nums">
                  {estimatedSec != null ? fmtDuration(estimatedSec) : '—'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Controls card */}
          <Card
            id="fullscreenControlsOverlay_routeBuilderPage"
            className="backdrop-blur-sm bg-white/95"
          >
            <CardContent className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onUndo}
                  disabled={waypointCount === 0}
                  className="flex-1 text-sm"
                >
                  Undo
                </Button>
                <Button
                  variant="outline"
                  onClick={onClear}
                  disabled={waypointCount === 0}
                  className="flex-1 text-sm text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear
                </Button>
              </div>
              <Input
                type="text"
                placeholder="Route name"
                value={routeName}
                onChange={(e) => onRouteNameChange(e.target.value)}
                maxLength={100}
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              />
              <Button
                disabled={!canSave || saving}
                onClick={onSave}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                {saving ? 'Saving…' : 'Save Route'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
