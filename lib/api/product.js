export async function getProducts() {
  const res = await fetch('/api/inventory/v1/product/list', {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch products')
  }
  return data.products
}

export async function fetchProductList() {
  const res = await fetch('/api/inventory/v1/product/list')
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch products')
  }

  return data.data
}

export async function createProduct(payload) {
  const res = await fetch('/api/inventory/v1/product/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  let data

  try {
    data = JSON.parse(text)
  } catch (parseError) {
    console.error('Parse error:', parseError)
    console.error('Response text:', text)
    throw new Error('Invalid server response')
  }

  if (!res.ok) {
    const errorMsg = Array.isArray(data.error) ? data.error.join(', ') : data.error
    throw new Error(errorMsg || 'Failed to create product')
  }

  return data.product
}

export async function adjustStock(productId, payload) {
  const res = await fetch(`/api/inventory/v1/product/adjust/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to adjust stock')
  }

  return res.json()
}

export async function favoriteProduct(productId, isFavorite) {
  const res = await fetch(`/api/inventory/v1/product/${productId}/favorite`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isFavorite }),
  })

  const data = await res.json()

  if (!res.ok) {
    const errorMsg = Array.isArray(data.error) ? data.error.join(', ') : data.error
    throw new Error(errorMsg || 'Failed to toggle favorite')
  }

  return data.data
}

export async function getProductSummary() {
  const res = await fetch('/api/inventory/v1/product/summary', {
    cache: 'no-store',
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    const errorMsg = Array.isArray(data.error) ? data.error.join(', ') : data.error
    throw new Error(errorMsg || 'Failed to fetch product summary')
  }

  return data.data
}

export async function updateProductDetails(productId, payload) {
  const res = await fetch(`/api/inventory/v1/product/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    const errorMsg = Array.isArray(data.error) ? data.error.join(', ') : data.error
    throw new Error(errorMsg || 'Failed to update product')
  }

  return data.data
}

export async function getLastPurchasePrice(productId) {
  const res = await fetch(`/api/inventory/v1/product/${productId}/last-price`, {
    cache: 'no-store',
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch last purchase price')
  }

  return data.data
}

export async function deleteProduct(productId) {
  const res = await fetch(`/api/inventory/v1/product/delete/${productId}`, {
    method: 'DELETE',
  })

  const data = await res.json()

  if (!res.ok) {
    const errorMsg = Array.isArray(data.error) ? data.error.join(', ') : data.error
    throw new Error(errorMsg || 'Failed to delete product')
  }

  return data.data
}

export async function getStockHistory(productId) {
  const res = await fetch(`/api/inventory/v1/product/stock/history/${productId}`, {
    cache: 'no-store',
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch stock history')
  }

  return data.history
}

export async function getRestockPredictions() {
  const res = await fetch('/api/inventory/v1/product/restock-predictions', {
    cache: 'no-store',
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch restock predictions')
  }

  return data.data
}

export async function getProductById(productId) {
  const res = await fetch(`/api/inventory/v1/product/${productId}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch product')
  return data.data
}

export async function getProductUsageHistory(productId) {
  const res = await fetch(`/api/inventory/v1/product-history/${productId}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch usage history')
  return data.products
}
