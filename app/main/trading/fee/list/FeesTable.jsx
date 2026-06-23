'use client'

import { useState } from 'react'
import UpdateFee from '../UpdateFee'

export default function FeesTable({ fees, onFeesChange, onRefresh }) {
  const [selectedFee, setSelectedFee] = useState(null)

  return (
    <>
      <table className="min-w-full text-sm" aria-label="Fees">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
              Fee Date
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
              Fee Name
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr
              key={fee.id}
              className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => setSelectedFee(fee)}
            >
              <td className="px-5 py-3.5 text-slate-700">
                {new Date(fee.fee_date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-5 py-3.5 font-medium text-slate-900">{fee.fee_name}</td>
              <td className="px-5 py-3.5 text-right font-mono font-semibold text-red-600">
                Rp {Number(fee.fee).toLocaleString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
