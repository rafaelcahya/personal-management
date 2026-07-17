import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FINNHUB_BASE = 'https://finnhub.io/api/v1'
const ALLOWED_TYPES = new Set(['Common Stock', 'ETP', 'ETF', 'ADR'])

async function finnhubGet(endpoint) {
  const key = process.env.FINNHUB_API_KEY
  const sep = endpoint.includes('?') ? '&' : '?'
  const res = await fetch(`${FINNHUB_BASE}${endpoint}${sep}token=${key}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Finnhub ${res.status}`)
  return res.json()
}

export async function GET(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.FINNHUB_API_KEY) {
      return NextResponse.json({ error: 'FINNHUB_API_KEY is not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    if (!q || q.length < 1) {
      return NextResponse.json({ success: true, data: [] })
    }

    const data = await finnhubGet(`/search?q=${encodeURIComponent(q)}`)
    const results = (data?.result ?? [])
      .filter((r) => ALLOWED_TYPES.has(r.type))
      .slice(0, 10)
      .map((r) => ({
        value: r.symbol,
        label: `${r.displaySymbol} — ${r.description}`,
        symbol: r.displaySymbol,
        description: r.description,
        type: r.type,
      }))

    return NextResponse.json({ success: true, data: results })
  } catch (err) {
    console.error('[research/symbol-search]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
