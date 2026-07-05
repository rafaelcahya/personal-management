'use client'

import dynamic from 'next/dynamic'
import Button from '@/components/base/Button/Button'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

const RouteMap = dynamic(() => import('./RouteMap'), { ssr: false })

export default function MediaCarousel({
  polyline,
  photos,
  laps,
  bestEfforts,
  activityStartedAt,
  totalDistanceM,
  streams,
  pagePrefix = 'activityDetailPage',
}) {
  const [active, setActive] = useState(0)
  const [expandedPhoto, setExpandedPhoto] = useState(null)

  const hasPhotos = photos.length > 0
  const hasMap = !!polyline

  if (!hasMap && !hasPhotos) return null

  const routeMapProps = {
    laps,
    bestEfforts,
    activityStartedAt,
    totalDistanceM,
    streams,
    pagePrefix,
  }

  if (hasMap && !hasPhotos) {
    return (
      <RouteMap encodedPolyline={polyline} height={420} className="w-full" {...routeMapProps} />
    )
  }

  const slides = []
  if (hasMap) slides.push({ type: 'map' })
  photos.forEach((p) => {
    if (p.url_600) slides.push({ type: 'photo', url: p.url_600, id: p.unique_id })
  })

  if (slides.length === 0) return null

  const prev = () => setActive((a) => (a - 1 + slides.length) % slides.length)
  const next = () => setActive((a) => (a + 1) % slides.length)

  const current = slides[active]

  return (
    <>
      <div className="relative group/carousel isolate">
        <div className="w-full overflow-hidden" style={{ height: 420 }}>
          {current.type === 'map' ? (
            <RouteMap
              encodedPolyline={polyline}
              height={420}
              className="w-full"
              {...routeMapProps}
            />
          ) : (
            <img src={current.url} alt="Activity photo" className="w-full h-full object-cover" />
          )}
        </div>

        {current.type === 'photo' && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpandedPhoto(current.url)}
            className="absolute top-2 right-2 z-[1001] bg-white/80 hover:bg-white border border-slate-200 rounded-lg shadow-sm opacity-0 group-hover/carousel:opacity-100"
            aria-label="View full photo"
          >
            <Maximize2 className="size-4 text-slate-600" />
          </Button>
        )}

        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-[1001] bg-white/80 hover:bg-white border border-slate-200 rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100"
              aria-label="Previous"
            >
              <ChevronLeft className="size-4 text-slate-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-[1001] bg-white/80 hover:bg-white border border-slate-200 rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100"
              aria-label="Next"
            >
              <ChevronRight className="size-4 text-slate-600" />
            </Button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1001] flex gap-1.5">
              {slides.map((_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setActive(i)}
                  className={`size-1.5 rounded-full min-w-0 p-0 ${i === active ? 'bg-white shadow' : 'bg-white/50'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {expandedPhoto && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedPhoto}
              alt="Activity photo"
              className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setExpandedPhoto(null)}
              className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 rounded-full"
              aria-label="Close photo"
            >
              <X className="size-5 text-white" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
