'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/base/Button/Button'
import { Tabs, TabsList, TabsTrigger } from '@/components/base/Tabs/Tabs.jsx'
import { Maximize2, X } from 'lucide-react'
import polyline from '@mapbox/polyline'
import { fmtPace, fmtDuration } from '../../dashboard/utils/format'

const JAWG_TOKEN = process.env.NEXT_PUBLIC_JAWG_ACCESS_TOKEN

const TILE_STYLES = {
  default: `https://tile.jawg.io/jawg-lagoon.json?access-token=${JAWG_TOKEN}`,
  street: `https://tile.jawg.io/jawg-matrix.json?access-token=${JAWG_TOKEN}`,
  dark: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
}

const POLYLINE_COLORS = { default: '#8b5cf6', street: '#ffffff', dark: '#a78bfa' }
const BORDER_COLORS = { default: '#000000', street: null, dark: null }

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function MapLibreRouteMap({
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
  const mlRef = useRef(null)
  const coordsRef = useRef([])
  const animFrameRef = useRef(null)
  const markersRef = useRef([])
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

    import('maplibre-gl').then((maplibregl) => {
      import('maplibre-gl/dist/maplibre-gl.css')
      if (!isMounted || !containerRef.current || mapRef.current) return

      const coords = polyline.decode(encodedPolyline).map(([lat, lng]) => [lng, lat])
      if (!coords?.length) return

      coordsRef.current = coords
      mlRef.current = maplibregl

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: TILE_STYLES[mapStyle] ?? TILE_STYLES.map,
        center: coords[0],
        zoom: 13,
        interactive,
        attributionControl: false,
      })

      if (interactive) {
        map.addControl(new maplibregl.NavigationControl())
      }

      map.on('load', () => {
        if (!isMounted) return

        const bounds = coords.reduce(
          (b, c) => b.extend(c),
          new maplibregl.LngLatBounds(coords[0], coords[0])
        )
        map.fitBounds(bounds, { padding: 12, animate: false })

        map.addSource('route', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } },
        })
        if (BORDER_COLORS[mapStyle]) {
          map.addLayer({
            id: 'route-border',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': BORDER_COLORS[mapStyle],
              'line-width': 6,
              'line-opacity': 0.5,
            },
          })
        }
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': POLYLINE_COLORS[mapStyle] ?? POLYLINE_COLORS.default,
            'line-width': 4,
            'line-opacity': 0.9,
          },
        })

        const routeSource = map.getSource('route')
        const DURATION = 5000
        const startTime = performance.now()

        function animate(now) {
          if (!isMounted) return
          const progress = Math.min((now - startTime) / DURATION, 1)
          const count = Math.max(Math.floor(progress * coords.length), 1)
          routeSource.setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords.slice(0, count) },
          })

          if (progress < 1) {
            animFrameRef.current = requestAnimationFrame(animate)
          } else {
            drawMarkers(maplibregl, map, coords)
          }
        }
        animFrameRef.current = requestAnimationFrame(animate)
      })

      if (isMounted) {
        mapRef.current = map
      }
    })

    return () => {
      isMounted = false
      cancelAnimationFrame(animFrameRef.current)
      if (mapRef.current) {
        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [encodedPolyline, interactive])

  function drawMarkers(maplibregl, map, coords) {
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

    function makeMarkerEl(color, label, id) {
      const el = document.createElement('div')
      el.id = id
      el.className = 'route-marker-wrapper'
      el.style.cssText = 'position:relative;width:0;height:0;cursor:pointer;'
      el.innerHTML = `
        <div style="position:absolute;width:18px;height:18px;border-radius:50%;background:${esc(color)};transform:translate(-50%,-50%);animation:routePing 1.6s ease-out infinite;pointer-events:none;"></div>
        <div style="position:absolute;width:11px;height:11px;border-radius:50%;background:${esc(color)};transform:translate(-50%,-50%);"></div>
        <div class="route-marker-label" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);background:#fff;color:#334155;border:1px solid #e2e8f0;padding:4px 10px;border-radius:8px;font-size:12px;font-weight:600;white-space:nowrap;font-family:system-ui,sans-serif;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);">${esc(label)}</div>
      `
      return el
    }

    const {
      laps: mLaps,
      bestEfforts: mEfforts,
      activityStartedAt: mStartedAt,
      totalDistanceM: mTotalDist,
      streams: mStreams,
      pagePrefix: mPrefix,
    } = markersDataRef.current

    const finishLabel = mLaps?.length > 0 ? `Lap ${mLaps.length} · Finish` : 'Finish'

    markersRef.current.push(
      new maplibregl.Marker({
        element: makeMarkerEl('#16a34a', 'Start', `routeStartMarker_${mPrefix}`),
      })
        .setLngLat(coords[0])
        .addTo(map),
      new maplibregl.Marker({
        element: makeMarkerEl('#dc2626', finishLabel, `routeEndMarker_${mPrefix}`),
      })
        .setLngLat(coords[coords.length - 1])
        .addTo(map)
    )

    // Lap boundary markers — skip last (merged into Finish marker above)
    if (mLaps?.length > 1 && mTotalDist > 0) {
      let cumDist = 0
      for (let i = 0; i < mLaps.length - 1; i++) {
        cumDist += mLaps[i].distance_m
        const frac = cumDist / mTotalDist
        if (frac <= 0 || frac >= 1) continue
        const idx = Math.round(frac * (coords.length - 1))
        const lapNum = i + 1

        const lap = mLaps[i]
        const lapPaceSec =
          lap.moving_time_sec > 0 && lap.distance_m > 0
            ? Math.round(lap.moving_time_sec / (lap.distance_m / 1000))
            : null
        const distStr = cumDist ? `${(cumDist / 1000).toFixed(2)} km` : '—'
        const paceStr = lapPaceSec ? `${fmtPace(lapPaceSec)}/km` : '—'
        const timeStr = lap.moving_time_sec ? fmtDuration(lap.moving_time_sec) : '—'

        const lapEl = document.createElement('div')
        lapEl.id = `lapMarker_${lapNum}_${mPrefix}`
        lapEl.className = 'route-marker-wrapper'
        lapEl.style.cssText = 'position:relative;width:0;height:0;cursor:pointer;'
        lapEl.innerHTML = `
          <div style="position:absolute;width:22px;height:22px;border-radius:50%;background:#7c3aed;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.25);font-family:system-ui,sans-serif;">${esc(String(lapNum))}</div>
          <div class="route-marker-label" style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:#fff;color:#334155;border:1px solid #e2e8f0;padding:6px 10px;border-radius:8px;white-space:nowrap;font-family:system-ui,sans-serif;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);">
            <div style="font-size:11px;font-weight:700;color:#7c3aed;margin-bottom:4px;">Lap ${esc(String(lapNum))}</div>
            <div style="display:grid;grid-template-columns:auto auto;gap:1px 10px;font-size:11px;">
              <span style="color:#94a3b8;">Dist</span><span style="font-weight:600;font-variant-numeric:tabular-nums;">${esc(distStr)}</span>
              <span style="color:#94a3b8;">Pace</span><span style="font-weight:600;font-variant-numeric:tabular-nums;">${esc(paceStr)}</span>
              <span style="color:#94a3b8;">Time</span><span style="font-weight:600;font-variant-numeric:tabular-nums;">${esc(timeStr)}</span>
            </div>
          </div>`

        markersRef.current.push(
          new maplibregl.Marker({ element: lapEl }).setLngLat(coords[idx]).addTo(map)
        )
      }
    }

    // Best effort PR markers
    const prEfforts = mEfforts?.filter((e) => e.pr_rank != null) ?? []
    const gpsStreams = mStreams?.filter((s) => s.lat != null && s.lng != null) ?? []

    if (prEfforts.length > 0 && gpsStreams.length > 0 && mStartedAt) {
      const actStartMs = new Date(mStartedAt).getTime()

      function makePrEl(label, id) {
        const el = document.createElement('div')
        el.id = id
        el.className = 'route-marker-wrapper'
        el.style.cssText = 'position:relative;width:0;height:0;cursor:pointer;'
        el.innerHTML = `
          <div style="position:absolute;width:13px;height:13px;border-radius:50%;background:#d97706;transform:translate(-50%,-50%);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
          <div class="route-marker-label" style="position:absolute;bottom:13px;left:50%;transform:translateX(-50%);background:#fff;color:#334155;border:1px solid #e2e8f0;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap;font-family:system-ui,sans-serif;box-shadow:0 2px 4px rgba(0,0,0,0.08);">${esc(label)}</div>
        `
        return el
      }

      const nearest = (targetSec) =>
        gpsStreams.reduce(
          (best, s) => {
            const diff = Math.abs(s.t - targetSec)
            return diff < best.diff ? { diff, lat: s.lat, lng: s.lng } : best
          },
          { diff: Infinity, lat: null, lng: null }
        )

      for (const effort of prEfforts) {
        const relStartSec = (new Date(effort.started_at).getTime() - actStartMs) / 1000
        const relEndSec = relStartSec + effort.elapsed_time_sec
        const safeName = effort.name?.replace(/[^a-zA-Z0-9]/g, '') ?? 'PR'

        const startPt = nearest(relStartSec)
        const endPt = nearest(relEndSec)

        if (startPt.lat != null) {
          markersRef.current.push(
            new maplibregl.Marker({
              element: makePrEl(
                `${effort.name ?? 'PR'} start`,
                `prEffortStart_${safeName}_${mPrefix}`
              ),
            })
              .setLngLat([startPt.lng, startPt.lat])
              .addTo(map)
          )
        }
        if (endPt.lat != null) {
          markersRef.current.push(
            new maplibregl.Marker({
              element: makePrEl(effort.name ?? 'PR', `prEffortEnd_${safeName}_${mPrefix}`),
            })
              .setLngLat([endPt.lng, endPt.lat])
              .addTo(map)
          )
        }
      }
    }
  }

  // Swap tile style + route color when user toggles map/satellite
  // CF-1/WF-4 fix: setStyle wipes all custom sources/layers — re-add after style.load
  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false
    const map = mapRef.current

    map.setStyle(TILE_STYLES[mapStyle] ?? TILE_STYLES.map)

    map.once('style.load', () => {
      if (cancelled || !mlRef.current) return
      const coords = coordsRef.current
      if (!coords.length) return

      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } },
      })
      if (BORDER_COLORS[mapStyle]) {
        map.addLayer({
          id: 'route-border',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': BORDER_COLORS[mapStyle],
            'line-width': 6,
            'line-opacity': 0.5,
          },
        })
      }
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': POLYLINE_COLORS[mapStyle] ?? POLYLINE_COLORS.default,
          'line-width': 4,
          'line-opacity': 0.9,
        },
      })

      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      drawMarkers(mlRef.current, map, coords)
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
    <Tabs
      id="mapStyleToggle_activityDetailPage"
      value={mapStyle}
      onValueChange={onStyleChange}
      className="shrink-0 self-start"
    >
      <TabsList variant="pill" size="sm">
        <TabsTrigger id="mapStyleDefault_activityDetailPage" value="default">
          Map
        </TabsTrigger>
        <TabsTrigger id="mapStyleStreet_activityDetailPage" value="street">
          Street
        </TabsTrigger>
        <TabsTrigger id="mapStyleDark_activityDetailPage" value="dark">
          Dark
        </TabsTrigger>
      </TabsList>
    </Tabs>
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
  const [mapStyle, setMapStyle] = useState('default')
  const modalRef = useRef(null)

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
          <MapLibreRouteMap
            encodedPolyline={encodedPolyline}
            height={height}
            interactive={true}
            mapStyle={mapStyle}
            laps={laps}
            bestEfforts={bestEfforts}
            activityStartedAt={activityStartedAt}
            totalDistanceM={totalDistanceM}
            streams={streams}
            pagePrefix={pagePrefix}
          />
          <Button
            onClick={() => setExpanded(true)}
            variant="ghost"
            className="absolute bottom-2 right-2 z-[1000] bg-white/90 hover:bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm transition-colors"
            aria-label="Expand map"
          >
            <Maximize2 className="size-4 text-slate-600" aria-hidden="true" />
          </Button>
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
              <MapLibreRouteMap
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(false)}
                className="absolute top-3 right-3 z-[1000] bg-white/90 hover:bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm transition-colors"
                aria-label="Close map"
              >
                <X className="size-4 text-slate-600" aria-hidden="true" />
              </Button>
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
