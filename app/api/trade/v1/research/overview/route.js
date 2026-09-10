import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCachedResearch } from '@/lib/services/trading/research/getResearchCache'

const FINNHUB_BASE = 'https://finnhub.io/api/v1'

async function finnhubGet(endpoint) {
  const key = process.env.FINNHUB_API_KEY
  const sep = endpoint.includes('?') ? '&' : '?'
  const res = await fetch(`${FINNHUB_BASE}${endpoint}${sep}token=${key}`)
  if (!res.ok) throw new Error(`Finnhub ${res.status}`)
  return res.json()
}

async function computeOverview(ticker) {
  const [recResult, ptResult] = await Promise.allSettled([
    finnhubGet(`/stock/recommendation?symbol=${encodeURIComponent(ticker)}`),
    finnhubGet(`/stock/price-target?symbol=${encodeURIComponent(ticker)}`),
  ])

  const recData = recResult.status === 'fulfilled' ? recResult.value : null
  const ptData = ptResult.status === 'fulfilled' ? ptResult.value : null

  // Most recent recommendation period
  const latestRec =
    Array.isArray(recData) && recData.length > 0
      ? recData.sort((a, b) => b.period.localeCompare(a.period))[0]
      : null

  const recommendation = latestRec
    ? {
        period: latestRec.period,
        strongBuy: latestRec.strongBuy ?? 0,
        buy: latestRec.buy ?? 0,
        hold: latestRec.hold ?? 0,
        sell: latestRec.sell ?? 0,
        strongSell: latestRec.strongSell ?? 0,
        total:
          (latestRec.strongBuy ?? 0) +
          (latestRec.buy ?? 0) +
          (latestRec.hold ?? 0) +
          (latestRec.sell ?? 0) +
          (latestRec.strongSell ?? 0),
      }
    : null

  const priceTarget =
    ptData && ptData.targetMean
      ? {
          low: ptData.targetLow ?? null,
          mean: ptData.targetMean ?? null,
          high: ptData.targetHigh ?? null,
          median: ptData.targetMedian ?? null,
          lastUpdated: ptData.lastUpdated ?? null,
        }
      : null

  return { ticker, recommendation, priceTarget }
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
    const ticker = searchParams.get('ticker')?.trim().toUpperCase()
    if (!ticker) {
      return NextResponse.json({ error: 'ticker is required' }, { status: 400 })
    }

    const data = await getCachedResearch(ticker, 'overview', () => computeOverview(ticker))

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[research/overview]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
