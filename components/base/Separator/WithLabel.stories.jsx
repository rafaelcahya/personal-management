import { Separator } from './Separator'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/With Label' }
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

export const WithLabel = {
  name: 'With Label',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">label</code> to render
        centered text between two lines. Use short conjunctions like &quot;or&quot; or
        &quot;and&quot;, or a brief section title. Only supported on horizontal orientation.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">short conjunction — label=&quot;or&quot;</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Separator label="or" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            section title — label=&quot;More options&quot;
          </span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Separator label="More options" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">with variant — label + dashed</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Separator label="or" variant="dashed" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">real usage — login form with "or" divider</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex flex-col gap-3 w-72">
              <Button className="w-full">Continue with Google</Button>
              <Separator label="or" />
              <Button variant="outline" className="w-full">
                Sign in with email
              </Button>
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
                title: 'Short conjunctions between two mutually exclusive options',
                body: 'Use label="or" or label="and" to present two options with equal weight — e.g. "Continue with Google" / "or" / "Sign in with email" in a login form.',
              },
              {
                title: 'Brief section titles to introduce a new content group',
                body: 'A 1–3 word label like "More options" or "Advanced" can introduce a secondary section without needing a heading element.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't put long phrases in label",
                body: 'The label prop is designed for short conjunctions and brief titles only. For longer labels, use a heading element — the label span is not a heading and will not communicate hierarchy to screen readers.',
              },
              {
                title: 'label is silently ignored on vertical separators',
                body: 'The label prop only renders on horizontal orientation. Passing it to a vertical separator has no effect — no error, no output.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Label text is rendered in a visible span and read in context',
                body: 'The label is a real text node inside the separator element. Screen readers announce it in document order — it communicates the relationship between sections naturally.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Combine label with variant="dashed" to soften the visual weight',
                body: 'A solid line with a label can feel heavy when the label already carries the semantic weight. Dashed softens the line so the label reads as the primary element.',
              },
            ],
          },
        ]}
      />

      <Code>{`<Separator label="or" />
<Separator label="More options" />
<Separator label="or" variant="dashed" />

{/* login form pattern */}
<Button className="w-full">Continue with Google</Button>
<Separator label="or" />
<Button variant="outline" className="w-full">Sign in with email</Button>`}</Code>
    </div>
  ),
}
