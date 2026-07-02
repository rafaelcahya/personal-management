'use client'

import { useState } from 'react'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function TypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        type === 'buy' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {type.toUpperCase()}
    </span>
  )
}

export default function TransactionTable({ transactions, onDelete, currency }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-slate-500">No transactions yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table
          id="transactionTable_currencyDetailPage"
          className="min-w-full text-sm"
          aria-label={`${currency} transactions`}
        >
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Type
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                IDR Amount
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Rate
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Qty
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap hidden sm:table-cell">
                Notes
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                  {formatDate(tx.transacted_at)}
                </td>
                <td className="px-5 py-3.5">
                  <TypeBadge type={tx.type} />
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  {formatIDR(tx.idr_amount)}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(tx.rate)}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                  {new Intl.NumberFormat('en', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  }).format(tx.foreign_amount)}
                </td>
                <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell max-w-xs truncate">
                  {tx.notes || '—'}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        id={`deleteTransactionBtn_${tx.id}_currencyDetailPage`}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Actions for transaction ${tx.id}`}
                        className="hover:bg-slate-100"
                      >
                        <MoreHorizontal className="size-4 text-slate-400" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 gap-2"
                        onClick={() => {
                          setDeleteTarget(tx)
                          setDialogOpen(true)
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This will hide the transaction. Data is kept for audit purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (deleteTarget) {
                  onDelete?.(deleteTarget.id)
                  setDeleteTarget(null)
                  setDialogOpen(false)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
