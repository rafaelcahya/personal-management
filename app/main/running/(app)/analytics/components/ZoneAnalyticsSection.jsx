'use client'

import { useState, useEffect } from 'react'
import { Heart, Gauge, Activity, Package, BarChart2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchZoneAnalytics, fetchGearAnalytics, fetchActivityTypes } from '@/lib/api/running'
import ZoneFilterBar from './ZoneFilterBar'
import HrZoneBreakdown from './HrZoneBreakdown'
import PaceZoneBreakdown from './PaceZoneBreakdown'
import CadenceZoneBreakdown from './CadenceZoneBreakdown'
import GearUsageBreakdown from './GearUsageBreakdown'

const HR_METHOD_LABELS = {
  max_hr: 'Max HR',
  karvonen: 'Heart Rate Reserve',
  threshold: 'Lactate Threshold',
}

function SubSection({ icon: Icon, title, meta, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</h3>
        {meta && (
          <>
            <span className="text-[10px] text-slate-300">·</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">{meta}</span>
          </>
        )}
      </div>
      {children}
    </div>
  )
}

export default function ZoneAnalyticsSection() {
  const [range, setRange] = useState('3m')
  const [activityType, setActivityType] = useState('Run')
  const [activityTypes, setActivityTypes] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [zoneData, setZoneData] = useState(null)
  const [gearData, setGearData] = useState(null)
  const [zoneError, setZoneError] = useState(null)
  const [gearError, setGearError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityTypes()
      .then((types) => setActivityTypes(types))
      .catch(() =>
        setActivityTypes(['Run', 'TrailRun', 'VirtualRun', 'Walk', 'Hike', 'Ride', 'Swim'])
      )
  }, [])

  const hasCustomDates = !!(startDate && endDate)
  const effectiveRange = hasCustomDates ? 'custom' : range

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setZoneError(null)
      setGearError(null)

      const tzOffset = new Date().getTimezoneOffset()
      const [zonesRes, gearRes] = await Promise.allSettled([
        fetchZoneAnalytics(effectiveRange, activityType, startDate, endDate, tzOffset),
        fetchGearAnalytics(effectiveRange, activityType, startDate, endDate, tzOffset),
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
  }, [effectiveRange, activityType, startDate, endDate])

  return (
    <section id="zoneAnalyticsSection_analyticsPage" aria-label="Zone Analytics">
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <BarChart2 className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">Zone Analytics</h3>
            </div>
            <p className="text-xs text-slate-400">
              Training distribution across HR zones, pace, cadence, and gear — aggregated across
              activities.
            </p>
          </div>

          <ZoneFilterBar
            range={range}
            activityType={activityType}
            activityTypes={activityTypes}
            startDate={startDate}
            endDate={endDate}
            onRangeChange={setRange}
            onTypeChange={setActivityType}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {!loading && zoneData != null && (
            <p id="zoneActivityCount_analyticsPage" className="text-xs text-slate-400">
              {zoneData.activity_count === 0
                ? 'No activities in this range'
                : `${zoneData.activity_count} ${zoneData.activity_count === 1 ? 'activity' : 'activities'} in this range`}
            </p>
          )}

          {loading && (
            <div
              id="zoneAnalyticsLoading_analyticsPage"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                id="hrZoneSubSection_analyticsPage"
                className="flex flex-col gap-3 border-t border-slate-100 pt-4"
              >
                <SubSection
                  icon={Heart}
                  title="HR Zones"
                  meta={HR_METHOD_LABELS[zoneData?.hr?.method] ?? null}
                >
                  <HrZoneBreakdown data={zoneData?.hr ?? null} error={zoneError} />
                </SubSection>
              </div>

              <div
                id="paceZoneSubSection_analyticsPage"
                className="flex flex-col gap-3 border-t border-slate-100 pt-4"
              >
                <SubSection icon={Gauge} title="Pace Zones">
                  <PaceZoneBreakdown data={zoneData?.pace ?? null} error={zoneError} />
                </SubSection>
              </div>

              <div
                id="cadenceZoneSubSection_analyticsPage"
                className="flex flex-col gap-3 border-t border-slate-100 pt-4"
              >
                <SubSection icon={Activity} title="Cadence Bands">
                  <CadenceZoneBreakdown data={zoneData?.cadence ?? null} error={zoneError} />
                </SubSection>
              </div>

              <div
                id="gearUsageSubSection_analyticsPage"
                className="flex flex-col gap-3 border-t border-slate-100 pt-4"
              >
                <SubSection icon={Package} title="Gear Usage">
                  <GearUsageBreakdown gear={gearData} error={gearError} />
                </SubSection>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
