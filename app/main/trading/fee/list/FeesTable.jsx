'use client'

import { useState } from 'react'
import UpdateFee from '../UpdateFee'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/base/Table/Table.jsx'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function FeesTable({ fees, onFeesChange, onRefresh }) {
  const [selectedFee, setSelectedFee] = useState(null)

  return (
    <>
      <Table wrapperClassName="overflow-x-auto flex-1" className="min-w-full" aria-label="Fees">
        <TableHeader sticky>
          <TableRow>
            <TableHead>Fee Date</TableHead>
            <TableHead>Fee Name</TableHead>
            <TableHead align="right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.map((fee) => (
            <TableRow key={fee.id} clickable onClick={() => setSelectedFee(fee)}>
              <TableCell className="text-slate-700">{formatDate(fee.fee_date)}</TableCell>
              <TableCell className="font-medium text-slate-900">{fee.fee_name}</TableCell>
              <TableCell className="font-mono font-semibold text-red-600" align="right">
                Rp {Number(fee.fee).toLocaleString('id-ID')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedFee && (
        <UpdateFee
          fee={selectedFee}
          onClose={() => setSelectedFee(null)}
          onUpdated={async () => {
            await onRefresh()
            setSelectedFee(null)
          }}
        />
      )}
    </>
  )
}
