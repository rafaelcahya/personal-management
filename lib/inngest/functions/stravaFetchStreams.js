import { inngest } from '@/lib/inngest/client'

export const stravaFetchStreams = inngest.createFunction(
  { id: 'strava-fetch-streams', retries: 3, triggers: [{ event: 'strava/fetch-streams' }] },
  async ({ event, step }) => {
    const { activityId, userId, _stravaActivityId } = event.data

    await step.run('fetch-activity-detail', async () => {
      // TODO: fetch activity detail from Strava API
      // TODO: upsert into rt_activities
    })

    await step.run('fetch-streams', async () => {
      // TODO: fetch HR/GPS/pace/cadence streams from Strava
      // TODO: insert into rt_activity_streams
    })

    await step.run('compute-splits', async () => {
      // TODO: compute splits if not provided by Strava
      // TODO: insert into rt_activity_splits
    })

    await step.sendEvent('trigger-insight', {
      name: 'ai/generate-post-activity-insight',
      data: { activityId, userId },
    })
  }
)
