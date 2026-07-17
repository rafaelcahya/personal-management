import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State/Loading',
}

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

export const Loading = {
  name: 'Loading',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">loading</code> variant
        renders animated skeleton rows while content is being fetched. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">skeletonRows</code> to match
        the approximate number of rows the loaded content will fill.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {[
          { rows: 3, label: '3 rows (default)', note: 'Good for card sections and small lists' },
          { rows: 5, label: '5 rows', note: 'Match to longer lists or table bodies' },
          { rows: 1, label: '1 row', note: 'Single-line sections or summary cards' },
          { rows: 8, label: '8 rows', note: 'Large tables or full-page content areas' },
        ].map(({ rows, label, note }) => (
          <div key={rows} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-700">
                skeletonRows={rows} — {label}
              </span>
              <span className="text-[11px] text-gray-400">{note}</span>
            </div>
            <div className="border border-gray-200 rounded-xl">
              <State variant="loading" skeletonRows={rows} />
            </div>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always show loading while a fetch is in-flight',
                body: 'Never let the content area go blank or show empty/error while data is being fetched. The loading variant holds the layout and tells the user something is coming.',
              },
              {
                title: 'Match skeletonRows to the expected content height',
                body: 'The goal is to minimize layout shift when real content loads. If you expect 5 rows, use skeletonRows={5} — the layout stays stable and avoids a jarring jump.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use loading after the fetch resolves",
                body: 'Switch immediately to empty or error once the fetch completes. Lingering skeletons confuse users into thinking data is still loading.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-busy and aria-label are set automatically',
                body: 'The loading variant renders with aria-busy="true" and aria-label="Loading…" — screen readers announce the loading state without any extra attributes.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'If you know the exact row count, match it exactly',
                body: 'The default of 3 rows is a reasonable fallback, but when you know the content (e.g. a 10-row table), setting skeletonRows={10} produces a much more stable loading experience.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* default — 3 skeleton rows */}
<State variant="loading" />

{/* match to expected content height */}
<State variant="loading" skeletonRows={5} />

{/* single-row section */}
<State variant="loading" skeletonRows={1} />`}</code>
      </pre>
    </div>
  ),
}
