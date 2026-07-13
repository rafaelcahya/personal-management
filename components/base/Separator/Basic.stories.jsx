import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/Basic' }
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Drop <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'<Separator />'}</code>{' '}
        between any two elements to add a horizontal dividing line. No props required — defaults to
        horizontal orientation, solid style.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">basic — horizontal divider between sections</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-4">
          <p className="text-sm text-gray-700">Section A</p>
          <Separator />
          <p className="text-sm text-gray-700">Section B</p>
          <Separator />
          <p className="text-sm text-gray-700">Section C</p>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Between semantically related but visually distinct sections',
                body: 'Use between form groups or content regions in a card where content is related but benefits from a clear visual boundary.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use as a layout spacer",
                body: 'Separator carries role="separator" and announces itself to assistive technology. Use margin or padding for spacing only — Separator is a semantic element, not a decorative one.',
              },
              {
                title: "Don't stack Separators back-to-back",
                body: 'Each Separator implies a content group exists on both sides. Back-to-back separators with nothing between them break that semantic contract.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'role="separator" is set automatically',
                body: 'The root div always renders with role="separator" and aria-orientation derived from the orientation prop. No manual ARIA overrides are needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use Separator for semantic grouping, not visual decoration',
                body: 'A Separator communicates a content boundary to both sighted users and screen readers. If you only need a line for visual purposes, use a border utility class on a plain div instead.',
              },
            ],
          },
        ]}
      />

      <Code>{`import { Separator } from '@/components/base/Separator/Separator'

<p>Section A</p>
<Separator />
<p>Section B</p>
<Separator />
<p>Section C</p>`}</Code>
    </div>
  ),
}
