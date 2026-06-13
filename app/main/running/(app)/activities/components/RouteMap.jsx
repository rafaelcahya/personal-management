'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize2, X } from 'lucide-react'
import polyline from '@mapbox/polyline'

const TILE_CONFIGS = {
  map: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
    options: { subdomains: 'abcd', maxZoom: 20 },
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { minZoom: 0, maxZoom: 20 },
  },
}

const POLYLINE_COLORS = { map: '#7c3aed', satellite: '#ffffff' }

function LeafletMap({
  encodedPolyline,
  height,
  className = '',
  interactive = false,
  mapStyle,
  laps,
  bestEfforts,
  activityStartedAt,
  totalDistanceM,
  streams,
  pagePrefix = 'activityDetailPage',
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const tileLayerRef = useRef(null)
  const routeLineRef = useRef(null)
  const animFrameRef = useRef(null)
  const markersDataRef = useRef({
    laps,
    bestEfforts,
    activityStartedAt,
    totalDistanceM,
    streams,
    pagePrefix,
  })

  useEffect(() => {
    markersDataRef.current = {
      laps,
      bestEfforts,
      activityStartedAt,
      totalDistanceM,
      streams,
      pagePrefix,
    }
  }, [laps, bestEfforts, activityStartedAt, totalDistanceM, streams, pagePrefix])

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

      const config = TILE_CONFIGS[mapStyle] ?? TILE_CONFIGS.map
      const tileLayer = L.default.tileLayer(config.url, config.options).addTo(map)

      // Fit to full bounds before animation so camera stays fixed
      const tempLine = L.default.polyline(coords)
      map.fitBounds(tempLine.getBounds(), { padding: [12, 12] })

      const routeLine = L.default
        .polyline([], {
          color: POLYLINE_COLORS[mapStyle] ?? POLYLINE_COLORS.map,
          weight: 4,
          opacity: 0.85,
        })
        .addTo(map)

      const DURATION = 5000
      const startTime = performance.now()

      function animate(now) {
        if (!isMounted) return
        const progress = Math.min((now - startTime) / DURATION, 1)
        const count = Math.max(Math.floor(progress * coords.length), 1)
        routeLine.setLatLngs(coords.slice(0, count))

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate)
        } else {
          routeLine.setLatLngs(coords)

          if (!document.getElementById('route-marker-styles')) {
            const style = document.createElement('style')
            style.id = 'route-marker-styles'
            style.textContent = `
              @keyframes routePing {
                0% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
                100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
              }
              .route-marker-label {
                opacity: 0;
                transition: opacity 0.15s ease;
                pointer-events: none;
              }
              .route-marker-wrapper:hover .route-marker-label {
                opacity: 1;
              }
            `
            document.head.appendChild(style)
          }

          const esc = (s) =>
            String(s)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')

          const makeIcon = (color, label) =>
            L.default.divIcon({
              html: `<div class="route-marker-wrapper" style="position:relative;width:0;height:0;cursor:pointer;">
                <div style="position:absolute;width:18px;height:18px;border-radius:50%;background:${esc(color)};transform:translate(-50%,-50%);animation:routePing 1.6s ease-out infinite;pointer-events:none;"></div>
                <div style="position:absolute;width:11px;height:11px;border-radius:50%;background:${esc(color)};transform:translate(-50%,-50%);"></div>
                <div class="route-marker-label" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);background:#fff;color:#334155;border:1px solid #e2e8f0;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:600;white-space:nowrap;font-family:system-ui,sans-serif;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);">${esc(label)}</div>
              </div>`,
              className: '',
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            })

          const {
            laps: mLaps,
            bestEfforts: mEfforts,
            activityStartedAt: mStartedAt,
            totalDistanceM: mTotalDist,
            streams: mStreams,
            pagePrefix: mPrefix,
          } = markersDataRef.current

          const finishLabel = mLaps?.length > 0 ? `Lap ${mLaps.length} · Finish` : 'Finish'

          const startMarker = L.default
            .marker(coords[0], { icon: makeIcon('#16a34a', 'Start') })
            .addTo(map)
          const endMarker = L.default
            .marker(coords[coords.length - 1], { icon: makeIcon('#dc2626', finishLabel) })
            .addTo(map)
          startMarker.getElement()?.setAttribute('id', `routeStartMarker_${mPrefix}`)
          endMarker.getElement()?.setAttribute('id', `routeEndMarker_${mPrefix}`)

          // Lap boundary markers — skip last (merged into Finish marker above)
          if (mLaps?.length > 1 && mTotalDist > 0) {
            const makeLapIcon = (num) =>
              L.default.divIcon({
                html: `<div style="position:relative;width:0;height:0;">
                  <div style="position:absolute;width:22px;height:22px;border-radius:50%;background:#7c3aed;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.25);font-family:system-ui,sans-serif;">${num}</div>
                </div>`,
                className: '',
                iconSize: [0, 0],
                iconAnchor: [0, 0],
              })

            let cumDist = 0
            for (let i = 0; i < mLaps.length - 1; i++) {
              cumDist += mLaps[i].distance_m
              const frac = cumDist / mTotalDist
              if (frac <= 0 || frac >= 1) continue
              const idx = Math.round(frac * (coords.length - 1))
              const lapNum = i + 1
              const m = L.default.marker(coords[idx], { icon: makeLapIcon(lapNum) }).addTo(map)
              m.getElement()?.setAttribute('id', `lapMarker_${lapNum}_${mPrefix}`)
            }
          }

          // Best effort PR markers
          const prEfforts = mEfforts?.filter((e) => e.pr_rank != null) ?? []
          const gpsStreams = mStreams?.filter((s) => s.lat != null && s.lng != null) ?? []

          if (prEfforts.length > 0 && gpsStreams.length > 0 && mStartedAt) {
            const actStartMs = new Date(mStartedAt).getTime()

            const makePrIcon = (label) =>
              L.default.divIcon({
                html: `<div class="route-marker-wrapper" style="position:relative;width:0;height:0;cursor:pointer;">
                  <div style="position:absolute;width:13px;height:13px;border-radius:50%;background:#d97706;transform:translate(-50%,-50%);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
                  <div class="route-marker-label" style="position:absolute;bottom:13px;left:50%;transform:translateX(-50%);background:#fff;color:#334155;border:1px solid #e2e8f0;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap;font-family:system-ui,sans-serif;box-shadow:0 2px 4px rgba(0,0,0,0.08);">${esc(label)}</div>
                </div>`,
                className: '',
                iconSize: [0, 0],
                iconAnchor: [0, 0],
              })

            for (const effort of prEfforts) {
              const relStartSec = (new Date(effort.started_at).getTime() - actStartMs) / 1000
              const relEndSec = relStartSec + effort.elapsed_time_sec
              const safeName = effort.name?.replace(/[^a-zA-Z0-9]/g, '') ?? 'PR'

              const nearest = (targetSec) =>
                gpsStreams.reduce(
                  (best, s) => {
                    const diff = Math.abs(s.t - targetSec)
                    return diff < best.diff ? { diff, lat: s.lat, lng: s.lng } : best
                  },
                  { diff: Infinity, lat: null, lng: null }
                )

              const startPt = nearest(relStartSec)
              const endPt = nearest(relEndSec)

              if (startPt.lat != null) {
                const sm = L.default
                  .marker([startPt.lat, startPt.lng], {
                    icon: makePrIcon(`${effort.name ?? 'PR'} start`),
                  })
                  .addTo(map)
                sm.getElement()?.setAttribute('id', `prEffortStart_${safeName}_${mPrefix}`)
              }
              if (endPt.lat != null) {
                const em = L.default
                  .marker([endPt.lat, endPt.lng], { icon: makePrIcon(effort.name ?? 'PR') })
                  .addTo(map)
                em.getElement()?.setAttribute('id', `prEffortEnd_${safeName}_${mPrefix}`)
              }
            }
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(animate)

      if (isMounted) {
        mapRef.current = map
        tileLayerRef.current = tileLayer
        routeLineRef.current = routeLine
      }
    })

    return () => {
      isMounted = false
      cancelAnimationFrame(animFrameRef.current)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        tileLayerRef.current = null
        routeLineRef.current = null
      }
    }
  }, [encodedPolyline, interactive])

  // Swap tile layer and polyline color on mapStyle change — CF-1/WF-4 fix:
  // capture refs before async, use cancellation flag to guard unmount writes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current || !routeLineRef.current) return

    let cancelled = false
    const currentMap = mapRef.current
    const currentTile = tileLayerRef.current
    const currentRoute = routeLineRef.current

    import('leaflet').then((L) => {
      if (cancelled || !currentMap || !currentTile || !currentRoute) return

      currentTile.remove()
      const config = TILE_CONFIGS[mapStyle] ?? TILE_CONFIGS.map
      const newTile = L.default.tileLayer(config.url, config.options).addTo(currentMap)
      currentRoute.setStyle({ color: POLYLINE_COLORS[mapStyle] ?? POLYLINE_COLORS.map })

      if (!cancelled) tileLayerRef.current = newTile
    })

    return () => {
      cancelled = true
    }
  }, [mapStyle])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ height }}
      aria-label="Route map"
    />
  )
}

function StyleToggle({ mapStyle, onStyleChange }) {
  return (
    <div
      id="mapStyleToggle_activityDetailPage"
      className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm"
    >
      <button
        id="mapStyleMap_activityDetailPage"
        onClick={() => onStyleChange('map')}
        aria-pressed={mapStyle === 'map'}
        className={`px-2.5 py-1 text-xs font-medium transition-colors ${
          mapStyle === 'map'
            ? 'bg-white text-slate-800'
            : 'bg-slate-50 text-slate-500 hover:bg-white'
        }`}
      >
        Map
      </button>
      <button
        id="mapStyleSatellite_activityDetailPage"
        onClick={() => onStyleChange('satellite')}
        aria-pressed={mapStyle === 'satellite'}
        className={`px-2.5 py-1 text-xs font-medium transition-colors ${
          mapStyle === 'satellite'
            ? 'bg-white text-slate-800'
            : 'bg-slate-50 text-slate-500 hover:bg-white'
        }`}
      >
        Satellite
      </button>
    </div>
  )
}

export default function RouteMap({
  encodedPolyline,
  height = 240,
  className = '',
  laps,
  bestEfforts,
  activityStartedAt,
  totalDistanceM,
  streams,
  pagePrefix = 'activityDetailPage',
}) {
  const [expanded, setExpanded] = useState(false)
  const [mapStyle, setMapStyle] = useState('map')
  const modalRef = useRef(null)

  // CF-2: focus modal on open, close on Escape
  useEffect(() => {
    if (!expanded) return
    modalRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [expanded])

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
      <div className={`${className}`}>
        <div className="relative rounded-t-lg overflow-hidden isolate" style={{ height }}>
          <LeafletMap
            encodedPolyline={encodedPolyline}
            height={height}
            interactive={false}
            mapStyle={mapStyle}
            laps={laps}
            bestEfforts={bestEfforts}
            activityStartedAt={activityStartedAt}
            totalDistanceM={totalDistanceM}
            streams={streams}
            pagePrefix={pagePrefix}
          />
          <button
            onClick={() => setExpanded(true)}
            className="absolute top-2 right-2 z-[1000] bg-white/90 hover:bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm transition-colors"
            aria-label="Expand map"
          >
            <Maximize2 className="size-4 text-slate-600" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center justify-start px-1 pt-1.5">
          <StyleToggle mapStyle={mapStyle} onStyleChange={setMapStyle} />
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Route map expanded"
            tabIndex={-1}
            className="relative w-full max-w-4xl rounded-xl overflow-hidden flex flex-col outline-none"
            style={{ height: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 overflow-hidden">
              <LeafletMap
                encodedPolyline={encodedPolyline}
                height="100%"
                className="w-full h-full"
                interactive={true}
                mapStyle={mapStyle}
                laps={laps}
                bestEfforts={bestEfforts}
                activityStartedAt={activityStartedAt}
                totalDistanceM={totalDistanceM}
                streams={streams}
                pagePrefix={pagePrefix}
              />
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-3 right-3 z-[1000] bg-white/90 hover:bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm transition-colors"
                aria-label="Close map"
              >
                <X className="size-4 text-slate-600" aria-hidden="true" />
              </button>
            </div>
            <div className="bg-white flex items-center px-3 py-2">
              <StyleToggle mapStyle={mapStyle} onStyleChange={setMapStyle} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
