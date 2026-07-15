import {
  SkeletonText,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonCard,
} from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Presets',
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

export const Presets = {
  name: 'Presets',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Ready-made preset helpers built on top of the base{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Skeleton</code>. All accept an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> prop. Use
        presets for common shapes — reach for the base{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Skeleton</code> only when no
        preset fits.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">SkeletonText — stacked text line placeholders</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">lines=3 (default)</span>
              <SkeletonText lines={3} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">lines=2 width=&quot;75%&quot;</span>
              <SkeletonText lines={2} width="75%" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">
                lines=1 (single line — no narrowing)
              </span>
              <SkeletonText lines={1} width="60%" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">SkeletonAvatar — circular avatar, four sizes</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-end gap-4">
            {['sm', 'default', 'lg', 'xl'].map((size) => (
              <div key={size} className="flex flex-col items-center gap-1.5">
                <SkeletonAvatar size={size} />
                <span className="text-[10px] text-gray-400">{size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">SkeletonBadge — narrow pill placeholder</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <SkeletonBadge />
            <SkeletonBadge />
            <SkeletonBadge />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          SkeletonButton — button-proportioned, three sizes
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            {['sm', 'default', 'lg'].map((size) => (
              <div key={size} className="flex flex-col items-center gap-1.5">
                <SkeletonButton size={size} />
                <span className="text-[10px] text-gray-400">{size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          SkeletonCard — avatar + header lines + body text
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">lines=3 (default)</span>
              <SkeletonCard lines={3} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400">lines=2</span>
              <SkeletonCard lines={2} />
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
                title: 'Use presets when the content shape matches',
                body: 'SkeletonText for text blocks, SkeletonAvatar for circular images, SkeletonButton for action placeholders, SkeletonCard for card lists. Presets handle sizing consistently with less boilerplate.',
              },
              {
                title: 'Use SkeletonCard as a drop-in for any card list',
                body: 'The lines prop lets you match the real card body line count without building a custom composition.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't force a preset that doesn't match the real shape",
                body: 'If no preset fits exactly, use the base Skeleton with the correct h-*, w-*, and rounded-* to avoid layout shift.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pass the same animation to all presets on the same loading surface',
                body: 'Mixing pulse and wave within one loading state looks unpolished and suggests unrelated load phases.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'All presets accept the same animation prop as the base Skeleton',
                body: 'You can freely mix presets and base Skeleton in a composed layout — just keep them all using the same animation value.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SkeletonText lines={3} width="75%" animation="wave" />

<SkeletonAvatar size="lg" />

<SkeletonBadge />

<SkeletonButton size="default" />

<SkeletonCard lines={3} animation="pulse" />`}</code>
      </pre>
    </div>
  ),
}
