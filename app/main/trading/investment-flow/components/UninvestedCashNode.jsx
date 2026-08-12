'use client'

import { Pencil, Wallet } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { formatRupiah } from '@/lib/utils/currencyFormatter'

export default function UninvestedCashNode({ amount, percentage, onEdit }) {
  return (
    <div
      id="uninvestedCashNode_investmentFlowPage"
      className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors"
      style={{ paddingLeft: '8px' }}
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
    </div>
  )
}
