export async function getProductNameSummary() {
  const res = await fetch('/api/inventory/v1/product-name/summary')
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch summary')
  }
  return data.data
}

export async function fetchProductName({ page = 1, limit = 15, search, status, sort } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  if (sort) params.set('sort', sort)

  const res = await fetch(`/api/inventory/v1/product-name/list?${params}`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch product names')
  }

  return data
}

export async function createProductName(payload) {
  const res = await fetch('/api/inventory/v1/product-name/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create product name')
  return data
}

export async function updateProductName(id, payload) {
  const res = await fetch(`/api/inventory/v1/product-name/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update product name')
  return data
}

export async function deleteProductName(id) {
  const res = await fetch(`/api/inventory/v1/product-name/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete product name')
  return data
}

export async function bulkUpdateProductNameStatus(ids, status) {
  const res = await fetch('/api/inventory/v1/product-name/bulk-update-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to bulk update product names')
  return data
}
