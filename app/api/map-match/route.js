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

  const { coordinates } = await request.json()
  if (!coordinates?.length) {
    return NextResponse.json({ error: 'coordinates required' }, { status: 400 })
  }

  const coordStr = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';')
  const radiuses = coordinates.map(() => '25').join(';')

  try {
    const res = await fetch(
      `https://router.project-osrm.org/match/v1/walking/${coordStr}?geometries=geojson&radiuses=${radiuses}&overview=full`
    )
    const data = await res.json()
    if (!res.ok || data.code !== 'Ok') {
      return NextResponse.json(
        { error: data.message ?? 'map matching failed' },
        { status: res.ok ? 422 : res.status }
      )
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'map matching failed' }, { status: 500 })
  }
}
