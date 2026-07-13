import Slider from './Slider'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Slider/Disabled',
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

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-10 p-8 w-80">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">variant="disabled" (explicit)</span>
        <Slider defaultValue={[40]} variant="disabled" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">disabled prop</span>
        <Slider defaultValue={[60]} disabled />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">disabled with tooltip</span>
        <Slider defaultValue={[50]} disabled showTooltip tooltipFormat={(v) => `${v}%`} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">disabled range slider</span>
        <Slider defaultValue={[20, 70]} disabled />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">disabled via FieldContent</span>
        <FieldContent disabled>
          <FieldLabel>Budget allocation</FieldLabel>
          <Slider defaultValue={[65]} />
          <FieldDescription>Cannot be changed after submission.</FieldDescription>
        </FieldContent>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable the slider when the value is locked for the current context',
                body: 'A slider set by an admin, locked after form submission, or read-only in a review screen should be disabled — the value stays visible but the thumb cannot be moved.',
              },
              {
                title: 'Use FieldContent disabled for full field suppression',
                body: 'Wrapping in FieldContent with disabled automatically disables the slider and dims the label and description — no need to pass disabled separately.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a FieldDescription explaining why the slider is locked',
                body: 'A muted value with no explanation causes confusion. "Cannot be changed after submission" or "Set by your administrator" gives users the context they need.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Explicit variant */}
<Slider defaultValue={[40]} variant="disabled" />

{/* Disabled prop */}
<Slider defaultValue={[60]} disabled />

{/* Via FieldContent */}
<FieldContent disabled>
  <FieldLabel>Budget allocation</FieldLabel>
  <Slider defaultValue={[65]} />
  <FieldDescription>Cannot be changed after submission.</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
