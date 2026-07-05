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
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalClose,
} from '@/components/base/Modal/Modal.jsx'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

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
      <Table
        id="transactionTable_currencyDetailPage"
        className="min-w-full"
        aria-label={`${currency} transactions`}
      >
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead align="right">IDR Amount</TableHead>
            <TableHead align="right">Rate</TableHead>
            <TableHead align="right">Qty</TableHead>
            <TableHead className="hidden sm:table-cell">Notes</TableHead>
            <TableHead className="w-10" align="right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="text-slate-700 whitespace-nowrap">
                {formatDate(tx.transacted_at)}
              </TableCell>
              <TableCell>
                <TypeBadge type={tx.type} />
              </TableCell>
              <TableCell className="font-mono text-slate-700" align="right">
                {formatIDR(tx.idr_amount)}
              </TableCell>
              <TableCell className="font-mono text-slate-700" align="right">
                {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(tx.rate)}
              </TableCell>
              <TableCell className="font-mono text-slate-700" align="right">
                {new Intl.NumberFormat('en', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                }).format(tx.foreign_amount)}
              </TableCell>
              <TableCell className="text-slate-500 hidden sm:table-cell max-w-xs truncate">
                {tx.notes || '—'}
              </TableCell>
              <TableCell align="right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={dialogOpen} onOpenChange={setDialogOpen}>
        <ModalContent showCloseButton={false}>
          <ModalHeader>
            <ModalTitle>Delete transaction?</ModalTitle>
            <ModalDescription className="text-sm">
              This will hide the transaction. Data is kept for audit purposes.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
            </ModalClose>
            <ModalClose asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteTarget) {
                    onDelete?.(deleteTarget.id)
                    setDeleteTarget(null)
                    setDialogOpen(false)
                  }
                }}
              >
                Delete
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
