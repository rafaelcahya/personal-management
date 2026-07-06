'use client'

import { useEffect, useRef } from 'react'

const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'

const DEFAULT_CENTER = [-6.2088, 106.8456] // Jakarta
const DEFAULT_ZOOM = 13

export default function RouteBuilderMap({ waypoints, onChange }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const polylineRef = useRef(null)
  const markersRef = useRef([])
  const waypointsRef = useRef(waypoints)

  useEffect(() => {
    waypointsRef.current = waypoints
  }, [waypoints])

  useEffect(() => {
    if (!containerRef.current) return
    if (containerRef.current._leaflet_id) return

    let isMounted = true

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css')
      if (!isMounted || !containerRef.current) return

      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.default.map(containerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: false,
      })

      L.default.tileLayer(TILE_URL, { subdomains: 'abcd', maxZoom: 20 }).addTo(map)

      const polyline = L.default
        .polyline([], { color: '#7c3aed', weight: 4, opacity: 0.85 })
        .addTo(map)

      mapRef.current = map
      polylineRef.current = polyline

      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        const next = [...waypointsRef.current, [lat, lng]]
        addMarker(L.default, map, [lat, lng], next.length)
        polyline.setLatLngs(next)
        onChange(next)
      })
    })

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        polylineRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  function addMarker(L, map, latlng, index) {
    const isFirst = index === 1
    const color = isFirst ? '#16a34a' : '#7c3aed'
    const icon = L.divIcon({
      html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
      className: '',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    })
    const marker = L.marker(latlng, { icon }).addTo(map)
    markersRef.current.push(marker)
  }

  // Sync external waypoint changes (undo / clear) → re-draw markers + polyline
  useEffect(() => {
    if (!mapRef.current || !polylineRef.current) return

    import('leaflet').then((L) => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      waypoints.forEach((latlng, i) => {
        addMarker(L.default, mapRef.current, latlng, i + 1)
      })

      polylineRef.current.setLatLngs(waypoints)
    })
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
