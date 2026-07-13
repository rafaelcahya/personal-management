'use client'
import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/With Filter' }
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

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
    <code>{children}</code>
  </pre>
)

const TYPES = ['Buy', 'Sell']
const SECTORS = ['Financials', 'Telecom', 'Consumer']

const ALL_DATA = [
  { id: 1, ticker: 'BBCA', name: 'Bank Central Asia', type: 'Buy', sector: 'Financials' },
  { id: 2, ticker: 'TLKM', name: 'Telkom Indonesia', type: 'Sell', sector: 'Telecom' },
  { id: 3, ticker: 'ASII', name: 'Astra International', type: 'Buy', sector: 'Consumer' },
  { id: 4, ticker: 'BMRI', name: 'Bank Mandiri', type: 'Buy', sector: 'Financials' },
  { id: 5, ticker: 'EXCL', name: 'XL Axiata', type: 'Sell', sector: 'Telecom' },
]

function FilterDemo() {
  const [types, setTypes] = useState([])
  const [sectors, setSectors] = useState([])
  const [draft, setDraft] = useState({ types: [], sectors: [] })
  const [open, setOpen] = useState(false)

  function toggleDraft(key, val) {
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(val) ? d[key].filter((v) => v !== val) : [...d[key], val],
    }))
  }

  function handleOpen(val) {
    if (val) setDraft({ types, sectors })
    setOpen(val)
  }

  function handleApply() {
    setTypes(draft.types)
    setSectors(draft.sectors)
    setOpen(false)
  }

  function handleReset() {
    setDraft({ types: [], sectors: [] })
  }

  const activeCount = types.length + sectors.length

  const filtered = ALL_DATA.filter(
    (row) =>
      (types.length === 0 || types.includes(row.type)) &&
      (sectors.length === 0 || sectors.includes(row.sector))
  )

  const checkboxClass = (active) =>
    `flex items-center gap-2 text-xs px-2 py-1.5 rounded cursor-pointer select-none transition-colors ${
      active ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
    }`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={handleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" />
              Filter
              {activeCount > 0 && (
                <span className="ml-1 size-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" side="bottom" align="start">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700">Filter</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-gray-600 px-1"
                >
                  Reset
                </button>
                <PopoverClose>
                  <X className="size-3.5" />
                </PopoverClose>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
                  Type
                </p>
                {TYPES.map((t) => (
                  <label key={t} className={checkboxClass(draft.types.includes(t))}>
                    <input
                      type="checkbox"
                      className="accent-violet-600"
                      checked={draft.types.includes(t)}
                      onChange={() => toggleDraft('types', t)}
                    />
                    {t}
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
                  Sector
                </p>
                {SECTORS.map((s) => (
                  <label key={s} className={checkboxClass(draft.sectors.includes(s))}>
                    <input
                      type="checkbox"
                      className="accent-violet-600"
                      checked={draft.sectors.includes(s)}
                      onChange={() => toggleDraft('sectors', s)}
                    />
                    {s}
                  </label>
                ))}
              </div>

              <Button size="sm" onClick={handleApply} className="w-full mt-1">
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {activeCount > 0 && (
          <button
            onClick={() => {
              setTypes([])
              setSectors([])
            }}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <X className="size-3" /> Clear filters
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                Ticker
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                Name
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                Type
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                Sector
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-gray-400">
                  No results
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono font-semibold text-xs text-gray-900">
                    {row.ticker}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-700">{row.name}</td>
                  <td className="px-4 py-2.5 text-xs">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        row.type === 'Buy'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{row.sector}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const WithFilter = {
  name: 'With Filter',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A filter panel inside a Popover. Draft state is only committed on &quot;Apply&quot; —
        discarded on cancel or close. The trigger badge shows how many filters are active so users
        can see filter state at a glance without opening the panel.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          filter panel — click Filter, check options, then Apply
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <FilterDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Filter panels where changes commit only on Apply',
                body: 'Use a draft state that syncs to applied state only when the user clicks Apply. This lets users preview selections before committing — essential for filters that trigger expensive queries.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't commit filter state on every checkbox change",
                body: 'Applying each checkbox change immediately triggers a refetch on every click. Use draft state and a single Apply action to batch all changes into one commit.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Show active filter count in the trigger badge',
                body: 'Users should be able to see filter state at a glance without opening the panel. A badge on the trigger communicates "filters are active" immediately.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Provide Reset inside the panel and Clear filters outside',
                body: '"Reset" inside the panel resets the draft without closing. "Clear filters" outside clears the applied state. They serve different purposes and users expect both controls.',
              },
            ],
          },
        ]}
      />

      <Code>{`const [open, setOpen] = useState(false)
const [draft, setDraft] = useState({ types: [], sectors: [] })

function handleOpen(val) {
  if (val) setDraft({ types, sectors })  // reset draft to applied state on open
  setOpen(val)
}

<Popover open={open} onOpenChange={handleOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">
      <Filter className="size-3.5" />
      Filter
      {activeCount > 0 && <Badge>{activeCount}</Badge>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-56 p-3" side="bottom" align="start">
    {/* filter checkboxes updating draft */}
    <Button size="sm" onClick={handleApply}>Apply</Button>
  </PopoverContent>
</Popover>`}</Code>
    </div>
  ),
}
