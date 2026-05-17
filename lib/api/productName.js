export async function getProductNameSummary() {
  const res = await fetch('/api/inventory/v1/product-name/summary')
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch summary')
  }
  return data.data
}

export async function getProductNames() {
  const res = await fetch('/api/inventory/v1/product-name/list')
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch product names')
  }

  return data.data
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

export async function fetchProductName() {
  const res = await fetch('/api/inventory/v1/product-name/list')
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch product names')
  }

  return data.data
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

// items: array of { id, product_name } objects
export async function bulkUpdateProductNameStatus(items, status) {
  const results = await Promise.all(
    items.map(({ id, product_name }) =>
      fetch(`/api/inventory/v1/product-name/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name, product_name_status: status }),
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update product name')
        return data
      })
    )
  )
  return results
}
