import { ScrollArea } from './ScrollArea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'ScrollArea/Basic',
}

export default meta

const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)
const wideItems = Array.from({ length: 20 }, (_, i) => `Column ${i + 1}`)

export const Vertical = {
  name: 'Vertical (default)',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <p className="text-sm text-gray-500 leading-relaxed">
        Default orientation — scrolls vertically. Height must be set via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>.
      </p>
      <ScrollArea className="h-48 rounded-md border border-gray-200 p-2">
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <div key={item} className="px-3 py-1.5 text-sm rounded hover:bg-gray-50">
              {item}
            </div>
          ))}
        </div>
      </ScrollArea>
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<ScrollArea className="h-48 rounded-md border border-gray-200 p-2">
  {items.map(item => (
    <div key={item} className="px-3 py-1.5 text-sm">{item}</div>
  ))}
</ScrollArea>`}</code>
      </pre>
    </div>
  ),
}

export const Horizontal = {
  name: 'Horizontal',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="horizontal"</code>{' '}
        — scrolls horizontally. Width must be constrained by the parent or className.
      </p>
      <ScrollArea orientation="horizontal" className="w-full rounded-md border border-gray-200 p-2">
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          {wideItems.map((col) => (
            <div
              key={col}
              className="w-28 shrink-0 px-3 py-1.5 text-sm rounded bg-gray-50 text-center"
            >
              {col}
            </div>
          ))}
        </div>
      </ScrollArea>
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<ScrollArea orientation="horizontal" className="w-full rounded-md border p-2">
  <div className="flex gap-2" style={{ width: 'max-content' }}>
    {columns.map(col => (
      <div key={col} className="w-28 shrink-0">{col}</div>
    ))}
  </div>
</ScrollArea>`}</code>
      </pre>
    </div>
  ),
}

export const Both = {
  name: 'Both',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="both"</code> —
        scrolls in both directions. Useful for wide tables or 2D canvases.
      </p>
      <ScrollArea orientation="both" className="h-40 w-full rounded-md border border-gray-200 p-2">
        <div className="flex flex-col gap-1" style={{ width: 'max-content', minWidth: '600px' }}>
          {items.slice(0, 15).map((item) => (
            <div key={item} className="flex gap-4 px-3 py-1.5 text-sm rounded hover:bg-gray-50">
              <span className="w-24 shrink-0 text-gray-400">{item}</span>
              <span className="w-40 shrink-0">Value A — {item}</span>
              <span className="w-40 shrink-0">Value B — {item}</span>
              <span className="w-32 shrink-0 text-right text-gray-500">100.00</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<ScrollArea orientation="both" className="h-40 w-full rounded-md border p-2">
  <div style={{ width: 'max-content', minWidth: '600px' }}>
    {rows.map(row => <Row key={row.id} {...row} />)}
  </div>
</ScrollArea>`}</code>
      </pre>
    </div>
  ),
}
