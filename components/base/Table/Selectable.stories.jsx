'use client'
import { useState } from 'react'
import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Selectable' }
export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed">
        Add a checkbox column with the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">selectable</code> prop. The
        header checkbox selects or deselects all visible rows. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">selectedRows</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onSelectionChange</code> for
        controlled mode, or omit both for uncontrolled.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          checkbox column — header checkbox selects/deselects all visible rows
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SelectableDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always pair selectable with a bulk-action bar',
                body: 'Show a delete, export, or archive bar when selection is non-empty. Selection with no available action is confusing — it looks like a UI bug.',
              },
              {
                title: 'Use controlled mode when the parent needs to react to selection',
                body: 'Pass selectedRows + onSelectionChange for delete flows, export dialogs, or any case where the parent drives the action. Omit both for simple on-page selection with no external state.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add selectable to a table with no bulk actions",
                body: "Checkboxes on a read-only table create visual noise and suggest actions that don't exist. Only enable selectable when users can actually do something with the selected rows.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The header checkbox selects all visible rows, not all data rows',
                body: 'It respects the current search filter and pagination page. Users selecting all on page 2 with a search filter active only select the rows currently visible.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Show the selection count in the bulk-action bar',
                body: '"3 rows selected · Delete · Export" — the count gives users confidence that their selection was registered before they act.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
