import { useState } from 'react'
import { AlertCircle, ChevronDown, Package, Search, SearchX, X } from 'lucide-react'
import { EmptyState, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle } from './EmptyState'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'EmptyState/Inside Dropdown',
}

export default meta

const allProducts = [
  'Apple iPhone 15',
  'Samsung Galaxy S24',
  'Sony WH-1000XM5',
  'iPad Air M2',
  'MacBook Pro 14"',
  'AirPods Pro',
]

const allStocks = ['BBCA', 'BBRI', 'TLKM', 'ASII', 'UNVR', 'BMRI']

function SearchableDropdown({ placeholder, items, emptyVariant = 'search', emptyLabel }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = query
    ? items.filter((i) => i.toLowerCase().includes(query.toLowerCase()))
    : items

  const handleSelect = (item) => {
    setSelected(item)
    setOpen(false)
    setQuery('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setSelected(null)
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 h-9 text-sm border rounded-md bg-white text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600"
      >
        <span className={selected ? 'flex-1 truncate text-gray-900' : 'flex-1 text-gray-400'}>
          {selected ?? placeholder}
        </span>
        {selected && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className="rounded p-0.5 hover:bg-gray-100 transition-colors"
          >
            <X className="size-3.5 text-gray-400" />
          </button>
        )}
        <ChevronDown
          className={`size-4 text-gray-400 transition-transform duration-150 shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search className="size-3.5 text-gray-400 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-sm outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              <div className="p-1">
                {filtered.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState variant={emptyVariant} size="xs">
                <EmptyStateIcon icon={emptyVariant === 'error' ? AlertCircle : SearchX} />
                <EmptyStateTitle>{emptyLabel ?? `No results for "${query}"`}</EmptyStateTitle>
              </EmptyState>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const InsideDropdown = {
  name: 'Inside Dropdown',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;xs&quot;</code>{' '}
        inside dropdowns and popovers where vertical space is constrained. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">xs</code> size uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">py-3</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size-5</code> icon, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">text-xs</code> typography —
        compact enough to fit inside a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">max-h-60</code> popover. Type
        something with no match to trigger the empty state.
      </p>

      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Product search — variant=&quot;search&quot;
          </span>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
            <Package className="size-3.5" />
            Product
          </div>
          <SearchableDropdown
            placeholder="Select product..."
            items={allProducts}
            emptyVariant="search"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Stock search — variant=&quot;search&quot;
          </span>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
            <Package className="size-3.5" />
            Stock symbol
          </div>
          <SearchableDropdown
            placeholder="Select symbol..."
            items={allStocks}
            emptyVariant="search"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Error state — variant=&quot;error&quot;
          </span>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
            <Package className="size-3.5" />
            Product (failed to load)
          </div>
          <SearchableDropdown
            placeholder="Select product..."
            items={[]}
            emptyVariant="error"
            emptyLabel="Failed to load options"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Empty — no options yet
          </span>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
            <Package className="size-3.5" />
            Category
          </div>
          <SearchableDropdown
            placeholder="Select category..."
            items={[]}
            emptyVariant="empty"
            emptyLabel="No categories yet"
          />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* inside a dropdown/popover — use size="xs" */}
<div className="max-h-48 overflow-y-auto">
  {filtered.length > 0 ? (
    <OptionList />
  ) : (
    <EmptyState variant="search" size="xs">
      <EmptyStateIcon icon={SearchX} />
      <EmptyStateTitle>No results for "{query}"</EmptyStateTitle>
    </EmptyState>
  )}
</div>

{/* error loading options */}
<EmptyState variant="error" size="xs">
  <EmptyStateIcon icon={AlertCircle} />
  <EmptyStateTitle>Failed to load options</EmptyStateTitle>
</EmptyState>`}</code>
      </pre>
    </div>
  ),
}
