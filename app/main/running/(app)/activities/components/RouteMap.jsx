'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize2, X } from 'lucide-react'
import polyline from '@mapbox/polyline'

function LeafletMap({ encodedPolyline, height, className = '', interactive = false }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !encodedPolyline) return

    let isMounted = true

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css')

      if (!isMounted || !containerRef.current) return
      if (containerRef.current._leaflet_id) return
      if (mapRef.current) return

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
        zoomControl: interactive,
        scrollWheelZoom: interactive,
        dragging: interactive,
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
      if (isMounted) mapRef.current = map
    })

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [encodedPolyline, interactive])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ height }}
      aria-label="Route map"
    />
  )
}

export default function RouteMap({ encodedPolyline, height = 240, className = '' }) {
  const [expanded, setExpanded] = useState(false)

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
    <>
      <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height }}>
        <LeafletMap encodedPolyline={encodedPolyline} height={height} interactive={false} />
        <button
          onClick={() => setExpanded(true)}
          className="absolute top-2 right-2 z-[1000] bg-white/90 hover:bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm transition-colors"
          aria-label="Expand map"
        >
          <Maximize2 className="size-4 text-slate-600" />
        </button>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative w-full max-w-4xl h-[80vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <LeafletMap
              encodedPolyline={encodedPolyline}
              height="100%"
              className="w-full h-full"
              interactive={true}
            />
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 z-[1000] bg-white/90 hover:bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm transition-colors"
              aria-label="Close map"
            >
              <X className="size-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
