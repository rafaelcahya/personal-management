'use client'

import { useEffect, useRef, useState } from 'react'
import { Undo2, Maximize2, Minimize2, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import Card, { CardContent } from '@/components/base/Card/Card'
import { fmtDuration } from '@/app/main/running/(app)/dashboard/utils/format'
import useMediaQuery from '../hooks/useMediaQuery'

const JAWG_TOKEN = process.env.NEXT_PUBLIC_JAWG_ACCESS_TOKEN
const TILE_STYLE_URL = 'https://tile.jawg.io/jawg-lagoon.json'
const TILE_STYLE = `${TILE_STYLE_URL}?access-token=${JAWG_TOKEN}`

const DEFAULT_CENTER = [106.8456, -6.2088] // Jakarta [lng, lat]
const DEFAULT_ZOOM = 13

// MapLibre paint properties and the DOM marker HTML cannot read CSS variables,
// so these colors are fixed values that mirror the design tokens.
const ROUTE_LINE_COLOR = '#7c3aed' // violet-600, brand accent
const ROUTE_BORDER_COLOR = '#000000' // dark outline keeps the line readable on the light basemap
const START_MARKER_COLOR = '#16a34a' // green-600, tells the start apart from the other waypoints
const MARKER_RING_COLOR = '#ffffff' // white ring separates the dot from any tile color

// A pointer-coarse device gets 44px hit areas and controls; fine pointers keep the compact size.
// The hit area is invisible and wider than the 12px dot so a fingertip can find it.
const MAP_STYLES = `
  @keyframes routePing {
    0% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
  }
  #routeBuilderMap_routeBuilderPage canvas { outline: none; }
  .rb-marker-hit {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  @media (pointer: coarse) {
    .rb-marker-hit { width: 44px; height: 44px; }
    #routeBuilderMap_routeBuilderPage .maplibregl-ctrl-group button {
      width: 44px;
      height: 44px;
    }
  }
`

const CONTROL_SIZE = 'size-8 [@media(pointer:coarse)]:size-11'

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
  const isFullscreenRef = useRef(false)
  const isTouchRef = useRef(false)
  const wasFullscreenRef = useRef(false)
  const fullscreenBtnRef = useRef(null)
  const fullscreenBackBtnRef = useRef(null)
  const [showDeleteHint, setShowDeleteHint] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapError, setMapError] = useState(null)
  const [mapAttempt, setMapAttempt] = useState(0)
  const isTouch = useMediaQuery('(pointer: coarse)')

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
    isFullscreenRef.current = isFullscreen
    isTouchRef.current = isTouch
    document.body.style.overflow = isFullscreen ? 'hidden' : ''
    const map = mapRef.current
    if (map) {
      // Touch only: inline, one finger scrolls the page and two move the map. Mouse users keep wheel zoom and drag.
      if (isFullscreen || !isTouch) map.cooperativeGestures.disable()
      else map.cooperativeGestures.enable()
      requestAnimationFrame(() => mapRef.current?.resize())
    }
    if (isFullscreen) {
      requestAnimationFrame(() => fullscreenBackBtnRef.current?.focus())
    } else if (wasFullscreenRef.current) {
      fullscreenBtnRef.current?.focus()
    }
    wasFullscreenRef.current = isFullscreen
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen, isTouch])

  useEffect(() => {
    if (!containerRef.current) return
    if (!JAWG_TOKEN) {
      setMapError('token')
      return
    }
    setMapError(null)
    let isMounted = true
    let loaded = false

    import('maplibre-gl').then((maplibregl) => {
      import('maplibre-gl/dist/maplibre-gl.css')
      if (!isMounted || !containerRef.current || mapRef.current) return

      mlRef.current = maplibregl

      if (!document.getElementById('route-builder-styles')) {
        const style = document.createElement('style')
        style.id = 'route-builder-styles'
        style.textContent = MAP_STYLES
        document.head.appendChild(style)
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: TILE_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
        cooperativeGestures: isTouchRef.current && !isFullscreenRef.current,
      })

      map.addControl(new maplibregl.NavigationControl())

      map.on('error', (e) => {
        if (!isMounted) return
        const status = e.error?.status
        const failedUrl = e.error?.url ?? ''
        // Only a rejected token, a failed style document or a style that never parsed hides the map;
        // a missing glyph, sprite or single tile must not.
        const styleFailed =
          failedUrl.startsWith(TILE_STYLE_URL) || (!loaded && !e.sourceId && !map.getStyle())
        if (status === 401 || status === 403 || styleFailed) setMapError('load')
      })

      map.on('load', () => {
        if (!isMounted) return
        loaded = true
        setMapError(null)

        map.addSource('route', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } },
        })
        map.addLayer({
          id: 'route-border',
          type: 'line',
          source: 'route',
          paint: { 'line-color': ROUTE_BORDER_COLOR, 'line-width': 6, 'line-opacity': 0.75 },
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

        const waypointsNow = waypointsRef.current
        if (waypointsNow.length) {
          map.getSource('route')?.setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: waypointsNow },
          })
        }
      })

      mapRef.current = map
      // Markers for waypoints added before the style finished loading
      waypointsRef.current.forEach((lnglat, i, all) =>
        addMarker(maplibregl, map, lnglat, i + 1, all.length)
      )
    })

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
      }
    }
  }, [mapAttempt])

  function addMarker(maplibregl, map, lnglat, index, total) {
    const isStart = index === 1
    const isLast = index === total
    const color = isStart ? START_MARKER_COLOR : ROUTE_LINE_COLOR

    const el = document.createElement('div')
    el.style.cssText = 'position:relative;width:0;height:0;'
    el.setAttribute('role', 'button')
    el.setAttribute('tabindex', '0')
    el.setAttribute(
      'aria-label',
      `Waypoint ${index}${isStart ? ' (start)' : ''}. Tap or press Delete to remove.`
    )

    let html = '<div class="rb-marker-hit"></div>'
    if (isLast && !isStart) {
      html += `<div style="position:absolute;width:20px;height:20px;border-radius:50%;background:${ROUTE_LINE_COLOR};transform:translate(-50%,-50%);animation:routePing 1.6s ease-out infinite;pointer-events:none;"></div>`
    }
    // innerHTML only uses internally-derived values (color constants) — never interpolate user input here
    html += `<div style="position:absolute;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid ${MARKER_RING_COLOR};box-shadow:0 1px 4px rgba(0,0,0,0.3);transform:translate(-50%,-50%);pointer-events:none;"></div>`
    el.innerHTML = html

    const markerIndex = index - 1
    function removeThisWaypoint() {
      onChange(waypointsRef.current.filter((_, i) => i !== markerIndex))
    }
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      removeThisWaypoint()
    })
    // A mouse click on a marker still falls through to the map (adds a waypoint) as before;
    // touch and pen taps remove the waypoint instead, since they have no right-click.
    el.addEventListener('click', (e) => {
      // Safari fires click as a plain MouseEvent without pointerType, so fall back to the device type
      const touchLike = e.pointerType
        ? e.pointerType !== 'mouse'
        : window.matchMedia('(pointer: coarse)').matches
      if (!touchLike) return
      e.stopPropagation()
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
  const pillPosition = isFullscreen ? 'top-16 sm:top-4' : 'top-4'
  const pillBase =
    'absolute left-1/2 -translate-x-1/2 w-max max-w-[calc(100%-7rem)] text-center text-xs font-medium px-3 py-1.5 rounded-full shadow-sm pointer-events-none select-none z-10'

  return (
    <div
      className={isFullscreen ? 'fixed inset-0 z-50 bg-white overflow-hidden' : 'relative'}
      {...(isFullscreen
        ? { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Route builder fullscreen' }
        : {})}
    >
      {/* Map canvas */}
      <div
        ref={containerRef}
        id="routeBuilderMap_routeBuilderPage"
        className={`w-full cursor-crosshair overflow-hidden ${isFullscreen ? 'h-full' : 'h-[clamp(280px,55dvh,420px)] rounded-xl'}`}
        aria-label={`Route builder map — ${isTouch ? 'tap' : 'click'} to add waypoints`}
      />

      {mapError && (
        <div
          id="mapError_routeBuilderPage"
          role="alert"
          className={`absolute inset-0 z-[5] flex flex-col items-center justify-center gap-2 bg-slate-50 px-6 text-center ${isFullscreen ? '' : 'rounded-xl'}`}
        >
          <AlertCircle className="size-6 text-red-400" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">The map could not be loaded</p>
          <p className="text-sm text-slate-500">
            {mapError === 'token'
              ? 'The map service is not set up on this app yet, so the map cannot be shown.'
              : 'Check your connection and try again.'}
          </p>
          {mapError !== 'token' && (
            <Button
              id="mapRetryBtn_routeBuilderPage"
              variant="ghost"
              onClick={() => setMapAttempt((n) => n + 1)}
              className="text-violet-600"
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Map controls — bottom-right row; the zoom controls are top-right so nothing overlaps */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
        <Button
          id="undoFloatingBtn_routeBuilderPage"
          variant="ghost"
          onClick={onUndo}
          disabled={waypoints.length === 0}
          className={`${CONTROL_SIZE} ${isFullscreen ? '' : 'lg:hidden'} bg-white/90 hover:bg-white border border-slate-200 shadow-sm rounded-lg p-0 flex items-center justify-center`}
          aria-label="Undo last waypoint"
        >
          <Undo2 className="size-5 text-slate-600" aria-hidden="true" />
        </Button>
        <Button
          ref={fullscreenBtnRef}
          id="fullscreenBtn_routeBuilderPage"
          variant="ghost"
          onClick={() => setIsFullscreen((v) => !v)}
          className={`${CONTROL_SIZE} bg-white/90 hover:bg-white border border-slate-200 shadow-sm rounded-lg p-0 flex items-center justify-center`}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="size-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Hint pills */}
      {!mapError && waypoints.length === 0 && (
        <div
          id="mapHintPill_routeBuilderPage"
          className={`${pillBase} ${pillPosition} bg-white/90 text-slate-600 border border-slate-200`}
        >
          {isTouch
            ? 'Tap the map to add your first waypoint'
            : 'Click the map to add your first waypoint'}
        </div>
      )}
      {!mapError && showDeleteHint && (
        <div
          id="waypointDeleteHint_routeBuilderPage"
          role="status"
          className={`${pillBase} ${pillPosition} bg-slate-800 text-white`}
        >
          {isTouch ? 'Tap a waypoint to remove it' : 'Right-click any waypoint to remove it'}
        </div>
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
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
      )}

      {/* Fullscreen panel — full width on phones and lifted above the bottom-right controls */}
      {isFullscreen && (
        <div className="absolute inset-x-3 bottom-[4.5rem] z-10 flex max-h-[calc(100dvh-9rem)] flex-col gap-3 overflow-y-auto sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-h-[calc(100dvh-7rem)] sm:w-56">
          <Card
            id="fullscreenStatsOverlay_routeBuilderPage"
            className="backdrop-blur-sm bg-white/95"
          >
            <CardContent className="grid grid-cols-3 gap-2 sm:grid-cols-1">
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

          <Card
            id="fullscreenControlsOverlay_routeBuilderPage"
            className="backdrop-blur-sm bg-white/95"
          >
            <CardContent className="flex flex-col gap-2">
              <Button
                id="fullscreenClearBtn_routeBuilderPage"
                variant="outline"
                onClick={onClear}
                disabled={waypointCount === 0}
                className="w-full text-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear
              </Button>
              <Input
                id="fullscreenRouteNameInput_routeBuilderPage"
                type="text"
                placeholder="Route name"
                aria-label="Route name"
                value={routeName}
                onChange={(e) => onRouteNameChange(e.target.value)}
                maxLength={100}
                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
              />
              <Button
                id="fullscreenSaveBtn_routeBuilderPage"
                disabled={!canSave || saving}
                onClick={onSave}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                {saving && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                {saving ? 'Saving…' : 'Save Route'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
