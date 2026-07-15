import { Skeleton } from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Basic',
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The base <code className="font-mono bg-gray-100 px-1 rounded text-xs">Skeleton</code> is a
        plain <code className="font-mono bg-gray-100 px-1 rounded text-xs">div</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">bg-gray-200</code> and
        animation. Shape is controlled entirely via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code> — pass any
        Tailwind size, border-radius, or layout classes to match the real content.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">freestyle shapes — controlled via className</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">text lines</span>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-4/5 rounded" />
                <Skeleton className="h-3.5 w-3/5 rounded" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">heading</span>
              <Skeleton className="h-6 w-48 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">avatar</span>
              <Skeleton className="size-10 rounded-full" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">image / card block</span>
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">table row</span>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">badge</span>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">button</span>
              <Skeleton className="h-9 w-28 rounded-lg" />
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
                title: 'Use base Skeleton for freeform shapes not covered by a preset',
                body: 'Pass the same h-*, w-*, and rounded-* classes as the real element to avoid layout shift when data loads.',
              },
              {
                title: 'Match the skeleton shape to the real content',
                body: 'Even small mismatches in height or width cause a jarring reflow when the real component appears.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't build freeform shapes when a preset exists",
                body: 'SkeletonText, SkeletonAvatar, SkeletonButton, and SkeletonCard handle common shapes consistently with less className boilerplate.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep the skeleton size identical to the real element',
                body: 'Same h-*, w-*, and rounded-* so there is no layout shift when the placeholder is replaced by real content.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Prefer presets over freeform shapes whenever a match exists',
                body: 'Only reach for the base Skeleton when no preset covers the exact shape you need. Presets are more consistent and require less per-site boilerplate.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Text lines */}
<Skeleton className="h-3.5 w-full rounded" />
<Skeleton className="h-3.5 w-4/5 rounded" />

{/* Avatar */}
<Skeleton className="size-10 rounded-full" />

{/* Image block */}
<Skeleton className="h-36 w-full rounded-xl" />

{/* Badge */}
<Skeleton className="h-5 w-14 rounded-full" />

{/* Button */}
<Skeleton className="h-9 w-28 rounded-lg" />`}</code>
      </pre>
    </div>
  ),
}
