import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/As Child',
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

export const AsChild = {
  name: 'As Child',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">asChild</code> to merge
          badge styles onto the child element instead of rendering a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">span</code>. Use this when
          the badge needs to be a link or button to preserve correct semantics and keyboard
          behavior.
        </p>
      </div>

      <div className="flex flex-col gap-5 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">as anchor link</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge asChild variant="default">
              <a href="#">View Details</a>
            </Badge>
            <Badge asChild variant="secondary">
              <a href="#">Learn More</a>
            </Badge>
            <Badge asChild variant="outline">
              <a href="#">See All</a>
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">as button</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge asChild variant="default">
              <button type="button">Click Me</button>
            </Badge>
            <Badge asChild variant="destructive">
              <button type="button">Remove</button>
            </Badge>
            <Badge asChild variant="outline">
              <button type="button">Dismiss</button>
            </Badge>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use asChild whenever the badge is interactive',
                body: 'Navigation badges need <a href>, action badges need <button type="button">. asChild merges badge styles onto the child element so you keep the correct HTML semantics without sacrificing the visual style.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add onClick to a plain Badge without asChild",
                body: "A span with onClick creates an inaccessible element — keyboard users cannot tab to it or activate it with Enter/Space, and screen readers don't announce it as interactive. Always use asChild + button for actions.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use <a href> for navigation and <button> for actions — never swap them',
                body: 'Semantics affect screen reader announcements and keyboard navigation. A link says "follow this to go somewhere"; a button says "click this to do something". Swapping them confuses assistive technology users.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add hover styles to link badges so they read as clearly interactive',
                body: 'Badge styling alone (no text-decoration, no cursor change) can be mistaken for a static label. Add hover:underline or hover:opacity-80 to the anchor so users understand it is clickable before they click.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Renders as <a> — navigation */}
<Badge asChild variant="default">
  <a href="/details">View Details</a>
</Badge>

{/* Renders as <button> — action */}
<Badge asChild variant="destructive">
  <button type="button" onClick={handleRemove}>Remove</button>
</Badge>`}</code>
      </pre>
    </div>
  ),
}
