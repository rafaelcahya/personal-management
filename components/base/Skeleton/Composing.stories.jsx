import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonButton } from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Composing',
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

export const Composing = {
  name: 'Composing',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Mix base <code className="font-mono bg-gray-100 px-1 rounded text-xs">Skeleton</code> and
        presets to replicate real UI layouts. Replace the skeleton with the real component once data
        loads — the shapes should match closely enough that there is no layout shift on switch.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">list item</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <SkeletonAvatar size="default" animation="pulse" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton animation="pulse" className="h-3.5 rounded w-32" />
                  <Skeleton animation="pulse" className="h-3 rounded w-48" />
                </div>
                <SkeletonBadge animation="pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">table rows</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-0 overflow-hidden border border-gray-200 rounded-xl bg-white">
            <div className="grid grid-cols-4 gap-4 px-4 py-2 border-b border-gray-100 bg-gray-50">
              {['Ticker', 'Price', 'Shares', 'P&L'].map((h) => (
                <span
                  key={h}
                  className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-100 last:border-0"
              >
                <Skeleton animation="wave" className="h-3.5 w-12 rounded" />
                <Skeleton animation="wave" className="h-3.5 w-16 rounded" />
                <Skeleton animation="wave" className="h-3.5 w-10 rounded" />
                <Skeleton animation="wave" className="h-3.5 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">profile header</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl">
            <SkeletonAvatar size="xl" animation="pulse" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton animation="pulse" className="h-5 w-40 rounded" />
              <Skeleton animation="pulse" className="h-3.5 w-56 rounded" />
              <div className="flex gap-2 mt-1">
                <SkeletonBadge animation="pulse" />
                <SkeletonBadge animation="pulse" />
              </div>
            </div>
            <SkeletonButton size="sm" animation="pulse" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">stats row</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl"
              >
                <Skeleton animation="wave" className="h-3 w-20 rounded" />
                <Skeleton animation="wave" className="h-7 w-28 rounded" />
                <Skeleton animation="wave" className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">form fields</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton animation="pulse" className="h-3.5 w-24 rounded" />
                <Skeleton animation="pulse" className="h-9 w-full rounded-lg" />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <SkeletonButton size="default" animation="pulse" />
            </div>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Mirror the exact layout of the real component',
                body: 'Same flex direction, gap, and alignment — so the transition from skeleton to real content causes zero layout shift.',
              },
              {
                title: 'Use presets as building blocks for specific elements',
                body: 'SkeletonAvatar, SkeletonBadge, SkeletonButton for named elements. Fall back to base Skeleton for structural containers like cards, rows, and form fields.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't approximate the layout",
                body: 'If the composed skeleton uses different padding, gap, or alignment than the real component, it will cause layout shift on data load. Match exactly.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The entire composed skeleton is aria-hidden automatically',
                body: 'All child Skeleton elements are aria-hidden by default — no additional attributes are needed when building a composed skeleton.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep the same animation across the entire composition',
                body: "Don't mix pulse and wave within a single list row or card. Use one animation per loading state — consistency is what makes the skeleton feel like one cohesive placeholder.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* List item */}
<div className="flex items-center gap-3">
  <SkeletonAvatar size="default" />
  <div className="flex flex-col gap-1.5 flex-1">
    <Skeleton className="h-3.5 rounded w-32" />
    <Skeleton className="h-3 rounded w-48" />
  </div>
  <SkeletonBadge />
</div>

{/* Table row */}
<div className="grid grid-cols-4 gap-4">
  <Skeleton className="h-3.5 w-12 rounded" animation="wave" />
  <Skeleton className="h-3.5 w-16 rounded" animation="wave" />
  <Skeleton className="h-3.5 w-10 rounded" animation="wave" />
  <Skeleton className="h-3.5 w-14 rounded" animation="wave" />
</div>

{/* Stats card */}
<div className="flex flex-col gap-2 p-4 border rounded-xl">
  <Skeleton className="h-3 w-20 rounded" />
  <Skeleton className="h-7 w-28 rounded" />
  <Skeleton className="h-3 w-16 rounded" />
</div>`}</code>
      </pre>
    </div>
  ),
}
