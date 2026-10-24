'use client'

import { BatteryMedium, Droplets } from 'lucide-react'
import { Badge } from '@/components/base/Badge/Badge'
import { StatTile } from './activityShared'
import TeMeter from './TeMeter'
import { getTeLabel, fmtBodyBattery, fmtSweat } from '../../../utils/garmin'

const TILE_VALUE_CLASS = 'text-slate-800 tabular-nums'

export default function TrainingEffectSection({ garmin }) {
  if (!garmin) return null

  const aerobic = garmin.training_effect_aerobic
  const anaerobic = garmin.training_effect_anaerobic
  const label = getTeLabel(garmin.training_effect_label)
  const sweat = garmin.sweat_loss_ml != null ? fmtSweat(garmin.sweat_loss_ml) : null
  const hasBattery = garmin.body_battery_delta != null

  if (aerobic == null && anaerobic == null && !label && !hasBattery && !sweat) return null

  return (
    <section id="trainingEffectSection_activityDetailPage" aria-label="Training effect">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Training Effect
        </p>
        {label && (
          <Badge
            id="trainingEffectLabel_activityDetailPage"
            size="sm"
            className={`font-semibold ${label.badge}`}
          >
            {label.long}
          </Badge>
        )}
      </div>

      {(aerobic != null || anaerobic != null) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
          {aerobic != null && (
            <TeMeter
              id="aerobicTeMeter_activityDetailPage"
              title="Aerobic training effect"
              caption="Aerobic"
              value={aerobic}
              message={garmin.aerobic_te_message}
            />
          )}
          {anaerobic != null && (
            <TeMeter
              id="anaerobicTeMeter_activityDetailPage"
              title="Anaerobic training effect"
              caption="Anaerobic"
              value={anaerobic}
              message={garmin.anaerobic_te_message}
            />
          )}
        </div>
      )}

      {(hasBattery || sweat) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {hasBattery && (
            <StatTile
              id="bodyBatteryTile_activityDetailPage"
              icon={BatteryMedium}
              label="Body battery"
              value={fmtBodyBattery(garmin.body_battery_delta)}
              valueClassName={TILE_VALUE_CLASS}
            />
          )}
          {sweat && (
            <StatTile
              id="sweatLossTile_activityDetailPage"
              icon={Droplets}
              label="Sweat loss"
              value={sweat.value}
              unit={sweat.unit}
              valueClassName={TILE_VALUE_CLASS}
            />
          )}
        </div>
      )}
    </section>
  )
}
