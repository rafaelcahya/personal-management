import { NextResponse } from 'next/server'

export async function GET(request) {
  const clientId = process.env.STRAVA_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: 'Strava integration is not configured' }, { status: 503 })
  }

  const redirectUri = new URL('/api/running/v1/auth/strava/callback', request.url).toString()

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    approval_prompt: 'auto',
    scope: 'read,activity:read_all,profile:read_all',
  })

  return NextResponse.redirect(`https://www.strava.com/oauth/authorize?${params.toString()}`)
}
