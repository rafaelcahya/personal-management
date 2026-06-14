'use client'

import { useState, useEffect } from 'react'
import { Heart, Gauge, Activity, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchZoneAnalytics, fetchGearAnalytics } from '@/lib/api/running'
import ZoneFilterBar from './ZoneFilterBar'
import HrZoneBreakdown from './HrZoneBreakdown'
import PaceZoneBreakdown from './PaceZoneBreakdown'
import CadenceZoneBreakdown from './CadenceZoneBreakdown'
import GearUsageBreakdown from './GearUsageBreakdown'

function SubSection({ icon: Icon, title, id, children }) {
  return (
    <div id={id} className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function ZoneAnalyticsSection() {
  const [range, setRange] = useState('3m')
  const [activityType, setActivityType] = useState('All')
  const [zoneData, setZoneData] = useState(null)
  const [gearData, setGearData] = useState(null)
  const [zoneError, setZoneError] = useState(null)
  const [gearError, setGearError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setZoneError(null)
      setGearError(null)

      const [zonesRes, gearRes] = await Promise.allSettled([
        fetchZoneAnalytics(range, activityType),
        fetchGearAnalytics(range, activityType),
      ])

      if (!alive) return

      if (zonesRes.status === 'fulfilled') {
        setZoneData(zonesRes.value)
      } else {
        setZoneData(null)
        setZoneError('Failed to load zone data')
      }

      if (gearRes.status === 'fulfilled') {
        setGearData(gearRes.value)
      } else {
        setGearData(null)
        setGearError('Failed to load gear data')
      }

      setLoading(false)
    }

    load()
    return () => {
      alive = false
    }
  }, [range, activityType])

  return (
    <section
      id="zoneAnalyticsSection_analyticsPage"
      aria-label="Zone Analytics"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Zone Analytics
        </h2>
        <p className="text-xs text-slate-400">
          Training distribution across HR zones, pace, cadence, and gear — aggregated across
          activities.
        </p>
      </div>

      <ZoneFilterBar
        range={range}
        activityType={activityType}
        onRangeChange={setRange}
        onTypeChange={setActivityType}
      />

      {loading && (
        <div
          id="zoneAnalyticsLoading_analyticsPage"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-label="Loading zone analytics"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 rounded-xl animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-slate-200/70 shadow-sm py-0">
            <CardContent className="px-5 py-5">
              <SubSection id="hrZoneSubSection_analyticsPage" icon={Heart} title="HR Zones">
                <HrZoneBreakdown data={zoneData?.hr ?? null} error={zoneError} />
              </SubSection>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/70 shadow-sm py-0">
            <CardContent className="px-5 py-5">
              <SubSection id="paceZoneSubSection_analyticsPage" icon={Gauge} title="Pace Zones">
                <PaceZoneBreakdown data={zoneData?.pace ?? null} error={zoneError} />
              </SubSection>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/70 shadow-sm py-0">
            <CardContent className="px-5 py-5">
              <SubSection
                id="cadenceZoneSubSection_analyticsPage"
                icon={Activity}
                title="Cadence Bands"
              >
                <CadenceZoneBreakdown data={zoneData?.cadence ?? null} error={zoneError} />
              </SubSection>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/70 shadow-sm py-0">
            <CardContent className="px-5 py-5">
              <SubSection id="gearUsageSubSection_analyticsPage" icon={Package} title="Gear Usage">
                <GearUsageBreakdown gear={gearData} error={gearError} />
              </SubSection>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
