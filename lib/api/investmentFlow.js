const BASE_URL = '/api/investment-flow/v1'
const UNINVESTED_CASH_URL = `${BASE_URL}/uninvested-cash`
const CASH_CATEGORIES_URL = `${UNINVESTED_CASH_URL}/categories`

export async function getInvestmentFlowTree() {
  const res = await fetch(BASE_URL, { cache: 'no-store' })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch investment flow tree')
  }

  return data.data || { nodes: [], uninvestedCash: 0, cashCategories: [] }
}

export async function updateUninvestedCash(amount) {
  const res = await fetch(UNINVESTED_CASH_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update uninvested cash')
  }

  return data.data.uninvestedCash
}

export async function createNode(payload) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.error || 'Failed to create node')
    if (data.code) err.code = data.code
    throw err
  }

  return data.data
}

export async function updateNode(id, payload) {
  const res = await fetch(BASE_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...payload }),
  })
  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.error || 'Failed to update node')
    if (data.code) err.code = data.code
    throw err
  }

  return data.data
}

export async function deleteNode(id) {
  const res = await fetch(`${BASE_URL}?id=${id}`, {
    method: 'DELETE',
  })

  if (res.status === 204) {
    return { success: true }
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete node')
  }

  return data
}

export async function createCashCategory(payload) {
  const res = await fetch(CASH_CATEGORIES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create cash category')
  return data.data.category
}

export async function updateCashCategory(id, payload) {
  const res = await fetch(`${CASH_CATEGORIES_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update cash category')
  return data.data.category
}

export async function deleteCashCategory(id) {
  const res = await fetch(`${CASH_CATEGORIES_URL}/${id}`, { method: 'DELETE' })
  if (res.status === 204) return { success: true }
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete cash category')
  return data
}

export async function moveNode(id, payload) {
  const res = await fetch(`${BASE_URL}/move`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...payload }),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to move node')
  }

  return data.data
}
