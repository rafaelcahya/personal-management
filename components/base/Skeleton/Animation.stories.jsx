import { Skeleton, SkeletonCard } from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Animation',
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

function AnimationDemo({ animation }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton animation={animation} className="size-8 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton animation={animation} className="h-3.5 w-40 rounded" />
          <Skeleton animation={animation} className="h-3 w-28 rounded" />
        </div>
      </div>
      <Skeleton animation={animation} className="h-3 w-full rounded" />
      <Skeleton animation={animation} className="h-3 w-4/5 rounded" />
      <Skeleton animation={animation} className="h-3 w-3/5 rounded" />
    </div>
  )
}

export const Pulse = {
  name: 'Pulse',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;pulse&quot;
        </code>{' '}
        — the default. Opacity fades in and out continuously using Tailwind&apos;s{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">animate-pulse</code>. Subtle
        and works on any background color.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          animation=&quot;pulse&quot; (default) — opacity fade
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <AnimationDemo animation="pulse" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use pulse as the default for most static content loads',
                body: "It's the least visually noisy option and works reliably on any background color, including dark themes.",
              },
              {
                title: 'Prefer pulse for profile pages, settings panels, and detail views',
                body: "Pulse has no direction, so it doesn't imply data is streaming in from a specific side — ideal for static content loads.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use pulse when content is streaming in sequentially",
                body: 'For list or feed loading states where items arrive one by one, wave better communicates directional data flow.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pulse works on any background color',
                body: "It's driven by CSS opacity with no gradient overlay, so it stays visible whether the background is light, dark, or colored.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep animation consistent across the entire loading state',
                body: 'Mixing pulse and wave on the same surface looks unpolished and suggests multiple unrelated load phases. Pick one and apply it to all skeletons.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* pulse is the default — prop can be omitted */}
<Skeleton animation="pulse" className="h-4 w-48 rounded" />
<SkeletonCard animation="pulse" />
<SkeletonText animation="pulse" lines={3} />`}</code>
      </pre>
    </div>
  ),
}

export const Wave = {
  name: 'Wave',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;wave&quot;
        </code>{' '}
        — a shimmer sweeps left to right using a CSS gradient background-position animation. More
        energetic than pulse; signals that data is actively loading over the network.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          animation=&quot;wave&quot; — shimmer sweeps left to right
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <AnimationDemo animation="wave" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use wave for list or feed loading states where items are streaming in',
                body: 'The directional shimmer reinforces the sense that content is arriving sequentially — ideal for tables, feeds, and lists.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use wave on very dark backgrounds without testing first",
                body: "The gradient overlay can look washed out. Fall back to pulse if the shimmer doesn't contrast enough on your actual background.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Wave uses a gradient background-position animation — no opacity change',
                body: 'It remains visible even when the surface has reduced contrast. Test on dark surfaces before shipping to ensure the shimmer is perceivable.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Don't mix wave and pulse on the same screen",
                body: 'Pick one animation for the entire loading state. Inconsistent animations suggest unrelated loading phases and look unpolished.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<Skeleton animation="wave" className="h-4 w-48 rounded" />
<SkeletonCard animation="wave" />
<SkeletonText animation="wave" lines={3} width="75%" />`}</code>
      </pre>
    </div>
  ),
}

export const None = {
  name: 'None',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;none&quot;
        </code>{' '}
        — a static placeholder with no animation at all. No CSS class is applied, so the skeleton
        stays a solid gray block. Use when motion must be suppressed.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          animation=&quot;none&quot; — static, no animation
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <AnimationDemo animation="none" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use animation="none" when honouring prefers-reduced-motion',
                body: 'Detect the media query in JS and pass none conditionally so motion-sensitive users get a static placeholder while everyone else gets the animated version.',
              },
              {
                title: 'A static skeleton is still better than no placeholder',
                body: 'It reserves the correct space and prevents layout shift even without animation — so animation="none" is still useful, just not animated.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t hardcode animation="none" for all users',
                body: 'It removes the loading affordance and can make the UI feel frozen. Use it only as a conditional fallback for reduced-motion, not as a shortcut to skip animation design.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Detect prefers-reduced-motion and pass it conditionally',
                body: 'const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches — pass animation={prefersReduced ? "none" : "pulse"} to respect user preference.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Reserve animation="none" for motion sensitivity',
                body: 'The default pulse and wave animations are intentional UX affordances. Only suppress them when there is a concrete accessibility reason — not for preference or convenience.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<Skeleton animation="none" className="h-4 w-48 rounded" />

{/* Detect prefers-reduced-motion and pass conditionally */}
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
<SkeletonCard animation={prefersReduced ? 'none' : 'pulse'} />`}</code>
      </pre>
    </div>
  ),
}
