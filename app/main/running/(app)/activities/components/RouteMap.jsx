'use client'

import { useEffect, useRef } from 'react'
import polyline from '@mapbox/polyline'

export default function RouteMap({ encodedPolyline, height = 240, className = '' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !encodedPolyline) return
    if (mapRef.current) return

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css')

      const coords = polyline.decode(encodedPolyline)
      if (!coords || coords.length === 0) return

      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.default.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false,
      })

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

      const routeLine = L.default
        .polyline(coords, {
          color: '#7c3aed',
          weight: 4,
          opacity: 0.85,
        })
        .addTo(map)

      map.fitBounds(routeLine.getBounds(), { padding: [12, 12] })
      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [encodedPolyline])

  if (!encodedPolyline) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-50 rounded-lg text-xs text-slate-400 ${className}`}
        style={{ height }}
      >
        No GPS data
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
      aria-label="Route map"
    />
  )
}
