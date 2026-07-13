import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/Orientations' }
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

export const Orientations = {
  name: 'Orientations',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;horizontal&quot;
        </code>{' '}
        (default) for row dividers and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;vertical&quot;
        </code>{' '}
        for column dividers. Vertical separators require an explicit height via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">horizontal (default) — row divider</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
            <p className="text-sm text-gray-700">Above</p>
            <Separator />
            <p className="text-sm text-gray-700">Below</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">vertical — inline column divider</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-4">
            <span className="text-sm text-gray-700">Left</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-700">Middle</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-700">Right</span>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Horizontal for row dividers between stacked sections',
                body: 'The default orientation. Use between vertically stacked content blocks — form groups, card sections, list category breaks.',
              },
              {
                title: 'Vertical for inline dividers between grouped controls',
                body: 'Use inside a flex items-center row to separate nav links, toolbar buttons, or breadcrumb items. Always provide an explicit height.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use vertical without an explicit height",
                body: 'Vertical separators have no intrinsic height. Without className="h-4" or h-full, the element renders at 0px and is invisible.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-orientation is set automatically from the orientation prop',
                body: 'Both horizontal and vertical separators set aria-orientation correctly without any manual override. Screen readers announce the correct axis.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use h-4 for inline icons, h-full when the parent flex container controls height',
                body: 'For inline toolbar separators between icons, h-4 or h-5 matches icon size well. When the parent is a flex row with a known height, h-full fills it automatically.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* horizontal — default */}
<Separator />
<Separator orientation="horizontal" />

{/* vertical — must provide height */}
<div className="flex items-center gap-4">
  <span>Left</span>
  <Separator orientation="vertical" className="h-5" />
  <span>Right</span>
</div>`}</Code>
    </div>
  ),
}
