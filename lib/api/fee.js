const BASE_URL = '/api/trade/v1/fee'

export async function fetchFeeList({ page = 1, limit = 15 } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))

  const res = await fetch(`${BASE_URL}/list?${params.toString()}`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch fees')
  }

  return {
    fees: data.fees || [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    limit: data.limit ?? 15,
    totalPages: data.totalPages ?? 1,
  }
}

export async function createFee(payload) {
  const res = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create fee')
  }

  return data
}

export async function updateFee(id, payload) {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update fee')
  }

  return data
}

export async function deleteFee(id) {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  if (res.status === 204 || res.status === 200) {
    try {
      const data = await res.json()
      return data
    } catch {
      return { success: true }
    }
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete fee')
  }

  return data
}

export async function fetchFeeSummary() {
  const res = await fetch(`${BASE_URL}/summary`, {
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch fee summary')
  }

  return {
    feeCount: data.data?.feeCount || 0,
    totalFee: data.data?.totalFee || 0,
  }
}
