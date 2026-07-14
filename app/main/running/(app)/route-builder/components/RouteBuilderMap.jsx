'use client'

import { useEffect, useRef } from 'react'
import { getDirections } from '@/lib/api/maps'

const TILE_STYLE = `https://tile.jawg.io/jawg-lagoon.json?access-token=${process.env.NEXT_PUBLIC_JAWG_ACCESS_TOKEN}`

const DEFAULT_CENTER = [106.8456, -6.2088] // Jakarta [lng, lat]
const DEFAULT_ZOOM = 13

export default function RouteBuilderMap({ waypoints, onChange }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const mlRef = useRef(null)
  const markersRef = useRef([])
  const waypointsRef = useRef(waypoints)
  const abortRef = useRef(null)

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
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: { 'line-color': '#7c3aed', 'line-width': 4, 'line-opacity': 0.85 },
        })

        map.on('click', (e) => {
          const { lng, lat } = e.lngLat
          const next = [...waypointsRef.current, [lng, lat]]
          addMarker(maplibregl, map, [lng, lat], next.length)
          onChange(next)
        })
      })

      mapRef.current = map
    })

    return () => {
      isMounted = false
      abortRef.current?.abort()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  function addMarker(maplibregl, map, lnglat, index) {
    const color = index === 1 ? '#16a34a' : '#7c3aed'
    const el = document.createElement('div')
    el.style.cssText = `width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);`
    const marker = new maplibregl.Marker({ element: el }).setLngLat(lnglat).addTo(map)
    markersRef.current.push(marker)
  }

  // Sync external waypoint changes (undo / clear) → redraw markers + get routed polyline
  useEffect(() => {
    const map = mapRef.current
    const maplibregl = mlRef.current
    if (!map || !maplibregl) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    waypoints.forEach((lnglat, i) => addMarker(maplibregl, map, lnglat, i + 1))

    const routeSource = map.getSource('route')
    if (!routeSource) return

    if (waypoints.length < 2) {
      routeSource.setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: waypoints },
      })
      return
    }

    // Cancel previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    getDirections(waypoints, controller.signal).then(({ data }) => {
      if (controller.signal.aborted) return
      const coords = data?.coordinates ?? waypoints
      routeSource.setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: coords },
      })
    })

    return () => controller.abort()
  }, [waypoints])

  return (
    <div
      ref={containerRef}
      id="routeBuilderMap_routeBuilderPage"
      className="w-full rounded-xl overflow-hidden"
      style={{ height: 420 }}
      aria-label="Route builder map — click to add waypoints"
    />
  )
}
