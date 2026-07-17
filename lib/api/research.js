export async function searchSymbols(query) {
  const res = await fetch(`/api/trade/v1/research/symbol-search?q=${encodeURIComponent(query)}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to search symbols')
  return data.data ?? []
}

export async function fetchResearchOverview(ticker) {
  const res = await fetch(`/api/trade/v1/research/overview?ticker=${encodeURIComponent(ticker)}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch overview')
  return data.data
}

export async function fetchResearchTechnicals(ticker) {
  const res = await fetch(
    `/api/trade/v1/research/technicals?ticker=${encodeURIComponent(ticker)}`,
    { cache: 'no-store' }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch technicals')
  return data.data
}

export async function fetchResearchCorporateEvents(ticker) {
  const res = await fetch(
    `/api/trade/v1/research/corporate-events?ticker=${encodeURIComponent(ticker)}`,
    { cache: 'no-store' }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch corporate events')
  return data.data
}
