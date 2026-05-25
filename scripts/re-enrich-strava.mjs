import { createClient } from '@supabase/supabase-js'
import { Inngest } from 'inngest'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const inngest = new Inngest({
  id: 'personal-management',
  eventKey: process.env.INNGEST_EVENT_KEY,
})

const { data: activities, error } = await supabase
  .from('rt_activities')
  .select('id, external_id, user_id')
  .eq('source', 'strava')
  .not('external_id', 'is', null)

if (error) {
  console.error('Failed to fetch activities:', error.message)
  process.exit(1)
}

if (!activities || activities.length === 0) {
  console.log('No Strava activities found.')
  process.exit(0)
}

console.log(`Found ${activities.length} Strava activities. Sending fetch-streams events...`)

await inngest.send(
  activities.map((a) => ({
    name: 'strava/fetch-streams',
    data: { activityId: a.id, userId: a.user_id, stravaActivityId: a.external_id },
  }))
)

console.log(`Done — queued ${activities.length} activities for enrichment.`)
