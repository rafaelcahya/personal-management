'use client'

import { Watch } from 'lucide-react'
import { Badge } from '@/components/base/Badge/Badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/base/Tooltip/Tooltip'
import { getTeLabel } from '../../../utils/garmin'

/** Training Effect badge and the small Garmin mark for one row of the activities list. */
export default function GarminListChips({ activityId, trainingEffectLabel, hasGarmin }) {
  const te = getTeLabel(trainingEffectLabel)

  return (
    <>
      {te && (
        <Badge
          id={`teBadge_${activityId}_activitiesPage`}
          size="xs"
          radius="sm"
          className={`py-0.5 ${te.badge}`}
        >
          {te.short}
        </Badge>
      )}
      {hasGarmin && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              id={`garminIndicator_${activityId}_activitiesPage`}
              className="inline-flex items-center shrink-0"
            >
              <Watch className="size-3 text-slate-300" aria-hidden="true" />
              <span className="sr-only">Garmin data</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>Has Garmin data</TooltipContent>
        </Tooltip>
      )}
    </>
  )
}
