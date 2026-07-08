'use client'

import { useEffect, useRef, useState } from 'react'
import { Wallet } from 'lucide-react'
import { getBudgets, upsertBudget } from '@/lib/api/inventoryBudget'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import { toast } from 'sonner'
import Button from '@/components/base/Button/Button'
import Input from '@/components/base/Input/Input'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'

function ProgressBar({ percent }) {
  const capped = Math.min(percent, 100)
  const color = percent >= 100 ? 'bg-destructive' : percent >= 75 ? 'bg-yellow-400' : 'bg-primary'
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
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
    <div className="py-3 px-4 border-b border-border last:border-0">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{type}</span>
          {percent != null && (
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${
                percent >= 100
                  ? 'bg-destructive/10 text-destructive'
                  : percent >= 75
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-primary/10 text-primary'
              }`}
            >
              {percent}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 text-sm">
          <span className="text-muted-foreground">{formatRupiah(actual)}</span>
          <span className="text-border">/</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <Input
                ref={inputRef}
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') setEditing(false)
                }}
                className="w-28 text-right border-violet-300 rounded h-auto py-0.5 px-2"
              />
              <Button onClick={handleSave} variant="default" size="sm" disabled={saving}>
                {saving ? '...' : 'Save'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setValue(budget != null ? String(budget) : '')
                setEditing(true)
              }}
              title="Set budget"
            >
              {budget != null ? (
                formatRupiah(budget)
              ) : (
                <span className="text-xs underline underline-offset-2">Set budget</span>
              )}
            </Button>
          )}
        </div>
      </div>
      {budget > 0 ? (
        <ProgressBar percent={percent} />
      ) : (
        <div className="w-full bg-muted rounded-full h-2" />
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
    <Card>
      <CardHeader>
        <CardIcon icon={Wallet} />
        <CardHeaderContent>
          <CardTitle>Monthly Budget Tracker</CardTitle>
          <CardDescription>
            Track this month&apos;s spend vs your budget per category
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent padding="none">
        {isLoading ? (
          <div className="space-y-4 px-4 py-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : allTypes.length === 0 ? (
          <EmptyState size="sm">
            <EmptyStateIcon icon={Wallet} />
            <EmptyStateTitle>No spend data this month</EmptyStateTitle>
            <EmptyStateDescription>
              Spend data will appear here once inventory usage is recorded.
            </EmptyStateDescription>
          </EmptyState>
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
      </CardContent>
    </Card>
  )
}
