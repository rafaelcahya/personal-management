import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Variants' }
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

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;default&quot;
        </code>{' '}
        — the standard violet-600 spinner. Used on white or light gray backgrounds where the primary
        brand color provides sufficient contrast.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">variant=&quot;default&quot; — violet-600</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center gap-2 w-fit">
            <Spinner variant="default" size="lg" />
            <span className="text-[10px] text-gray-400">violet-600</span>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use variant="default" for most loading states on white or light backgrounds',
                body: "It aligns with the app's primary brand color and provides strong contrast on any surface lighter than midtone gray.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use the default variant on a violet or dark background",
                body: 'The spinner will disappear against a violet-600 button or dark overlay. Use variant="white" instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The variant prop can be omitted for the default spinner',
                body: 'variant="default" is the default value — no need to pass it explicitly for white or light gray background loading states.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'variant="default" is the correct choice for outline and ghost buttons',
                body: 'These buttons have a light or transparent background, so the violet-600 spinner is fully visible. Always match spinner variant to its immediate background.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* variant="default" is the default — prop can be omitted */}
<Spinner variant="default" />
<Spinner />`}</code>
      </pre>
    </div>
  ),
}

export const Muted = {
  name: 'Muted',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;muted&quot;
        </code>{' '}
        — a gray-400 spinner. Use when the loading state is secondary or non-critical and you want
        to de-emphasize the indicator relative to other content on the page.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">variant=&quot;muted&quot; — gray-400</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center gap-2 w-fit">
            <Spinner variant="muted" size="lg" />
            <span className="text-[10px] text-gray-400">gray-400</span>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use variant="muted" inside card sections',
                body: 'The gray keeps the spinner visually subordinate to the card header and title — use it when the violet default would compete with other prominent elements.',
              },
              {
                title: 'Good choice for secondary buttons',
                body: 'The gray spinner blends naturally with the neutral color scheme of secondary and ghost buttons.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use muted when the spinner is the primary feedback signal",
                body: 'Users may miss a low-contrast gray indicator on light backgrounds in bright environments. Use the default violet spinner when loading feedback must be clearly visible.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'variant="muted" (gray-400) has lower contrast than default',
                body: 'Only use it where the spinner is secondary feedback — not the primary loading signal. Never use muted when the loading state is the only visual indicator of progress.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use muted inside card loading states',
                body: 'e.g. a Portfolio section waiting for data — the muted spinner keeps the loading state readable without drawing as much visual attention as the violet default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<Spinner variant="muted" />

{/* common use — inside a card section */}
<div className="flex items-center justify-center py-16">
  <Spinner size="lg" variant="muted" />
</div>`}</code>
      </pre>
    </div>
  ),
}

export const White = {
  name: 'White',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;white&quot;
        </code>{' '}
        — a white spinner. Use on dark or colored backgrounds (filled buttons, dark overlays) where
        the default violet spinner would be invisible.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          variant=&quot;white&quot; — requires a dark background to be visible
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2 bg-violet-600 rounded-xl p-4">
              <Spinner variant="white" size="lg" />
              <span className="text-[10px] text-violet-200">violet bg</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-gray-900 rounded-xl p-4">
              <Spinner variant="white" size="lg" />
              <span className="text-[10px] text-gray-400">dark bg</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-rose-600 rounded-xl p-4">
              <Spinner variant="white" size="lg" />
              <span className="text-[10px] text-rose-200">colored bg</span>
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
                title: 'Always use variant="white" inside filled (dark) buttons',
                body: 'The default violet spinner is invisible against a violet-600 button background. White is the only variant that maintains sufficient contrast here.',
              },
              {
                title: 'Use on dark overlays and colored backgrounds',
                body: 'Any background darker than midtone gray — rose, emerald, sky, gray-900 — needs variant="white" to keep the spinner visible.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use white on light backgrounds",
                body: 'The spinner will disappear against a white or light gray surface. White is only safe when the background is clearly dark or saturated.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'White provides the highest contrast against dark and colored backgrounds',
                body: "It's the correct choice any time the immediate background is darker than midtone gray. When in doubt, test the spinner visibility against the actual background color.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'The rule: background darker than gray-400 → use white',
                body: 'If the background is lighter, use default or muted. This simple heuristic covers almost every real use case without needing to test each background individually.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* inside a filled button */}
<Button disabled>
  <Spinner size="xs" variant="white" />
  Saving...
</Button>

{/* dark overlay */}
<div className="bg-gray-900 ...">
  <Spinner size="xl" variant="white" />
</div>`}</code>
      </pre>
    </div>
  ),
}

export const Custom = {
  name: 'Custom',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">text-*</code> class via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code> to override
        the color with any Tailwind color. The spinner uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-current</code>, so it
        inherits from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">currentColor</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">custom color via className text-*</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Spinner className="text-rose-500" size="lg" />
              <span className="text-[10px] text-gray-400">rose-500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner className="text-amber-500" size="lg" />
              <span className="text-[10px] text-gray-400">amber-500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner className="text-emerald-500" size="lg" />
              <span className="text-[10px] text-gray-400">emerald-500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner className="text-sky-500" size="lg" />
              <span className="text-[10px] text-gray-400">sky-500</span>
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
                title: 'Use a custom color when the component has its own semantic color',
                body: 'A destructive action area, a success banner, a warning panel — when the surrounding context has a defined semantic color, the spinner should match it.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Prefer built-in variants in most cases',
                body: 'default, muted, and white cover the vast majority of loading states. Reach for a custom text-* color only when none of the three built-in variants fit.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Place the text-* class directly on the Spinner component',
                body: "Don't put it on a wrapper — border-current inherits from the element's own currentColor, so the class must be on the span itself to take effect.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Don't mix custom colors and preset variants in the same loading context",
                body: 'Pick one approach per surface. Inconsistent spinner colors in one loading state look like separate, unrelated operations.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* any Tailwind text-* color works */}
<Spinner className="text-rose-500" />
<Spinner className="text-emerald-500" />
<Spinner className="text-sky-500" />`}</code>
      </pre>
    </div>
  ),
}
