export async function getProductBrandSummary() {
  const res = await fetch('/api/inventory/v1/product-brand/summary')
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch summary')
  }
  return data.data
}

export async function fetchProductBrand({ page = 1, limit = 15, search, status, sort } = {}) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  if (sort) params.set('sort', sort)

  const res = await fetch(`/api/inventory/v1/product-brand/list?${params}`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch product brands')
  }

  return data
}

export async function addProductBrand(payload) {
  const res = await fetch('/api/inventory/v1/product-brand/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create product brand')
  return data
}

export async function updateProductBrand(id, payload) {
  const res = await fetch(`/api/inventory/v1/product-brand/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update product brand')
  return data
}

export async function deleteProductBrand(id) {
  const res = await fetch(`/api/inventory/v1/product-brand/delete/${id}`, {
    method: 'DELETE',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete product brand')
  return data
}
