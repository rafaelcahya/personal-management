'use client'

import { useEffect, useRef, useState } from 'react'
import { getBudgets, upsertBudget } from '@/lib/api/inventoryBudget'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import { toast } from 'sonner'

function ProgressBar({ percent }) {
  const capped = Math.min(percent, 100)
  const color = percent >= 100 ? 'bg-red-500' : percent >= 75 ? 'bg-yellow-400' : 'bg-violet-500'
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${capped}%` }}
      />
    </div>
  )
}

function BudgetRow({ type, actual, budget, onSave }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(budget != null ? String(budget) : '')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleSave = async () => {
    const parsed = Number(value.replace(/\D/g, ''))
    if (isNaN(parsed) || parsed < 0) {
      toast.error('Budget tidak valid')
      return
    }
    setSaving(true)
    try {
      await onSave(type, parsed)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const percent = budget > 0 ? Math.round((actual / budget) * 100) : null

  return (
    <div className="py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-slate-700 truncate">{type}</span>
          {percent != null && (
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${
                percent >= 100
                  ? 'bg-red-100 text-red-600'
                  : percent >= 75
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-violet-100 text-violet-700'
              }`}
            >
              {percent}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 text-sm">
          <span className="text-slate-600">{formatRupiah(actual)}</span>
          <span className="text-slate-300">/</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') setEditing(false)
                }}
                className="w-28 text-right border border-violet-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs px-2 py-1 bg-violet-600 text-white rounded hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? '...' : 'Save'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setValue(budget != null ? String(budget) : '')
                setEditing(true)
              }}
              className="text-slate-400 hover:text-violet-600 transition-colors"
              title="Set budget"
            >
              {budget != null ? (
                formatRupiah(budget)
              ) : (
                <span className="text-xs underline underline-offset-2">Set budget</span>
              )}
            </button>
          )}
        </div>
      </div>
      {budget > 0 ? (
        <ProgressBar percent={percent} />
      ) : (
        <div className="w-full bg-slate-100 rounded-full h-2" />
      )}
    </div>
  )
}

export default function MonthlyBudgetTracker({ monthlySpendByType, loading }) {
  const [budgets, setBudgets] = useState({})
  const [budgetLoading, setBudgetLoading] = useState(true)

  useEffect(() => {
    getBudgets()
      .then((data) => {
        const map = data.reduce((acc, b) => {
          acc[b.type] = Number(b.monthly_budget)
          return acc
        }, {})
        setBudgets(map)
      })
      .catch(() => toast.error('Failed to load budgets'))
      .finally(() => setBudgetLoading(false))
  }, [])

  const thisMonth = new Date().toISOString().slice(0, 7)
  const spendByType = (monthlySpendByType || [])
    .filter((i) => i.month === thisMonth)
    .reduce((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + i.total_spent
      return acc
    }, {})

  const allTypes = Array.from(
    new Set([...Object.keys(spendByType), ...Object.keys(budgets)])
  ).sort()

  const handleSave = async (type, value) => {
    await upsertBudget(type, value)
    setBudgets((prev) => ({ ...prev, [type]: value }))
    toast.success(`Budget for ${type} saved`)
  }

  const isLoading = loading || budgetLoading

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">💰 Monthly Budget Tracker</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Track this month's spend vs your budget per category
        </p>
      </div>
      <div className="px-5 py-3">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-3 bg-slate-200 rounded w-32" />
                </div>
                <div className="h-2 bg-slate-200 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : allTypes.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">No spend data this month 📋</p>
          </div>
        ) : (
          allTypes.map((type) => (
            <BudgetRow
              key={type}
              type={type}
              actual={spendByType[type] || 0}
              budget={budgets[type] ?? null}
              onSave={handleSave}
            />
          ))
        )}
      </div>
    </div>
  )
}
