'use client'

import { useEffect, useRef, useState } from 'react'
import { Undo2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'

const TILE_STYLE = `https://tile.jawg.io/jawg-lagoon.json?access-token=${process.env.NEXT_PUBLIC_JAWG_ACCESS_TOKEN}`

const DEFAULT_CENTER = [106.8456, -6.2088] // Jakarta [lng, lat]
const DEFAULT_ZOOM = 13

export default function RouteBuilderMap({ waypoints, onChange, onUndo }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const mlRef = useRef(null)
  const markersRef = useRef([])
  const waypointsRef = useRef(waypoints)
  const [showDeleteHint, setShowDeleteHint] = useState(false)

  useEffect(() => {
    waypointsRef.current = waypoints
  }, [waypoints])

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
          paint: { 'line-color': '#7c3aed', 'line-width': 4, 'line-opacity': 0.9 },
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
    const color = isStart ? '#16a34a' : '#7c3aed'

    const el = document.createElement('div')
    el.style.cssText = 'position:relative;width:0;height:0;'

    let html = ''
    if (isLast && !isStart) {
      html += `<div style="position:absolute;width:20px;height:20px;border-radius:50%;background:#7c3aed;transform:translate(-50%,-50%);animation:routePing 1.6s ease-out infinite;pointer-events:none;"></div>`
    }
    html += `<div style="position:absolute;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);transform:translate(-50%,-50%);"></div>`
    el.innerHTML = html

    const markerIndex = index - 1
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      onChange(waypointsRef.current.filter((_, i) => i !== markerIndex))
    })

    const marker = new maplibregl.Marker({ element: el }).setLngLat(lnglat).addTo(map)
    markersRef.current.push(marker)
  }

  // Sync external waypoint changes (undo / clear) → redraw markers + line
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

  return (
    <div className="relative">
      <div
        ref={containerRef}
        id="routeBuilderMap_routeBuilderPage"
        className="w-full rounded-xl overflow-hidden cursor-crosshair"
        style={{ height: 420 }}
        aria-label="Route builder map — click to add waypoints"
      />
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
    </div>
  )
}
