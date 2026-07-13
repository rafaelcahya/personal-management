import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination/States' }
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

export const States = {
  name: 'States',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pagination automatically manages button disabled state based on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">page</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">totalPages</code>. Prev is
        disabled on the first page, Next on the last page, and nothing renders when there is only
        one page.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">mid-page — both Prev and Next enabled</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination page={4} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">first page — Prev disabled</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination page={1} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">last page — Next disabled</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination page={8} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            single page — renders nothing (totalPages = 1)
          </span>
          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <p className="text-xs text-gray-400 italic mb-1">Nothing renders below:</p>
            <Pagination page={1} totalPages={1} total={6} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Let the component manage all disabled state automatically',
                body: 'Pass the real page and totalPages values and the component derives button disabled state on its own — no extra logic needed in the parent.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never add your own disabled prop to Prev or Next',
                body: 'Manual disabled management will diverge from component state over time. The component already disables Prev on page 1 and Next on the last page.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Returns null when totalPages <= 1 or dataset is empty',
                body: 'No empty pagination bar is ever rendered — the component handles all edge cases internally including totalPages = 0 when the dataset is empty.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Don't guard with {totalPages > 1 && <Pagination />}",
                body: 'The guard is redundant and creates an extra condition to maintain. Always render Pagination unconditionally — it handles the single-page and empty cases itself.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Disabled state is automatic — just pass real values */}
<Pagination
  page={1}           {/* → Prev disabled */}
  totalPages={8}
  total={75}
  onPrev={() => setPage((p) => Math.max(1, p - 1))}
  onNext={() => setPage((p) => Math.min(8, p + 1))}
/>

{/* Single page → returns null, renders nothing */}
<Pagination page={1} totalPages={1} total={6} onPrev={...} onNext={...} />`}</code>
      </pre>
    </div>
  ),
}
