'use client'

import { ArrowUpDown, Percent, Ruler, Activity, Gauge, Timer } from 'lucide-react'
import { StatTile, SectionLabel } from './activityShared'
import { fmtGroundContact, fmtOneDecimal, fmtStrideM, fmtGapPace } from '../../../utils/garmin'

const TILE_VALUE_CLASS = 'text-slate-800 tabular-nums'

export default function RunningFormSection({ garmin }) {
  if (!garmin) return null

  const tiles = [
    garmin.avg_ground_contact_time_ms != null && {
      id: 'groundContactTile_activityDetailPage',
      icon: Timer,
      label: 'Ground contact',
      value: fmtGroundContact(garmin.avg_ground_contact_time_ms),
      unit: 'ms',
    },
    garmin.avg_vertical_oscillation_cm != null && {
      id: 'verticalOscillationTile_activityDetailPage',
      icon: ArrowUpDown,
      label: 'Vertical oscillation',
      value: fmtOneDecimal(garmin.avg_vertical_oscillation_cm),
      unit: 'cm',
    },
    garmin.avg_vertical_ratio_pct != null && {
      id: 'verticalRatioTile_activityDetailPage',
      icon: Percent,
      label: 'Vertical ratio',
      value: fmtOneDecimal(garmin.avg_vertical_ratio_pct),
      unit: '%',
    },
    garmin.avg_stride_length_cm != null && {
      id: 'strideLengthTile_activityDetailPage',
      icon: Ruler,
      label: 'Stride length',
      value: fmtStrideM(garmin.avg_stride_length_cm),
      unit: 'm',
    },
    garmin.avg_run_cadence_spm != null && {
      id: 'garminCadenceTile_activityDetailPage',
      icon: Activity,
      label: 'Cadence (both legs)',
      value: Math.round(garmin.avg_run_cadence_spm),
      unit: 'spm',
    },
    garmin.grade_adjusted_pace_sec_per_km != null && {
      id: 'garminGapTile_activityDetailPage',
      icon: Gauge,
      label: 'Grade-adj. pace',
      value: fmtGapPace(garmin.grade_adjusted_pace_sec_per_km),
      unit: '/km',
    },
  ].filter(Boolean)

  if (tiles.length === 0) return null

  return (
    <section id="runningFormSection_activityDetailPage" aria-label="Running form">
      <SectionLabel>Running Form</SectionLabel>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tiles.map((t) => (
          <StatTile key={t.id} {...t} valueClassName={TILE_VALUE_CLASS} />
        ))}
      </div>
    </section>
  )
}
