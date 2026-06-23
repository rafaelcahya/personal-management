export async function fetchTradeList({ page = 1, limit = 15, ticker } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (ticker) params.set('ticker', ticker)
  const res = await fetch(`/api/trade/v1/trade/list?${params}`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch trades')
  }

  return {
    trades: data.data?.trades ?? [],
    total: data.data?.total ?? 0,
    page: data.data?.page ?? page,
    limit: data.data?.limit ?? limit,
  }
}

export async function createTrade(payload) {
  const res = await fetch('/api/trade/v1/trade/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create trade')
  }

  return data
}

export async function updateTrade(id, payload) {
  const res = await fetch(`/api/trade/v1/trade/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update trade')
  }

  return data
}

export async function deleteTrade(id) {
  const res = await fetch(`/api/trade/v1/trade/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete trade')
  }

  return data
}

export async function fetchAllTradeOptions() {
  const res = await fetch('/api/trade/v1/trade/options/all', {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch all options')
  }

  return (
    data.options || {
      stockType: [],
      entrySession: [],
      entryOccasion: [],
      buyReason: [],
      sellReason: [],
    }
  )
}

export async function fetchTradeOption(optionType) {
  const res = await fetch(`/api/trade/v1/trade/options/${optionType}`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch ${optionType} options`)
  }

  return data.options || []
}

export async function fetchStockTypeOptions() {
  return fetchTradeOption('stockType')
}

export async function fetchEntrySessionOptions() {
  return fetchTradeOption('entrySession')
}

export async function fetchEntryOccasionOptions() {
  return fetchTradeOption('entryOccasion')
}

export async function fetchBuyReasonOptions() {
  return fetchTradeOption('buyReason')
}

export async function fetchSellReasonOptions() {
  return fetchTradeOption('sellReason')
}

export async function fetchTradeSummary() {
  const res = await fetch('/api/trade/v1/trade/summary', {
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to fetch trade summary')
  }

  const data = await res.json()
  return data.data
}
