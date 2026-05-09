export async function getBudgets() {
  const res = await fetch('/api/inventory/v1/budget', { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch budgets')
  return data.data
}

export async function upsertBudget(type, monthly_budget) {
  const res = await fetch('/api/inventory/v1/budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, monthly_budget }),
  })
  const data = await res.json()
  if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save budget')
}
