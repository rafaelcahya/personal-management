export async function getProductLogByProductListId(productListId) {
  const res = await fetch(`/api/inventory/v1/product-history/${productListId}`, {
    cache: 'no-store',
  })

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch product history')
  }
  return data.products
}

export async function getProductHistory() {
  const res = await fetch(`/api/inventory/v1/product-history/list`, {
    cache: 'no-store',
  })

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch product history')
  }
  return data.productHistories
}

export async function fetchProductHistory({ page = 1, limit = 15, search, status, sort } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) params.append('search', search)
  if (status) params.append('status', status)
  if (sort) params.append('sort', sort)

  const res = await fetch(`/api/inventory/v1/product-history/list?${params.toString()}`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch product history')
  }

  return { data: data.data, total: data.total, page: data.page, limit: data.limit }
}

export async function updateProductUsage(historyId, data) {
  const res = await fetch(`/api/inventory/v1/product-history/update/${historyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Failed to update product history')
  }

  const result = await res.json()
  return result.data
}
