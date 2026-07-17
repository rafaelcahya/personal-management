import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FINNHUB_BASE = 'https://finnhub.io/api/v1'

async function finnhubGet(endpoint) {
  const key = process.env.FINNHUB_API_KEY
  const sep = endpoint.includes('?') ? '&' : '?'
  const res = await fetch(`${FINNHUB_BASE}${endpoint}${sep}token=${key}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Finnhub ${res.status}`)
  return res.json()
}

function dateStr(date) {
  return date.toISOString().split('T')[0]
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

    const today = new Date()
    const sixMonthsAgo = new Date(today)
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const oneYearAhead = new Date(today)
    oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1)

    const sym = encodeURIComponent(ticker)
    const fromDate = dateStr(sixMonthsAgo)
    const toDate = dateStr(today)
    const toDateFuture = dateStr(oneYearAhead)

    const [earningsResult, insiderResult, dividendResult] = await Promise.allSettled([
      finnhubGet(`/stock/earnings?symbol=${sym}`),
      finnhubGet(`/stock/insider-transactions?symbol=${sym}&from=${fromDate}&to=${toDate}`),
      finnhubGet(`/stock/dividend?symbol=${sym}&from=${toDate}&to=${toDateFuture}`),
    ])

    // Earnings — last 4 quarters
    const earningsRaw = earningsResult.status === 'fulfilled' ? earningsResult.value : null
    const earnings = Array.isArray(earningsRaw)
      ? earningsRaw
          .sort((a, b) => b.period?.localeCompare(a.period ?? '') ?? 0)
          .slice(0, 4)
          .map((e) => ({
            period: e.period,
            quarter: e.quarter,
            year: e.year,
            epsEstimate: e.estimate ?? null,
            epsActual: e.actual ?? null,
            surprise: e.surprise ?? null,
            surprisePercent:
              e.surprisePercent != null ? parseFloat(e.surprisePercent.toFixed(2)) : null,
          }))
      : null

    // Insider transactions — recent 10
    const insiderRaw = insiderResult.status === 'fulfilled' ? insiderResult.value : null
    const insiderTransactions = Array.isArray(insiderRaw?.data)
      ? insiderRaw.data.slice(0, 10).map((t) => ({
          name: t.name,
          transactionCode: t.transactionCode,
          change: t.change,
          share: t.share,
          transactionPrice: t.transactionPrice ?? null,
          filingDate: t.filingDate,
        }))
      : null

    // Dividend — next upcoming payment
    const dividendRaw = dividendResult.status === 'fulfilled' ? dividendResult.value : null
    const upcomingDividend =
      Array.isArray(dividendRaw) && dividendRaw.length > 0
        ? (() => {
            const next = dividendRaw.sort((a, b) => a.date?.localeCompare(b.date ?? '') ?? 0)[0]
            return {
              amount: next.amount ?? null,
              currency: next.currency ?? 'USD',
              date: next.date ?? null,
              payDate: next.payDate ?? null,
              frequency: next.frequency ?? null,
            }
          })()
        : null

    return NextResponse.json({
      success: true,
      data: { ticker, earnings, insiderTransactions, upcomingDividend },
    })
  } catch (err) {
    console.error('[research/corporate-events]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
