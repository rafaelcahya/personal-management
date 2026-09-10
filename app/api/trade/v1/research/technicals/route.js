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

function lastValue(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null
  return arr[arr.length - 1]
}

function rsiInterpretation(value) {
  if (value >= 70) return 'overbought'
  if (value <= 30) return 'oversold'
  return 'neutral'
}

function macdSignal(hist) {
  if (hist == null) return 'neutral'
  if (hist > 0) return 'bullish'
  if (hist < 0) return 'bearish'
  return 'neutral'
}

async function computeTechnicals(ticker) {
  const toTs = Math.floor(Date.now() / 1000)
  const fromTs = toTs - 180 * 24 * 60 * 60

  const rsiFields = encodeURIComponent(JSON.stringify({ timeperiod: 14 }))
  const macdFields = encodeURIComponent(
    JSON.stringify({ fastperiod: 12, slowperiod: 26, signalperiod: 9 })
  )
  const sym = encodeURIComponent(ticker)

  const [rsiResult, macdResult, patternResult] = await Promise.allSettled([
    finnhubGet(
      `/indicator?symbol=${sym}&resolution=D&from=${fromTs}&to=${toTs}&indicator=rsi&indicator_fields=${rsiFields}`
    ),
    finnhubGet(
      `/indicator?symbol=${sym}&resolution=D&from=${fromTs}&to=${toTs}&indicator=macd&indicator_fields=${macdFields}`
    ),
    finnhubGet(`/scan/pattern?symbol=${sym}&resolution=D`),
  ])

  const rsiData = rsiResult.status === 'fulfilled' ? rsiResult.value : null
  const macdData = macdResult.status === 'fulfilled' ? macdResult.value : null
  const patternData = patternResult.status === 'fulfilled' ? patternResult.value : null

  const rsiValue = lastValue(rsiData?.rsi)
  const rsi =
    rsiValue != null
      ? { value: parseFloat(rsiValue.toFixed(2)), interpretation: rsiInterpretation(rsiValue) }
      : null

  const macdValue = lastValue(macdData?.macd)
  const macdSignalValue = lastValue(macdData?.macdSignal)
  const macdHistValue = lastValue(macdData?.macdHist)
  const macd =
    macdValue != null
      ? {
          macd: parseFloat(macdValue.toFixed(4)),
          signal: parseFloat((macdSignalValue ?? 0).toFixed(4)),
          histogram: parseFloat((macdHistValue ?? 0).toFixed(4)),
          trend: macdSignal(macdHistValue),
        }
      : null

  const patterns = Array.isArray(patternData?.points)
    ? patternData.points.map((p) => ({
        name: p.patternname,
        type: p.patterntype,
        status: p.status,
        breakout: p.breakout_w,
      }))
    : null

  return { ticker, rsi, macd, patterns }
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

    const data = await getCachedResearch(ticker, 'technicals', () => computeTechnicals(ticker))

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[research/technicals]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
