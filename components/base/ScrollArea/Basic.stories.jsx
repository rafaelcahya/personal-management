import { ScrollArea } from './ScrollArea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'ScrollArea/Basic' }
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

const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical = {
  name: 'Vertical (default)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Default orientation — scrolls vertically. Height must always be set on ScrollArea via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>. Without a
        height, the outer div expands to fit content and no scrollbar appears.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">vertical — fixed height list</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ScrollArea className="h-48 rounded-md border border-gray-200 p-2">
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <div
                  key={item}
                  className="px-3 py-1.5 text-sm rounded hover:bg-gray-50 text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Fixed-height containers with overflowing vertical content',
                body: 'Use when a list, log, or prose block is taller than its allocated space and needs to scroll. The custom scrollbar appears automatically once height is constrained.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "No fixed height — don't use ScrollArea",
                body: 'Without a height on ScrollArea, the outer div expands to fit its content and nothing scrolls. Use overflow-y-auto on a plain div with a known height instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: "Don't nest ScrollArea inside another ScrollArea",
                body: 'Double-nested scroll containers confuse users about which layer responds to wheel input. If you need nested scrolling, reconsider the layout.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Set height on ScrollArea, layout classes on the inner wrapper',
                body: 'Apply h-*, border, padding to ScrollArea className. Apply flex, gap, divide to a wrapper div inside children — the inner viewport is always h-full w-full and cannot be styled directly.',
              },
            ],
          },
        ]}
      />

      <Code>{`<ScrollArea className="h-48 rounded-md border border-gray-200 p-2">
  <div className="flex flex-col gap-0.5">
    {items.map(item => (
      <div key={item} className="px-3 py-1.5 text-sm rounded hover:bg-gray-50">
        {item}
      </div>
    ))}
  </div>
</ScrollArea>`}</Code>
    </div>
  ),
}

// ─── Horizontal ───────────────────────────────────────────────────────────────

const wideItems = Array.from({ length: 20 }, (_, i) => `Column ${i + 1}`)

export const Horizontal = {
  name: 'Horizontal',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;horizontal&quot;
        </code>{' '}
        scrolls left / right. The children must have an explicit width wider than the container —
        use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          style=&#123;&#123; width: &apos;max-content&apos; &#125;&#125;
        </code>{' '}
        or a fixed pixel width so overflow triggers.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">horizontal — wide columns</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ScrollArea
            orientation="horizontal"
            className="w-full rounded-md border border-gray-200 p-2"
          >
            <div className="flex gap-2" style={{ width: 'max-content' }}>
              {wideItems.map((col) => (
                <div
                  key={col}
                  className="w-28 shrink-0 px-3 py-1.5 text-sm rounded bg-gray-100 text-center text-gray-700"
                >
                  {col}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Content that is wider than its container',
                body: "Use horizontal orientation for column lists, wide tables, or image strips where the content genuinely overflows the container's width.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use without children wider than the container",
                body: "Horizontal overflow only triggers when the children are wider than the ScrollArea. If children shrink to fit, no scrollbar appears — even with orientation='horizontal' set.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use shrink-0 on individual child items',
                body: "Flex children shrink by default to fill available space. Add shrink-0 to each child so they keep their declared width — otherwise the container won't overflow and no scrollbar appears.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  "Give the wrapper style={{ width: 'max-content' }} and constrain ScrollArea width",
                body: "The overflow only triggers against a bounded width. Set w-full or max-w-* on ScrollArea, then use style={{ width: 'max-content' }} on the inner wrapper so it grows past the boundary.",
              },
            ],
          },
        ]}
      />

      <Code>{`<ScrollArea orientation="horizontal" className="w-full rounded-md border border-gray-200 p-2">
  {/* children must be wider than the container */}
  <div className="flex gap-2" style={{ width: 'max-content' }}>
    {columns.map(col => (
      <div key={col} className="w-28 shrink-0">{col}</div>
    ))}
  </div>
</ScrollArea>`}</Code>
    </div>
  ),
}

// ─── Both ─────────────────────────────────────────────────────────────────────

export const Both = {
  name: 'Both',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;both&quot;
        </code>{' '}
        scrolls in both directions. Useful for wide data grids or 2D canvases where content
        overflows both horizontally and vertically.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">both — 2D data grid</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ScrollArea
            orientation="both"
            className="h-40 w-full rounded-md border border-gray-200 p-2"
          >
            <div
              className="flex flex-col gap-1"
              style={{ width: 'max-content', minWidth: '600px' }}
            >
              {items.slice(0, 15).map((item) => (
                <div key={item} className="flex gap-4 px-3 py-1.5 text-sm rounded hover:bg-gray-50">
                  <span className="w-24 shrink-0 text-gray-400">{item}</span>
                  <span className="w-40 shrink-0 text-gray-700">Value A</span>
                  <span className="w-40 shrink-0 text-gray-700">Value B</span>
                  <span className="w-32 shrink-0 text-right text-gray-500">100.00</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: '2D content that overflows both axes',
                body: "Use orientation='both' for wide data grids, canvases, or diagrams where content overflows both horizontally and vertically at the same time.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Prefer vertical or horizontal when only one axis overflows',
                body: "orientation='both' enables overflow on two axes simultaneously. If only one axis overflows, use the specific orientation — it avoids accidental two-dimensional scrolling in future content changes.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keyboard and screen-reader behavior is the same across all orientations',
                body: 'Scrollbar orientation is a visual and interaction concern — ARIA roles and keyboard scrolling work identically for vertical, horizontal, and both.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Set both height and wider-than-container children; use minWidth alongside max-content',
                body: "Both constraints are required: set a height for vertical scroll and style={{ width: 'max-content', minWidth: '...' }} on the inner wrapper for horizontal scroll. minWidth guarantees a minimum width even when columns are few.",
              },
            ],
          },
        ]}
      />

      <Code>{`<ScrollArea orientation="both" className="h-40 w-full rounded-md border border-gray-200 p-2">
  {/* needs both height (vertical) and wider-than-container children (horizontal) */}
  <div style={{ width: 'max-content', minWidth: '600px' }}>
    {rows.map(row => <Row key={row.id} {...row} />)}
  </div>
</ScrollArea>`}</Code>
    </div>
  ),
}
