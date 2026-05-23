// GET /api/running/v1/sync/webhook → Strava challenge verification
// POST /api/running/v1/sync/webhook → Strava event handler

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const challenge = searchParams.get('hub.challenge')
  const token = searchParams.get('hub.verify_token')

  if (mode === 'subscribe' && token === process.env.STRAVA_WEBHOOK_VERIFY_SECRET) {
    return Response.json({ 'hub.challenge': challenge })
  }

  return new Response('Forbidden', { status: 403 })
}

export async function POST(request) {
  const event = await request.json()
  // { aspect_type: 'create'|'update'|'delete', object_id, object_type, owner_id }

  // Langsung return 200 — Strava expects response < 2 detik
  // Proses async via Inngest
  const { inngest } = await import('@/lib/inngest/client')
  await inngest.send({
    name: 'strava/handle-webhook-event',
    data: event,
  })

  return new Response('OK', { status: 200 })
}
