import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Full Page' }
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

export const FullPage = {
  name: 'Full Page',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        For full-page or full-section loading states, center the spinner with a flex container and
        pair it with a text label for clarity. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="xl"</code> to fill the
        visual center of a large empty area.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">full-page overlay — light background</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="relative h-64 border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Spinner size="xl" />
              <span className="text-sm text-gray-500">Loading data...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">inside a card section</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-800">Portfolio</span>
            </div>
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" variant="muted" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">full-page overlay — dark background</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="relative h-48 border border-gray-200 rounded-xl overflow-hidden bg-gray-900">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Spinner size="xl" variant="white" />
              <span className="text-sm text-gray-300">Uploading...</span>
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
                title: 'Always pair a full-page spinner with a short text label',
                body: '"Loading data...", "Uploading..." — users need to know what is happening, not just that something is happening.',
              },
              {
                title: 'Use size="xl" for full-page, size="lg" inside card sections',
                body: 'xl fills the visual center of a large empty area. lg is the right scale for a card body waiting for data without overwhelming the card header.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a full-page spinner for content with a predictable layout",
                body: 'A Skeleton fills the space more gracefully and prevents jarring layout shifts when data arrives. Full-page spinners work best for unknown-shape content only.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always add a timeout and error fallback',
                body: 'If the spinner runs longer than ~10 seconds without resolving, surface an error state with a retry button. Never leave the user staring at a spinner indefinitely.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Match variant to background: white on dark, muted inside card sections',
                body: 'variant="white" for dark overlays; variant="muted" inside card sections where violet would compete with the header text and draw too much attention.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* centered in a container */}
<div className="flex items-center justify-center py-16">
  <Spinner size="xl" />
</div>

{/* with label */}
<div className="flex flex-col items-center gap-3">
  <Spinner size="xl" />
  <span className="text-sm text-gray-500">Loading data...</span>
</div>

{/* dark background */}
<Spinner size="xl" variant="white" />`}</code>
      </pre>
    </div>
  ),
}
