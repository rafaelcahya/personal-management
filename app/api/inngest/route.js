import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { generatePostActivityInsight } from '@/lib/inngest/functions/generatePostActivityInsight'
import { generateAnalyticsSummary } from '@/lib/inngest/functions/generateAnalyticsSummary'
import { checkAnomaly } from '@/lib/inngest/functions/checkAnomaly'
import { weeklyReview } from '@/lib/inngest/functions/weeklyReview'
import { dailyInsight } from '@/lib/inngest/functions/dailyInsight'
import { fridayPrepNotification } from '@/lib/inngest/functions/fridayPrepNotification'
import { stravaFetchStreams } from '@/lib/inngest/functions/stravaFetchStreams'
import { stravaBackfill } from '@/lib/inngest/functions/stravaBackfill'
import { stravaHandleWebhookEvent } from '@/lib/inngest/functions/stravaHandleWebhookEvent'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generatePostActivityInsight,
    generateAnalyticsSummary,
    checkAnomaly,
    weeklyReview,
    dailyInsight,
    fridayPrepNotification,
    stravaFetchStreams,
    stravaBackfill,
    stravaHandleWebhookEvent,
  ],
})
