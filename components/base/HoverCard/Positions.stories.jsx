import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'HoverCard/Positions',
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

const sides = ['top', 'right', 'bottom', 'left']
const aligns = ['start', 'center', 'end']

const btnClass =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default min-w-28'

export const Positions = {
  name: 'Positions',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> controls which side
        the panel appears on.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> controls alignment
        along that axis. The panel flips automatically when it would overflow the viewport.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side — top / right / bottom / left</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex gap-3 flex-wrap py-10 justify-center">
            {sides.map((side) => (
              <HoverCard key={side} openDelay={0}>
                <HoverCardTrigger asChild>
                  <button type="button" className={btnClass}>
                    {side}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent side={side} className="px-3 py-2">
                  <p className="text-xs text-gray-600 whitespace-nowrap">side=&quot;{side}&quot;</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          align — start / center / end (side=&quot;bottom&quot;)
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex gap-3 flex-wrap py-10">
            {aligns.map((align) => (
              <HoverCard key={align} openDelay={0}>
                <HoverCardTrigger asChild>
                  <button type="button" className={btnClass}>
                    {align}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent align={align} className="w-40 px-3 py-2">
                  <p className="text-xs text-gray-600">align=&quot;{align}&quot;</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'side="bottom" + align="start" for ticker symbols and inline text',
                body: 'This is the most common combination — the card anchors to the left edge of the trigger and opens downward, matching reading direction. Use it for any inline text trigger like a ticker symbol, product name, or username.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't manually handle viewport overflow",
                body: 'The panel flips automatically when it would overflow the viewport. Just set the preferred side for the intended layout and let the flip handle edge cases — no conditional logic based on viewport position needed.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'sideOffset defaults to 8 — increase for triggers with visible borders',
                body: 'The default 8px gap gives visual breathing room. Increase sideOffset when the trigger has a border, pill badge, or button outline so the panel does not feel glued to the trigger element.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Set the preferred side and trust the flip behavior',
                body: 'Prefer the side that works for most cases. The flip is automatic and handles viewport edge cases correctly — trying to override it with custom logic usually makes placement less reliable, not more.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* side: top | right | bottom (default) | left */}
{/* align: start | center (default) | end   */}
<HoverCardContent side="bottom" align="start" sideOffset={8}>
  ...
</HoverCardContent>`}</code>
      </pre>
    </div>
  ),
}
