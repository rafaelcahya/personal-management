import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/Variants' }
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

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop
        controls the line style. All three variants work for both horizontal and vertical
        orientations. Line color uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-current</code> — change
        it by passing a text color class on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">horizontal variants</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-5">
            {[
              { variant: 'solid', desc: 'solid (default) — continuous line' },
              { variant: 'dashed', desc: 'dashed — evenly spaced dashes' },
              { variant: 'dotted', desc: 'dotted — evenly spaced dots' },
            ].map(({ variant, desc }) => (
              <div key={variant} className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">{desc}</span>
                <Separator variant={variant} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">vertical variants</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-8 h-12">
            <div className="flex flex-col items-center gap-1">
              <Separator orientation="vertical" variant="solid" className="h-6" />
              <span className="text-[10px] text-gray-400">solid</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Separator orientation="vertical" variant="dashed" className="h-6" />
              <span className="text-[10px] text-gray-400">dashed</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Separator orientation="vertical" variant="dotted" className="h-6" />
              <span className="text-[10px] text-gray-400">dotted</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">custom color — text-* class on className</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
            <Separator className="text-violet-300" />
            <Separator variant="dashed" className="text-blue-300" />
            <Separator variant="dotted" className="text-rose-300" />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'solid for most cases',
                body: 'The default — provides the clearest visual separation without adding visual noise. Start with solid and only switch to another variant when the context calls for it.',
              },
              {
                title: 'dashed for optional or secondary sections',
                body: 'Use dashed between optional form fields or between a main section and an "advanced" section. The lighter visual weight signals the boundary is less strict.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't switch variant for variety alone",
                body: 'Each variant carries a visual weight signal. Mixing solid, dashed, and dotted without a consistent rule creates visual noise and undermines the hierarchy.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Variant is purely visual — no ARIA impact',
                body: 'The variant prop only changes the CSS border style. All three variants render the same role="separator" and aria-orientation — screen readers are unaffected.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Change line color via a text-* class on className',
                body: 'The line uses border-current, which inherits from the element text color. Pass e.g. text-violet-300 on className to change the color — overriding border-* directly will not work.',
              },
            ],
          },
        ]}
      />

      <Code>{`<Separator variant="solid" />   {/* default */}
<Separator variant="dashed" />
<Separator variant="dotted" />

{/* custom color via className */}
<Separator className="text-violet-300" />
<Separator variant="dashed" className="text-blue-300" />

{/* vertical */}
<Separator orientation="vertical" variant="dashed" className="h-5" />`}</Code>
    </div>
  ),
}
