import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { waypoints } = await request.json()
  if (!waypoints?.length || waypoints.length < 2) {
    return NextResponse.json({ error: 'at least 2 waypoints required' }, { status: 400 })
  }

  const coordStr = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(';')

  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/walking/${coordStr}?geometries=geojson&overview=full`
    )
    const data = await res.json()
    if (!res.ok || data.code !== 'Ok') {
      return NextResponse.json(
        { error: data.message ?? 'directions failed' },
        { status: res.ok ? 422 : res.status }
      )
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'directions failed' }, { status: 500 })
  }
}
