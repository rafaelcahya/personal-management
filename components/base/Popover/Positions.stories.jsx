import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/Positions' }
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

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
    <code>{children}</code>
  </pre>
)

// ─── Side ─────────────────────────────────────────────────────────────────────

const sides = ['top', 'right', 'bottom', 'left']

export const Side = {
  name: 'Side',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> controls which side
        of the trigger the panel appears on. The panel flips automatically when it would overflow
        the viewport — so the declared side is the preferred side, not a guarantee.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side — top · right · bottom · left</span>
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg flex gap-3 flex-wrap justify-center">
          {sides.map((side) => (
            <Popover key={side}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </PopoverTrigger>
              <PopoverContent side={side} className="px-3 py-2">
                <p className="text-xs text-gray-600 whitespace-nowrap">side=&quot;{side}&quot;</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'side="bottom" for most cases',
                body: 'The default — it has the most vertical room and matches user expectations for dropdowns and filter panels that open below a trigger.',
              },
              {
                title: 'side="right" or "left" for sidebar or row action triggers',
                body: 'When the trigger is a sidebar item or a row action button and vertical space is limited, opening to the side avoids clipping the table content below.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't hardcode a side when the trigger is near a viewport edge",
                body: 'The panel flips automatically when it would overflow the viewport. Trust the auto-flip rather than guessing the best side — the declared value is the preferred side, not a guarantee.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The panel position has no impact on keyboard or screen-reader behavior',
                body: 'Focus order, Escape to close, and click-outside detection all work identically regardless of which side the panel opens on.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'side="bottom" has the most room — start there and adjust only if needed',
                body: 'Most layouts have more vertical space below the trigger than above or beside it. Only switch to another side when the layout specifically requires it.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* side: top | right | bottom (default) | left */}
<PopoverContent side="top">...</PopoverContent>
<PopoverContent side="right">...</PopoverContent>
<PopoverContent side="bottom">...</PopoverContent>  {/* default */}
<PopoverContent side="left">...</PopoverContent>`}</Code>
    </div>
  ),
}

// ─── Align ────────────────────────────────────────────────────────────────────

const aligns = ['start', 'center', 'end']

export const Align = {
  name: 'Align',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> controls how the
        panel is aligned along the side axis. Defaults to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&quot;start&quot;</code>. The
        demo below uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;bottom&quot;</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          align (side=&quot;bottom&quot;) — start · center · end
        </span>
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg flex gap-3 flex-wrap">
          {aligns.map((align) => (
            <Popover key={align}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  {align}
                </Button>
              </PopoverTrigger>
              <PopoverContent align={align} className="w-40 px-3 py-2">
                <p className="text-xs text-gray-600">align=&quot;{align}&quot;</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'align="start" when the trigger is near the left edge',
                body: 'The default — the panel opens flush with the left side of the trigger. Right choice for most left-to-right layouts where triggers sit on the left side of the container.',
              },
              {
                title: 'align="end" when the trigger is near the right edge',
                body: "Prevents the panel from overflowing off-screen when the trigger is at the right side of the viewport — the panel aligns to the trigger's right edge instead of left.",
              },
              {
                title: 'align="center" for wide triggers',
                body: 'When the trigger is a wide button, center alignment opens the panel in the middle below it rather than flush with the left — visually more balanced.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't force an align value when auto-flip handles it",
                body: 'The panel adjusts alignment automatically near viewport edges. Only set align when the default start behavior visually conflicts with your layout — not as a default precaution.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Alignment has no impact on keyboard or screen-reader behavior',
                body: 'Escape, Tab, click-outside, and focus management work the same regardless of alignment. This is a purely visual prop.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Combine side and align to fine-tune panel position',
                body: 'side controls which face the panel opens on; align controls where along that edge it anchors. Combine them — e.g. side="bottom" align="end" — to get precise placement for any layout.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* align: start (default) | center | end */}
<PopoverContent align="start">...</PopoverContent>   {/* default — flush with trigger left */}
<PopoverContent align="center">...</PopoverContent>  {/* centered below trigger */}
<PopoverContent align="end">...</PopoverContent>     {/* flush with trigger right */}`}</Code>
    </div>
  ),
}
