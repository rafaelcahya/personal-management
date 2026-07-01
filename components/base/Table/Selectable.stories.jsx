'use client'
import { useState } from 'react'
import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Selectable' }
export default meta

const data = [
  { id: 1, ticker: 'BBCA', name: 'Bank Central Asia', qty: 100 },
  { id: 2, ticker: 'TLKM', name: 'Telkom Indonesia', qty: 200 },
  { id: 3, ticker: 'ASII', name: 'Astra International', qty: 150 },
  { id: 4, ticker: 'BMRI', name: 'Bank Mandiri', qty: 75 },
]

const columns = [
  {
    id: 'ticker',
    header: 'Ticker',
    cell: (row) => <span className="font-mono font-semibold">{row.ticker}</span>,
    width: 100,
  },
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'qty', header: 'Qty', cell: (row) => row.qty, align: 'right' },
]

function SelectableDemo() {
  const [selected, setSelected] = useState([])
  return (
    <div className="flex flex-col gap-4">
      <DataTable
        data={data}
        rowId="id"
        columns={columns}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
      />
      <p className="text-xs text-gray-500">
        Selected IDs:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">
          {selected.length ? selected.join(', ') : 'none'}
        </code>
      </p>
    </div>
  )
}

export const Selectable = {
  name: 'Selectable',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Add a checkbox column with the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">selectable</code> prop. The
        header checkbox selects or deselects all visible rows. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">selectedRows</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onSelectionChange</code> for
        controlled mode, or omit both for uncontrolled.
      </p>

      <SelectableDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`const [selected, setSelected] = useState([])

<DataTable
  data={positions}
  rowId="id"
  columns={columns}
  selectable
  selectedRows={selected}
  onSelectionChange={setSelected}
/>`}</code>
      </pre>
    </div>
  ),
}
