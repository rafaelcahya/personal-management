import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { inngest } from '@/lib/inngest/client'
import { isStravaStubbed } from '@/lib/services/running/strava/stravaStub'

// Each queued activity costs Strava API calls; the user can call this again for the next batch.
const RE_ENRICH_BATCH_CAP = 100

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

    const { data: credentials, error: credError } = await admin
      .from('rt_strava_credentials')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (credError) throw new Error(credError.message)
    if (!credentials) {
      return NextResponse.json({ error: 'Strava not connected' }, { status: 400 })
    }

    // enriched_at is set once the streams are stored, so null means still missing streams.
    const { data: activities, error: fetchError } = await admin
      .from('rt_activities')
      .select('id, external_id')
      .eq('user_id', user.id)
      .eq('source', 'strava')
      .not('external_id', 'is', null)
      .is('enriched_at', null)
      .order('started_at', { ascending: false })
      .limit(RE_ENRICH_BATCH_CAP)

    if (fetchError) {
      throw new Error(fetchError.message)
    }

    if (!activities || activities.length === 0) {
      return NextResponse.json({ queued: 0 })
    }

    if (isStravaStubbed()) {
      return NextResponse.json({ queued: activities.length, stubbed: true })
    }

    await inngest.send(
      activities.map((a) => ({
        id: `fetch-streams-${a.id}`,
        name: 'strava/fetch-streams',
        data: { activityId: a.id, userId: user.id, stravaActivityId: a.external_id },
      }))
    )

    return NextResponse.json({ queued: activities.length })
  } catch (err) {
    console.error('[strava/re-enrich]', err)
    return NextResponse.json({ error: 'Re-enrich failed' }, { status: 500 })
  }
}
