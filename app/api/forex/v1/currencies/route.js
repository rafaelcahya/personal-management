import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    const res = await fetch('https://api.frankfurter.dev/v2/currencies', {
      next: { revalidate: 86400 },
    })

    if (!res.ok) throw new Error('Failed to fetch currencies from Frankfurter')

    const data = await res.json()
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Bad gateway', message: 'Unexpected response from Frankfurter API' },
        { status: 502 }
      )
    }

    const currencies = Object.fromEntries(
      data
        .filter((entry) => entry.iso_code && entry.iso_code !== 'IDR')
        .map((entry) => [
          entry.iso_code,
          { name: String(entry.name ?? ''), symbol: String(entry.symbol ?? '') },
        ])
    )

    return NextResponse.json({ data: currencies, message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[forex/currencies]', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
