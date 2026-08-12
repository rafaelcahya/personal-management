'use client'

import { useState } from 'react'
import { ShoppingCart, MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react'
import { format } from 'date-fns'
import EditStockForm from '@/app/main/inventory/product-list/detail/EditStockForm'
import DeleteStockDialog from '@/app/main/inventory/product-list/detail/DeleteStockDialog'
import Button from '@/components/base/Button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/DropdownMenu/DropdownMenu'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

function StockHistoryTable({ history, onRefresh }) {
  const [editEntry, setEditEntry] = useState(null)
  const [deleteEntry, setDeleteEntry] = useState(null)

  if (!history || history.length === 0) {
    return (
      <div
        id="stockHistoryEmpty_productDetailPage"
        className="flex flex-col items-center justify-center py-16 gap-4 text-center"
      >
        <ShoppingCart className="size-10 text-slate-300" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">No stock history yet</p>
          <p className="text-xs text-slate-500">Add stock to see purchase records here</p>
        </div>
      </div>
    )
  }

  const sorted = [...history].sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))

  return (
    <>
      <Table id="stockHistoryTable_productDetailPage" aria-label="Stock history">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead align="right">Qty Added</TableHead>
            <TableHead align="right">Price</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((h, idx) => (
            <TableRow key={h.id ?? idx} id={`stockHistoryRow_${h.id}_productDetailPage`}>
              <TableCell className="text-slate-700 whitespace-nowrap">
                {h.purchase_date ? format(new Date(h.purchase_date), 'd MMM yyyy') : '—'}
              </TableCell>
              <TableCell className="font-mono text-slate-700" align="right">
                {h.quantity_added ?? '—'}
              </TableCell>
              <TableCell className="font-mono text-slate-700 whitespace-nowrap" align="right">
                {h.price != null ? `Rp ${Number(h.price).toLocaleString('id-ID')}` : '—'}
              </TableCell>
              <TableCell className="text-slate-500 max-w-xs truncate">{h.note || '—'}</TableCell>
              <TableCell align="center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      id={`stockHistoryRowMenu_${h.id}_productDetailPage`}
                      variant="ghost"
                      size="icon"
                      aria-label="Entry actions"
                      className="size-7 outline-none hover:bg-slate-100"
                    >
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      id={`editStockEntry_${h.id}_productDetailPage`}
                      onSelect={() => setEditEntry(h)}
                      className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Entry
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      id={`deleteStockEntry_${h.id}_productDetailPage`}
                      onSelect={() => setDeleteEntry(h)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                    >
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete Entry
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editEntry && (
        <EditStockForm
          entry={editEntry}
          open={!!editEntry}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditEntry(null)
          }}
          onUpdated={async () => {
            setEditEntry(null)
            await onRefresh?.()
          }}
        />
      )}

      {deleteEntry && (
        <DeleteStockDialog
          entry={deleteEntry}
          open={!!deleteEntry}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeleteEntry(null)
          }}
          onDeleted={async () => {
            setDeleteEntry(null)
            await onRefresh?.()
          }}
        />
      )}
    </>
  )
}

export default function StockHistorySection({ history, onRefresh }) {
  return (
    <section
      id="stockHistorySection_productDetailPage"
      className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
      aria-labelledby="stock-history-heading"
    >
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
          <ShoppingCart className="size-4 text-violet-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p id="stock-history-heading" className="text-sm font-semibold text-slate-900">
            Stock History
          </p>
          <p className="text-xs text-slate-500 mt-0.5">All restocks for this product</p>
        </div>
      </div>
      <StockHistoryTable history={history} onRefresh={onRefresh} />
    </section>
  )
}
