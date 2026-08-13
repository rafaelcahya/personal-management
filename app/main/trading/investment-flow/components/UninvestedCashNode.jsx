'use client'

import { Pencil, Plus, Trash2, Wallet } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

export default function UninvestedCashNode({
  amount,
  percentage,
  onEdit,
  categories = [],
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const hasCategories = categories.length > 0

  return (
    <div>
      <div
        id="uninvestedCashNode_investmentFlowPage"
        className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors"
        style={{ paddingLeft: '28px' }}
      >
        <span className="w-4 shrink-0" aria-hidden="true" />
        <span className="w-6 shrink-0" aria-hidden="true" />
        <Wallet className="size-4 text-emerald-500 shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-700 truncate min-w-0 flex-1">
          Uninvested Cash
        </span>
        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 hidden sm:inline">
          {formatRupiah(amount)}
        </span>
        <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap shrink-0 w-14 text-right">
          {percentage.toFixed(1)}%
        </span>
        {!hasCategories && (
          <Button
            id="uninvestedCashEditBtn_investmentFlowPage"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 min-w-11 min-h-11 md:min-w-8 md:min-h-8"
            aria-label="Edit uninvested cash"
            onClick={onEdit}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </Button>
        )}
        {onAddCategory && (
          <Button
            id="uninvestedCashAddCategoryBtn_investmentFlowPage"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 min-w-11 min-h-11 md:min-w-8 md:min-h-8"
            aria-label="Add cash pool"
            onClick={onAddCategory}
          >
            <Plus className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      {hasCategories &&
        categories.map((cat) => (
          <div
            key={cat.id}
            id={`uninvestedCashCategory_${cat.id}_investmentFlowPage`}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
            style={{ paddingLeft: '72px' }}
          >
            <span className="w-4 shrink-0" aria-hidden="true" />
            <Wallet className="size-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="text-sm text-slate-600 truncate min-w-0 flex-1">{cat.name}</span>
            <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 hidden sm:inline">
              {formatRupiah(cat.nominal)}
            </span>
            <Button
              id={`uninvestedCashCategoryEditBtn_${cat.id}_investmentFlowPage`}
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 min-w-9 min-h-9 md:min-w-7 md:min-h-7"
              aria-label={`Edit ${cat.name}`}
              onClick={() => onEditCategory?.(cat)}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
              id={`uninvestedCashCategoryDeleteBtn_${cat.id}_investmentFlowPage`}
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 min-w-9 min-h-9 md:min-w-7 md:min-h-7 text-rose-400 hover:text-rose-600"
              aria-label={`Delete ${cat.name}`}
              onClick={() => onDeleteCategory?.(cat)}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        ))}
    </div>
  )
}
