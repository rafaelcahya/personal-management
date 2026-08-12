const BASE_URL = '/api/investment-flow/v1'

export async function getInvestmentFlowTree() {
  const res = await fetch(BASE_URL, { cache: 'no-store' })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch investment flow tree')
  }

  return data.data || []
}

export async function createNode(payload) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create node')
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
    throw new Error(data.error || 'Failed to update node')
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
