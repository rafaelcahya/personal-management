import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { injuryCoachRequestSchema } from '@/schemas/runningSymptoms'
import { getActiveSymptomLogs } from '@/lib/services/running/symptoms/symptomLog'
import { buildPhysioPrompt, buildSportsMedicinePrompt } from '@/lib/services/running/ai/prompts'
import { generateInsight } from '@/lib/services/running/ai/generateInsight'

const ESCALATE_TOKEN = '[ESCALATE]'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = injuryCoachRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { role, body_part, injuryPhase, question, pain_level, activity_id } = parsed.data

    const [profile, activeSymptoms, recentActivities, trainingLoad, referenceActivity] =
      await Promise.all([
        getProfile(supabase, user.id),
        getActiveSymptomLogs(supabase, user.id),
        getRecentActivities(supabase, user.id),
        getTrainingLoad(supabase, user.id),
        activity_id ? getReferenceActivity(supabase, user.id, activity_id) : Promise.resolve(null),
      ])

    if (pain_level !== undefined && body_part) {
      const { error: symptomError } = await supabase.from('rt_symptom_logs').insert({
        user_id: user.id,
        body_region: body_part,
        pain_level,
      })
      if (symptomError) {
        console.error('[running/ai/injury-coach] Failed to log symptom:', symptomError.message)
      }
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Not found', message: 'Runner profile not found' },
        { status: 404 }
      )
    }

    const context = buildInjuryContext({
      profile,
      activeSymptoms,
      recentActivities,
      trainingLoad,
      referenceActivity,
      bodyPart: body_part,
      injuryPhase,
      question,
    })

    const systemPrompt =
      role === 'physio'
        ? buildPhysioPrompt(profile, context)
        : buildSportsMedicinePrompt(profile, context)

    const userContent = `Athlete's question: ${question}`

    const { output, isValid } = await generateInsight({
      systemPrompt,
      userContent,
      insightType: 'injury_coach',
      maxTokens: 1200,
    })

    const escalate = output.includes(ESCALATE_TOKEN)
    const cleanedContent = output.replace(ESCALATE_TOKEN, '').trim()

    const { data: savedInsight, error: saveError } = await supabase
      .from('rt_ai_insights')
      .insert({
        user_id: user.id,
        insight_type: 'injury_coach',
        status: isValid ? 'ready' : 'invalid',
        is_valid: isValid,
        content: cleanedContent,
        data_refs: {
          role,
          body_part: body_part ?? null,
          injuryPhase: injuryPhase ?? null,
          escalate,
          symptom_count: activeSymptoms.length,
        },
      })
      .select('id, created_at')
      .single()

    if (saveError) {
      console.error('[running/ai/injury-coach] Failed to save insight:', saveError.message)
    }

    return NextResponse.json(
      {
        data: {
          content: cleanedContent,
          role,
          created_at: savedInsight?.created_at ?? new Date().toISOString(),
        },
        escalate,
        message: 'OK',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[running/ai/injury-coach POST]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

async function getProfile(supabase, userId) {
  const { data } = await supabase
    .from('rt_users')
    .select('display_name, birth_date, max_hr, resting_hr_baseline, height_cm, weight_kg')
    .eq('id', userId)
    .maybeSingle()
  return data
}

async function getRecentActivities(supabase, userId) {
  const since = new Date()
  since.setDate(since.getDate() - 14)

  const { data } = await supabase
    .from('rt_activities')
    .select('started_at, distance_m, avg_pace_sec_per_km, avg_hr, activity_type, duration_sec')
    .eq('user_id', userId)
    .gte('started_at', since.toISOString())
    .order('started_at', { ascending: false })
    .limit(20)

  return data ?? []
}

async function getReferenceActivity(supabase, userId, activityId) {
  const { data } = await supabase
    .from('rt_activities')
    .select(
      'id, started_at, distance_m, duration_sec, avg_pace_sec_per_km, avg_hr, max_hr, avg_cadence, elevation_gain_m, avg_watts, aerobic_decoupling, activity_type'
    )
    .eq('id', activityId)
    .eq('user_id', userId)
    .maybeSingle()
  return data
}

async function getTrainingLoad(supabase, userId) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('rt_daily_training_metrics')
    .select('acwr, acute_load_7d, chronic_load_28d, training_load')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()
  return data
}

function sanitizeUserText(text, maxLength) {
  return text
    .replace(/\[.*?\]/g, '')
    .trim()
    .slice(0, maxLength)
}

function fmtPace(secPerKm) {
  if (!secPerKm) return null
  const m = Math.floor(secPerKm / 60)
  const s = String(secPerKm % 60).padStart(2, '0')
  return `${m}:${s}/km`
}

function buildInjuryContext({
  profile,
  activeSymptoms,
  recentActivities,
  trainingLoad,
  referenceActivity,
  bodyPart,
  injuryPhase,
  question,
}) {
  const lines = []

  if (referenceActivity) {
    lines.push("=== USER'S REFERENCE RUN FOR THIS QUESTION ===")
    const date = referenceActivity.started_at
      ? new Date(referenceActivity.started_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : null
    if (date) lines.push(`Date: ${date}`)
    if (referenceActivity.activity_type) lines.push(`Type: ${referenceActivity.activity_type}`)
    if (referenceActivity.distance_m)
      lines.push(`Distance: ${(referenceActivity.distance_m / 1000).toFixed(2)} km`)
    if (referenceActivity.duration_sec) {
      const h = Math.floor(referenceActivity.duration_sec / 3600)
      const m = Math.floor((referenceActivity.duration_sec % 3600) / 60)
      const s = referenceActivity.duration_sec % 60
      lines.push(`Duration: ${h > 0 ? `${h}h ` : ''}${m}m ${s}s`)
    }
    if (referenceActivity.avg_pace_sec_per_km)
      lines.push(`Avg pace: ${fmtPace(referenceActivity.avg_pace_sec_per_km)}`)
    if (referenceActivity.avg_hr) lines.push(`Avg HR: ${referenceActivity.avg_hr} bpm`)
    if (referenceActivity.max_hr) lines.push(`Max HR: ${referenceActivity.max_hr} bpm`)
    if (referenceActivity.avg_cadence)
      lines.push(`Avg cadence: ${referenceActivity.avg_cadence} spm`)
    if (referenceActivity.elevation_gain_m)
      lines.push(`Elevation gain: ${referenceActivity.elevation_gain_m} m`)
    if (referenceActivity.avg_watts) lines.push(`Avg power: ${referenceActivity.avg_watts} W`)
    if (referenceActivity.aerobic_decoupling != null)
      lines.push(`Aerobic decoupling: ${referenceActivity.aerobic_decoupling}%`)
    lines.push('')
  }

  lines.push('=== ATHLETE PROFILE ===')
  if (profile.display_name) lines.push(`Name: ${profile.display_name}`)
  if (profile.birth_date) {
    const age = calcAge(profile.birth_date)
    if (age) lines.push(`Age: ${age}`)
  }
  if (profile.height_cm) lines.push(`Height: ${profile.height_cm} cm`)
  if (profile.weight_kg) lines.push(`Weight: ${profile.weight_kg} kg`)
  if (profile.max_hr) lines.push(`Max HR: ${profile.max_hr} bpm`)

  lines.push('')
  lines.push('=== REPORTED SYMPTOMS ===')
  if (activeSymptoms.length === 0) {
    lines.push('No active symptoms logged.')
  } else {
    for (const s of activeSymptoms) {
      const parts = [
        `Body region: ${s.body_region}`,
        `Pain level: ${s.pain_level}/10`,
        s.pain_type ? `Pain type: ${s.pain_type}` : null,
        s.occurs_when ? `Occurs: ${s.occurs_when}` : null,
        s.notes ? `Notes: <user_notes>${sanitizeUserText(s.notes, 500)}</user_notes>` : null,
      ].filter(Boolean)
      lines.push(`- ${parts.join(' | ')}`)
      lines.push(`  Logged: ${new Date(s.logged_at).toLocaleDateString('en-GB')}`)
    }
  }

  if (bodyPart) {
    lines.push('')
    lines.push(`Focus body part: ${bodyPart}`)
  }
  if (injuryPhase) {
    lines.push(`Injury phase: ${injuryPhase}`)
  }

  lines.push('')
  lines.push('=== TRAINING LOAD ===')
  if (trainingLoad) {
    if (trainingLoad.acwr != null) lines.push(`ACWR: ${trainingLoad.acwr}`)
    if (trainingLoad.acute_load_7d != null)
      lines.push(`Acute load (7d): ${trainingLoad.acute_load_7d}`)
    if (trainingLoad.chronic_load_28d != null)
      lines.push(`Chronic load (28d): ${trainingLoad.chronic_load_28d}`)
  } else {
    lines.push('No training load data available.')
  }

  lines.push('')
  lines.push('=== RECENT ACTIVITIES (last 14 days) ===')
  if (recentActivities.length === 0) {
    lines.push('No activities in the last 14 days.')
  } else {
    for (const a of recentActivities) {
      const date = a.started_at
        ? new Date(a.started_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        : ''
      const dist = a.distance_m ? `${(a.distance_m / 1000).toFixed(1)} km` : null
      const hr = a.avg_hr ? `HR avg ${a.avg_hr} bpm` : null
      const type = a.activity_type ?? 'Run'
      const parts = [type, dist, hr].filter(Boolean).join(' | ')
      lines.push(`${date}: ${parts}`)
    }
  }

  lines.push('')
  lines.push('=== ATHLETE QUESTION ===')
  lines.push(`<user_question>${sanitizeUserText(question, 1000)}</user_question>`)

  return lines.join('\n')
}

function calcAge(birthDate) {
  if (!birthDate) return null
  const now = new Date()
  const birth = new Date(birthDate)
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}
