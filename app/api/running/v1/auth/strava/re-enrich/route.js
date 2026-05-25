import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { inngest } from '@/lib/inngest/client'

export async function POST(_request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: credentials } = await admin
      .from('rt_strava_credentials')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!credentials) {
      return NextResponse.json({ error: 'Strava not connected' }, { status: 400 })
    }

    // Fetch all Strava activities for this user
    const { data: activities, error: fetchError } = await admin
      .from('rt_activities')
      .select('id, external_id')
      .eq('user_id', user.id)
      .eq('source', 'strava')
      .not('external_id', 'is', null)

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!activities || activities.length === 0) {
      return NextResponse.json({ queued: 0 })
    }

    await inngest.send(
      activities.map((a) => ({
        name: 'strava/fetch-streams',
        data: { activityId: a.id, userId: user.id, stravaActivityId: a.external_id },
      }))
    )

    return NextResponse.json({ queued: activities.length })
  } catch (err) {
    console.error('[strava/re-enrich]', err.message)
    return NextResponse.json({ error: 'Re-enrich failed' }, { status: 500 })
  }
}
