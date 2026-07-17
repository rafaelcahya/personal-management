import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FINNHUB_BASE = 'https://finnhub.io/api/v1'
const LOOK_AHEAD_DAYS = 30
const MAX_TICKERS = 10
const MAX_ECO_EVENTS = 20

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function futureStr(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

async function finnhubGet(endpoint) {
  const key = process.env.FINNHUB_API_KEY
  const sep = endpoint.includes('?') ? '&' : '?'
  const res = await fetch(`${FINNHUB_BASE}${endpoint}${sep}token=${key}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Finnhub API error: ${res.status}`)
  return res.json()
}

export async function GET() {
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
      return NextResponse.json(
        { error: 'FINNHUB_API_KEY is not configured on the server' },
        { status: 503 }
      )
    }

    const from = todayStr()
    const to = futureStr(LOOK_AHEAD_DAYS)

    // Fetch user's distinct tickers from trade_list
    const { data: trades } = await supabase
      .from('trade_list')
      .select('ticker')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .not('ticker', 'is', null)

    const tickers = [...new Set((trades ?? []).map((t) => t.ticker).filter(Boolean))].slice(
      0,
      MAX_TICKERS
    )

    const suggestions = []

    // Earnings calendar — one request per ticker in parallel
    if (tickers.length > 0) {
      const earningsResults = await Promise.allSettled(
        tickers.map((ticker) =>
          finnhubGet(
            `/calendar/earnings?from=${from}&to=${to}&symbol=${encodeURIComponent(ticker)}`
          )
        )
      )

      earningsResults.forEach((result, i) => {
        if (result.status !== 'fulfilled') return
        const calendar = result.value?.earningsCalendar ?? []
        for (const e of calendar) {
          if (!e.date) continue
          const ticker = tickers[i]
          const descParts = [
            `Q${e.quarter ?? '?'} ${e.year ?? ''} earnings release for **${ticker}**.`,
            e.epsEstimate != null ? `EPS estimate: ${e.epsEstimate}.` : null,
            e.revenueEstimate != null
              ? `Revenue estimate: ${(e.revenueEstimate / 1e9).toFixed(2)}B.`
              : null,
            e.hour === 'bmo'
              ? 'Before market open.'
              : e.hour === 'amc'
                ? 'After market close.'
                : null,
          ]
          suggestions.push({
            key: `earnings-${ticker}-${e.date}`,
            title: `${ticker} Q${e.quarter ?? '?'} ${e.year ?? ''} Earnings`,
            event_date: e.date,
            impact_direction: 'UP',
            type: 'earnings',
            ticker,
            event_description: descParts.filter(Boolean).join(' '),
            tags: [ticker.toLowerCase(), 'earnings'],
            links: [
              {
                hyperlink: 'Yahoo Finance',
                link: `https://finance.yahoo.com/quote/${ticker}/financials`,
              },
            ],
          })
        }
      })
    }

    // Economic calendar — non-critical, skip on failure
    try {
      const ecoData = await finnhubGet('/calendar/economic')
      const ecoEvents = (ecoData?.economicCalendar ?? [])
        .filter((e) => {
          if (!e.time) return false
          const date = e.time.split(' ')[0]
          return date >= from && date <= to
        })
        .slice(0, MAX_ECO_EVENTS)

      for (const e of ecoEvents) {
        const date = e.time.split(' ')[0]
        const descParts = [
          `**${e.event}** (${e.country ?? 'Global'}).`,
          e.prev != null ? `Previous: ${e.prev}${e.unit ? ' ' + e.unit : ''}.` : null,
          e.estimate != null ? `Estimate: ${e.estimate}${e.unit ? ' ' + e.unit : ''}.` : null,
          `Impact: ${e.impact ?? 'unknown'}.`,
        ]
        suggestions.push({
          key: `eco-${e.event}-${date}`,
          title: e.event,
          event_date: date,
          impact_direction: e.impact === 'high' ? 'DOWN' : 'UP',
          type: 'economic',
          ticker: null,
          event_description: descParts.filter(Boolean).join(' '),
          tags: ['macro', ...(e.country ? [e.country.toLowerCase()] : [])],
          links: [
            {
              hyperlink: 'Economic Calendar',
              link: 'https://www.investing.com/economic-calendar/',
            },
          ],
        })
      }
    } catch {
      // Economic calendar is non-critical — continue without it
    }

    // Deduplicate by key, sort ascending by date
    const seen = new Set()
    const unique = suggestions
      .filter((s) => {
        if (seen.has(s.key)) return false
        seen.add(s.key)
        return true
      })
      .sort((a, b) => a.event_date.localeCompare(b.event_date))

    return NextResponse.json({ success: true, data: unique }, { status: 200 })
  } catch (err) {
    console.error('[event/import-suggestions]', err)
    return NextResponse.json(
      { error: err.message || 'Failed to fetch import suggestions' },
      { status: 500 }
    )
  }
}
